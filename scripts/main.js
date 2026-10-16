// DATA
let records= [];
let editingId = null;
let SearchRegex = null;
let settings = {currency: 'RWF',
  rates: {RWF: 1, USD: 1300, EUR: 1400},
  cap: 1000000,
  categories:['Food', 'Books', 'Transport', 'Entertainment', 'Fees', 'Other'],
};
