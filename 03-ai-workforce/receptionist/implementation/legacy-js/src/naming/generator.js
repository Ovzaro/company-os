const benchmarks = new Set([
  'apple', 'nike', 'meta', 'stripe', 'ramp', 'vanta', 'nvidia', 'linear',
  'openai', 'anthropic', 'scaleai', 'figma', 'mercury', 'palantir', 'snowflake',
  'datadog', 'cloudflare', 'brex', 'rippling',
]);

const strategies = {
  'Invented Words': {
    roots: ['aev', 'alv', 'arv', 'avi', 'cal', 'cav', 'cel', 'civ', 'cor', 'dov', 'elv', 'evr', 'fal', 'hel', 'ira', 'kae', 'kiv', 'lev', 'lor', 'lum', 'mer', 'nav', 'niv', 'nor', 'orv', 'rav', 'rel', 'sev', 'sol', 'tal', 'tor', 'val', 'vel', 'ver', 'via', 'vor', 'zen'],
    endings: ['a', 'ia', 'io', 'is', 'o', 'on', 'or', 'ra', 'ta', 'um', 'us', 'va'],
  },
  'Latin Inspired': {
    roots: ['alto', 'aure', 'celer', 'clar', 'fort', 'lumen', 'nova', 'omni', 'ora', 'prim', 'vera', 'viva', 'vola', 'axis', 'forma', 'modus', 'nex', 'opus', 'via', 'voca'],
    endings: ['a', 'al', 'en', 'ia', 'io', 'is', 'o', 'on', 'or', 'um', 'us', 'va'],
  },
  'Greek Inspired': {
    roots: ['aero', 'arch', 'dyna', 'eidos', 'heli', 'kair', 'kine', 'kos', 'meta', 'noet', 'orbi', 'phos', 'soph', 'thea', 'xeno', 'zoe', 'aion', 'kratos', 'nous', 'telos'],
    endings: ['a', 'an', 'ia', 'ic', 'io', 'is', 'on', 'os', 'um', 'us', 'yx'],
  },
  Astronomy: {
    roots: ['astra', 'cael', 'cosma', 'eclip', 'elara', 'lyra', 'nova', 'orion', 'solar', 'vega', 'zenith', 'luna', 'aphel', 'cygn', 'draco', 'peri', 'sidra', 'titan', 'umbra'],
    endings: ['a', 'ar', 'en', 'ia', 'io', 'is', 'o', 'on', 'or', 'um', 'us'],
  },
  Mythology: {
    roots: ['atlas', 'aurora', 'evan', 'freya', 'heron', 'iris', 'janus', 'juno', 'midas', 'odin', 'orion', 'phoebe', 'rhea', 'themis', 'vesta', 'aegis', 'echo', 'hebe', 'nyx'],
    endings: ['a', 'an', 'ia', 'io', 'is', 'o', 'on', 'or', 'os', 'um', 'us'],
  },
  'Scientific Terms': {
    roots: ['atom', 'axon', 'boson', 'coda', 'flux', 'ion', 'lumen', 'neura', 'nova', 'orbit', 'phase', 'prism', 'quanta', 'relay', 'signal', 'vector', 'wave', 'helix', 'kinet', 'synap'],
    endings: ['a', 'al', 'en', 'ia', 'ic', 'io', 'is', 'on', 'or', 'um', 'us'],
  },
};

