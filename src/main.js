const hookedPage = [];

// @additions/servers.js

function scan() {
    document.querySelectorAll(".game-server-details").forEach(el => {
        hookedPage.forEach(func => {
            func(el)
        });
    });
}

window.addEventListener("load", scan);

const observer = new MutationObserver(scan);
observer.observe(document.body, { childList: true, subtree: true });