let columnsN = 10;
let rowsN = 20;
let speed = 200;

let current_coordinate = [0, 0];
let secondsPassed = 0;
let oldTimeStamp = 0;
let score = 0;
let currentGameState = [];

const deepCopy = (arr) => {
    let copy = [];
    arr.forEach(elem => {
        if (Array.isArray(elem)) {
            copy.push(deepCopy(elem))
        } else {
            if (typeof elem === 'object') {
                copy.push(deepCopyObject(elem))
            } else {
                copy.push(elem)
            }
        }
    })
    return copy;
}



let Piece_L =
    [["#AB00FF", "#000"],
    ["#AB00FF", "#000"],
    ["#AB00FF", "#AB00FF"]];
let Piece_L_Inverse =
    [["#000", "#ff0000"],
    ["#000", "#ff0000"],
    ["#ff0000", "#ff0000"]];

let Piece_Square =
    [["#cea200", "#cea200"],
    ["#cea200", "#cea200"],];

let Piece_Line =
    [["#72bcd4"],
    ["#72bcd4"],
    ["#72bcd4"],
    ["#72bcd4"],];

let Piece_T =
    [["#000", "#adff2f", "#000"],
    ["#adff2f", "#adff2f", "#adff2f"]];


let currentPiece;

const setNewPiece = () => {
    rPiece = Math.floor(Math.random() * 5);
    if (rPiece == 0) {
        currentPiece = deepCopy(Piece_Square);
    } else if (rPiece == 1) {
        currentPiece = deepCopy(Piece_L);
    }
    else if (rPiece == 2) {
        currentPiece = deepCopy(Piece_L_Inverse);
    }
    else if (rPiece == 3) {
        currentPiece = deepCopy(Piece_Line);
    }
    else if (rPiece == 4) {
        currentPiece = deepCopy(Piece_T);
    }
}
setNewPiece();




const BuildBoard = () => {
    let x = 0;
    let y = 0;
    let container = document.getElementsByClassName("container")[0];
    for (let rowsI = 0; rowsI < rowsN; rowsI++) {
        currentGameState[rowsI] = [];
        for (let columnsI = 0; columnsI < columnsN; columnsI++) {
            let square = document.createElement("div");
            square.style.height = "10px";
            square.style.width = "10px";
            square.style.border = "1px solid black";
            square.style.margin = "1px";
            square.id = columnsI + "-" + rowsI;
            square.style.background = "black";
            container.append(square);
            currentGameState[rowsI][columnsI] = "#000";
        }
    }
}

document.addEventListener('keydown', (key) => {
    if (key.key == "ArrowRight") {
        //TODO Check width of piece before incrementing current_coordinate
        if (current_coordinate[0] < 9) {
            if (checkCanGoRight()) {
                current_coordinate[0] += 1
            }
        }
    } else if (key.key == "ArrowLeft") {
        if (current_coordinate[0] > 0) {
            if (checkCanGoLeft()) {
                current_coordinate[0] -= 1
            }
        }
    } else if (key.key == "ArrowUp") {
        rotatePiece();
        console.log(currentPiece);
    } else if (key.key == " ") {
        if (speed == 50) {
            speed = 1000;
        } else {
            speed = 50;
        }
    }

    if (current_coordinate[1] < 20) {
        clean();
        drawPiece();
    }

})

const rotatePiece = () => {
    let copyPiece = [];
    let tempHorizontalArray = [];
    let counter = 0;
    let nColumns = currentPiece[0].length;
    for (let index = 0; index < nColumns; index++) {
        copyPiece.push([]);
    }
    for (let r = currentPiece.length - 1; r >= 0; r--) {
        tempHorizontalArray = currentPiece[r];
        for (let c = 0; c < tempHorizontalArray.length; c++) {
            copyPiece[c][counter] = tempHorizontalArray[c];
        }
        counter++;
    }

    //check if can rotate
    for (let copyR = 0; copyR < copyPiece.length; copyR++) {
        for (let copyC = 0; copyC < copyPiece[copyR].length; copyC++) {
            let col = current_coordinate[0] + copyC;
            let row = current_coordinate[1] + copyR;

            if (currentGameState[row][col] != "#000" && copyPiece[copyR][copyC] != "#000") {
                return false;
            }
            if (copyPiece[0].length + current_coordinate[0] > rowsN - 1) {
                return false;
            }
        }

    }
    currentPiece = deepCopy(copyPiece);
}

