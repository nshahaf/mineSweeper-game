'use strict'
var gHints
var gIsHint
var timeOutId

function initHints() {
    gIsHint = false
    gHints = [{ isClicked: false, isUsed: false },
    { isClicked: false, isUsed: false },
    { isClicked: false, isUsed: false }]

    renderHints()
}

function onHintClick(currPos) {
    //model
    if (gHints[currPos].isUsed) return // user cant click on a used hint
    else if (gHints[currPos].isClicked === false) { // turn to true and all other to false
        for (var i = 0; i < gHints.length; i++) {
            if (gHints[i].isClicked === true) gHints[i].isClicked = false
        }
        gHints[currPos].isClicked = true // only the current is clicked
        gIsHint = true
    } else if (gHints[currPos].isClicked === true) {
        gHints[currPos].isClicked = false
        gIsHint = false
    }
    // console.log('gIsHint:', gIsHint)
    //DOM
    renderHints()
}

function renderHints() {
    var elHints = document.querySelectorAll('#hint button')

    for (var i = 0; i < gHints.length; i++) {
        if (gHints[i].isUsed === true) {
            elHints[i].style.backgroundColor = 'yellow'
            elHints[i].style.boxShadow = 'none'

        } else if (gHints[i].isClicked === true && gHints[i].isUsed === false) {
            elHints[i].style.boxShadow = '0px 0px 4px'

        } else if (gHints[i].isClicked === false && gHints[i].isUsed === false) {
            elHints[i].style.boxShadow = 'none'
            elHints[i].style.backgroundColor = ''
        }
    }
}

function hintShowAround(i, j) {
    for (var t = 0; t < gHints.length; t++) {
        if (gHints[t].isClicked) gHints[t].isUsed = true
    }

    renderHints()

    var indexs = [] // get cells to show
    for (var dx = -1; dx <= 1; dx++) {
        for (var dy = -1; dy <= 1; dy++) {
            if (i + dx > gBoard.length - 1 || i + dx < 0) continue  //if out of range
            if (j + dy > gBoard.length - 1 || j + dy < 0) continue  //if out of range

            var currCell = gBoard[i + dx][j + dy]
            if (currCell.isShown === false) {
                indexs.push(i + dx)
                indexs.push(j + dy)
            }
        }
    }
    //show for 1 sec and than hide
    for (var t = 0; t < indexs.length; t = t + 2) {
        gBoard[indexs[t]][indexs[t + 1]].isShown = true
    }
    renderBoard(gBoard)

    timeOutId = setTimeout(function () {
        for (var t = 0; t < indexs.length; t = t + 2) {
            gBoard[indexs[t]][indexs[t + 1]].isShown = false
        }
        renderBoard(gBoard)
        gIsHint = false
    }, 1000)
}
