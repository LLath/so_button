const inject = async (src) => {
  const script = document.createElement("script")
  script.src = src
  script.onload = () => {
    console.log(`Injected into twitch`)
    const png = chrome.runtime.getURL("icons/play-button.png")
    document.dispatchEvent(new CustomEvent("getPng", { "detail": png }))
  }
  (document.head || document.documentElement).appendChild(script)
}

(async () => {
  const src = chrome.runtime.getURL('script.js');
  inject(src)

})();

