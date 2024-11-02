;(function () {
  window.addEventListener('message', function (event) {
    if (event.source !== window) {
      return
    }

    if (event.data && event.data.type === 'SET_FAKEOAI_DATA') {
      chrome.runtime.sendMessage({
        action: 'setFakeOAIData',
        ...event.data,
      })
    }
  })
  const evt = new CustomEvent('FakeOAIAuthHelperEvent', {})
  window.dispatchEvent(evt)
})()
