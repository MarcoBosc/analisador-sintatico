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

const randomNumber = (max) => Math.floor(Math.random() * max);

const findNextNonTerminal = (str) => {
    const targets = new Set(['S', 'A', 'B', 'C', 'D']);
    for (let char of str) {
        if (targets.has(char)) {
            return char;
        }
    }
    return null;
};

const checkIfDerivationEnds = (sent) => findNextNonTerminal(sent) === null;

function substituteNonTerminal(sentence, nonTerminal, sequence) {
    const index = sentence.indexOf(nonTerminal);
    if (index === -1) return sentence;

    const left = sentence.slice(0, index);
    const right = sentence.slice(index + 1);
    return left + sequence.join('') + right;
}

function deriveNonTerminal(nonTerminal, sentence) {
    if (checkIfDerivationEnds(sentence)) return sentence;

    CURRENT_LENGTH++;

    let production;

    if (nonTerminal === 'D') {
        if (CURRENT_LENGTH >= MAX_LENGTH) {
            production = grammar.D[1]; // produção vazia
        } else {
            production = grammar.D[0];
        }
    } else {
        const rules = grammar[nonTerminal];
        const ruleIndex = randomNumber(rules.length);
        production = rules[ruleIndex];
    }

    sentence = substituteNonTerminal(sentence, nonTerminal, production);

    const next = findNextNonTerminal(sentence);
    if (next) return deriveNonTerminal(next, sentence);
    return sentence;
}

export function derive() {
    CURRENT_LENGTH = 0;
    sentence = 'S';
    return deriveNonTerminal('S', sentence);
}