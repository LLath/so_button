let png;

document.addEventListener("getPng", e => {
  console.log("Got injected material")
  png = e.detail
})

const buildBadge = (added_node) => {
  const usernameContainer = added_node.getElementsByClassName("chat-line__username-container")[0]
  if (usernameContainer === undefined) {
    // console.log("UsernameContainer is empty", usernameContainer)
    return
  }
  const badges = usernameContainer.querySelector("span")

  // const testContent = document.createElement("button")
  // const testContentText = document.createTextNode(">")
  // testContent.append(testContentText)
  // soBadgeContainer.appendChild(testContent)

  const soBadgeContainer = document.createElement("div")
  soBadgeContainer.classList.add("InjectLayout-sc-588ddc-0")
  soBadgeContainer.classList.add("kUvjun")

  const badgeButton = document.createElement("button")

  const soBadgeContent = document.createElement("img")
  soBadgeContent.height = "16"
  soBadgeContent.width = "16"
  soBadgeContent.alt = "Shout out"
  soBadgeContent.src = png

  badgeButton.appendChild(soBadgeContent)
  soBadgeContainer.appendChild(badgeButton)
  badges.appendChild(soBadgeContainer)

  soBadgeContainer.addEventListener("click", event => {
    const username = usernameContainer.getElementsByClassName("chat-author__display-name")[0].innerHTML
    const msg = `!so ${username}`

    setInputValue(msg)
    getInputController().props.onSendMessage(msg)
  })
}

window.addEventListener("load", event => {
  const messageContainer = document.getElementsByClassName("chat-scrollable-area__message-container").item(0)

  for (const message of messageContainer.children) {
    buildBadge(message)
  }
  const config = { childList: true, subtree: true }

  const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      mutation.addedNodes.forEach(added_node => {
        // console.log("ADDED NODE", added_node)
        if (added_node.classList.contains("chat-line__message")) {
          buildBadge(added_node)
        }
      })
    }
  }

  const observer = new MutationObserver(callback)

  observer.observe(messageContainer, config)

})


//#region Event helpers
// https://github.com/SevenTV/SevenTV/blob/dev/src/Sites/twitch.tv/Util/Twitch.ts
function setInputValue(value) {
  value = value.replace(/�/g, ''); // omit weird character
  const el = document.querySelector("[data-a-target='chat-input']");
  if (el && typeof el.value != undefined) {
    el.value = value;
    el.dispatchEvent(new Event('input', { bubbles: true }));

    const inst = getReactInstance(el);

    if (inst) {
      const props = inst.memoizedProps;
      if (props && props.onChange) {
        props.onChange({ target: el });
      }
    }
  } else {
    const el = getChatInput()?.props;
    el.onChange({ target: { value: value } });
  }
}

function findReactParents(node, predicate, maxDepth = 15, depth = 0) {
  let success = false;
  try { success = predicate(node); } catch (_) { }
  if (success) return node;
  if (!node || depth > maxDepth) return null;

  const { 'return': parent } = node;
  if (parent) {
    return findReactParents(parent, predicate, maxDepth, depth + 1);
  }

  return null;
}

function getReactInstance(el) {
  for (const k in el) {
    if (k.startsWith('__reactInternalInstance$')) {
      return (el)[k];
    }
  }
}

function getInputController() {
  const node = findReactParents(
    getReactInstance(document.querySelectorAll('div.chat-input')[0]),
    n => n.stateNode?.props.onSendMessage,
  );
  return node?.stateNode;
}
//#endregion