const clean = () => {
    for (let r = 0; r < currentGameState.length; r++) {
        for (let c = 0; c < currentGameState[r].length; c++) {
            let currentDiv = document.getElementById(c + "-" + r);
            currentDiv.style.backgroundColor = currentGameState[r][c];
        }
    }
}

const checkLineClear = () => {
    let index = 0;
    for (let r = 0; r < currentGameState.length; r++) {
        for (let c = 0; c < currentGameState[r].length; c++) {

            if (currentGameState[r][c] == "#000") {
                break;
            }
            if (c == currentGameState[r].length - 1) {
                clearLine(r);
            }
        }
    }
}

const clearLine = (row) => {
    score++
    document.getElementById("score").innerText = score;
    for (let c = 0; c < currentGameState[row].length; c++) {
        currentGameState[row][c] = "#000";
    }

    for (let r = row; r > 0; r--) {
        for (let c = 0; c < currentGameState[r].length; c++) {
            currentGameState[r][c] = currentGameState[r - 1][c]
        }
    }
}

const draw = (timeStamp) => {
    secondsPassed = (timeStamp - oldTimeStamp);
    if (secondsPassed > speed) {
        clean();
        checkLineClear();
        oldTimeStamp = timeStamp;

        if (checkCanGoLow()) {
            current_coordinate[1] += 1;
            drawPiece();
        } else {
            placePieceInCurrentState();
        }
    }
}


const checkGameOver = () => {
    for (let r = 0; r < currentPiece.length; r++) {
        for (let c = 0; c < currentPiece[r].length; c++) {
            let col = current_coordinate[0] + c;
            let row = current_coordinate[1] + r;
            let currentDiv = document.getElementById(col + "-" + row);
            if (currentGameState[row][col] != "#000" && currentPiece[r][c] != "#000") {
                alert("Score:"+score);
            }
        }
    }
}

const placePieceInCurrentState = () => {
    for (let r = 0; r < currentPiece.length; r++) {
        for (let c = 0; c < currentPiece[r].length; c++) {
            let col = current_coordinate[0] + c;
            let row = current_coordinate[1] + r;
            if (currentPiece[r][c] != "#000") {
                currentGameState[row][col] = currentPiece[r][c];
            }
        }
    }
    setNewPiece();
    
    clean();
    current_coordinate = [0, 0];
    checkGameOver();
}

const checkCanGoRight = () => {
    for (let r = 0; r < currentPiece.length; r++) {
        for (let c = 0; c < currentPiece[r].length; c++) {
            let col = current_coordinate[0] + c + 1;
            let row = current_coordinate[1] + r;
            if (currentGameState[row][col] != "#000" && currentPiece[r][c] != "#000") {
                return false;
            }
        }
    }
    return true;
}

const checkCanGoLeft = () => {
    for (let r = 0; r < currentPiece.length; r++) {
        for (let c = 0; c < currentPiece[r].length; c++) {
            let col = current_coordinate[0] - 1;
            let row = current_coordinate[1] + r;
            if (currentGameState[row][col] != "#000" && currentPiece[r][c] != "#000") {
                return false;
            }
        }
    }
    return true;
}

const checkCanGoLow = () => {
    for (let r = 0; r < currentPiece.length; r++) {
        for (let c = 0; c < currentPiece[r].length; c++) {
            let col = current_coordinate[0] + c;
            let row = current_coordinate[1] + r + 1;

            if (row >= rowsN) {
                return false;
            }
            if (currentGameState[row][col] != "#000" && currentPiece[r][c] != "#000") {
                return false;
            }
        }
    }
    return true;
}

const drawPiece = () => {
    for (let r = 0; r < currentPiece.length; r++) {
        for (let c = 0; c < currentPiece[r].length; c++) {
            if (current_coordinate[1] + currentPiece.length < 21) {
                let col = current_coordinate[0] + c;
                let row = current_coordinate[1] + r;
                let currentDiv = document.getElementById(col + "-" + row);
                if (currentPiece[r][c] != "#000") {
                    currentDiv.style.background = currentPiece[r][c];
                }
            }
        }
    }
}

window.requestAnimationFrame(gameLoop);
function gameLoop(timeStamp) {
    draw(timeStamp);
    window.requestAnimationFrame(gameLoop);
}
BuildBoard();
let currentDiv = document.getElementById(current_coordinate[0] + "-" + current_coordinate[1]);
currentDiv.style.background = "Yellow";