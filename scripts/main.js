// DATA
let records = [];
let editingId = null;
let searchRegex = null;
let settings = {
  currency: 'RWF',
  rates: { RWF: 1, USD: 1300, EUR: 1400 },
  cap: 100000,
  categories: ['Food', 'Books', 'Transport', 'Entertainment', 'Fees', 'Other'],
};

// Storage(localStorage)
function saveData() {
  localStorage.setItem('minttrack-records', JSON.stringify(records));
  localStorage.setItem('minttrack-settings', JSON.stringify(settings));
}

function loadSaved(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (error) {
    return null;
  }
}

// Helpers
function $(selector) {
  return document.querySelector(selector);
}

function money(amountRwf) {
  const options = { style: 'currency', currency: settings.currency, maximumFractionDigits: 2 };
  return new Intl.NumberFormat('en', options).format(amountRwf / settings.rates[settings.currency]);
}

function dateToText(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, 0);
  return `${date.getFullYear()}-${month}-${day}`;
}

function announce(message) {
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
    <td data-label="Date">${highlight(r.date, searchRegex)}</td>
    <td data-label="Description">${highlight(r.description, searchRegex)}</td>
    <td data-label="Category">${highlight(r.category, searchRegex)}</td>
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

function renderTable() {
  const list = records.filter((r) => !searchRegex || [r.description, r.category, r.date,
  String(r.amount)].some((text) => searchRegex.test(text)));
  list.sort(SORTS[$('#sort').value]);

  $('#records-body').innerHTML = list.map((r) => (r.id === editingId ? editRow(r) : normalRow(r))).join("");
  $('#result-count').textContent = `Showing ${list.length} of ${records.length} transactions`;
  $('#empty-state').hidden = list.length > 0;
  $('#empty-state').textContent = records.length === 0
    ? 'No transactions yet. Add your first one with the form above.'
    : 'Nothing matches this search. Try another pattern.';
}

// Dashboard
function renderDashboard() {
  let total = 0;
  const perCategory = {};
  records.forEach((r) => {
    total += r.amount;
    perCategory[r.category] = (perCategory[r.category] || 0) + r.amount;
  });

  let top = 'None yet';
  for (const category in perCategory) {
    if (top === 'None yet' || perCategory[category] >
      perCategory[top]) top = category;
  }

  const days = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date();
    day.setDate(day.getDate() - i);
    const sum = records.filter((r) => r.date === dateToText(day)).reduce((s, r) => s + r.amount, 0);
    days.push({ sum: sum, name: day.toLocaleDateString('en', { weekday: 'short' }) });
  }
  const biggest = Math.max(1, ...days.map((d) => d.sum));

  $('#stat-count').textContent = records.length;
  $('#stat-total').textContent = money(total);
  $('#stat-top').textContent = top;
  $('#stat-week').textContent = money(days.reduce((s, d) => s + d.sum, 0));
  $('#chart').innerHTML = days.map((d) => `<li class="bar-item"> 
    <span class="bar-track"><span class="bar" style="height:${(d.sum / biggest) * 100}%"></span></span>
    <span class="bar-label">${d.name}</span><span class="visually-hidden">${money(d.sum)}</span></li>`).join('');

  const remaining = settings.cap - total;
  const isOver = settings.cap > 0 && remaining < 0;
  $('#budget-text').textContent = settings.cap
    ? `${money(total)} spent of ${money(settings.cap)}`
    : `${money(total)} spent`;
  $('#meter-fill').style.width = settings.cap
    ? Math.min(100, (total / settings.cap) * 100) + '%'
    : '0%';
  $('#meter-fill').classList.toggle('over', isOver);
  $('#cap-polite').textContent = !settings.cap
    ? 'No budget cap set. Add one in Settings.'
    : isOver
      ? ''
      : `${money(remaining)} left in your budget.`;
  $('#cap-assertive').textContent = isOver ? `Over budget by ${money(-remaining)}.` : '';
}

// Redraws everything
function renderAll() {
  renderTable();
  renderDashboard();
  $('#category-options').innerHTML = settings.categories.map((c) => `<option value="${escapeHtml(c)}">`).join('');
}

// Start
async function start() {
  const savedSettings = loadSaved('minttrack-settings');
  if (savedSettings) settings = { ...settings, ...savedSettings };

  const savedRecords = loadSaved('minttrack-records');
  if (savedRecords && validateImport(savedRecords) === '') {
    records = savedRecords;
  } else {
    try {
      const response = await fetch('seed.json');
      records = await response.json();
    } catch (error) {
      records = [];
    }
    saveData();
  }

  $('#date').value = dateToText(new Date());
  fillSettings();
  renderAll();
}

document.addEventListener('DOMContentLoaded', start);