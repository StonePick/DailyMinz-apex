
const FEEDS = {

    zh: "https://zh.dailyminz.org/atom.xml",
    en: "https://en.dailyminz.org/atom.xml"

};

let currentLang = "en";


// THEME SWITCH

const themeToggle = document.getElementById("themeToggle");

function setTheme(isDark) {

    document.body.classList.toggle("dark", isDark);

    themeToggle.textContent = isDark ? "🔆" : "🌙";

    localStorage.setItem("theme", isDark ? "dark" : "light");

}

function initTheme() {

    const savedTheme = localStorage.getItem("theme");

    let isDark;

    if (savedTheme) {

        isDark = savedTheme === "dark";

    } else {

        isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    }

    setTheme(isDark);

}

initTheme();

themeToggle.addEventListener("click", () => {

    const isDark = document.body.classList.contains("dark");

    setTheme(!isDark);

});


// LANGUAGE SWITCH

document.getElementById("langSelect").addEventListener("change", e => {

    currentLang = e.target.value;

    loadPosts();
    loadMatrix();

});




// RSS FETCH

async function fetchFeed(url) {

    const res = await fetch("https://cors-anywhere.herokuapp.com/" + url);

    const xml = new DOMParser().parseFromString(await res.text(), "text/xml");

    const entries = [...xml.querySelectorAll("entry")];

    return entries.map(e => ({

        title: e.querySelector("title").textContent,
        link: e.querySelector("link").getAttribute("href")

    }));

}



// LATEST POSTS

async function loadPosts() {

    const posts = await fetchFeed(FEEDS[currentLang]);

    const list = document.getElementById("postList");

    list.innerHTML = "";

    posts.slice(0, 6).forEach(p => {

        const li = document.createElement("li");

        li.innerHTML = `<a href="${p.link}">${p.title}</a>`;

        list.appendChild(li);

    });

    document.getElementById("readMore").href =
        currentLang === "zh" ?
            "https://zh.dailyminz.org" :
            "https://en.dailyminz.org";

}



// I18N MATRIX

async function loadMatrix() {

    const zh = await fetchFeed(FEEDS.zh);
    const en = await fetchFeed(FEEDS.en);

    const zhSet = new Set(zh.map(p => slug(p.link)));
    const enSet = new Set(en.map(p => slug(p.link)));

    const all = new Set([...zhSet, ...enSet]);
    const allArray = Array.from(all);
    const displayCount = Math.min(allArray.length, 6);

    const tbody = document.querySelector("#i18nTable tbody");
    tbody.innerHTML = "";

    allArray.slice(0, displayCount).forEach(name => {

        const tr = document.createElement("tr");

        tr.innerHTML = `

<td>${name}</td>
<td>${zhSet.has(name) ? "√" : "×"}</td>
<td>${enSet.has(name) ? "√" : "×"}</td>

`;

        tbody.appendChild(tr);

    });

    if (allArray.length > 6) {

        const tr = document.createElement("tr");

        tr.innerHTML = `<td colspan="3"><a href="i18n.html">Read more</a></td>`;

        tbody.appendChild(tr);

    }

}


function slug(url) {

    return url.split("/").pop().replace(".html", "");

}



// INIT

loadPosts();
loadMatrix();