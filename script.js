const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScore = document.getElementById('finalScore');
const birdImg = new Image();
const pipeImg = new Image();
const backgroundImg = new Image();
const backgroundMusic = new Audio('assets/background-music.mp3'); // Add the path to your background music

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
    
    // Start playing background music
    backgroundMusic.loop = true; // Loop the music
    backgroundMusic.play();
    
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
        pipes.push({ x: canvas.width, top: pipeTopHeight, bottom: pipeBottomHeight, width: PIPE_WIDTH });
    }

    pipes.forEach((pipe, index) => {
        pipe.x -= 1.5;

        if (pipe.x + 50 < 0) {
            pipes.splice(index, 1);
            score++;
        }

        if (checkCollision(bird, pipe)) {
            showGameOver();
            return;
        }
    });
}

function checkCollision(bird, pipe) {
    // Define the effective bounding box of the bird
    let birdLeft = bird.x;
    let birdRight = bird.x + bird.width;
    let birdTop = bird.y;
    let birdBottom = bird.y + bird.height;

    // Define the effective bounding boxes of the pipe
    let pipeTopX = pipe.x;
    let pipeTopY = 0;
    let pipeBottomX = pipe.x;
    let pipeBottomY = canvas.height - pipe.bottom;
    let pipeRight = pipe.x + PIPE_WIDTH;

    let overlapTolerance = 25; // Horizontal tolerance for side collision
    let verticalTolerance = 0; // Vertical tolerance for top and bottom collision


    // Check collision with top pipe
    if (birdRight > pipeTopX + overlapTolerance && birdLeft < pipeTopX + 50 - overlapTolerance) {
        if (birdTop < pipe.top + verticalTolerance) {
            return true; // Collision with top pipe
        }
    }

    // Check collision with bottom pipe
    if (birdRight > pipeBottomX + overlapTolerance && birdLeft < pipeBottomX + 50 - overlapTolerance) {
        if (birdBottom > pipeBottomY - verticalTolerance) {
            return true; // Collision with bottom pipe
        }
    }

    return false; // No collision
}

const PIPE_WIDTH = 80;

function drawPipes() {
    pipes.forEach(pipe => {
        ctx.drawImage(pipeImg, pipe.x, 0, PIPE_WIDTH, pipe.top);
        ctx.drawImage(pipeImg, pipe.x, canvas.height - pipe.bottom, PIPE_WIDTH, pipe.bottom);
    });
}

function drawScore() {
    ctx.fillStyle = '#000';
    ctx.font = '16px Arial';
    ctx.fillText(`Score: ${score}`, 10, canvas.height - 20);
}

function showGameOver() {
    gameRunning = false;
    backgroundMusic.pause(); // Pause the background music
    setTimeout(function() {
        finalScore.innerText = `Your Score: ${score}`;
        document.getElementById('gameContainer').style.display = 'none';
        gameOverScreen.style.display = 'block';
    }, 1000);
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
