
const FEEDS = {

    zh: "https://zh.dailyminz.org/atom.xml",
    en: "https://en.dailyminz.org/atom.xml"

};

let currentLang = "en";


// THEME SWITCH

document.getElementById("themeToggle").addEventListener("change", e => {

    document.body.classList.toggle("dark");

});


// LANGUAGE SWITCH

document.getElementById("langSelect").addEventListener("change", e => {

    currentLang = e.target.value;

    loadPosts();
    loadMatrix();

});




// RSS FETCH

async function fetchFeed(url) {

    const res = await fetch("https://api.allorigins.win/get?url=" + encodeURIComponent(url));

    const data = await res.json();

    const xml = new DOMParser().parseFromString(data.contents, "text/xml");

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

    const tbody = document.querySelector("#i18nTable tbody");
    tbody.innerHTML = "";

    all.forEach(name => {

        const tr = document.createElement("tr");

        tr.innerHTML = `

<td>${name}</td>
<td>${zhSet.has(name) ? "√" : "×"}</td>
<td>${enSet.has(name) ? "√" : "×"}</td>

`;

        tbody.appendChild(tr);

    });

}


function slug(url) {

    return url.split("/").pop().replace(".html", "");

}



// INIT

loadPosts();
loadMatrix();