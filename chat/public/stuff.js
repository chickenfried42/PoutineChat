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
    borderColor: "rgb(122, 106, 92)",
    nameColor: "rgb(38, 46, 90)",
    messageHover: "#887b7849",
    chatboxText: "rgb(53, 63, 122)",
    logoutColor: "rgb(53, 63, 122)",
    alt: "green",
    buttonColor: "rgb(122, 106, 92)",
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

  console.log(message);
  const $box = $('<div>').addClass('message');
  const $author = $(`<span id="${message.author.id}">`).addClass('author').text(message.author.name+":");
  const $avatar = $(`<img id="${message.author.id}">`).addClass('avatar').attr("src", message.author.avatar);
//  const $avatar = $('<img>').addClass('avatar').attr("src", "https://render.fineartamerica.com/images/rendered/default/poster/8/7.5/break/images/artworkimages/medium/3/carpenter-brut-logo-band-connor-wilson.jpg");
  const $content = $('<span>').text(message.content);
  const $timestamp = $('<span style="margin-left: 4px;" class="timestamp">').text("@" + timeInfo);
  
  $box.append($avatar);
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
  if(chatbox.scrollHeight-chatbox.scrollTop < 400 && !f) {
    return;
  }
  chatbox.scrollTop = chatbox.scrollHeight;
  setTimeout(function() {chatbox.scrollTop = chatbox.scrollHeight;}, 167)
}

