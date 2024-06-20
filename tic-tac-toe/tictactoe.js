/**
 * File:    tictactoe.js
 *
 * Author:  Christian Medina
 * Date:    June 17, 2024
 *
 * Summary:
 *
 *  The tictactoe.js program demonstrates usage of both factory and IIFE patterns in JavaScript.
 *  A game instance is created when the page loads, allowing players to start a game of tic-tac-toe.
 *  Upon either a win or tie, the game instance will stop and display the outcome.
 *  Players may also choose to reset the board and continue playing.
 */

/**
 * viewController handles all DOM manipulation for the view.
 */
const viewController = (function () {
    const boardElement = document.getElementById("board")
    const resetButton = document.getElementById("reset")
    const outcomeText = document.getElementById("outcome");
    const playerNamesSection = document.getElementById("player-names")

    resetButton.addEventListener("click", function () {
        game.reset()
    })
    const drawAddPlayer = (player) => {
        const symbol = player.getSymbol()
        const label = document.createElement('label')
        label.setAttribute('for', 'player-name')
        label.innerText = `Player ${symbol}'s Name:`
        const input = document.createElement('input')
        input.setAttribute('name', 'player-name')
        input.setAttribute('type', 'text')
        const confirm = document.createElement('button')
        confirm.setAttribute('name', 'set-player-name')
        confirm.innerText = `Confirm`
        confirm.addEventListener('click', () => {player.setName(input.value)})
        const playerName = document.createElement('div')
        playerName.append(label)
        playerName.append(input)
        playerName.append(confirm)
        playerNamesSection.append(playerName)
    }
    const drawWinner = (winner) => {
        outcomeText.innerText = `The winner is ${winner.getName()}!`
    }
    const drawTie = () => {
        outcomeText.innerText = `It's a tied game!`
    }
    const clearOutcome = () => {
        outcomeText.innerText = ""
    }
    const drawBoard = (board) => {
        boardElement.innerText = ""
        for (const row of board) {
            const boardRow = document.createElement("div")
            boardRow.classList.add("row")
            for (const cell of row) {
                boardRow.append(cell.element)
            }
            boardElement.append(boardRow)
        }
    }
    const updateBoard = (row, col, symbol) => {
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        cell.innerText = symbol
    }

    return {drawAddPlayer, clearOutcome, drawBoard, drawTie, drawWinner, updateBoard}
})()

/**
 * gameBoard manages the board's state.
 */
const gameBoard = (function () {
    const board = (function (){
        const boardCells = [[], [], []]
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                boardCells[row][col] = createCell(row, col)
            }
        }
        return boardCells
    })()
    const get = () => {
        return board
    }
    const update = (row, col, symbol) => {
        board[row][col].setCellSymbol(symbol)
        viewController.updateBoard(row, col, symbol)
    }
    const clear = () => {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                board[row][col].setCellSymbol(undefined)
            }
        }
        viewController.drawBoard(board)
    }
    const isFilled = () => {
        for (const row of board) {
            for (const cell of row) {
                if (!cell.getCellSymbol()) {
                    return false
                }
            }
        }
        return true
    }
    const isWinningLine = (row, symbol) => {
        return row.every((cell) => cell.getCellSymbol() === symbol)
    }

    return {get, update, clear, isFilled, isWinningLine}
})()

/**
 * game controls the flow of the match between players.
 */
const game = (function () {
    const players = []
    const board = gameBoard.get()
    const playerOne = createPlayer("X")
    const playerTwo = createPlayer("O")
    players.push(playerOne)
    players.push(playerTwo)
    for (const player of players) {viewController.drawAddPlayer(player)}

    const isValidCell = (row, col) => {
        return !(getWinner() || gameBoard.isFilled() || board[row][col].getCellSymbol())
    }
    const start = () => {
        viewController.drawBoard(board)
    }
    const update = (row, col) => {
        if (!isValidCell(row, col)) {
            return
        }

        playRound(row, col)

        const winner = getWinner()
        if (winner) {
            viewController.drawWinner(winner)
        } else if (gameBoard.isFilled()) {
            viewController.drawTie()
        }
    }
    const reset = () => {
        gameBoard.clear()
        viewController.clearOutcome()
        playerOne.setTurn(true)
        playerTwo.setTurn(false)
    }
    const playRound = (row, col) => {
        if (playerOne.isTurn()) {
            gameBoard.update(row, col, playerOne.getSymbol())
            playerOne.setTurn(false)
            playerTwo.setTurn(true)
        } else if (playerTwo.isTurn()) {
            gameBoard.update(row, col, playerTwo.getSymbol())
            playerTwo.setTurn(false)
            playerOne.setTurn(true)
        }
    }
    const getWinner = () => {
        const playerOneSymbol = playerOne.getSymbol()
        const playerTwoSymbol = playerTwo.getSymbol()
        const board = gameBoard.get()

        for (const row of board) {
            if (gameBoard.isWinningLine(row, playerOneSymbol)) return playerOne
            if (gameBoard.isWinningLine(row, playerTwoSymbol)) return playerTwo
        }

        for (let col = 0; col < 3; col++) {
            const line = [
                board[0][col],
                board[1][col],
                board[2][col]
            ]
            if (gameBoard.isWinningLine(line, playerOneSymbol)) return playerOne
            if (gameBoard.isWinningLine(line, playerTwoSymbol)) return playerTwo
        }

        const leftToRightDiagonal = [board[0][0], board[1][1], board[2][2]]
        const rightToLeftDiagonal = [board[0][2], board[1][1], board[2][0]]

        if (gameBoard.isWinningLine(leftToRightDiagonal, playerOneSymbol)) return playerOne
        if (gameBoard.isWinningLine(rightToLeftDiagonal, playerOneSymbol)) return playerOne
        if (gameBoard.isWinningLine(leftToRightDiagonal, playerTwoSymbol)) return playerTwo
        if (gameBoard.isWinningLine(rightToLeftDiagonal, playerTwoSymbol)) return playerTwo

        return undefined
    }

    return {start, update, reset}
})()

/**
 * createCell generates a new instance of a cell for each board entry
 */
function createCell(row, col) {
    let cellSymbol = undefined
    const element = document.createElement("span")
    const setCellSymbol = (symbol) => {
        cellSymbol = symbol
        element.innerText = cellSymbol ?? ""
    }
    const getCellSymbol = () => {
        return cellSymbol
    }
    element.addEventListener("click", () => {game.update(row, col)})
    element.classList.add("cell")
    element.dataset.row = `${row}`
    element.dataset.col = `${col}`

    return {element, getCellSymbol, setCellSymbol}
}

/**
 * createPlayer generates the necessary players and their symbols for a game
 */
function createPlayer(symbol) {
    let canMove = true
    let name = ""
    const getSymbol = () => {
        return symbol
    }
    const isTurn = () => {
        return canMove
    }
    const setName = (selectedName) => {
        if (selectedName) name = selectedName
        else name = getSymbol()
    }
    const getName = () => {
        return name
    }
    const setTurn = (move) => {
        canMove = move
    }
    return {getName, getSymbol, isTurn, setName, setTurn}
}

game.start()
