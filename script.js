const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset-button');
const gameStatus = document.getElementById('game-status');
const winningLine = document.getElementById('winning-line');
let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let isGameActive = true;

const winningConditions = [
    [0, 1, 2], // Linha superior
    [3, 4, 5], // Linha do meio
    [6, 7, 8], // Linha inferior
    [0, 3, 6], // Coluna esquerda
    [1, 4, 7], // Coluna central
    [2, 5, 8], // Coluna direita
    [0, 4, 8], // Diagonal principal
    [2, 4, 6]  // Diagonal secundária
];

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedIndex = clickedCell.getAttribute('data-index');

    if (board[clickedIndex] !== '' || !isGameActive) {
        return;
    }

    board[clickedIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    checkResult();
}

function checkResult() {
    let roundWon = false;
    let winningCombination = [];

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            winningCombination = [a, b, c];
            break;
        }
    }

    if (roundWon) {
        gameStatus.textContent = `Jogador ${currentPlayer} venceu!`;
        gameStatus.classList.add('win');
        isGameActive = false;

        // Marcar células vencedoras e desenhar a linha
        winningCombination.forEach(index => {
            cells[index].classList.add('win');
        });
        drawWinningLine(winningCombination);
        return;
    }

    if (!board.includes('')) {
        gameStatus.textContent = 'Empate!';
        gameStatus.classList.add('draw');
        isGameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    gameStatus.textContent = `Vez do jogador ${currentPlayer}`;
}

function drawWinningLine(combination) {
    const [a, b, c] = combination;
    const cellA = cells[a].getBoundingClientRect();
    const cellC = cells[c].getBoundingClientRect();
    const boardRect = document.getElementById('game-board').getBoundingClientRect();
    
    const offsetX = cellC.left - cellA.left;
    const offsetY = cellC.top - cellA.top;

    // Calcular posição e rotação da linha
    winningLine.style.width = Math.sqrt(offsetX ** 2 + offsetY ** 2) + 'px';
    winningLine.style.transform = `translate(${cellA.left - boardRect.left + 60}px, ${cellA.top - boardRect.top + 60}px) rotate(${Math.atan2(offsetY, offsetX)}rad)`;
}


function resetBoard() {
    board = ['', '', '', '', '', '', '', '', ''];
    isGameActive = true;
    currentPlayer = 'X';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('win');
    });
    gameStatus.textContent = `Vez do jogador ${currentPlayer}`;
    gameStatus.classList.remove('win', 'draw');
    winningLine.style.width = '0';
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetBoard);
