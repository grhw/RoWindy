hookedPage.push((srv)=>{
    const snipe = srv.querySelector(".rw-srv");
    const joinButton = srv.querySelector("button[data-btr-instance-id]");
    const placeIdSpan = srv.querySelector("span[data-placeid]");

    if (!snipe && joinButton && placeIdSpan) {
        const server_id = joinButton.getAttribute("data-btr-instance-id");
        const place_id = joinButton.getAttribute("data-placeid");
        
        const container = document.createElement("div");
        const force_join = document.createElement("button");
        container.className = "rw-srv";

        force_join.onclick = ()=>{
            window.Roblox.GameLauncher.joinGameInstance(place_id,server_id);
        }
        force_join.innerText = "Force Join";
        container.appendChild(force_join);
        srv.appendChild(container);
    }
})