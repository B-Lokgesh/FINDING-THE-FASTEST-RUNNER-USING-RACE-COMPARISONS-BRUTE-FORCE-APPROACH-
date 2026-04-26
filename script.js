let runners = [];
let comparisons = 0;
let isPaused = false;

function generateRunners() {
    runners = [];
    comparisons = 0;
    document.getElementById("comparisons").innerText = "Comparisons: 0";
    document.getElementById("result").innerText = "";
    document.getElementById("container").innerHTML = "";
    document.getElementById("sortBtn").style.display = "none";

    for (let i = 0; i < 100; i++) {
        let speed = Math.floor(Math.random() * 100) + 1;
        runners.push({ id: i, speed: speed });

        let card = document.createElement("div");
        card.className = "card";
        card.id = "card-" + i;

        card.innerHTML = `
            <span>Runner ${i}</span>
            <div class="speed">${speed}</div>
        `;

        document.getElementById("container").appendChild(card);
    }

    document.getElementById("status").innerText = "Runners generated!";
}

async function startRace() {
    let fastest = runners[0];

    for (let i = 1; i < runners.length; i++) {

        await checkPause();

        highlight(fastest.id, runners[i].id);

        await sleep(getSpeed());

        comparisons++;
        updateUI(fastest.id, runners[i].id);

        if (runners[i].speed > fastest.speed) {
            fastest = runners[i];
        }

        reset();
    }

    document.getElementById("status").innerText = "Race Completed!";
    document.getElementById("result").innerText =
        `🏆 Fastest Runner: #${fastest.id} (Speed ${fastest.speed})`;

    document.getElementById("card-" + fastest.id).classList.add("winner");

    document.getElementById("sortBtn").style.display = "inline-block";
}

function pauseResume() {
    isPaused = !isPaused;
    document.querySelector(".controls button:nth-child(3)").innerText =
        isPaused ? "Resume" : "Pause";
}

async function checkPause() {
    while (isPaused) {
        await sleep(100);
    }
}

function highlight(id1, id2) {
    document.getElementById("card-" + id1).classList.add("active");
    document.getElementById("card-" + id2).classList.add("active");
}

function reset() {
    let cards = document.getElementsByClassName("card");
    for (let c of cards) {
        c.classList.remove("active");
    }
}

function updateUI(id1, id2) {
    document.getElementById("comparisons").innerText =
        "Comparisons: " + comparisons;

    document.getElementById("status").innerText =
        `Comparing Runner ${id1} vs Runner ${id2}`;
}

function sleep(ms) {
    return new Promise(res => setTimeout(res, ms));
}

function getSpeed() {
    return document.getElementById("speedSlider").value;
}

function sortRunners() {
    runners.sort((a, b) => b.speed - a.speed);

    let container = document.getElementById("container");
    container.innerHTML = "";

    runners.forEach(r => {
        let card = document.createElement("div");
        card.className = "card sorted";

        card.innerHTML = `
            <span>Runner ${r.id}</span>
            <div class="speed">${r.speed}</div>
        `;

        container.appendChild(card);
    });

    document.getElementById("status").innerText = "Sorted by speed (descending)";
}