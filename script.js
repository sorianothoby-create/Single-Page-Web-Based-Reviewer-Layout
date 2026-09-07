function hideAll() {

    document.getElementById("subjects").style.display = "none";

    document.querySelectorAll(".page").forEach(function(page) {
        page.style.display = "none";
    });

    document.querySelectorAll(".lesson").forEach(function(lesson) {
        lesson.style.display = "none";
    });

}


function showSubject(subject) {

    hideAll();

    document.getElementById(subject).style.display = "block";

}


function showLesson(lesson) {

    hideAll();

    document.getElementById(lesson).style.display = "block";

}


function showSubjects() {

    hideAll();

    document.getElementById("subjects").style.display = "block";

}

function searchContent() {

    let search = document.getElementById("searchBar").value.toLowerCase().trim();

    let results = document.getElementById("searchResults");

    let subjectButtons = document.querySelectorAll("#subjects > button");

    results.innerHTML = "";


    // If search is empty
    if (search === "") {

        subjectButtons.forEach(function(button) {
            button.style.display = "block";
        });

        return;
    }


    // Hide normal subject buttons while searching
    subjectButtons.forEach(function(button) {
        button.style.display = "none";
    });


    // SUBJECTS

    let subjects = [
        {
            name: "Oral Communication",
            id: "oral"
        },

        {
            name: "Physical Science",
            id: "physical"
        },

        {
            name: "Practical Research",
            id: "research"
        }
    ];


    // LESSONS

    let lessons = [

        {
            name: "Lesson 1",
            id: "oralLesson1",
            subject: "Oral Communication"
        },

        {
            name: "Lesson 2",
            id: "oralLesson2",
            subject: "Oral Communication"
        },

        {
            name: "Lesson 3",
            id: "oralLesson3",
            subject: "Oral Communication"
        },

        {
            name: "Lesson 1",
            id: "physicalLesson1",
            subject: "Physical Science"
        },

        {
            name: "Lesson 2",
            id: "physicalLesson2",
            subject: "Physical Science"
        },

        {
            name: "Lesson 3",
            id: "physicalLesson3",
            subject: "Physical Science"
        },

        {
            name: "Lesson 1",
            id: "researchLesson1",
            subject: "Practical Research"
        },

        {
            name: "Lesson 2",
            id: "researchLesson2",
            subject: "Practical Research"
        },

        {
            name: "Lesson 3",
            id: "researchLesson3",
            subject: "Practical Research"
        }

    ];


    // CHECK IF A SUBJECT MATCHES

    let matchingSubject = subjects.find(function(subject) {

        return subject.name.toLowerCase().includes(search);

    });


    // IF A SUBJECT MATCHES

    if (matchingSubject) {

        // SUBJECT LABEL

        results.innerHTML += `
            <div class="search-title">
                SUBJECT
            </div>
        `;


        // SUBJECT BUTTON

        results.innerHTML += `
            <button onclick="showSubject('${matchingSubject.id}')">
                ${matchingSubject.name}
            </button>
        `;


        // LESSON LABEL

        results.innerHTML += `
            <div class="search-title">
                LESSON
            </div>
        `;


        // GET LESSONS FOR THAT SUBJECT

        let subjectLessons = lessons.filter(function(lesson) {

            return lesson.subject === matchingSubject.name;

        });


        // SHOW LESSONS

        subjectLessons.forEach(function(lesson) {

            results.innerHTML += `
                <button onclick="showLesson('${lesson.id}')">
                    ${lesson.name}
                </button>
            `;

        });


        // STOP HERE
        // This prevents the lessons from appearing twice.

        return;
    }


    // IF NO SUBJECT MATCHES,
    // SEARCH LESSONS INSTEAD

    let matchingLessons = lessons.filter(function(lesson) {

        return lesson.name.toLowerCase().includes(search);

    });


    if (matchingLessons.length > 0) {

        results.innerHTML += `
            <div class="search-title">
                LESSON
            </div>
        `;


        matchingLessons.forEach(function(lesson) {

            results.innerHTML += `
                <button onclick="showLesson('${lesson.id}')">
                    ${lesson.subject} - ${lesson.name}
                </button>
            `;

        });

    }

}