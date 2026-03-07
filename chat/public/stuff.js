const themes = {
  "red": {
    chatboxColor: "rgb(54, 54, 54)",
    borderColor: "rgb(223, 72, 61)",
    nameColor: "rgb(223, 72, 61)",
    messageHover: "rgb(63, 63, 63)",
    chatboxText: "white",
    logoutColor: "white",
    alt: "green",
    buttonColor: "white"
  },
  "green": {
    chatboxColor: "rgb(54, 54, 54)",
    borderColor: "rgb(50, 238, 144)",
    nameColor: "rgb(50, 238, 144)",
    messageHover: "rgb(63, 63, 63)",
    chatboxText: "white",
    logoutColor: "rgb(255, 79, 79)",
    alt: "green",
    buttonColor: "rgb(50, 238, 144)",
  },
  "blue": {
    chatboxColor: "#e3eff6",
    borderColor: "#39ace7",
    nameColor: "rgb(38, 46, 90)",
    messageHover: "#b7e5ff83",
    chatboxText: "rgb(53, 63, 122)",
    logoutColor: "rgb(53, 63, 122)",
    alt: "green",
    buttonColor: "#39ace7"
  },
  "brown": {
    chatboxColor: "rgb(229,222,207)",
    borderColor: "rgb(217,189,165)",
    nameColor: "rgb(38, 46, 90)",
    messageHover: "#b7e5ff83",
    chatboxText: "rgb(53, 63, 122)",
    logoutColor: "rgb(53, 63, 122)",
    alt: "green",
    buttonColor: "rgb(217,189,165)"
  }
}
// behold the one instance of jquery usage in this entire project
export function messageElement(message) {
  let date;
  if(message.created_at) {
      date = message.created_at.toDate();
  } else {
      date = new Date();
  }

  let timeInfo = `${date.toLocaleDateString("en-US", {dateStyle: "short"})} ${date.toLocaleTimeString("en-US", {timeStyle:"short"})}`;
  timeInfo = timeInfo.replace(`${new Date().toLocaleDateString("en-US", {dateStyle: "short"})} `, "")

  
  const $box = $('<div>').addClass('message');
  const $author = $('<span>').addClass('author').text(message.author.name+": ");
  const $content = $('<span>').text(message.content);
  const $timestamp = $('<span>').text(" - " + timeInfo);
  $box.append($author);
  $box.append($content);
  $box.append($timestamp);
  $('.chatbox').append($box);
  return $box;
}

export function manualElement(command, description) {
  const $box = $('<div>').addClass('cmd');
  const $name = $('<span>').addClass('author').text(command+" - ");
  const $desc = $('<span>').text(description);
  $box.append($name);
  $box.append($desc);
  $('.manual').append($box);
  return $box;
}


export function changeTheme(t) {
  const theme = themes[t]
  const root = document.documentElement;
  root.style.setProperty('--chatbox-color', theme.chatboxColor);
  root.style.setProperty('--border-color', theme.borderColor);
  root.style.setProperty("--namecolor", theme.nameColor);
  root.style.setProperty("--message-hover", theme.messageHover);
  root.style.setProperty("--chatbox-text", theme.chatboxText);
  root.style.setProperty("--logout-color", theme.logoutColor);
  root.style.setProperty("--alt", theme.altColor);
  root.style.setProperty("--button-color", theme.buttonColor); 

  // root.style.setProperty('--border-color', theme.chatboxColor);
}

export function scrollToBottom(f) {
  const chatbox = document.querySelector(".chatbox");
  if(chatbox.scrollHeight-chatbox.scrollTop < 400 || !f) {
    console.log(chatbox.scrollHeight);
    console.log(chatbox.scrollTop);
    return;
  }
  chatbox.scrollTop = chatbox.scrollHeight;
}

