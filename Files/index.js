const canvas = document.getElementById('game');
const restartButton = document.getElementById('restart');
const ctx = canvas.getContext('2d');

class snakePart{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

let speed = 9;
let score = 0;
let highScore = 0
let lastHighScore = JSON.parse(localStorage.getItem('highScore'));
if(lastHighScore !== 0){
    highScore = lastHighScore;
}

let tileCount = 20;
let tileSize = canvas.width/tileCount - 2;

let headX = 15;
let headY = 15;
const snakeParts = [];
let tailLength = 2;

let appleX =  Math.floor(Math.random() * tileCount);
let appleY =  Math.floor(Math.random() * tileCount);

let xVelocity = 0;
let yVelocity = 0;

function drawGame(){
    changeSnakePosition();
    let result = isGameOver();
    if(result){
        return;
    }
    
    clearScreen();
    
    checkAppleCollision();
    drawApple();
    drawSnake();
    
    drawScore();
    drawHighScore();
    
    setTimeout(drawGame, 1000/speed);
    
    //to restart game after game over.
    document.getElementById('restart').onclick = () => {
        checkHighScore();
        location.reload(true);
    }
}

function isGameOver(){
    let gameOver = false;
    
    if(xVelocity === 0 && yVelocity === 0){
        return false;
    }
    
    //Hitting the walls
    if(headX < 0){
        gameOver = true;
    }
    else if(headX === tileCount){
        gameOver = true;
    }
    else if(headY < 0){
        gameOver = true;
    }
    else if(headY === tileCount){
        gameOver = true;
    }
    
    //Going over Body
    for(let i = 0; i < snakeParts.length; i++){
        let part = snakeParts[i];
        if(part.x === headX && part.y === headY){
            gameOver = true;
            break;
        }
    }
    
    if(gameOver){
        ctx.fillStyle = 'white';
        ctx.font = '50px Verdana';
        ctx.fillText('Game Over!', canvas.width / 6.5, canvas.height / 2);
        return gameOver;
    }
}

function clearScreen(){
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake(){    
    ctx.fillStyle = 'limegreen';
    for(let i = 0; i < snakeParts.length; i++){
        let part = snakeParts[i];
        ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize)
    }
    snakeParts.push(new snakePart(headX, headY));
    if (snakeParts.length > tailLength){
        snakeParts.shift();
    }
    
    ctx.fillStyle = 'orange';
    ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize)
}

function changeSnakePosition(){
    headX = headX + xVelocity;
    headY = headY + yVelocity;
}

function drawApple(){
    ctx.fillStyle = 'red';
    ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
}

function checkAppleCollision(){
    if(appleX == headX && appleY == headY){
        appleX = Math.floor(Math.random() * tileCount);
        appleY = Math.floor(Math.random() * tileCount);
        tailLength++;
        score++;
    }
}

function drawScore(){
    ctx.fillStyle = 'white';
    ctx.font = '15px Verdana';
    ctx.fillText('Score : ' + score, canvas.width - 80, 15)
    
}

function checkHighScore(){
    if(highScore !== 0){
        if(highScore < score){
            highScore = score;
            localStorage.setItem('highScore', JSON.stringify(highScore));
        }
        if(highScore > score){
            return;
        }
    }
    else{
        highScore = score;
        localStorage.setItem("highScore", JSON.stringify(score))
    }
}

function drawHighScore(){
    ctx.fillStyle = 'white';
    ctx.font = '15px Verdana';
    ctx.fillText('High Score : ' + highScore, canvas.width - 120, 35);
}

document.body.addEventListener('keydown', keyDown);

function keyDown(event){
    //Pressing up key
    if(event.keyCode == 38 || event.keyCode == 87){
        if(yVelocity == 1){
            return;
        }
        yVelocity = -1;
        xVelocity = 0;
    }

    //Pressing down key
    if(event.keyCode == 40 || event.keyCode == 83){
        if(yVelocity == -1){
            return;
        }
        yVelocity = 1;
        xVelocity = 0;
    }

    //Pressing left key
    if(event.keyCode == 37 || event.keyCode == 65){
        if(xVelocity == 1){
            return;
        }
        yVelocity = 0;
        xVelocity = -1;
    }
    
    //Pressing right key
    if(event.keyCode == 39 || event.keyCode == 68){
        if(xVelocity == -1){
            return;
        }
        yVelocity = 0;
        xVelocity = 1;
    }
}
drawGame();