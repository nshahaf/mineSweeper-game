'use strict'

//CONSTANTS:
const gLevels = [{ size: 4, mines: 2 }, { size: 8, mines: 14 }, { size: 12, mines: 32 }]
const gIcons = { normal: '😀', winner: '😎', looser: '😭' }
const MINE = '💣'
const FLAG = '🚩'
const LIFE = '💗'


//GLOBAL VERIABLES:
var gBoard
var gGame
var gLevel
var gtimerintervalId
var gameDiff = 1

//disable right mouse click default modal
document.addEventListener('contextmenu', event => { event.preventDefault(); })

//Init veriables and functions
function onInit() {
    gGame = {
        isOn: true,
        isFirstClick: true,
        shownCount: 0,
        markedCount: 0, // with flag
        secsPassed: 0,
        lifeCounter: 3,
    }
    initHints()
    
    updateLifeCount()
    updateIcon()
    gLevel = gLevels[gameDiff]
    gBoard = buildBoard() // build the dataModel

    renderBoard(gBoard)

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
    //for debbuging
    // board[0][0].isMine = true
    // board[2][2].isMine = true
    return board
}

function renderBoard(board) {//Render the board as a <table> to the page
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'

        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]

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

function placeMines(idxI, idxJ) {//place mines in random locations in gBoard
    //create shuffled array in the board size with mines in random locations
    var arr = []
    for (var i = 0; i < gLevel.mines; i++) {
        arr.push(MINE)
    }
    for (var i = gLevel.mines; i < (gLevel.size ** 2); i++) { //-1 is for first click support
        arr.push("")
    }
    // console.log('arr:',arr)
    shuffle(arr)
    // console.log('arr:', arr)

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (i === idxI && j === idxJ) continue
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

    if (gGame.isFirstClick) {//added first click support
        placeMines(i, j)
        setMinesNegsCount()
        currCell.isShown = true 
        gGame.shownCount++
        if (currCell.minesAroundCount === 0) revealAround(i, j)
        renderBoard(gBoard)
        gGame.isFirstClick = false
        return
    }

    if (gIsHint) {
        hintShowAround(i, j)
        return
    }

    currCell.isShown = true // change show status for later rendering of the board
    gGame.shownCount++



    if (currCell.isMine) {// added life support
        gGame.lifeCounter--
        updateLifeCount()
        currCell.isShown = false
        gGame.shownCount--
        if (gGame.lifeCounter === 0) gameOver()
    }
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
    // console.log('gGame.markedCount:', gGame.markedCount)
    // console.log('currCell:', currCell)
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
                if (gBoard[i + dx][j + dy].isMarked) gGame.markedCount--
                gGame.shownCount++
            }
        }
    }
}

function checkGameOver() {//Game ends when all mines are marked, and all the other cells are shown
    var numOfCells = gLevel.size ** 2

    if (gGame.markedCount !== gLevel.mines) return

    if (gGame.shownCount < numOfCells - gLevel.mines) return

    gameOver(true)

}

function gameOver(isWin = false) {// stop player activities and show all mines on the board
    gGame.isOn = false
    showMines()
    isWin ? updateIcon(gIcons.winner) : updateIcon(gIcons.looser)
    isWin ? console.log('Winner!') : console.log('game is over')
    if (isWin) {
        saveToLocalStorage()
        updateHighScoreTable()
    }
    renderBoard(gBoard)
}

function updateTimeCounter() {
    if (!gGame.isOn) return
    var strHTML = padNumber(gGame.secsPassed)
    var elTimeCounter = document.getElementById('time-counter')
    elTimeCounter.innerText = strHTML
    gGame.secsPassed++
}

function onDiffButtonClicked(val) {//handle board width 
    var elGameContainer = document.querySelector(".game-container")
    gameDiff = val
    if (val === 0) elGameContainer.style.width = '200px'
    else if (val === 1) elGameContainer.style.width = '250px'
    else if (val === 2) elGameContainer.style.width = '400px'
    else elGameContainer.style.width = '250px'
    gameOver()
    onInit()
}

function updateLifeCount() {// DOM update for the visual life counter 
    var elLife = document.querySelector('#life')
    var htmlTxt = ''
    for (var i = 0; i < gGame.lifeCounter; i++) {
        htmlTxt += LIFE
    }
    elLife.innerText = htmlTxt
}

function updateIcon(str = gIcons.normal) { // DOM update for the player icon
    var elIcon = document.querySelector('.reset-btn')
    elIcon.innerText = str
}
