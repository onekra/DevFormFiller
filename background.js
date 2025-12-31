/**
 * Background Service Worker
 * Manages background tasks for the extension
 * - Listens for keyboard shortcuts
 * - Sends messages to content scripts
 */

// Initialize default settings
function initializeSettings() {
  chrome.storage.local.get('whitelist', (result) => {
    if (!result.whitelist) {
      chrome.storage.local.set({ whitelist: [] });
    }
  });

  chrome.storage.local.get('shortcutKey', (result) => {
    if (!result.shortcutKey) {
      chrome.storage.local.set({ shortcutKey: 'Ctrl+Shift+F' });
    }
  });
}

// Initialize settings on install
chrome.runtime.onInstalled.addListener(() => {
  initializeSettings();
  console.log('Form Auto-Fill Extension installed');
});

// Listen for keyboard shortcut commands
chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-fill-form') {
    // Aktif tab'a mesaj gönder
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'fillForm'
        }).catch((error) => {
          console.log('Tab\'a ulaşılamadı:', error);
        });
      }
    });
  }
});

// Receive messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkWhitelist') {
    // Check whether the domain is in the whitelist
    const domain = extractDomain(request.url);
    chrome.storage.local.get('whitelist', (result) => {
      const whitelist = result.whitelist || [];
      const isWhitelisted = whitelist.includes(domain);
      sendResponse({ isWhitelisted });
    });
    return true; // Async olduğu için true döndür
  }

  if (request.action === 'getWhitelist') {
    // Return the whitelist
    chrome.storage.local.get('whitelist', (result) => {
      sendResponse({ whitelist: result.whitelist || [] });
    });
    return true;
  }
});

/**
 * Extract domain from URL
 * Example: https://www.example.com/page → example.com
 */
function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    // Remove leading www. prefix
    return hostname.replace(/^www\./, '');
  } catch (error) {
    return '';
  }
}
