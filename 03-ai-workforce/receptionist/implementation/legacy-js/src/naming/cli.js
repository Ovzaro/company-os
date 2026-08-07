import { resolve } from 'node:path';

import { checkAvailability } from './checker.js';
import { exportResults } from './exporter.js';
import { generateNames } from './generator.js';
import { pronunciation, rationale, scoreName, tieBreaker } from './scorer.js';

function option(name, fallback) {
  const argument = process.argv.find((value) => value.startsWith(`--${name}=`));
  return argument ? argument.slice(name.length + 3) : fallback;
}

const count = Number(option('count', '10000'));
const outputCount = Number(option('top', '500'));
const live = process.argv.includes('--live');
const concurrency = Number(option('concurrency', '5'));
const generated = generateNames(count);
if (generated.length < count) throw new Error(`Only ${generated.length} deliberate candidates could be generated.`);

const ranked = generated.map((candidate) => ({ ...candidate, score: scoreName(candidate.name, candidate) }))
  .sort((a, b) => b.score.overall - a.score.overall || tieBreaker(a.name) - tieBreaker(b.name));

// Limit repetition without distorting scores: no source category may occupy more
// than one third of any tier-sized selection window.
function selectDiverse(candidates, limit, categoryCap, excluded = new Set()) {
  const selected = [];
  const counts = new Map();
  for (const candidate of candidates) {
    if (excluded.has(candidate.name)) continue;
    const used = counts.get(candidate.category) || 0;
    if (used < categoryCap && selected.length < limit) {
      selected.push(candidate);
      counts.set(candidate.category, used + 1);
    }
  }
  return selected;
}

const elite = selectDiverse(ranked, Math.min(25, outputCount), 4);
const used = new Set(elite.map(({ name }) => name));
const excellent = selectDiverse(ranked, Math.min(75, Math.max(0, outputCount - 25)), 14, used);
for (const candidate of excellent) used.add(candidate.name);
const good = selectDiverse(ranked, Math.max(0, outputCount - elite.length - excellent.length), 70, used);
const finalists = [...elite, ...excellent, ...good];
const checked = new Array(finalists.length);
let cursor = 0;
async function worker() {
  while (cursor < finalists.length) {
    const index = cursor++;
    const candidate = finalists[index];
    const availability = await checkAvailability(candidate.name, { live });
    checked[index] = {
      ...candidate,
      availability,
      pronunciation: pronunciation(candidate.name),
      meaning: candidate.category === 'Modified Real Words'
        ? 'A softened, abstracted form inspired by a familiar real-word shape.'
        : `Evokes the linguistic world of ${candidate.category.toLowerCase()}.`,
      reason: rationale(candidate.score, candidate),
    };
  }
}

await Promise.all(Array.from({ length: Math.max(1, concurrency) }, worker));
await exportResults(checked, resolve(option('csv', 'company_names.csv')), resolve(option('markdown', 'top_100.md')));
console.log(`Generated ${generated.length}; classified ${checked.length}; exported Elite 25, Excellent 100, Good 500. Live checks: ${live ? 'on' : 'off'}.`);
