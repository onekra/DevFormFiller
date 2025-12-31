/**
 * Popup Script
 * Manages the logic for the extension popup
 */

let currentDomain = null;

// Sayfa yüklendikçe
document.addEventListener('DOMContentLoaded', () => {
  // Get current domain
  getCurrentDomain();
  
  // Load whitelist
  loadWhitelist();

  // Attach button event listeners
  document.getElementById('whitelistBtn').addEventListener('click', addToWhitelist);
  document.getElementById('removeBtn').addEventListener('click', removeFromWhitelist);
});

/**
 * Get current domain and display it
 */
function getCurrentDomain() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      const url = tabs[0].url;
      currentDomain = extractDomain(url);
      
      // Display domain
      const domainElement = document.getElementById('currentDomain');
      if (currentDomain) {
        domainElement.textContent = `🌐 ${currentDomain}`;
      } else {
        domainElement.textContent = 'Domain not found';
      }

      // Whitelist durumunu kontrol et ve butonları güncelle
      updateButtonStates();
    }
  });
}

/**
 * Load whitelist and render it
 */
function loadWhitelist() {
  chrome.storage.local.get('whitelist', (result) => {
    const whitelist = result.whitelist || [];
    const container = document.getElementById('whitelistContainer');

    if (whitelist.length === 0) {
      container.innerHTML = '<p class="empty-message">No sites in whitelist</p>';
      return;
    }

    // Whitelist öğelerini göster
    container.innerHTML = '';
    whitelist.forEach((domain) => {
      const item = document.createElement('div');
      item.className = 'whitelist-item';
      item.innerHTML = `
        <span class="domain-name">${domain}</span>
        <button class="btn-remove-item" data-domain="${domain}" title="Delete">✕</button>
      `;

      // Silme butonunun olayını ekle
      item.querySelector('.btn-remove-item').addEventListener('click', () => {
        removeSpecificDomain(domain);
      });

      container.appendChild(item);
    });
  });
}

/**
 * Add current domain to whitelist
 */
function addToWhitelist() {
  if (!currentDomain) {
    showPopupNotification('Domain not found!', 'error');
    return;
  }

  chrome.storage.local.get('whitelist', (result) => {
    const whitelist = result.whitelist || [];

    // If already in whitelist
    if (whitelist.includes(currentDomain)) {
      showPopupNotification('This site is already whitelisted!', 'info');
      return;
    }

    // Add to whitelist
    whitelist.push(currentDomain);
    chrome.storage.local.set({ whitelist }, () => {
      showPopupNotification('Site added to whitelist!', 'success');
      loadWhitelist();
      updateButtonStates();
    });
  });
}

/**
 * Remove current domain from whitelist
 */
function removeFromWhitelist() {
  if (!currentDomain) {
    showPopupNotification('Domain not found!', 'error');
    return;
  }

  removeSpecificDomain(currentDomain);
}

/**
 * Remove a specific domain from the whitelist
 */
function removeSpecificDomain(domain) {
  chrome.storage.local.get('whitelist', (result) => {
    let whitelist = result.whitelist || [];

    // Domain'i whitelist'ten çıkar
    whitelist = whitelist.filter(d => d !== domain);
    chrome.storage.local.set({ whitelist }, () => {
      showPopupNotification('Site removed from whitelist!', 'success');
      loadWhitelist();
      updateButtonStates();
    });
  });
}

/**
 * Update button states
 * Check if domain is in whitelist
 */
function updateButtonStates() {
  if (!currentDomain) {
    document.getElementById('whitelistBtn').disabled = true;
    document.getElementById('removeBtn').disabled = true;
    return;
  }

  chrome.storage.local.get('whitelist', (result) => {
    const whitelist = result.whitelist || [];
    const isWhitelisted = whitelist.includes(currentDomain);

    document.getElementById('whitelistBtn').disabled = isWhitelisted;
    document.getElementById('removeBtn').disabled = !isWhitelisted;

    // Update button text
    if (isWhitelisted) {
      document.getElementById('whitelistBtn').textContent = '✓ Whitelisted';
      document.getElementById('whitelistBtn').style.opacity = '0.6';
    } else {
      document.getElementById('whitelistBtn').textContent = '➕ Add to Whitelist';
      document.getElementById('whitelistBtn').style.opacity = '1';
    }
  });
}

/**
 * Show a notification in the popup
 */
function showPopupNotification(message, type) {
  // Eski notification'ı kaldır
  const oldNotification = document.querySelector('.popup-notification');
  if (oldNotification) {
    oldNotification.remove();
  }

  // Yeni notification oluştur
  const notification = document.createElement('div');
  notification.className = `popup-notification notification-${type}`;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Remove after 2 seconds
  setTimeout(() => {
    notification.remove();
  }, 2000);
}

/**
 * Extract domain from URL
 */
function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    // www. ön ekini kaldır
    return hostname.replace(/^www\./, '');
  } catch (error) {
    return '';
  }
}

/**
 * Fill current page form (trigger)
 */
function fillCurrentPageForm() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'fillForm'
      });
    }
  });
}

// Update font and style when popup opens
window.addEventListener('load', () => {
  // İkon güncelle
  const header = document.querySelector('.header');
  if (header) {
    header.style.fontFamily = 'Arial, sans-serif';
  }
});
