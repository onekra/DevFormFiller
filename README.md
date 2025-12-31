# Firefox Form Auto-Fill Extension

A professional Firefox extension that automatically fills web forms with test data. Perfect for QA testing, development, and streamlined form testing workflows.

## Features

### Core Functionality
- Automatically fills all form elements (input, textarea, select, etc.) with test data
- Triggered by keyboard shortcut (Ctrl+Shift+F) or popup button
- Generates appropriate data based on form field type

### Supported Form Types
- Text Input: Random names and text
- Email Input: Valid email format
- Tel Input: Valid phone number
- Number Input: Random number
- Date Input: Valid date format
- DateTime Input: Valid datetime format
- Password Input: Secure password
- Checkbox: Random selection
- Radio Button: Random option
- Select Dropdown: Random option
- Textarea: Long text

### Security and Control
- Whitelist system - only works on user-approved domains
- Domain-based control
- Popup management interface
- Secure local storage

### Technical Features
- Manifest V3 (latest Firefox standard)
- Content script for DOM access
- Browser storage API for whitelist
- Background script for keyboard shortcuts
- Responsive popup UI

## Quick Start

### Installation Method 1: Temporary (Best for Testing)

1. Open Firefox
2. Type in address bar: `about:debugging`
3. Select "This Firefox" from left menu
4. Click "Load Temporary Add-on..." button
5. Select `/home/onekra/extansion/manifest.json`
6. Extension installed!

### Installation Method 2: Permanent (.xpi Package)

1. Open terminal and run:
```bash
cd /home/onekra/extansion
zip -r form-filler.xpi . -x '.git/*' 'TEST_PAGE.html'
```

2. In Firefox:
   - Open `about:addons`
   - Click gear icon
   - Select "Install Add-on From File"
   - Choose created `form-filler.xpi`

## Usage

### Adding Site to Whitelist
1. Click extension icon in toolbar
2. Click "Add to Whitelist" button
3. Site is now whitelisted

### Filling Forms
- Press `Ctrl+Shift+F` (Windows/Linux)
- Press `Cmd+Shift+F` (Mac)
- Form will auto-fill with generated test data

### Removing from Whitelist
1. Click extension icon
2. Click "Remove from Whitelist" button

## File Structure

```
/home/onekra/extansion/
├── manifest.json          # Extension configuration
├── background.js          # Background script
├── content.js            # Form filling engine
├── popup.html            # Popup UI
├── popup.js              # Popup functionality
├── styles.css            # Styling
├── icons/
│   ├── icon-16.png
│   ├── icon-48.png
│   └── icon-96.png
├── TEST_PAGE.html        # Test form
└── README_EN.md          # This file
```

## Technical Details

### Manifest V3
- Latest Firefox extension standard
- Enhanced security and performance

### Data Generation

Generated test data examples:
- Names: "Ali Yilmaz", "Zeynep Kaya"
- Emails: "ahmet123@example.com"
- Phone: "+905551234567" (Turkish format)
- Password: "X7@kL9#mP2$nW5!" (12 chars, special chars)
- Date: "2024-12-25"
- Long text: "Lorem ipsum dolor sit amet..."

### Permissions

- `storage` - Store whitelist
- `scripting` - Inject content script
- `activeTab` - Access active tab
- `tabs` - Read tab information
- `<all_urls>` - Works on all sites (whitelist controlled)

## Privacy and Security

✓ Local processing only
✓ No data sent to external servers
✓ No tracking or analytics
✓ Whitelist prevents unauthorized use
✓ Open source code

## Customization

### Change Names
Edit `content.js` line ~180:
```javascript
function generateRandomName() {
  const firstNames = ['Your', 'Names', 'Here'];
  const lastNames = ['Last', 'Names', 'Here'];
  // ...
}
```

### Change Email Domains
Edit `content.js` line ~195:
```javascript
const domains = ['company.com', 'test.local'];
```

### Change Phone Format
Edit `content.js` line ~210:
```javascript
return `+1${Math.random()...}`; // Your country code
```

## Troubleshooting

**Problem: Forms not filling**
- Ensure site is whitelisted
- Try Ctrl+Shift+F again
- Check Firefox console (F12) for errors

**Problem: Shortcut not working**
- Use Cmd+Shift+F on Mac
- Use Ctrl+Shift+F on Windows/Linux
- Check if another app uses same shortcut

**Problem: Extension not visible**
- Restart Firefox
- Check about:debugging page
- Reload extension

**Problem: Wrong data type**
- Verify HTML input has correct type attribute
- Example: `<input type="email" name="email">`

## Requirements

- Firefox 109 or later
- JavaScript enabled
- Local storage enabled

## License

Open source - use as needed

## Version

v1.0.0 - January 1, 2026

---

For detailed installation guide and examples, see INSTALLATION_EN.md
