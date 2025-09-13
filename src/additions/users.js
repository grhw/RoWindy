// @utils/createIcon.js
const listHtml = `
// #snippets/friendsList.html
` // {TITLE}
const pinIcon = `
// #snippets/pin.html
`
const pinnedIcon = `
// #snippets/pin_filled.html
`
const dropdown = `
// #snippets/dropdown.html
`

const elm = document.createElement("div")
let callback = ()=>{};
elm.innerHTML = dropdown
elm.classList.add("rw-dropdown")
elm.style.display = "none"

const template = elm.querySelector("ul")

Object.keys(rwData["friend_pins"]).forEach((category)=>{
    const button = document.createElement("li")
    const btn = document.createElement("button")
    btn.type = "button"
    btn.className = "friend-tile-dropdown-button"
    btn.textContent = category

    button.append(btn)
    template.prepend(button)

    btn.onclick = ()=>{
        const id = callback()
        if (!rwData["friend_pins"][category]["users"].includes(id)) {
            rwData["friend_pins"][category]["users"].push(id)
            save()
        }
        elm.style.display = "none"
    }
})

document_html.append(elm)

function getUserPinCategory(userId) {
    for (const category of Object.keys(rwData["friend_pins"])) {
        const arr = rwData["friend_pins"][category]["users"]
        if (arr.includes(userId)) {
            return rwData["friend_pins"][category]
        }
    }
    return null
}

function pinUser(aEl,userId) {
    aEl.innerHTML = pinnedIcon
    aEl.setAttribute("filled","true")
    aEl.dataset.userid = userId
}

function unpinUser(aEl,userId) {
    Object.keys(rwData["friend_pins"]).forEach((category)=>{
        const arr = rwData["friend_pins"][category]["users"]
        const idx = arr.indexOf(userId)
        if (idx !== -1) {
            arr.splice(idx,1)
            save()
        }
    })
    aEl.innerHTML = pinIcon
    aEl.removeAttribute("filled")
    delete aEl.dataset.userid
}

hookedPage.push(()=>{
    document.querySelectorAll(".friend-carousel-container:not(.rw-list)").forEach(container=>{
        container.classList.add("rw-list")
        Object.keys(rwData["friend_pins"]).forEach((category)=>{
            const users = rwData["friend_pins"][category]["users"]
            const [el,list, count] = createList(container,category);
            el.setAttribute("style",`--rw-category-color: ${rwData["friend_pins"][category]["color"]};`)

            count.innerText = `(${users.length})`
            addPeopleToList(list,users)
        })
    })

    document.querySelectorAll("a.avatar-card-link").forEach(icon=>{
        const category = getUserPinCategory(icon.href.split("/")[4])
        if (category) {
            icon.parentElement.style.border = `solid 4px ${category["color"]}`
        }
    })

    document.querySelectorAll(".profile-header-details:not(.rw-card), .list-item.avatar-card:not(.rw-card)").forEach(user=>{
        user.classList.add("rw-card")

        const a = document.createElement("a")
        a.classList.add("rw-pin")

        const userId = user.tagName === "LI" 
            ? user.id 
            : document.querySelector(".profile-platform-container")?.getAttribute("data-profile-id")

        const existingCategory = userId ? getUserPinCategory(userId) : null
        if (existingCategory) {
            pinUser(a,userId)
        } else {
            a.innerHTML = pinIcon
            a.setAttribute("filled","false")
        }

        a.onclick = ()=>{
            if (!userId) return

            if (a.getAttribute("filled") === "true") {
                unpinUser(a,userId)
                return
            }

            const pos = a.getBoundingClientRect()
            elm.style.left = `${pos.x + (pos.width/2)}px`
            elm.style.top = `${pos.y + (pos.height)}px`
            elm.style.display = "block"

            callback = ()=>{
                pinUser(a,userId)
                return userId
            }
        }

        user.append(a)
    })
})
