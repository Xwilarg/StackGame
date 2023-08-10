const stacks = {
    "Computer": [
        "stackoverflow",
        "electronics.stackexchange",
        "tex.stackexchange",
        "mathoverflow",
        "codegolf.stackexchange",
        "crypto.stackexchange.com",
        "superuser",
        "langdev.stackexchange",
        "puzzling.stackexchange",
        "stats.stackexchange"
    ],
    "Culture": [
        "movies.stackexchange",
        "rpg.stackexchange",
        "writing.stackexchange",
        "skeptics.stackexchange",
        "travel.stackexchange",
        "worldbuilding.stackexchange"
    ],
    "Science": [
        "politics.stackexchange",
        "law.stackexchange",
        "academia.stackexchange",
        "astronomy.stackexchange"
    ]
    /*
    "retrocomputing.stackexchange"
    "latin.stackexchange"
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
    return Object.keys(stacks)[Math.floor(Math.random() * Object.keys(stacks).length)];
}

function randomChoice(stack) {
    if (stack === null) {
        stack = randomStack();
    }
    return stacks[stack][Math.floor(Math.random() * stacks[stack].length)];
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