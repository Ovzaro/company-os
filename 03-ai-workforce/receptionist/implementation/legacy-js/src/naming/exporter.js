import { writeFile } from 'node:fs/promises';

const columns = ['Rank', 'Tier', 'Name', 'Category', 'Overall Score', '.com Available', 'Instagram', 'X', 'LinkedIn', 'TikTok', 'Threads', 'Facebook', 'GitHub', 'Reddit', 'Pronunciation', 'Origin', 'Meaning', 'Why it scored highly'];

function csvCell(value) { return `"${String(value).replaceAll('"', '""')}"`; }
function row(result, rank, tier) {
  return [rank, tier, result.name, result.category, result.score.overall, result.availability.domain,
    result.availability.instagram, result.availability.x, result.availability.linkedin,
    result.availability.tiktok, result.availability.threads, result.availability.facebook,
    result.availability.github, result.availability.reddit, result.pronunciation,
    result.source, result.meaning, result.reason];
}
function tierFor(rank) {
  if (rank <= 25) return 'Elite';
  if (rank <= 100) return 'Excellent';
  return 'Good';
}
function table(results, start, end, explain) {
  const selectedColumns = explain ? columns : columns.slice(0, -1);
  return [
    `| ${selectedColumns.join(' | ')} |`,
    `| ${selectedColumns.map(() => '---').join(' | ')} |`,
    ...results.slice(start - 1, end).map((result, offset) => {
      const values = row(result, start + offset, tierFor(start + offset));
      if (!explain) values.pop();
      return `| ${values.map((value) => String(value).replaceAll('|', '\\|')).join(' | ')} |`;
    }),
  ].join('\n');
}

export async function exportResults(results, csvPath, markdownPath) {
  const csv = [columns, ...results.map((result, index) => row(result, index + 1, tierFor(index + 1)))]
    .map((values) => values.map(csvCell).join(',')).join('\n');
  const markdown = [
    '# Company Name Rankings', '',
    '> Availability is a point-in-time signal, not a legal clearance or reservation. Unknown means the platform could not be verified reliably.', '',
    '## Top 25 Elite', '', table(results, 1, 25, true), '',
    '## Top 100 Excellent', '', table(results, 26, 100, false), '',
    '## Top 500 Good', '', table(results, 101, 500, false), '',
  ].join('\n');
  await Promise.all([writeFile(csvPath, `${csv}\n`), writeFile(markdownPath, markdown)]);
}

