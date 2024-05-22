'use strict'

//CONSTANTS:
const gLevel = [{ size: 4, mines: 2 }, { size: 8, mines: 14 }, { size: 12, mines: 32 }]
const MINE = '💣'
const FLAG = '🚩'


//GLOBAL VERIABLES:
var gBoard
var gGame

//disable right mouse click default modal
document.addEventListener('contextmenu', event => { event.preventDefault(); });

//GAME FUNCTIONS
function onInit() {
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0, // with flag
        secsPassed: 0
    }

    gBoard = buildBoard() // build the dataModel
    setMinesNegsCount()
    renderBoard(gBoard)

    console.log('gBoard:', gBoard)

}


function buildBoard() { // create size x size matrix with empty cells
    var size = gLevel[0].size // TODO: get the current level marked
    var board = []

    for (var i = 0; i < size; i++) { // create rows
        board.push([])

        for (var j = 0; j < size; j++) { //create cells
            var cellData = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = cellData
        }
    }

    board[0][0].isMine = true
    board[2][2].isMine = true
    return board
}

function renderBoard(board) {//Render the board as a <table> to the page
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'

        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]

            // var className = cell.isShown ? `cell cell-${i}-${j}` : `cell cell-${i}-${j} hide-cell`
            var className = getCellClass(cell, i, j)
            var txt = getCellTxtValue(cell)

            strHTML += `<td class="${className} " onclick="onCellClicked(this,${i},${j})" oncontextmenu="onCellMarked(this,${i},${j})">
            ${txt}
            </td>`
        }
        strHTML += '</tr>'
    }

    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
}

function setMinesNegsCount() {//Count mines around each cell and set the cell's minesAroundCount.
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            // console.log (`cell i:${i} j:${j} nieghbors:`,countNeighbors(i,j,gBoard) )
            gBoard[i][j].minesAroundCount = countNeighbors(i, j, gBoard)
        }
    }
}

function onCellClicked(elCell, i, j) {//Called when a cell is clicked (left click)
    if (!gGame.isOn) return
    var currCell = gBoard[i][j] // model
    if (currCell.isMarked || currCell.isShown) return // user cant clicked on a flaged cell

    console.log('currCell:', currCell)


    currCell.isShown = true // change show status for later rendering of the board

    if (currCell.isMine) gameOver()

    renderBoard(gBoard)

}

function onCellMarked(elCell, i, j) {//Called when a cell is right- clicked See how you can hide the context menu on right click
    if(!gGame.isOn) return

    var currCell = gBoard[i][j]
    if (currCell.isShown) return
    currCell.isMarked = !currCell.isMarked //toggle flag
    console.log('currCell:', currCell)
    renderBoard(gBoard)

}

function gameOver() {// stop player activities and show all mines on the board
    gGame.isOn = false
    console.log('game is over')
    showMines()
    renderBoard(gBoard)
}

function getCellTxtValue(cell) {//element txt value

    if (!cell.isShown && cell.isMarked) return FLAG // cell is flaged but not clicked (left click)

    if (cell.isShown && cell.isMine) return MINE // cell is clicked and is a mine

    if (cell.isShown && !cell.isMine) return cell.minesAroundCount // cell clicked and is not a mine

}

function getCellClass(cell, i, j) { //element classes
    var className = `cell cell-${i}-${j} hide-cell`


    if (!cell.isShown && cell.isMarked || cell.isShown) { // show flag or open cell
        className = `cell cell-${i}-${j}`
    }

    return className
}

function showMines() { // change all the mines to status shown
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j]
            if (currCell.isMine) currCell.isShown = true
        }
    }
}



// function expandShown(board, elCell, i, j) {//When user clicks a cell with no mines around, we need to open not only that cell, but also its neighbors.

// }


// function checkGameOver() {//Game ends when all mines are marked, and all the other cells are shown

// }
