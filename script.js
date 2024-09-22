const myCanvas = document.getElementById('myCanvas');
const ballRadius = 10;
let paddleWidth = 80;
let paddleHeight = 15;  
let paddleX = myCanvas.width/2 - paddleWidth/2;
let paddleY =  myCanvas.height - paddleHeight;

let x = myCanvas.width / 2;
let y = myCanvas.height - ballRadius - paddleHeight;
let dx = 5;
let dy = 5;

let dPressed = false;
let aPressed = false;

let interval = 0;

let score = 0;

let lives = 3;

const brickRowCount = 7;
const brickColCount = 8;
const brickWidth = 120;
const brickHeight = 20;
const brickPadding = 30;
const brickMarginSide = (myCanvas.width - (brickColCount * (brickWidth + brickPadding) - brickPadding)) / 2;
const brickMarginTop = 50;
let bricks = [];

for(let i = 0; i < brickRowCount; i++){
    bricks[i] = [];
    for(let j = 0; j < brickColCount; j++){
        bricks[i][j] = {x: 0, y: 0, bool: true};
    }
}
const ctx = myCanvas.getContext("2d");

const createBrickField = () =>{
    for(let i = 0; i < brickRowCount; i++){
        for(let j = 0; j < brickColCount; j++){
            if(bricks[i][j].bool){
                bricks[i][j].x = j * (brickPadding + brickWidth) + brickMarginSide;
                bricks[i][j].y = i * (brickPadding + brickHeight) + brickMarginTop;
                ctx.beginPath();
                ctx.fillStyle = 'white';
                ctx.fillRect(bricks[i][j].x, bricks[i][j].y, brickWidth, brickHeight)
                ctx.closePath();
            }
        }
    }
}

const drawBall = () =>{
    ctx.beginPath();
    ctx.arc(x, y , ballRadius, 0, Math.PI * 2, true);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
}


const drawPaddle = () =>{
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);
    ctx.closePath();
}

const requestCollision = () =>{
    for(let i = 0; i < brickRowCount; i++){
        for(let j = 0; j < brickColCount; j++){
            if(bricks[i][j].bool){
                if((x + ballRadius > bricks[i][j].x && x - ballRadius < bricks[i][j].x + brickWidth) && (y + ballRadius > bricks[i][j].y && y - ballRadius < bricks[i][j].y + brickHeight)){
                    dy = -dy;
                    score++;
                    if(score === brickRowCount * brickColCount){
                        alert('YOU WIN, CONGRATULATIONS!');
                        document.location.reload();
                    }
                    bricks[i][j].bool = false;
                }
            }
        }
    }
}

const moveBall = () =>{
    if(x - ballRadius < 0 || x + ballRadius > myCanvas.width){
        dx = -dx;
    }
    if(y - ballRadius < 0){
        dy = -dy;
    }
    if(y + ballRadius > myCanvas.height){
        if(!lives){
            alert('GAME OVER');
            lives = 3;
            document.location.reload();
        } else{
            x = myCanvas.width / 2;
            y = myCanvas.height - ballRadius - paddleHeight;
            paddleX = myCanvas.width/2 - paddleWidth/2;
            dx = 5;
            dy = -5;
            lives--;
        }
    } else if(y + ballRadius > paddleY && dy > 0) {
        if(x + ballRadius > paddleX && x - ballRadius < paddleX + paddleWidth){
            dy = -dy;  
        } 
    }
    x += dx;
    y += dy;
}

const keyDownHandler = (e) =>{
    if(e.key === 'a'){
        aPressed = true;
    }
    if(e.key === 'd'){
        dPressed = true;
    }
}

const keyUpHandler = (e) =>{
    if(e.key === 'a'){
        aPressed = false;
    }
    if(e.key === 'd'){
        dPressed = false;
    }
}

const mouseMoveHandler = (e) =>{
    const relativeX = e.clientX - myCanvas.offsetLeft;
    if(relativeX > 0 && relativeX < myCanvas.width){
        paddleX = relativeX - paddleWidth / 2;
    }
}

const movePaddle = () =>{
    if(aPressed){
        if(paddleX - 7 > 0){
            paddleX -= 7;
        }
    }else if(dPressed){
        if(paddleX + 7 + paddleWidth < myCanvas.width){
            paddleX += 7;
        }
    }
}

const drawScore = () => {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'orange';
    ctx.fillText(`Score: ${score}`, brickMarginSide, brickMarginTop/2);
}

const drawLives = () =>{
    ctx.font = '20px Arial';
    ctx.fillStyle = 'orange';
    ctx.fillText(`Lives: ${lives}`, myCanvas.width - brickMarginSide - ctx.measureText('Lives: 3').width, brickMarginTop/2);
}

const draw = () =>{
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    movePaddle();
    drawPaddle();
    drawBall();
    createBrickField();
    requestCollision();
    drawScore();
    drawLives();
    moveBall();
    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
document.addEventListener('keydown' ,keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
document.addEventListener('mousemove', mouseMoveHandler);

