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