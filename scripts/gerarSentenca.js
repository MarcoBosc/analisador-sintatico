import { derive } from './gerarSentencaValida.js';

document.addEventListener("DOMContentLoaded", function () {
    // Seleciona todas as células da tabela dentro do modal
    const tabelaGramatica = document.querySelectorAll('#sentencaModal table tbody td');
    let currentProductionRole = "S";
    let sentence = "";
    const useSentence = document.querySelector('.useSentence');
    const sentenceInputModal = document.getElementById('sentencaInputModal');
    const sentenceInput = document.getElementById('sentencaInput');
    const alertModal = document.getElementById('alertModal');
    const randomSentenceBtn = document.getElementById('randomSentenceBtn');
    const validSentenceBtn = document.getElementById('validSentenceBtn');

    tabelaGramatica.forEach(cell => {
        cell.addEventListener('click', function () {
            const row = this.parentElement;
            const rowId = row.id;
            const cellText = this.textContent.trim();

            if (["S::=", "A::=", "B::=", "C::=", "D::="].includes(cellText)) {
                return
            }
            if (currentProductionRole === null) {
                alert(`Não existem mais não terminais a serem derivados.`);

                useSentence.classList.add('btn-info', 'shadow-lg');
                setTimeout(() => {
                    useSentence.classList.remove('btn-info', 'shadow-lg');
                }, 500);
                return
            }
            if (rowId != currentProductionRole) {
                alert(`${rowId}::= não é a regra atual, escolha uma produção de ${currentProductionRole}::=.`);
                return
            }
            if (cellText === "-") {
                alert(`Produção inválida para a regra ${rowId}::=, tente novamente.`);
                return
            }

            derivate(cellText);
            changeCurrentProduction(getNextProduction(sentence));
            if (currentProductionRole === null) {
                useSentence.removeAttribute('disabled');
                handleAlert();
            }
        });
    });

    let derivate = (text) => {
        if (sentence === "") {
            sentence = text;
        } else {
            sentence = sentence.replace(/[A-Z]/, () => text);
        }
        sentence = sentence.replace(/ε/g, "");

        sentenceInputModal.value = sentence;
    };

    let getNextProduction = (production) => {
        const match = production.match(/[A-Z]/);
        return match ? match[0] : null;
    };

    let changeCurrentProduction = (newProduction) => {
        if (newProduction !== null) {
            document.querySelectorAll('#sentencaModal .table-primary').forEach(el => {
                el.classList.remove('table-primary');
            });
            document.getElementById(newProduction).classList.add('table-primary');
        }
        currentProductionRole = newProduction;
    }

    let handleClick = () => {
        sentenceInput.value = sentenceInputModal.value;
        sentenceInputModal.value = "";
        sentence = "";
        changeCurrentProduction("S");
        resetAlert();
        sentenceInput.dispatchEvent(new Event('change'));
    };
    document.querySelector('.useSentence').addEventListener('click', handleClick);

    let handleCancel = () => {
        sentenceInput.value = sentenceInputModal.value;
        sentenceInputModal.value = "";
        sentence = "";
        changeCurrentProduction("S");
        resetAlert();
    }

    let handleAlert = () => {
        alertModal.classList.remove('alert-info');
        alertModal.classList.add('alert-success');
        alertModal.innerHTML = 'Derivação realizada com sucesso! Clique em <strong>Usar sentença</strong> para continuar.';
    }

    let resetAlert = () => {
        alertModal.classList.remove('alert-success');
        alertModal.classList.add('alert-info');
        alertModal.textContent = 'Clique na tabela para realizar as derivações.';
    };

    let generateRandomSentence = () => {
        const chars = ['a', 'b', 'c', 'd'];
        const length = Math.floor(Math.random() * (12 - 5 + 1)) + 5; // entre 5 e 12
        let sentence = 'a'; // sempre começa com 'a'
      
        for (let i = 1; i < length; i++) {
          sentence += chars[Math.floor(Math.random() * chars.length)];
        }
      
        sentenceInput.value = sentence;
        sentenceInput.dispatchEvent(new Event('change'));
      };
      randomSentenceBtn.addEventListener('click', generateRandomSentence);

      let generateValidSentence = () => {
        const sentence = derive();
        sentenceInput.value = sentence;
        sentenceInput.dispatchEvent(new Event('change'));
      };
      validSentenceBtn.addEventListener('click', generateValidSentence);
});

