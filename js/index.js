const stacks = [
    "stackoverflow",
    "electronics.stackexchange",
    "tex.stackexchange",
    "mathoverflow"
];

let answer = null;

async function getNextQuestionAsync(stack) {
    const content = await fetch(`https://api.stackexchange.com/2.3/questions?pagesize=100&site=${stack}`)
        .then(resp => resp.json());
    const json = content.items;
    return json[Math.floor(Math.random() * json.length)].title;
}

function loadQuestion() {
    answer = stacks[Math.floor(Math.random() * stacks.length)];
    getNextQuestionAsync(answer).then((title) => {
        document.getElementById("question").innerHTML = title;
    });
}

addEventListener("load", () => {
    const btnContainer = document.getElementById("choices");
    for (const link of stacks) {
        const val = link;

        const btn = document.createElement("button");
        btn.innerHTML = val;
        btn.addEventListener("click", () => {
            if (answer === null) {
                return;
            }
            document.getElementById("result").innerHTML =
                answer === val
                ? `The answer was indeed ${answer}`
                : `Wrong, the answer was ${answer}`;
            answer = null;
            loadQuestion();
        });
        btnContainer.appendChild(btn);
    }

    loadQuestion();
})