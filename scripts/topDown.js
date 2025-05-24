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
        const row = document.createElement('tr');
      
        const stackCell = document.createElement('td');
        const entryCell = document.createElement('td');
        const actionCell = document.createElement('td');
      
        stackCell.textContent = stack.join("");
        entryCell.textContent = entry.join("");
        actionCell.textContent = action;
      
        row.appendChild(stackCell);
        row.appendChild(entryCell);
        row.appendChild(actionCell);
      
        // Lógica para cor de fundo
        const isErro = action.toLowerCase().includes("erro");
        const isSucesso = action.includes("reconhecida");
      
        if (isErro) {
          stackCell.style.backgroundColor = '#da0f0f';
          entryCell.style.backgroundColor = '#da0f0f';
          actionCell.style.backgroundColor = '#da0f0f';
          stackCell.style.color = "#fff";
          entryCell.style.color = "#fff";
          actionCell.style.color = "#fff";   
        } else if (isSucesso) {
          stackCell.style.backgroundColor = '#09ad2a';
          entryCell.style.backgroundColor = '#09ad2a';
          actionCell.style.backgroundColor = '#09ad2a';
          stackCell.style.color = "#fff";
          entryCell.style.color = "#fff";
          actionCell.style.color = "#fff";   
        }     

        tbody.appendChild(row);
      }
      
    
    generateAllBtn.addEventListener('click', () => {
        while (!finished){
            step();
        }
    });

    renderRow(["$S"], ["-$"], "Nenhuma sentença definida.");
});
