const favorableEndings = ['a', 'ia', 'io', 'is', 'o', 'on', 'or', 'um', 'us'];
const familiarClusters = /br|cl|cr|dr|fl|fr|gl|gr|pl|pr|sc|sk|sl|sp|st|tr|th/;

function clamp(value) { return Math.max(1, Math.min(100, Math.round(value))); }
function syllables(name) { return Math.max(1, (name.toLowerCase().match(/[aeiouy]+/g) || []).length); }

export function pronunciation(name) {
  return name.toLowerCase().replace(/x/g, 'ks').replace(/ae/g, 'ay');
}

export function scoreName(name, candidate = {}) {
  const lower = name.toLowerCase();
  const length = lower.length;
  const syllableCount = syllables(lower);
  const consonants = (lower.match(/[^aeiouy]/g) || []).length;
  const ratio = consonants / length;
  const harsh = /[^aeiouy]{3}|[aeiou]{3}|[jq][^u]|[xz][^aeiouy]|(.)\1/.test(lower);
  const visualRepeat = new Set(lower).size / length;
  const smoothCluster = familiarClusters.test(lower);
  const favorableEnding = favorableEndings.some((ending) => lower.endsWith(ending));
  const repeatedLetters = length - new Set(lower).size;
  const ambiguousVowels = (lower.match(/iae|eai|oia|uai/g) || []).length;
  const dimensions = {
    brandability: clamp(94 - Math.abs(6 - length) * 4 - (harsh ? 14 : 0) + (favorableEnding ? 3 : 0)),
    memorability: clamp(95 - Math.abs(2 - syllableCount) * 8 - Math.max(0, length - 7) * 3 - (harsh ? 10 : 0)),
    pronunciation: clamp(97 - Math.abs(2 - syllableCount) * 7 - (harsh ? 20 : 0) + (smoothCluster ? 2 : 0)),
    simplicity: clamp(98 - Math.abs(5.5 - length) * 5 - (harsh ? 12 : 0)),
    premiumFeel: clamp(91 + (favorableEnding ? 4 : 0) + (smoothCluster ? 2 : 0) - (harsh ? 13 : 0)),
    globalAppeal: clamp(94 - Math.max(0, syllableCount - 3) * 10 - (harsh ? 16 : 0)),
    visualIdentity: clamp(88 + visualRepeat * 7 - Math.abs(6 - length) * 2),
    futureScalability: clamp(95 - (harsh ? 8 : 0)),
  };
  const balancePenalty = Math.abs(0.55 - ratio) * 18;
  const craftBonus = candidate.curated ? 3 : 0;
  const overall = clamp(Object.values(dimensions).reduce((sum, value) => sum + value, 0) / 8
    - balancePenalty - repeatedLetters * 1.8 - ambiguousVowels * 5 + craftBonus);
  return { overall, dimensions, syllables: syllableCount };
}

export function rationale(result, candidate) {
  const strengths = Object.entries(result.dimensions).sort((a, b) => b[1] - a[1]).slice(0, 3)
    .map(([key]) => key.replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`));
  return `${result.syllables}-syllable ${candidate.category.toLowerCase()} name with strong ${strengths.join(', ')} and a clean consonant-vowel rhythm.`;
}

export function tieBreaker(name) {
  let value = 2166136261;
  for (const character of name) { value ^= character.charCodeAt(0); value = Math.imul(value, 16777619); }
  return value >>> 0;
}
