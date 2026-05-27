
let currentLang = "en";


// THEME SWITCH

function setTheme(isDark, themeToggle) {

    document.body.classList.toggle("dark", isDark);

    if (themeToggle) {
        themeToggle.textContent = isDark ? "🔆" : "🌙";
    }

    localStorage.setItem("theme", isDark ? "dark" : "light");

}

function initTheme(themeToggle) {

    const savedTheme = localStorage.getItem("theme");

    let isDark;

    if (savedTheme) {

        isDark = savedTheme === "dark";

    } else {

        isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    }

    setTheme(isDark, themeToggle);

}


// JSON NAMES FETCH

async function fetchNames() {
    const res = await fetch("names.json");
    return await res.json();
}


// FEATURES

async function loadFeatures() {
    const { zh_names = [], en_names = [] } = await fetchNames();
    const names = currentLang === "zh" ? zh_names : en_names;
    const list = document.getElementById("featureList");

    list.innerHTML = "";

    names.slice(0, 6).forEach(name => {
        const li = document.createElement("li");
        li.textContent = name;
        list.appendChild(li);
    });

    document.getElementById("featureMore").href = "i18n.html";
}


// I18N MATRIX

async function loadMatrix() {
    const { zh_names = [], en_names = [] } = await fetchNames();

    const zhSet = new Set(zh_names);
    const enSet = new Set(en_names);
    const all = Array.from(new Set([...zh_names, ...en_names]));
    const displayCount = Math.min(all.length, 6);

    const tbody = document.querySelector("#i18nTable tbody");
    tbody.innerHTML = "";

    all.slice(0, displayCount).forEach(name => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
<td>${name}</td>
<td>${zhSet.has(name) ? "√" : "×"}</td>
<td>${enSet.has(name) ? "√" : "×"}</td>
`;
        tbody.appendChild(tr);
    });

    if (all.length > displayCount) {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td colspan="3"><a href="i18n.html">Read more</a></td>`;
        tbody.appendChild(tr);
    }
}


// INIT

document.addEventListener("DOMContentLoaded", () => {
    const themeToggleButton = document.getElementById("themeToggle");
    const langSelect = document.getElementById("langSelect");

    initTheme(themeToggleButton);

    if (themeToggleButton) {
        themeToggleButton.addEventListener("click", () => {
            const isDark = document.body.classList.contains("dark");
            setTheme(!isDark, themeToggleButton);
        });
    }

    if (langSelect) {
        langSelect.addEventListener("change", e => {
            currentLang = e.target.value;
            loadFeatures();
            loadMatrix();
        });
    }

    loadFeatures();
    loadMatrix();
});