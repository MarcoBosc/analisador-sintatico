let sentence = "";
// Regras de produção da gramática
const grammarRules = {
    S: ['aA'],
    A: ['bBc', 'aCb', 'dDc'],
    B: ['aDb', 'Cd'],
    C: ['bSB', 'cAd'],
    D: ['dBa', 'ε']
};

// Conjuntos FIRST
const first = {
    S: ['a'],
    A: ['b', 'a', 'd'],
    B: ['a', 'b', 'c'],
    C: ['b', 'c'],
    D: ['d', 'ε']
};

// Conjuntos FOLLOW
const follow = {
    S: ['$'],
    A: ['$', 'd'],
    B: ['c', 'a', 'b', 'd'],
    C: ['b', 'd'],
    D: ['c', 'b']
};


document.addEventListener("DOMContentLoaded", function () {
    const tbody = document.querySelector('#topDownTable tbody');
    const sentenceInput = document.getElementById('sentencaInput');
  
    let resetTable = (value) => {
      tbody.innerHTML = `
        <tr>
          <td>$S</td>
          <td>${value}</td>
          <td>-</td>
        </tr>
      `;
    };
  
    sentenceInput.addEventListener('change', (event) => {
      resetTable(sentenceInput.value + "$");
    });
  
    resetTable("-");
  });