const document_html = document.querySelector("html")
const hookedPage = [];
if (!localStorage.getItem("rw_data")||localStorage.getItem("rw_data") == "{}") {
    localStorage.setItem("rw_data",JSON.stringify({"friend_pins": {}}))
}
const rwData = JSON.parse(localStorage.getItem("rw_data"))
const save = ()=>localStorage.setItem("rw_data",JSON.stringify(rwData))
// @utils/logger.js

// @additions/servers.js
// @additions/users.js

function scan() {
    hookedPage.forEach(func => {
        func()
    });
}

if (window.location.pathname.split("/")[1].toLowerCase() == "rowindy") {
    document_html.classList.add("rw-page")
}

// @additions/settings/categories.js

window.addEventListener("load", scan);

const observer = new MutationObserver(scan);
observer.observe(document_html, { childList: true, subtree: true });