const page = `
// #pages/settings.html
`
const icon_img = `
// #snippets/icon.txt
`


hookedPage.push(()=>{
    document.querySelectorAll(".rbx-navbar-icon-group:not(.rw-bar)").forEach(bar=>{
        bar.classList.add("rw-bar")

        const li = document.createElement("li")
        const icon = document.createElement("button")
        icon.type = "button"
        icon.classList.add("btn-navigation-nav-settings-md")
        li.appendChild(icon)
        const img = document.createElement("span")
        img.classList.add("rw-icon")
        img.style.backgroundImage = `url("${icon_img.trim()}")`

        icon.onclick = ()=>{
            window.location.assign("https://www.roblox.com/rowindy/settings")
        }

        icon.appendChild(img)

        bar.appendChild(li)
    })
})

if (!document_html.classList.contains("rw-page")) return

if (window.location.pathname.split("/")[2].toLowerCase() == "settings") {
    hookedPage.push(()=>{
        document.querySelectorAll("#content:not(.rw)").forEach(content=>{
            document.querySelector("title").innerText = "Settings - RoWindy"
            content.classList.add("rw")
            content.innerHTML = page
        })
    })
}