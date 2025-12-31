/**
 * Content Script
 * Runs in the web page and interacts with form elements
 * - Finds form elements
 * - Fills them with test data
 */

// Background script'ten komut dinle
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fillForm') {
    checkWhitelistAndFill();
  }
});

// Popup'tan gelen mesajları dinle
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getCurrentDomain') {
    sendResponse({ domain: extractDomain(window.location.href) });
  }
});

/**
 * Check whitelist and fill the form
 */
function checkWhitelistAndFill() {
  // Background'a domain kontrolü yap
  chrome.runtime.sendMessage(
    { action: 'checkWhitelist', url: window.location.href },
    (response) => {
      if (response && response.isWhitelisted) {
        fillForm();
        showNotification('Form filled successfully!');
      } else {
        showNotification('This domain is not whitelisted!');
      }
    }
  );
}

/**
 * Form öğelerini bul ve doldur
 */
function fillForm() {
  // Tüm input, select ve textarea öğelerini bul
  const inputs = document.querySelectorAll('input, textarea, select');

  inputs.forEach((element) => {
    // Gizli veya devre dışı öğeleri atla
    if (element.style.display === 'none' || element.disabled) {
      return;
    }

    const type = element.type ? element.type.toLowerCase() : '';

    switch (type) {
      case 'text':
      case 'search':
      case 'url':
        element.value = generateRandomName();
        triggerChangeEvent(element);
        break;

      case 'email':
        element.value = generateEmail();
        triggerChangeEvent(element);
        break;

      case 'tel':
      case 'phone':
        element.value = generatePhoneNumber();
        triggerChangeEvent(element);
        break;

      case 'number':
      case 'range':
        element.value = generateRandomNumber(1, 100);
        triggerChangeEvent(element);
        break;

      case 'date':
        element.value = generateRandomDate();
        triggerChangeEvent(element);
        break;

      case 'datetime-local':
        element.value = generateRandomDatetime();
        triggerChangeEvent(element);
        break;

      case 'password':
        element.value = generatePassword();
        triggerChangeEvent(element);
        break;

      case 'checkbox':
        element.checked = Math.random() > 0.5;
        triggerChangeEvent(element);
        break;

      case 'radio':
        // Randomly select a radio button
        const name = element.name;
        const radios = document.querySelectorAll(`input[type="radio"][name="${name}"]`);
        if (radios.length > 0) {
          const randomRadio = radios[Math.floor(Math.random() * radios.length)];
          randomRadio.checked = true;
          triggerChangeEvent(randomRadio);
        }
        break;

      case 'select':
      case 'select-one':
        fillSelect(element);
        break;

      case '':
        // Type belirtilmeyen input
        if (element.tagName === 'TEXTAREA') {
          element.value = generateLongText();
          triggerChangeEvent(element);
        } else if (element.tagName === 'SELECT') {
          fillSelect(element);
        } else {
          element.value = generateRandomName();
          triggerChangeEvent(element);
        }
        break;
    }
  });
}

/**
 * Fill select dropdown
 */
function fillSelect(selectElement) {
  const options = selectElement.querySelectorAll('option');
  
  // İlk option'ı (genellikle placeholder) atla
  let validOptions = Array.from(options).filter(opt => opt.value && opt.value !== '');
  
  if (validOptions.length === 0) {
    validOptions = Array.from(options);
  }

  if (validOptions.length > 0) {
    const randomOption = validOptions[Math.floor(Math.random() * validOptions.length)];
    selectElement.value = randomOption.value;
    triggerChangeEvent(selectElement);
  }
}

/**
 * Trigger change events
 * Ensures form validation runs
 */
function triggerChangeEvent(element) {
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
}

/**
 * Test data generation functions
 */

function generateRandomName() {
  const firstNames = ['Ali', 'Ayşe', 'Mehmet', 'Fatma', 'Ahmet', 'Zeynep', 'İbrahim', 'Hülya'];
  const lastNames = ['Yılmaz', 'Kaya', 'Demir', 'Çelik', 'Şahin', 'Akkaya', 'Güzel', 'Arslan'];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return `${firstName} ${lastName}`;
}

function generateEmail() {
  const names = ['ahmet', 'zeynep', 'fatma', 'mehmet', 'ayse', 'ibrahim'];
  const domains = ['example.com', 'test.com', 'demo.org', 'sample.net'];
  
  const name = names[Math.floor(Math.random() * names.length)];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const number = Math.floor(Math.random() * 999);
  
  return `${name}${number}@${domain}`;
}

function generatePhoneNumber() {
  // Turkish phone number format
  const areaCode = '5' + Math.floor(Math.random() * 10);
  const number = Math.floor(Math.random() * 10000000000).toString().padStart(9, '0');
  
  return `+90${areaCode}${number}`;
}

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomDate() {
  const today = new Date();
  const pastDate = new Date(today.setDate(today.getDate() - generateRandomNumber(1, 365)));
  
  const year = pastDate.getFullYear();
  const month = String(pastDate.getMonth() + 1).padStart(2, '0');
  const day = String(pastDate.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

function generateRandomDatetime() {
  const date = generateRandomDate();
  const hours = String(generateRandomNumber(0, 23)).padStart(2, '0');
  const minutes = String(generateRandomNumber(0, 59)).padStart(2, '0');
  
  return `${date}T${hours}:${minutes}`;
}

function generatePassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  let password = '';
  
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return password;
}

function generateLongText() {
  const texts = [
    'This is test data used to fill the form.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Sample text 1: Form testing is important for web applications.',
    'Sample text 2: This extension provides automatic form filling.',
    'Sample text 3: Forms are tested with sample data.',
    'Can be used as a long description text.'
  ];
  
  return texts[Math.floor(Math.random() * texts.length)];
}

/**
 * Show notification
 */
function showNotification(message) {
  // Bildirim elementer oluştur
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4CAF50;
    color: white;
    padding: 15px 20px;
    border-radius: 4px;
    font-family: Arial, sans-serif;
    font-size: 14px;
    z-index: 10000;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    animation: slideIn 0.3s ease-in-out;
  `;

  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

/**
 * Animasyon stili ekle
 */
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);

console.log('Content script loaded');
