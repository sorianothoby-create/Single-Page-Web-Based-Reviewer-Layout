
let currentSubject = "hope 3";

function hideAll() {
    document.getElementById("subjects").style.display = "none";
    document.getElementById("subjectPage").style.display = "none";
    document.getElementById("lessonPage").style.display = "none";
}

function showSubjects() {
    hideAll();

    document.getElementById("subjects").style.display = "block";
    document.getElementById("searchBar").value = "";
    document.getElementById("searchResults").innerHTML = "";

    document.querySelectorAll("#subjectButtons button").forEach(function(button) {
        button.style.display = "block";
    });

    window.scrollTo(0, 0);
}

function showSubject(subjectId) {
    const subject = reviewerData.find(function(item) {
        return item.id === subjectId;
    });

    if (!subject) return;

    currentSubject = subjectId;

    hideAll();

    document.getElementById("subjectTitle").textContent = subject.name;

    const buttons = document.getElementById("lessonButtons");
    buttons.innerHTML = "";

    subject.lessons.forEach(function(lesson) {
        const button = document.createElement("button");
        button.textContent = lesson.title;

        button.onclick = function() {
            showLesson(subject.id, lesson.id);
        };

        buttons.appendChild(button);
    });

    document.getElementById("subjectPage").style.display = "block";

    window.scrollTo(0, 0);
}

function showLesson(subjectId, lessonId) {
    const subject = reviewerData.find(function(item) {
        return item.id === subjectId;
    });

    if (!subject) return;

    const lesson = subject.lessons.find(function(item) {
        return item.id === lessonId;
    });

    if (!lesson) return;

    currentSubject = subjectId;

    hideAll();

    document.getElementById("lessonTitle").textContent =
        subject.name + " - " + lesson.title;

    const content = document.getElementById("lessonContent");
    content.innerHTML = "";

    lesson.content.forEach(function(item) {
        const heading = document.createElement("h3");
        heading.textContent = item.heading;

        const paragraph = document.createElement("p");
        paragraph.textContent = item.text;
        paragraph.style.whiteSpace = "pre-line";

        content.appendChild(heading);
        content.appendChild(paragraph);
    });

    document.getElementById("lessonPage").style.display = "block";

    window.scrollTo(0, 0);
}

function initializeSubjects() {
    const container = document.getElementById("subjectButtons");
    container.innerHTML = "";

    reviewerData.forEach(function(subject) {
        const button = document.createElement("button");
        button.textContent = subject.name;

        button.onclick = function() {
            showSubject(subject.id);
        };

        container.appendChild(button);
    });
}


