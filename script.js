const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScore = document.getElementById('finalScore');
const birdImg = new Image();
const pipeImg = new Image();
const backgroundImg = new Image();

let bird, pipes, score, frame, gameRunning;

birdImg.src = 'assets/bird.png';
pipeImg.src = 'assets/pipe.png';
backgroundImg.src = 'assets/background.png';

function startGame() {
    startScreen.style.display = 'none';
    document.getElementById('gameContainer').style.display = 'block';

    bird = { x: 50, y: 150, width: 30, height: 24, gravity: 0.3, velocity: 0, lift: -5 };
    pipes = [];
    score = 0;
    frame = 0;
    gameRunning = true;
    gameOverScreen.style.display = 'none';
    gameLoop();
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
        showGameOver();
    }
}

function drawBird() {
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

function updatePipes() {
    if (frame % 90 === 0) {
        let gap = 120;
        let pipeTopHeight = Math.floor(Math.random() * (canvas.height - gap));
        let pipeBottomHeight = canvas.height - pipeTopHeight - gap;
        pipes.push({ x: canvas.width, top: pipeTopHeight, bottom: pipeBottomHeight });
    }

    pipes.forEach((pipe, index) => {
        pipe.x -= 1.5;

        if (pipe.x + 50 < 0) {
            pipes.splice(index, 1);
            score++;
        }

        if (bird.x < pipe.x + 50 && bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)) {
            showGameOver();
        }
    });
}

function drawPipes() {
    pipes.forEach(pipe => {
        ctx.drawImage(pipeImg, pipe.x, 0, 50, pipe.top);
        ctx.drawImage(pipeImg, pipe.x, canvas.height - pipe.bottom, 50, pipe.bottom);
    });
}

function drawScore() {
    ctx.fillStyle = '#000';
    ctx.font = '16px Arial';
    ctx.fillText(`Score: ${score}`, 10, canvas.height - 20);
}

function showGameOver() {
    gameRunning = false;
    finalScore.innerText = `Your Score: ${score}`;
    document.getElementById('gameContainer').style.display = 'none';
    gameOverScreen.style.display = 'block';
}

function gameLoop() {
    if (!gameRunning) return;

    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    updateBird();
    drawBird();
    updatePipes();
    drawPipes();
    drawScore();

    frame++;
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', function(event) {
    if (event.key === ' ' && gameRunning) {
        bird.velocity = bird.lift;
    }
});

function restartGame() {
    startGame();
}

// The game starts when the player clicks the start button
