# MintTrack - Student Finance Tracker
MintTrack is a simple website that helps students track what they spend. You can add your expenses, search them with regex, and see if you are staying under your budget. 
Everything is in your browser so you don't need an account. 

Built with plain **HTML, CSS and JavaScript**.

- **Live site:**  https://amtoha-prog.github.io/Student_finance_tracker/
- **Demo video:** https://youtu.be/CWd3yYX_Ehg
- **Alissa Bonaventura Mtoha**


## Features

- **Add, edit and delete** expenses. Editing happens directly in the role, and deleting asks for confirmation.
- **Regex validation** with error messages that show while you type.
- **Search** with regex, with matches highlighted. A wrong pattern shows an error instead of crashing.
- **Sort** by date, description or amount.
- **Dashboard:** number of expenses, total spent, top category, a last seven days bar charts and budget meter.
- **Budget cap** shows how much is left, or how much you are over.
- **Currencies** RWF (base), USD and EUR, with exchange rates you type in Settings.
- **Saves automatically** in your browser (localStorage).
- **Export and import** your data as a JSON file. Imported files are checked first.
- **Works on phone, tablet and computer.**


## How to run it 

**Online:** open the live site: https://amtoha-prog.github.io/Student_finance_tracker/

**0n your computer:**
1. Download the code (download ZIP) on github and unzip it.
2. Open the folder in VS Code and run `index.html` with the **Live Server** extension. (It must run through a server so `seed.json` can load.)

**To start fresh:** press F12, go to the Console, type `localStorage.clear()` and reload the page.


## Files

```
index.html             The app
tests.html             Automatic checks for the regex rules
seed.json              Sample expenses
styles/main.css        All the styles
scripts/main.js        Regex rules, import check, search and highlight
scripts/validator.js   Saves data and draws the table and dashboard
scripts/events.js.     Handles clicks, typing, forms and settings
assests                Logo and illustrations
docs/spec.md           data model, wireframes, and accessibility plan
```


## Regex catalog

1. **Description** - no spaces at the start or end: `^\S(?:.*\S)?$`
2. **Amount** - a number with up to 2 decimals: `^(0|[1-9]\d*)(\.\d{1,2})?$`
3. **Amount not zero** (advanced, back-refrence): `^(?!0+(?:[ -][A-Za-z]+)*$)`
4. **Date** - YYYY-MM-DD: `^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$`
5. **Category** - letters, spaces or hyphens: `^[A-Za-z]+(?:[ -][A-Za-z]+)*$`
6. **Repeated word** (advanced, back-refrence): `\b(\w+)\s+\1\b`


## Search patterns to try

- `coffee` - finds coffee expenses
- `\.\d{2}\b` - finds amounts with cents
- `\b(\w)\s+\1\b` - finds a repeated word
- `(` - shows the pattern is not valid error


## Keyboard map

- **Tab / Shift+Tab** - move forward / back
- **Enter** - press a button or submit a form
- **/** - jump to the search box
- **Enter / Escape** while editing a row - save / cancel
- The first **Tab** shows the "Skip to main content" link


## Accessibility

- Uses proper HTML tags (header, nav, main, section, footer) and clear headings.
- Every input has a label, and errors are shown in text, not just colour.
- Screen readers announce messages like "Transaction added" and budget warnings (aria-live).
- A clear outline shows which item has keyboard focus.
- A "Skip to main content" link helps keyboard users.
- Good colour contrast.
- Animations turn off if your device is set to reduce motion.
- Works on phone, tablet and computer (360px, 768px, 1024px).


## Testing

1. Open tests.html. It should say "32 of 32 tests passed"
2. Try these in the app:
   - Type a description starting with a space: an error appears.
   - Type 0 as the amount: an error appears.
   - Search for ( : an error appears and the app keeps working.
   - Export, delete an expense, then import the file: it comes back.
   - Reload the page: your data is still there.
   - Use only the keyboard to add, edit and delete.

## Credits 

Illustrations by Storyset (storyset.com)

