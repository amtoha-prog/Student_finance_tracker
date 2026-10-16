// DATA
let records= [];
let editingId = null;
let SearchRegex = null;
let settings = {currency: 'RWF',
  rates: {RWF: 1, USD: 1300, EUR: 1400},
  cap: 1000000,
  categories:['Food', 'Books', 'Transport', 'Entertainment', 'Fees', 'Other'],
};

// Storage(localStorage)
function saveData() {
  localStorage.setItem('minttrack-records', JSON.stringify(records)); 
  localStorage.setItem('minttrack-settings', JSON.stringify(settings));
}

function loadSaved(key) {
  try{
    return JSON.parse(loacolStorage.getItem(key));
  } catch (error) {
    return null;
  }
}

// Helpers
function $(selector){
  return document.querySelector(selector);
}

function money(amountRwf){
  const options = {style:'currency', currency: settings.currency, maximumFractionDigits: 2 };
  return new Intl.NumberFormat('en', options).format(amountRwf / settings.rates[settings.currency]);
}

function dateToText(date){
  const month = String(date.getMonth() + 1).padStart(2, 0);
  const day = String(date.getDate()).padStart(2, 0);
  return `${date.getFullYear()}-${month}-${day}`;
}

function announce(message){
  $('#status').textContent = message;
  $('#status').classList.add('show');
  setTimeout(() => $('#status').classList.remove('show'), 3000);
}

// Records table
const SORTS = {
  'date-new': (a, b) => b.date.localeCompare(a.date),
  'date-old': (a, b) => a.date.localeCompare(b.date),
  'name-az': (a, b) => a.description.localeCompare(b.description),
  'name-za': (a, b) => b.description.localeCompare(a.description),
  'amount-high': (a, b) => b.amount - a.amount,
  'amount-low': (a, b) => a.amount - b.amount,
};

function normalRow(r) {
  const name = escapeHtml(r.description);
  return `<tr data-id="${r.id}"> 
  <td data-label="Date">${highlight(r.description, searchRegex)}</td>
  <td data-label="Description>${highlight(r.description, searchRegex)}</td>
  <td data-label="Amount" class="num">${money(r.amount)}</td>
  <td class="actions">
   <button class="btn small light" data-action="edit" aria-label="Edit ${name}">Edit</button>
   <button class="btn small red" data-action="delete" aria-label="Delete ${name}">Delete</button>
  </td>
</tr>`;

}

function editRow(r) {
const box = (field, label) =>
  `<input type="text" data-field="${field}" aria-label="${label}" value="${escapeHtml(r[field])}">`;
  return `<tr data-id="${r.id}">
  <td data-label="Date">${box('date', 'Date')}</td>
  <td data-label="Description">${box('description', 'Description')}</td>
  <td data-label="Category">${box('category', 'Category')}</td>
  <td data-label="Amount (RWF)">${box('amount', 'Amount in RWF')}</td>
  <td class="actions">
   <button class="btn small" data-action="save">Save</button>
   <button class="btn small light" data-action="cancel">Cancel</button>
  </td></tr>`;
}

function renderTable(){
  const list = records.filter((r) => !searchRegex || [r.description, r.category, r.date,
    String(r.amount)].some((text) => searchRegex.test(text)));
    list.sort(SORTS[$('#sort').value]);
}