window.addEventListener("load", event => {
  const button = document.getElementById("addChat")
  const container = document.getElementsByClassName("chat-scrollable-area__message-container")[0]

  button.addEventListener("click", event => {
    const message = document.createElement("div")
    message.classList.add("chat-line__message")
    const usernameContainer = document.createElement("div")
    usernameContainer.classList.add("chat-line__username-container")
    const badges = document.createElement("span")
    const badgesItem = document.createTextNode("B")
    badges.append(badgesItem)
    usernameContainer.appendChild(badges)
    message.append(usernameContainer)
    container.appendChild(message)

    console.log(event)
  })
})