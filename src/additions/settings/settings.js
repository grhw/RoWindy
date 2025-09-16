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

        icon.appendChild(img)

        bar.appendChild(li)
    })
})