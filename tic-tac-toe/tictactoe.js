/**
 * File:    tictactoe.js
 *
 * Author:  Christian Medina
 * Date:    June 17, 2024
 *
 * Summary:
 *
 */


const gameBoard = (function() {
    const board = [["","",""], ["","",""], ["","",""]]
    const get = () => { return board }
    const update = (row, col, move) => { board[row][col] = move }
    const isFilled = () => {
        for (const row of board) {
            if (row.includes("")) {
                return false
            }
        }
        return true
    }

    return { get, update, isFilled }
})()

function createGame(playerOne, playerTwo) {
    return {}
}

function createPlayer(symbol) {
    let score = 0
    const makeMove = (row, col) => { gameBoard.update(row, col, symbol) }
    const increaseScore = () => { score++ }
    const getScore = () => { return score }
    return { makeMove, increaseScore, getScore }
}

const playerOne = createPlayer("X")
const playerTwo = createPlayer("O")
const game = createGame(playerOne, playerTwo)
console.log(gameBoard.get())