const blendFirst = ['arc', 'bright', 'clear', 'core', 'ever', 'flow', 'form', 'frame', 'kind', 'light', 'live', 'north', 'open', 'prime', 'rise', 'signal', 'spark', 'true', 'wave', 'wise'];
const blendSecond = ['ara', 'base', 'beam', 'era', 'form', 'grid', 'lane', 'line', 'loop', 'mark', 'ora', 'path', 'rise', 'span', 'vera', 'via', 'well', 'works'];
const realWords = ['amber', 'arcade', 'canvas', 'clarity', 'compass', 'copper', 'current', 'ember', 'kinetic', 'lucid', 'marble', 'meadow', 'moment', 'mosaic', 'native', 'origin', 'prism', 'ripple', 'silver', 'vertex'];
const curated = {
  'Invented Words': ['Avero', 'Cevra', 'Elvio', 'Norel', 'Orvia', 'Rovia', 'Tavro', 'Veylo'],
  'Latin Inspired': ['Auren', 'Celera', 'Celsa', 'Lumera', 'Modus', 'Verana', 'Verio', 'Volara'],
  'Greek Inspired': ['Aiona', 'Eidon', 'Kinea', 'Noema', 'Phora', 'Sopha', 'Telon', 'Xenia'],
  Astronomy: ['Aphel', 'Caelo', 'Cygnia', 'Elara', 'Lunor', 'Sidra', 'Umbren', 'Veyga'],
  Mythology: ['Aegira', 'Atlara', 'Echor', 'Junora', 'Nyris', 'Theona', 'Vestara', 'Rheon'],
  'Scientific Terms': ['Axona', 'Bosora', 'Fluxa', 'Helixa', 'Ionara', 'Kinera', 'Lumon', 'Prisum'],
  'Blended Words': ['Arclane', 'Corevia', 'Evera', 'Formara', 'Primora', 'Truvera', 'Wavora', 'Wisevia'],
  'Modified Real Words': ['Ambera', 'Canvia', 'Marblo', 'Mosai', 'Origia', 'Riplia', 'Silvara', 'Vertia'],
};

function capitalize(value) {
  return `${value[0].toUpperCase()}${value.slice(1)}`;
}

function normalize(root, ending) {
  let value = `${root}${ending}`.toLowerCase();
  value = value.replace(/([aeiou])\1/g, '$1').replace(/([a-z])\1\1/g, '$1$1');
  if (root.endsWith(ending[0])) value = `${root}${ending.slice(1)}`;
  return value;
}

function valid(value) {
  return value.length >= 4 && value.length <= 9
    && /^[a-z]+$/.test(value)
    && !benchmarks.has(value)
    && !/(.)\1\1|[aeiou]{4}|[^aeiouy]{4}/.test(value);
}

function modifiedForms(word) {
  const vowels = ['a', 'e', 'i', 'o'];
  const forms = new Set();
  for (const vowel of vowels) {
    forms.add(word.replace(/[aeiou](?=[^aeiou]*$)/, vowel));
  }
  forms.add(word.replace(/(er|ity|ic|ent)$/i, 'a'));
  forms.add(word.replace(/(er|ity|ic|ent)$/i, 'o'));
  forms.add(`${word.slice(0, Math.max(3, word.length - 2))}ia`);
  forms.add(`${word.slice(0, Math.max(3, word.length - 1))}o`);
  return [...forms];
}

export function generateNames(count = 10_000) {
  const names = new Map();
  const add = (value, category, source, isCurated = false) => {
    const lower = value.toLowerCase();
    if (valid(lower) && !names.has(lower)) names.set(lower, { name: capitalize(lower), category, source, curated: isCurated });
  };

  for (const [category, candidates] of Object.entries(curated)) {
    for (const candidate of candidates) add(candidate, category, 'Human-curated benchmark construction', true);
  }

  for (const [category, lexicon] of Object.entries(strategies)) {
    for (const root of lexicon.roots) {
      for (const ending of lexicon.endings) {
        add(normalize(root, ending), category, `${root} + ${ending}`);
        add(normalize(root.slice(0, -1), ending), category, `${root} modified with ${ending}`);
      }
    }
  }
  for (const first of blendFirst) {
    for (const second of blendSecond) {
      add(normalize(first, second), 'Blended Words', `${first} + ${second}`);
      add(`${first.slice(0, 3)}${second}`, 'Blended Words', `${first} + ${second}`);
    }
  }
  for (const word of realWords) {
    for (const form of modifiedForms(word)) add(form, 'Modified Real Words', `Modified from ${word}`);
  }

  // A curated syllable matrix expands the invented family without randomness.
  const starts = ['br', 'c', 'cl', 'd', 'f', 'fl', 'gr', 'h', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'z'];
  const centers = ['a', 'e', 'i', 'o', 'u', 'ae', 'ia', 'io'];
  const bridges = ['l', 'm', 'n', 'r', 's', 't', 'v'];
  const finishes = ['a', 'en', 'ia', 'io', 'is', 'o', 'on', 'or', 'um', 'us', 'va'];
  for (const start of starts) for (const center of centers) for (const bridge of bridges) for (const finish of finishes) {
    add(`${start}${center}${bridge}${finish}`, 'Invented Words', `${start}-${center}-${bridge}-${finish} phonetic pattern`);
  }
  return [...names.values()].slice(0, count);
}
