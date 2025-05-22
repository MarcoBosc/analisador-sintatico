document.addEventListener("DOMContentLoaded", function () {
    const parsingTable = {
        S: { a: "S → aA", b: "-", c: "-", d: "-", "$": "-" },
        A: { a: "A → aCb", b: "A → bBc", c: "-", d: "A → dDc", "$": "-" },
        B: { a: "B → aDb", b: "B → Cd", c: "B → Cd", d: "-", "$": "-" },
        C: { a: "-", b: "C → bSB", c: "C → cAd", d: "-", "$": "-" },
        D: { a: "-", b: "D → ε", c: "D → ε", d: "D → dBa", "$": "-" }
    };

    const tbody = document.querySelector('#topDownTable tbody');
    const sentenceInput = document.getElementById('sentencaInput');
    const nextStep = document.getElementById('nextStep');
    const generateAllBtn = document.getElementById('generateAllBtn')

    let stack = [];
    let entry = [];
    let lastAction = "";
    let finished = false;
    let index = 1;

    sentenceInput.addEventListener('change', () => {
        clearStuff();
    });

    sentenceInput.addEventListener('input', () => {
       clearStuff();
    });

    let clearStuff = () => {
        tbody.innerHTML = "";
        const input = sentenceInput.value.trim();
        index = 1;
    
        if (!input) {
            renderRow(["$S"], ["-$"], "Nenhuma sentença definida.");
            nextStep.disabled = true;
            generateAllBtn.disabled = true;
            return;
        }
    
        stack = ["$", "S"];
        entry = input.split("");
        entry.push("$");
        finished = false;
    
        const top = stack[stack.length - 1];
        const current = entry[0];
        lastAction = parsingTable[top]?.[current] || `Erro em ${index} iterações.`;
        renderRow(stack, entry, lastAction);
    
        nextStep.disabled = false;
        generateAllBtn.disabled = false;
    }

    nextStep.addEventListener('click', () => {
       step();
    });

    let step =() => {
        if (finished || !lastAction) return;
        index ++;
        const top = stack[stack.length - 1];
        const current = entry[0];

        if (lastAction.startsWith("Lê")) {
            stack.pop();
            entry.shift();
        } else if (lastAction.includes("→")) {
            const rhs = lastAction.split("→")[1].trim();
            stack.pop();
            if (rhs !== "ε") {
                const symbols = rhs.split("").reverse();
                stack.push(...symbols);
            }
        } else {
            finished = true;
            renderRow(stack, entry, lastAction);
            return;
        }

        if (stack.length === 1 && stack[0] === "$" && entry[0] === "$") {
            renderRow(["$"], ["$"], `Sentença reconhecida em ${index} itereções!`);
            finished = true;
            return;
        }

        const newTop = stack[stack.length - 1];
        const newCurrent = entry[0];

        if (newTop === newCurrent && !/^[A-Z]$/.test(newTop)) {
            lastAction = `Lê '${newCurrent}'`;
        } else {
            lastAction = parsingTable[newTop]?.[newCurrent] || `Erro em ${index} iterações.`;
        }
        if (lastAction == `Erro em ${index} iterações.`) {
            return
        }
        if (lastAction === "-") {
            lastAction = `Erro em ${index} iterações.`;
            finished = true
        }
        
        renderRow(stack, entry, lastAction);
    }

    function renderRow(stack, entry, action) {
        const tr = document.createElement('tr');

        const tdPilha = document.createElement('td');
        tdPilha.textContent = stack.join("");
        tr.appendChild(tdPilha);

        const tdEntrada = document.createElement('td');
        tdEntrada.textContent = entry.join("");
        tr.appendChild(tdEntrada);

        const tdAcao = document.createElement('td');
        tdAcao.textContent = action;
        tr.appendChild(tdAcao);

        tbody.appendChild(tr);
    }

    generateAllBtn.addEventListener('click', () => {
        while (!finished){
            step();
        }
    });

    renderRow(["$S"], ["-$"], "Nenhuma sentença definida.");
});
