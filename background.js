chrome.action.onClicked.addListener(function () {
  chrome.tabs.create({ url: 'https://token.fakeoai.com' })
})

chrome.webRequest.onBeforeRedirect.addListener(
  function ({ redirectUrl: url, tabId }) {
    if (url.startsWith('https://chatgpt.com/api/auth/callback/login-web?')) {
      chrome.storage.local.set({ url }, function () {
        chrome.tabs.update(tabId, { url: 'callback.html' })
      })
      return { cancel: true }
    }
  },
  { urls: ['<all_urls>'] },
  ['responseHeaders'],
)

chrome.runtime.onMessage.addListener(
  async ({ url, auth0, action }, sender, sendResponse) => {
    if (action === 'setFakeOAIData') {
      const domain = 'auth0.openai.com'
      try {
        const cookies = await chrome.cookies.getAll({ domain: domain })
        for (let cookie of cookies) {
          if ('cf_clearance' === cookie.name) {
            continue
          }
          await chrome.cookies.remove({
            url: `https://${domain}/`,
            name: cookie.name,
          })
        }
        await chrome.cookies.set({
          url: `https://${domain}/`,
          name: 'auth0',
          value: auth0,
          path: '/',
          secure: true,
          httpOnly: true,
        })
        if (sender.tab && sender.tab.id) {
          await chrome.tabs.update(sender.tab.id, { url })
          sendResponse({ status: 'success' })
        } else {
          sendResponse({ status: 'failure', message: 'Invalid sender tab.' })
        }
      } catch (error) {
        console.log(error)
        sendResponse({ status: 'failure', message: error.message })
      }
      return true
    }
  },
)
