const message = {
  content: "ahahahhheahhahahaha",
  author: "uid of user"
}

// here i decided to use jquery for some reason (i've barely used it before)

export function messageElement(message) {
  const $box = $('<div>').addClass('message');
  const $author = $('<span>').addClass('author').text(message.author.name+": ");
  const $content = $('<span>').text(message.content);
  $box.append($author);
  $box.append($content);
  $('.chatbox').append($box);
  return $box;
}

// however integrating jquery with my other code is kinda hard for a neophyte like me so I'm just going to leave it in this module
