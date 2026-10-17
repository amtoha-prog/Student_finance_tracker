// Add form
const form =$('#record-form');
const FIELDS = ['description', 'amount', 'category', 'date'];

function readForm() {
  return {
    description: collapseSpaces($('#description').value),
    amount: $('#amount').value,
    category: $('#category').value,
    date: $('#date').value,
  };
}

function showError(field, message) {
  $(`#${field}-error`).textContent = message;
  $('#' + field).setAttribute('aria-invalid', message ? 'true' : 'false');
}

FIELDS.forEach((field) => {
  $('#' + field).addEventListener('input', () => showError(field, validateRecord(readForm())[field] || ''));
});

form.addEventListener('submit', (event) => {
  event.preventDefault(); 
  const data = readForm();
  FIELDS.forEach((field) => showError(field, errors[field] || ''));
  if (Object.keys(errors).length > 0) {
    form.querySelector('[aria-invalid="true"]').focus;
    return;
  }

  const now = new Date().toISOString();
  const lastNumber = Math.max(0, ...records.map((r) => Number(r.id.replace('rec_', '')) || 0));
  const id ='rec_' + String(lastNumber + 1).padStart(4, '0');
  records.push({id: id, ...data, amount: Number(data.amount), createdAt: now, updatedAt: now
  });
  saveData();
  form.reset();
  $('#date').value = dateToText(new Date());
  renderAll();
  announce('Transaction added.');
});

// Search and Sort
function runSearch () {
  const result = compileRegex($('#search').value, $('#ignore-case').checked);
  searchRegex = result.regex;
  $('#search-error').textContent = result.error;
  renderTable();
}
$('#search').addEventListener('input', runSearch);
$('#ignore-case').addEventListener('change', runSearch);
$('#sort').addEventListener('change', renderTable);

document.addEventListener('keydown', (event) => {
  if(event.key === '/' && !event.target.matches('input, select')) {
    event.preventDefault();
    $('#search').focus();
  }
});