const RULES ={
  description: /^\S(?:.*\S)?$/,

  amount:/^(0|[1-9]\d*)(\.\d{1,2})?$/,

  notZero: /^(?!0+(?:\.0+)?$)/,

  date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,

  category: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,

  duplicateWord: /\b(\w+)\s+\1\b/i,
};

function collapseSpaces(text) {
  return text.replace(/\s{2,}/g, '');
}

function collapseSpaces(text) {
  return text.replace(/\s{2,}/g, ' ');
}

function validateDescription(value) {
  if (value === '') return 'Enter a description.';
  if (!RULES.description.test(value)) return 'Remove the spaces at the start or end.';
  const repeated = value.match(RULES.duplicateWord);
  if (repeated) return 'The word "' + repeated[1] + ' " is typed twice. Remove one.';
  return '';
}

function validateAmount(value) {
  if (value === '') return 'Enter an amount.';
  if (!RULES.amount.test(value)) return 'Use numbers only, with up to 2 decimals (e.g. 1500 or 12.50).';
  return '';
}

function validateDate(value) {
  if (value === '') return 'Enter a date.';
  if (!RULES.date.test(value)) return 'Use the format YYYY-MM-DD (e.g. 2026-10-14).';
  const parts = value.split('-').map(Number);
  const check = new Date(parts[0], parts[1] - 1, parts[2]);
  if (check.getDate() !== parts[2]) return 'That date does not exist.';
  return '';
}

function validateCategory(value) {
  if (value === '') return 'Enter a category.';
  if (!RULES.category.test(value)) return 'Use letters only, with single spaces or hyphens.';
  return '';
}

function validateRecord(data) {
  const errors = {};
  const checks = {
    description: validateDescription(data.description),
    amount: validateAmount(data.amount),
    category: validateCategory(data.category),
    date: validateDate(data.date),
  }
  return errors;
}

// Check imported JSON

function validateImport(data) {
  if (!Array.isArray(data)) return 'The file must contain a list (JSON array) of transactions.';

  const usedIds =[];
  for (let i = 0; i < data.length; i++) {
    const r = data[i];
    const where = 'Transaction ' + (i + 1);

    if (!r || typeof r !== 'object') return where + ' is not an object.';
    if (typeof r.id !== 'string' || r.id === '') return where + ' has no id.';
    if (usedIds.includes(r.id)) return where + ' repeats the id "' + r.id + '".';
    usedIds.push(r.id);

    if (typeof r.description !== 'string' || !RULES.description.test(r.description)) return where + ' has a bad description.';
    if (typeof r.amount !== 'number' || r.amount < 0) return where + ' has a bad amount.';
    if (typeof r.category !== 'string' || !RULES.date.test(r.date)) return where + ' has a bad date.';
    if (typeof r.createdAt !== 'string' || typeof r.updatedAt !== 'string') return where + ' is missing timestamps.';
  }
  return '';
}

function escapeHtml(text) {
  return String(text)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replaceAll(/"/g, '&quot;');
}

function highlight(text, regex) {
  text = String(text);
  if(!regex) return escapeHtml(text);


  const findAll = new RegExp(regex.source, regex.flags + 'g');
  let result = '';
  let last = 0;
  for (const match of text.matchAll(findAll)) {
    result += escapeHtml(text.slice(last, match.index)) + '<mark>' + escapeHtml(match[0]) + '</mark>';
    last = match.index + match[0].length;
  }
  return result + escapeHtml(text.slice(last));
}
