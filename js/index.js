const stacks = {
    "it": [
        "stackoverflow",
        "electronics.stackexchange",
        "tex.stackexchange",
        "mathoverflow",
        "codegolf.stackexchange"
    ]
};

let answer = null;
let buttons = [];

async function getNextQuestionAsync(stack) {
    const content = await fetch(`https://api.stackexchange.com/2.3/questions?pagesize=100&site=${stack}`)
        .then(resp => resp.json());
    const json = content.items;
    return json[Math.floor(Math.random() * json.length)].title;
}

function loadQuestion() {
    // Get right answer
    const category = "it";
    let possibilities = [];
    answer = stacks[category][Math.floor(Math.random() * stacks[category].length)];
    possibilities.push(answer);

    // Fill others answers
    while (possibilities.length < 4) {
        const val = stacks[category][Math.floor(Math.random() * stacks[category].length)];
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
            answer = null;
            loadQuestion();
        });
        buttons.push(btn);
        btnContainer.appendChild(btn);
    }

    loadQuestion();
})