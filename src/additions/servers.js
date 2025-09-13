hookedPage.push(()=>{
    document.querySelectorAll(".game-server-details").forEach(srv=>{
        const snipe = srv.querySelector(".rw-srv");
        const joinButton = srv.querySelector("button[data-btr-instance-id]");
        const placeIdSpan = srv.querySelector("span[data-placeid]");
    
        if (!snipe && joinButton && placeIdSpan) {
            const server_id = joinButton.getAttribute("data-btr-instance-id");
            const place_id = placeIdSpan.getAttribute("data-placeid");
            
            const container = document.createElement("div");
            container.className = "rw-srv";
    
            const force_join = document.createElement("button");
            force_join.onclick = ()=>{
                window.Roblox.GameLauncher.joinGameInstance(place_id,server_id);
            }
            force_join.innerText = "Force Join";
    
    
            const invite_link = document.createElement("button");
            invite_link.onclick = ()=>{
                navigator.clipboard.writeText(`https://www.roblox.com/games/${place_id}/#rw-invite=${server_id}`);
                invite_link.innerText = "Copied!";
                setTimeout(()=>{
                    invite_link.innerText = "Invite";
                },500)
            }
            invite_link.innerText = "Invite";
    
            container.appendChild(force_join);
            container.appendChild(invite_link);
            srv.prepend(container);
        }
    })
})

if (window.location.hash.startsWith("#rw-invite=")) {
    const place = window.location.pathname.split("/")[2];
    const server = window.location.hash.split("=")[1];

    console.log(server,place)

    window.Roblox.GameLauncher.joinGameInstance(place,server);
}