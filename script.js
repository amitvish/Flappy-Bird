const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverPopup = document.getElementById('gameOverPopup');

let bird, pipes, score, frame, gameRunning;

function startGame() {
    bird = { x: 50, y: 150, width: 20, height: 20, gravity: 0.3, velocity: 0, lift: -5 };
    pipes = [];  
    score = 0;
    frame = 0;   
    gameRunning = true;
    gameOverPopup.style.display = 'none';
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
    ctx.fillStyle = 'yellow';
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function updatePipes() {
    if (frame % 90 === 0) {
        let gap = 120;
        let pipeTopHeight = Math.floor(Math.random() * (canvas.height - gap));
        let pipeBottomHeight = canvas.height - pipeTopHeight - gap;
        pipes.push({ x: canvas.width, top: pipeTopHeight, bottom: pipeBottomHeight });
    }

    pipes.forEach((pipe, index) => {
        pipe.x -= 2 ; 

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
    ctx.fillStyle = 'green';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, 50, pipe.top);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, 50, pipe.bottom);
    });
}

function drawScore() {
    ctx.fillStyle = '#000';
    ctx.font = '16px Arial';
    ctx.fillText(`Score: ${score}`, 10, canvas.height - 20);
}

function showGameOver() {
    gameRunning = false;
    gameOverPopup.style.display = 'block';
}

function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
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

startGame();
