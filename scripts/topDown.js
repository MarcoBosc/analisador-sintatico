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

    let stack = [];
    let entry = [];
    let lastAction = "";
    let finished = false;
    let index = 1;

    sentenceInput.addEventListener('change', () => {
        tbody.innerHTML = "";
        const input = sentenceInput.value.trim();
        if (!input) return;

        stack = ["$", "S"];
        entry = input.split("");
        entry.push("$");
        finished = false;

        const top = stack[stack.length - 1];
        const current = entry[0];
        lastAction = parsingTable[top]?.[current] || `Erro em ${index} iterações.`;
        renderRow(stack, entry, lastAction);
    });

    nextStep.addEventListener('click', () => {
        if (finished || !lastAction) return;
        index ++;
        // Aplica a última ação
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

        // Verifica se a sentença foi reconhecida
        if (stack.length === 1 && stack[0] === "$" && entry[0] === "$") {
            renderRow(["$"], ["$"], `Sentença reconhecida em ${index} itereções!`);
            finished = true;
            return;
        }

        // Define a próxima ação e mostra o novo estado
        const newTop = stack[stack.length - 1];
        const newCurrent = entry[0];

        if (newTop === newCurrent) {
            lastAction = `Lê '${newCurrent}'`;
        } else {
            lastAction = parsingTable[newTop]?.[newCurrent] || `Erro em ${index} iterações.`;
        }

        renderRow(stack, entry, lastAction);
    });

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

    // Inicializa com mensagem vazia
    renderRow(["$S"], ["-$"], "Nenhuma sentença definida.");
});
