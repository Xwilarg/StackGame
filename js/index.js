const stacks = {
    "stackoverflow": "professional and enthusiast programmers",
    "electronics.stackexchange": "electronics and electrical engineering professionals, students, and enthusiasts",
    "tex.stackexchange": "users of TeX, LaTeX, ConTeXt, and related typesetting systems",
    "mathoverflow": "professional mathematicians",
    "codegolf.stackexchange": "programming puzzle enthusiasts and code golfers",
    "crypto.stackexchange" : "software developers, mathematicians and others interested in cryptography",
    "superuser": "computer enthusiasts and power users",
    "langdev.stackexchange": "designers and implementers of computer programming languages",
    "puzzling.stackexchange": "those who create, solve, and study puzzles",
    "stats.stackexchange": "people interested in statistics, machine learning, data analysis, data mining, and data visualization",
    "movies.stackexchange": "movie and TV enthusiasts",
    "rpg.stackexchange": "gamemasters and players of tabletop, paper-and-pencil role-playing games",
    "writing.stackexchange": "the craft of professional writing, including fiction, non-fiction, technical, scholarly, and commercial writing",
    "skeptics.stackexchange": "scientific skepticism",
    "travel.stackexchange": "road warriors and seasoned travelers",
    "worldbuilding.stackexchange": "writers/artists using science, geography and culture to construct imaginary worlds and settings",
    "politics.stackexchange": "people interested in governments, policies, and political processes",
    "law.stackexchange": "legal professionals, students, and others with experience or interest in law",
    "academia.stackexchange": "academics and those enrolled in higher education",
    "astronomy.stackexchange": "astronomers and astrophysicists"
}

const categories = {
    // Main Categories
    "Computer": [
        "stackoverflow",
        "codegolf.stackexchange",
        "superuser",
        "langdev.stackexchange",
    ],
    "Science": [
        "astronomy.stackexchange",
        "electronics.stackexchange",
        "stats.stackexchange",
        "tex.stackexchange",
        "mathoverflow",
        "crypto.stackexchange.com",
    ],
    "Letters": [
        "politics.stackexchange",
        "law.stackexchange",
        "academia.stackexchange",
        "skeptics.stackexchange",
    ],
    "Fiction": [
        "movies.stackexchange",
        "rpg.stackexchange",
        "writing.stackexchange",
        "worldbuilding.stackexchange"
    ],

    // Mix
    "Fiction vs Reality": [
        "worldbuilding.stackexchange",
        "rpg.stackexchange",
        "skeptics.stackexchange",
        "law.stackexchange"
    ]
    /*
    "retrocomputing.stackexchange"
    "latin.stackexchange"
    "puzzling.stackexchange"
        "travel.stackexchange",
    */
};

let answer = null;
let buttons = [];

async function getNextQuestionAsync(stack) {
    const content = await fetch(`https://api.stackexchange.com/2.3/questions?pagesize=100&site=${stack}`)
        .then(resp => resp.json());
    const json = content.items;
    return json[Math.floor(Math.random() * json.length)].title;
}

function randomStack() {
    return Object.keys(categories)[Math.floor(Math.random() * Object.keys(categories).length)];
}

function randomChoice(stack) {
    if (stack === null) {
        return Object.keys(stacks)[Math.floor(Math.random() * Object.keys(stacks).length)]
    }
    return categories[stack][Math.floor(Math.random() * categories[stack].length)];
}

function loadQuestion() {
    // Get right answer
    const category =
        Math.floor(Math.random() * 5) === 0
        ? null
        : randomStack();
    document.getElementById("theme").innerHTML = `Theme: ${category == null ? "None" : category}`;

    let possibilities = [];
    answer = randomChoice(category);
    possibilities.push(answer);

    // Fill others answers
    while (possibilities.length < 4) {
        const val = randomChoice(category);
        if (!possibilities.includes(val)) {
            possibilities.push(val);
        }
    }

    // Shuffle
    possibilities = possibilities
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
    
    for (let i = 0; i < 4; i++) {
        buttons[i].innerHTML = possibilities[i];
        buttons[i].value = possibilities[i];
    }

    // Get question
    getNextQuestionAsync(answer).then((title) => {
        document.getElementById("question").innerHTML = title;
    });
}

addEventListener("load", () => {
    const btnContainer = document.getElementById("choices");
    for (let i = 0; i < 4; i++) {
        const btn = document.createElement("button");
        btn.addEventListener("click", (e) => {
            if (answer === null) {
                return;
            }
            document.getElementById("result").innerHTML =
                answer === e.target.value
                ? `The answer was indeed ${answer}`
                : `Wrong, the answer was ${answer}`;
                document.getElementById("result-sub").innerHTML = `Origin question: ${document.getElementById("question").innerHTML}`;
            answer = null;
            loadQuestion();
        });
        buttons.push(btn);
        btnContainer.appendChild(btn);
    }

    loadQuestion();
})