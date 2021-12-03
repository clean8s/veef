fetch("https://run.mocky.io/v3/7b1ccde5-01bf-4e12-9a23-d87ff910a0cd").then(x => x.json()).then(resp => {
    tree3.data = resp;
    tree4.data = resp;
});
tree5.renderLabel = (handler) => {
    let h = VeefElement.h;
    if(handler.path.length === 1)
    return h`<span><v-icon name="Menu"></v-icon> Menu-style JSON: {</span>`
    let icon = "CircleFilled";
    if(handler.type != "Number") {
        if( handler.path[0].toLowerCase() != handler.path[0]) {
            icon = handler.path[0]
        }
        if(handler.path[0] == "Music") {
            icon = "MusicNote"
        }
    }
    return h`<span><v-icon name=${icon}></v-icon> ${handler.path[0]}: {</span>`
}
tree5.renderInfo = (handler) => {
    return ""
}
tree5.dark = true;
tree5.theme = {
    background: "#FF6600",
    text: "#fff",
    str: "#FF9966",
    num: "#FF9966"
}
tree5.data = {
    Settings: {
        Wifi: {
            Help: "I want help",
            datalimit: "40GB"
        },
        Music: {
            Play: "ok",
            Stop: "ok"
        }
    },
    Folder: [
        1,2,3
    ]
}

