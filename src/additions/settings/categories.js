const page = `
// #pages/categories.html
`

if (!document_html.classList.contains("rw-page")) return

if (window.location.pathname.split("/")[2].toLowerCase() == "categories") {
    hookedPage.push(()=>{
        document.querySelectorAll("#content:not(.rw)").forEach(content=>{
            document.querySelector("title").innerText = "Categories - RoWindy"
            content.classList.add("rw")
            content.innerHTML = page

            content.querySelector(".create-pin").onclick = ()=>{
                rwData["friend_pins"][`User Pin #${Object.keys(rwData["friend_pins"]).length}`] = {
                    "users": [],
                    "color": "#ffffff"
                }
                save()
                window.location.reload()
            }

            Object.keys(rwData["friend_pins"]).forEach((category)=>{
                const settings = document.querySelector(".rw-template").cloneNode(true)
                const title = settings.querySelector("h2")
                const col = settings.querySelector("#color input")
                title.innerText = category

                col.value = rwData["friend_pins"][category]["color"]
                col.oninput = ()=>{
                    rwData["friend_pins"][category]["color"] = col.value
                    save()
                }

                settings.classList.remove("rw-template")

                document.querySelector("#content").append(settings)
            })
        })
    })
}