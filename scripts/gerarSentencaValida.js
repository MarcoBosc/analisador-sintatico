const MAX_LENGTH = 20;
let CURRENT_LENGTH = 0;
let sentence = '';

const grammar = {
    S: [["a", "A"]],
    A: [["b", "B", "c"], ["a", "C", "b"], ["d", "D", "c"]],
    B: [["a", "D", "b"], ["C", "d"]],
    C: [["b", "S", "B"], ["c", "A", "d"]],
    D: [["d", "B", "a"], []]  // produção vazia (ε)
};

let randomNumber = (max) => Math.floor(Math.random() * max);

// Encontra o primeiro não terminal na sentença
let findNextNonTerminal = (str) => {
    const targets = new Set(['S', 'A', 'B', 'C', 'D']);
    for (let char of str) {
        if (targets.has(char)) {
            return char;
        }
    }
    return null;
}

// Verifica se a derivação terminou (não há mais não terminais)
let checkIfDerivationEnds = (sent) => {
    return findNextNonTerminal(sent) === null;
}

// Substitui o primeiro não terminal encontrado na sentença pela sequência
function substituteNonTerminal(sentence, nonTerminal, sequence) {
    const index = sentence.indexOf(nonTerminal);
    if (index === -1) return sentence;

    const left = sentence.slice(0, index);
    const right = sentence.slice(index + 1);
    return left + sequence.join('') + right;
}

// Chama a regra de derivação específica para cada não terminal
function nextProductionController(nonTerminal, sentence) {
    switch (nonTerminal) {
        case 'S': return deriveS(sentence);
        case 'A': return deriveA(sentence);
        case 'B': return deriveB(sentence);
        case 'C': return deriveC(sentence);
        case 'D': return deriveD(sentence);
        default:
            throw new Error(`Não terminal desconhecido: ${nonTerminal}`);
    }
}

// Deriva a sentença a partir do símbolo inicial S
export function derive() {
    CURRENT_LENGTH = 0;
    sentence = 'S';
    return deriveS(sentence);
}

function deriveS(sentence) {
    if (checkIfDerivationEnds(sentence)) return sentence;

    CURRENT_LENGTH++;
    let production = grammar.S[0];
    sentence = substituteNonTerminal(sentence, 'S', production);

    let next = findNextNonTerminal(sentence);
    if (next) return nextProductionController(next, sentence);
    return sentence;
}

function deriveA(sentence) {
    if (checkIfDerivationEnds(sentence)) return sentence;

    CURRENT_LENGTH++;
    let ruleIndex = randomNumber(grammar.A.length);
    let production = grammar.A[ruleIndex];
    sentence = substituteNonTerminal(sentence, 'A', production);

    let next = findNextNonTerminal(sentence);
    if (next) return nextProductionController(next, sentence);
    return sentence;
}

function deriveB(sentence) {
    if (checkIfDerivationEnds(sentence)) return sentence;

    CURRENT_LENGTH++;
    let ruleIndex = randomNumber(grammar.B.length);
    let production = grammar.B[ruleIndex];
    sentence = substituteNonTerminal(sentence, 'B', production);

    let next = findNextNonTerminal(sentence);
    if (next) return nextProductionController(next, sentence);
    return sentence;
}

function deriveC(sentence) {
    if (checkIfDerivationEnds(sentence)) return sentence;

    CURRENT_LENGTH++;
    let ruleIndex = randomNumber(grammar.C.length);
    let production = grammar.C[ruleIndex];
    sentence = substituteNonTerminal(sentence, 'C', production);

    let next = findNextNonTerminal(sentence);
    if (next) return nextProductionController(next, sentence);
    return sentence;
}

function deriveD(sentence) {
    if (checkIfDerivationEnds(sentence)) return sentence;

    CURRENT_LENGTH++;

    let production;
    if (CURRENT_LENGTH >= MAX_LENGTH) {
        // força escolher produção vazia para finalizar
        production = grammar.D[1]; // produção vazia (array vazio)
    } else {
        production = grammar.D[0];
    }

    sentence = substituteNonTerminal(sentence, 'D', production);

    let next = findNextNonTerminal(sentence);
    if (next) return nextProductionController(next, sentence);
    return sentence;
}
