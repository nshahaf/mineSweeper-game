'use strict'


function countNeighbors(cellI, cellJ, mat) {//count nighbors func to count mines around
    var neighborCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue // only in range

        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue // only in range

            if (i === cellI && j === cellJ) continue // skip cell

            if (mat[i][j].isMine) neighborCount++
        }
    }
    return neighborCount
}

function padNumber(num) {// pad the counter and the flag count to be 000 type

    if (num >= 0) {
        var digits = (""+num).split("")
        for (var i = digits.length ; i < 3 ; i ++) {
            digits.unshift('0')
        }
        var str = digits.join('')
       
    } else {
        num = Math.abs(num)
        var digits = (""+num).split("")
        console.log('digits:',digits)
        for (var i = digits.length ; i < 3 ; i ++) {
            digits.unshift('0')
        }
        digits.splice(0,1,'-')
        var str = digits.join('')
    }
    return str
}

function showMines() { // change all the mines to status shown
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j]
            if (currCell.isMine) currCell.isShown = true
        }
    }
}

function getCellTxtValue(cell) {//element txt value

    if (!cell.isShown && cell.isMarked) return FLAG // cell is flaged but not clicked (left click)

    if (cell.isShown && cell.isMine) return MINE // cell is clicked and is a mine

    if (cell.isShown && !cell.isMine) return `${cell.minesAroundCount}` // cell clicked and is not a mine
    else return '?'

}

function getCellClass(cell, i, j) { //element classes
    var n = cell.minesAroundCount
    var className = `cell cell-${i}-${j} hide-cell`
    if (!cell.isShown && cell.isMarked || cell.isShown) { // show flag or open cell
        className = `cell cell-${i}-${j} color${n}`
    }
    return className
}

function shuffle(array) {
    var currentIndex = array.length;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      var randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  }
  