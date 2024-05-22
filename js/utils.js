'use strict'

function getRandomColor() {
    const letters = '0123456789ABCDEF'
    var color = '#'
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}

function getRandomInt(min, max) { // generate a random number between min (inclusive) and max (exclusive)
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

function countNeighbors(cellI, cellJ, mat) {
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