function searchContent() {
    const searchBar = document.getElementById("searchBar");
    const searchResults = document.getElementById("searchResults");
    const subjectButtons = document.getElementById("subjectButtons");

    const query = searchBar.value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    searchResults.replaceChildren();

    if (!query) {
        subjectButtons.style.display = "";
        return;
    }

    subjectButtons.style.display = "none";

    const words = query.split(" ");
    const results = [];

    function normalize(text) {
        return String(text || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\w\s]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    function makeSnippet(text, queryWords) {
        const original = String(text || "").replace(/\s+/g, " ").trim();

        if (!original) {
            return "Open this section to review its content.";
        }

        const normalizedText = normalize(original);
        let position = -1;

        for (const word of queryWords) {
            position = normalizedText.indexOf(word);
            if (position !== -1) break;
        }

        if (position === -1) {
            return original.slice(0, 140) +
                (original.length > 140 ? "..." : "");
        }

        const start = Math.max(0, position - 45);
        const end = Math.min(original.length, position + 100);

        return (start > 0 ? "..." : "") +
            original.slice(start, end) +
            (end < original.length ? "..." : "");
    }

    for (const subject of reviewerData) {
        const subjectName = normalize(subject.name);

        // Search subject names.
        if (words.every(word => subjectName.includes(word))) {
            results.push({
                type: "subject",
                subject,
                title: subject.name,
                snippet: "Subject — open to see its lessons.",
                score: 100
            });
        }

        for (const lesson of subject.lessons) {
            const title = normalize(lesson.title);
            const headings = lesson.content
                .map(item => normalize(item.heading))
                .join(" ");

            const content = lesson.content
                .map(item => normalize(item.text))
                .join(" ");

            const searchableText =
                `${subjectName} ${title} ${headings} ${content}`;

            // Every search word must match somewhere in the lesson.
            if (!words.every(word => searchableText.includes(word))) {
                continue;
            }

            let score = 0;

            if (title === query) score += 100;
            else if (title.startsWith(query)) score += 70;
            else if (title.includes(query)) score += 50;

            for (const word of words) {
                if (title.includes(word)) score += 10;
                if (headings.includes(word)) score += 5;
                if (content.includes(word)) score += 1;
            }

            let snippetText = lesson.content
                .map(item => `${item.heading}: ${item.text}`)
                .join(" ");

            // Prefer a section that actually contains the search term.
            const matchingSection = lesson.content.find(item => {
                const section = normalize(
                    `${item.heading} ${item.text}`
                );
                return words.every(word => section.includes(word));
            });

            if (matchingSection) {
                snippetText =
                    `${matchingSection.heading}: ${matchingSection.text}`;
            }

            results.push({
                type: "lesson",
                subject,
                lesson,
                title: lesson.title,
                snippet: makeSnippet(snippetText, words),
                score
            });
        }
    }

    // Show the strongest matches first.
    results.sort((a, b) => b.score - a.score);

    if (results.length === 0) {
        const message = document.createElement("p");
        message.className = "search-empty";
        message.textContent =
            `No results found for "${searchBar.value.trim()}". Try fewer or different keywords.`;

        searchResults.appendChild(message);
        return;
    }

    const heading = document.createElement("p");
    heading.className = "search-title";
    heading.textContent =
        `${results.length} result${results.length === 1 ? "" : "s"} found`;

    searchResults.appendChild(heading);

    for (const result of results) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "search-result-button";

        const title = document.createElement("strong");
        title.className = "search-result-heading";
        title.textContent = result.title;

        const details = document.createElement("span");
        details.className = "search-result-snippet";
        details.textContent = result.snippet;

        const category = document.createElement("span");
        category.className = "search-result-category";
        category.textContent = result.type === "subject"
            ? "SUBJECT"
            : result.subject.name;

        button.textContent = result.title;

        button.addEventListener("click", () => {
            searchBar.value = "";
            searchResults.replaceChildren();
            subjectButtons.style.display = "";

            if (result.type === "subject") {
                showSubject(result.subject.id);
            } else {
                showLesson(result.subject.id, result.lesson.id);
            }
        });

        searchResults.appendChild(button);
    }
}


const themeToggle = document.getElementById("themeToggle");

function updateThemeButton() {
    const isDark = document.documentElement.dataset.theme === "dark";

    themeToggle.textContent = isDark ? "☀️" : "🌙";

    themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
    );
}

themeToggle.addEventListener("click", function() {
    const isDark = document.documentElement.dataset.theme === "dark";

    document.documentElement.dataset.theme = isDark ? "light" : "dark";

    updateThemeButton();
});


const floatingBackButton = document.getElementById("floatingBackButton");

function goBack() {
    const subjectPage = document.getElementById("subjectPage");
    const lessonPage = document.getElementById("lessonPage");

    if (lessonPage.style.display !== "none") {
        showSubject(currentSubject);
    } else if (subjectPage.style.display !== "none") {
        showSubjects();
    }

    updateFloatingBackButton();
}

function updateFloatingBackButton() {
    const subjectPage = document.getElementById("subjectPage");
    const lessonPage = document.getElementById("lessonPage");

    const activePage =
        lessonPage.style.display !== "none" ? lessonPage :
        subjectPage.style.display !== "none" ? subjectPage :
        null;

    if (!activePage) {
        floatingBackButton.classList.remove("visible");
        return;
    }

    const topBackButton = activePage.querySelector(".back-button");

    if (!topBackButton) {
        floatingBackButton.classList.remove("visible");
        return;
    }

    const buttonPosition = topBackButton.getBoundingClientRect();

    const topButtonIsVisible =
        buttonPosition.bottom > 0 &&
        buttonPosition.top < window.innerHeight;

    floatingBackButton.classList.toggle("visible", !topButtonIsVisible);
}

window.addEventListener("scroll", updateFloatingBackButton);
window.addEventListener("resize", updateFloatingBackButton);
initializeSubjects();
showSubjects();
updateThemeButton();