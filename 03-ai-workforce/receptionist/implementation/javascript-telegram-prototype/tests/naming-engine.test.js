import assert from 'node:assert/strict';
import test from 'node:test';

import { failedChecks } from '../src/naming/checker.js';
import { generateNames } from '../src/naming/generator.js';
import { scoreName } from '../src/naming/scorer.js';

test('generates 10,000 unique, globally usable name shapes', () => {
  const names = generateNames(10_000);
  assert.equal(names.length, 10_000);
  assert.equal(new Set(names.map(({ name }) => name)).size, 10_000);
  assert.ok(names.every(({ name }) => /^[A-Z][a-z]{3,8}$/.test(name)));
  assert.ok(new Set(names.map(({ category }) => category)).size >= 8);
});

test('scores every dimension from 1 to 100', () => {
  const score = scoreName('Voria');
  assert.ok(score.overall >= 1 && score.overall <= 100);
  assert.equal(Object.keys(score.dimensions).length, 8);
  assert.ok(Object.values(score.dimensions).every((value) => value >= 1 && value <= 100));
});

test('counts only confirmed unavailable checks as failures', () => {
  assert.equal(failedChecks({ domain: 'Unavailable', github: 'Available', x: 'Unknown' }), 1);
});
