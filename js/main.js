'use strict'

//CONSTANTS:
const gLevels = [{ size: 4, mines: 2 }, { size: 8, mines: 14 }, { size: 12, mines: 32 }]
const MINE = '💣'
const FLAG = '🚩'


//GLOBAL VERIABLES:
var gBoard
var gGame
var gLevel
var gtimerintervalId

//disable right mouse click default modal
document.addEventListener('contextmenu', event => { event.preventDefault(); })

//Init and rendering functions
function onInit(diff = 1) {
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0, // with flag
        secsPassed: 0
    }
    gLevel = gLevels[diff]

    gBoard = buildBoard() // build the dataModel
    //placeMines()
    setMinesNegsCount()
    renderBoard(gBoard)
    console.log('gBoard:', gBoard)

    clearInterval(gtimerintervalId)
    gtimerintervalId = setInterval(updateTimeCounter, 1000)

}

function buildBoard() { // create size x size matrix with empty cells
    var boardSize = gLevel.size // TODO: get the current level marked
    var board = []

    for (var i = 0; i < boardSize; i++) { //build the game board with no mines
        board.push([])

        for (var j = 0; j < boardSize; j++) { //create cells
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

    //update flag counter
    var elflagCounter = document.getElementById('flag-counter')
    var flagStrHTML = padNumber(gLevel.mines - gGame.markedCount)
    elflagCounter.innerText = flagStrHTML

    //render board
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML

    // console.log('gGame.shownCount:',gGame.shownCount)
}

function placeMines() {//place mines in random locations in gBoard
    //create shuffled array in the board size with mines in random locations
    var arr = []
    for (var i = 0; i < gLevel.mines; i++) {
        arr.push(MINE)
    }
    for (var i = gLevel.mines; i < gLevel.size ** 2; i++) {
        arr.push("")
    }
    // console.log('arr:',arr)
    shuffle(arr)
    console.log('arr:', arr)

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (arr.shift() === MINE) gBoard[i][j].isMine = true
        }
    }
}

function setMinesNegsCount() {//Count mines around each cell and set the cell's minesAroundCount.
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            // console.log (`cell i:${i} j:${j} nieghbors:`,countNeighbors(i,j,gBoard) )
            gBoard[i][j].minesAroundCount = countNeighbors(i, j, gBoard)
        }
    }
}

//InGame functions
function onCellClicked(elCell, i, j) {//Called when a cell is clicked (left click)
    if (!gGame.isOn) return

    var currCell = gBoard[i][j] // model
    if (currCell.isMarked || currCell.isShown) return // user cant clicked on a flaged cell

    //for debugging
    // console.log('currCell:', currCell)
    // console.log('i:', i)
    // console.log('j:', j)

    currCell.isShown = true // change show status for later rendering of the board
    gGame.shownCount++
    if (currCell.isMine) gameOver()
    if (currCell.minesAroundCount === 0 && !currCell.isMine) revealAround(i, j)

    renderBoard(gBoard)
    checkGameOver()

}

function onCellMarked(elCell, i, j) {//Called when a cell is right- clicked See how you can hide the context menu on right click
    if (!gGame.isOn) return

    var currCell = gBoard[i][j]
    if (currCell.isShown) return
    currCell.isMarked = !currCell.isMarked //toggle flag

    currCell.isMarked ? gGame.markedCount++ : gGame.markedCount--
    console.log('gGame.markedCount:', gGame.markedCount)
    console.log('currCell:', currCell)
    renderBoard(gBoard)
    checkGameOver()

}

function revealAround(i, j) {// if cells has no mines around, reveal the mines around it
    for (var dx = -1; dx <= 1; dx++) {
        for (var dy = -1; dy <= 1; dy++) {
            if (dx === 0 && dy === 0) continue
            if (i + dx > gBoard.length - 1 || i + dx < 0) continue
            if (j + dy > gBoard.length - 1 || j + dy < 0) continue

            if (!gBoard[i + dx][j + dy].isShown) {
                gBoard[i + dx][j + dy].isShown = true
                gGame.shownCount++
            }
        }
    }
}

function checkGameOver() {//Game ends when all mines are marked, and all the other cells are shown
    var total = gGame.shownCount + gGame.markedCount
    // console.log('total:', total)
    // console.log('gLevel.size**2:', gLevel.size ** 2)
    if (total === gLevel.size ** 2) gameOver()
}

function gameOver() {// stop player activities and show all mines on the board
    gGame.isOn = false
    console.log('game is over')
    showMines()
    renderBoard(gBoard)

}

function updateTimeCounter() {
    if (!gGame.isOn) return
    var strHTML = padNumber(gGame.secsPassed)
    var elTimeCounter = document.getElementById('time-counter')
    elTimeCounter.innerText = strHTML
    gGame.secsPassed++
}

// function onDiffButtonClicked(val) {//handle board width 
//     gameOver()
//     var elGameContainer = document.querySelector(".game-container")
//     elGameContainer.style.width = "200px"
//     console.dir('elGameContainer.style.width',elGameContainer.style.width)
//     switch (val) {
//         case 0:
           
//             break;

//         default:
//         case 1:

//             break;

//         case 2:

//             break;
//     }
//     onInit(val)


// }