
let currentSubject = "oral";

// ==========================================
// HIDE ALL PAGES
// ==========================================

function hideAll() {

    document.getElementById("subjects").style.display = "none";

    document.getElementById("subjectPage").style.display = "none";

    document.getElementById("lessonPage").style.display = "none";

}

// ==========================================
// SHOW SUBJECTS PAGE
// ==========================================

function showSubjects() {

    hideAll();

    document.getElementById("subjects").style.display = "block";

    document.getElementById("searchBar").value = "";

    document.getElementById("searchResults").innerHTML = "";

    document.querySelectorAll("#subjectButtons button").forEach(function(button) {

        button.style.display = "block";

    });

}

// ==========================================
// SHOW A SUBJECT'S LESSONS
// ==========================================

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

// ==========================================
// SHOW A LESSON
// ==========================================

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

// ==========================================
// GENERATE SUBJECT BUTTONS
// ==========================================

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

// ==========================================
// SEARCH SUBJECTS AND LESSONS
// ==========================================

function searchContent() {

    const search = document.getElementById("searchBar")
        .value.toLowerCase().trim();

    const results = document.getElementById("searchResults");

    const subjectButtons = document.querySelectorAll("#subjectButtons button");

    results.innerHTML = "";

    // Show all subject buttons when search is empty.

    if (search === "") {

        subjectButtons.forEach(function(button) {

            button.style.display = "block";

        });

        return;

    }

    // Hide normal subject buttons while searching.

    subjectButtons.forEach(function(button) {

        button.style.display = "none";

    });

    // Search every subject and its lessons.

    reviewerData.forEach(function(subject) {

        const matchingSubject =
            subject.name.toLowerCase().includes(search);

        const matchingLessons = subject.lessons.filter(function(lesson) {

            const matchingTitle =
                lesson.title.toLowerCase().includes(search);

            const matchingContent = lesson.content.some(function(item) {

                return item.heading.toLowerCase().includes(search) ||
                       item.text.toLowerCase().includes(search);

            });

            return matchingTitle || matchingContent;

        });

        // Skip subjects with no matches.

        if (!matchingSubject && matchingLessons.length === 0) {

            return;

        }

        // Add the subject heading.

        const title = document.createElement("div");

        title.className = "search-title";

        title.textContent = subject.name;

        results.appendChild(title);

        // Add a subject button if its name matches.

        if (matchingSubject) {

            const button = document.createElement("button");

            button.textContent = "Open " + subject.name;

            button.onclick = function() {

                showSubject(subject.id);

            };

            results.appendChild(button);

        }

        // Add matching lesson buttons.

        matchingLessons.forEach(function(lesson) {

            const button = document.createElement("button");

            button.textContent = subject.name + " - " + lesson.title;

            button.onclick = function() {

                showLesson(subject.id, lesson.id);

            };

            results.appendChild(button);

        });

    });

    // Display a message if nothing matches.

    if (results.innerHTML === "") {

        results.textContent = "No subjects or lessons found.";

    }

}

// ==========================================
// START THE WEBSITE
// ==========================================

initializeSubjects();

showSubjects();