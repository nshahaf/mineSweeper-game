'use strict'

var highScoreTable
retriveFromLocalStorage()
updateHighScoreTable()

function retriveFromLocalStorage() {
    highScoreTable = JSON.parse(localStorage.getItem("highScore"))
    // console.log('highScoreTable:', highScoreTable)
    if (highScoreTable === null) {
        highScoreTable = []
        return
    }

    // highScoreTable = highScoreTable.sort((score1, score2) => { return score1.time - score2.time })
}

function updateHighScoreTable() {
    if (highScoreTable === null) return
    var length = highScoreTable.length
    if (length === 0) return
    highScoreTable.sort()
    var easyHighScore = []
    var hardHighScore = []
    var extremeHighScore = []

    for (var i = 0; i < length; i++) {
        if (highScoreTable[i].level === 'easy') easyHighScore.push(highScoreTable[i])
        else if (highScoreTable[i].level === 'hard') hardHighScore.push(highScoreTable[i])
        else if (highScoreTable[i].level === 'extreme') extremeHighScore.push(highScoreTable[i])
    }


    //constract new highScore table with best from each level
    highScoreTable = []
    if (easyHighScore.length > 0) highScoreTable.push(easyHighScore[0])
    if (hardHighScore.length > 0) highScoreTable.push(hardHighScore[0])
    if (extremeHighScore.length > 0) highScoreTable.push(extremeHighScore[0])

    //update DOM
    for (var i = 0; i < highScoreTable.length; i++) {
        document.getElementById(`name${i + 1}`).innerText = highScoreTable[i].name
        document.getElementById(`level${i + 1}`).innerText = highScoreTable[i].level
        document.getElementById(`time${i + 1}`).innerText = highScoreTable[i].time
    }
}

function saveToLocalStorage() {
    var level
    if (gameDiff === 0) level = 'easy'
    else if (gameDiff === 1) level = 'hard'
    else if (gameDiff === 2) level = 'extreme'

    var score = {
        name: makeId(),
        time: gGame.secsPassed,
        level: level

    }
    highScoreTable.push(score)
    highScoreTable = highScoreTable.sort((score1, score2) => { return score1.time - score2.time })
    localStorage.setItem('highScore', JSON.stringify(highScoreTable))

}

function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}



