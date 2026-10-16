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
