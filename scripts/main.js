const $ = (selector) => document.querySelector(selector);
const storageKey = "mintttrack-data";

const today = () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezone0ffset());
  return date.toISOString().slice(0, 10);
};

const defaultData = {
  transactions:[],
  settings: { currency: "USD", budget: 500, period: "month", alert: 80 }
};

let data = loadData();
function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && Array.isArray(saved.transactions) && saved.settings) {
      return saved;
    }
  } catch {
    showMessage("Saved data could not be loaded.");
  }
  return structuredClone(defaultData);
}