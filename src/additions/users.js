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
            Object.keys(rwData["friend_pins"]).forEach((cat)=>{
                const arr = rwData["friend_pins"][cat]["users"]
                const idx = arr.indexOf(id)
                if (idx !== -1) arr.splice(idx,1)
            })
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

function createList(container,title) {
    const list = document.createElement("div");
    list.classList.add("react-friends-carousel-container")

    list.innerHTML = listHtml.replaceAll("{TITLE}",`<span style="color: var(--rw-category-color);">${title}</span> <span class="count">(0)</span>`)
    container.prepend(list)

    return [list,list.querySelector(".friends-carousel-list-container"),list.querySelector(".count")]
}

const presences = ["offline","online","ingame"]
async function addPeopleToList(list,user_ids) {
    if (user_ids.length === 0) return

    const headshots_raw = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?size=150x150&format=Png&userIds=${user_ids.join(",")}`)
    const headshots = await headshots_raw.json()
    const users_raw = await fetch("https://users.roblox.com/v1/users",{
        method: "POST",
        body: JSON.stringify({
            "userIds": user_ids,
            "excludeBannedUsers": false
        })
    })
    const users = await users_raw.json()
    const status_raw = await fetch("https://presence.roblox.com/v1/presence/users",{
        method: "POST",
        body: JSON.stringify({
            "userIds": user_ids,
        })
    })
    const status = await status_raw.json()

    user_ids.forEach((user_id,i)=>{
        const st = status["userPresences"][i]
        createIcon(list,user_id,headshots["data"][i].imageUrl,users["data"][i]["displayName"],st["lastLocation"],presences[st["userPresenceType"]])
    })
}

function pinUser(aEl,userId,color) {
    aEl.innerHTML = pinnedIcon
    aEl.setAttribute("filled","true")
    aEl.dataset.userid = userId
    if (aEl.parentElement) {
        aEl.parentElement.style.border = `solid 4px ${color}`
    }
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
    if (aEl.parentElement) {
        aEl.parentElement.style.border = ""
    }
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
            pinUser(a,userId,existingCategory["color"])
        } else {
            a.innerHTML = pinIcon
            a.setAttribute("filled","false")
        }

        a.onclick = ()=>{

            if (Object.keys(rwData["friend_pins"]).length < 1) {
                window.location.assign("https://www.roblox.com/rowindy/categories")
            }
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
                const cat = getUserPinCategory(userId)
                const color = cat ? cat["color"] : "var(--theme-accent)"
                pinUser(a,userId,color)
                return userId
            }
        }

        user.append(a)
    })
})
