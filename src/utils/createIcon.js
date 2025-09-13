const userHtml = `
// #snippets/user.html
` // {USERID} {THUMBNAIL} {DISPLAY} {STATUS}


function createIcon(at,user_id,thumbnail,display,status,icon) {
    const user = document.createElement("div");

    user.innerHTML = userHtml.replaceAll("{USERID}",user_id).replaceAll("{THUMBNAIL}",thumbnail).replaceAll("{DISPLAY}",display).replaceAll("{STATUS}",status).replaceAll("{ICON}",icon)
    at.appendChild(user)
}

return createIcon