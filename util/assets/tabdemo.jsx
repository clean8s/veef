document.addEventListener("DOMContentLoaded", () => {
    createTab.addEventListener('click', () => {
        const btn = document.createElement("button");
        btn.slot = "tab";

        const vtabs = createTab.nextElementSibling;
        const i = Array.from(vtabs.querySelectorAll('button')).length + 1;
        btn.textContent = "Tab";
        let bq = Array.from(tabDemo.querySelectorAll("button"))
        bq[bq.length - 1].after(btn)

        const tab = document.createElement("div");
        // tab.style.display = 'none'
        tab.innerHTML = `<h1>This is tab #${i}</h1>`
        tab.style.display = 'none'
        tabDemo.append(tab)
    })
})