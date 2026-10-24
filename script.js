const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScore = document.getElementById('finalScore');
const birdImg = new Image();
const pipeImg = new Image();
const backgroundImg = new Image();
const backgroundMusic = new Audio('assets/background-music.mp3'); // Add the path to your background music
const PIPE_WIDTH = 80;
const PIPE_SPAWN_INTERVAL = 120;
const INITIAL_PIPE_COUNT = 3;
const BIRD_HITBOX_PADDING = 4;
const PIPE_HORIZONTAL_COLLISION_PADDING = 28;
const PIPE_VERTICAL_COLLISION_PADDING = 2;

let bird, pipes, score, frame, gameRunning, gameOver, animationFrameId = null;

birdImg.src = 'assets/bird.png';
pipeImg.src = 'assets/pipe.png';
backgroundImg.src = 'assets/background.png';

function startGame() {
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }

    startScreen.style.display = 'none';
    document.getElementById('gameContainer').style.display = 'block';

    bird = { x: 50, y: 150, width: 30, height: 24, gravity: 0.15, velocity: 0, lift: -4 };
    pipes = [];
    score = 0;
    frame = 0;
    gameRunning = true;
    gameOver = false;
    gameOverScreen.style.display = 'none';
    
    // Start playing background music
    backgroundMusic.loop = true; // Loop the music
    backgroundMusic.currentTime = 0;
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
    if (frame === 0) {
        // Seed the opening with three pipes before regular spawning begins.
        for (let index = 0; index < INITIAL_PIPE_COUNT; index++) {
            addPipe(canvas.width / 2 + index * PIPE_SPAWN_INTERVAL);
        }
    } else if (frame % PIPE_SPAWN_INTERVAL === 0) {
        addPipe(canvas.width);
    }

    pipes.forEach((pipe, index) => {
        pipe.x -= 1;

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

function addPipe(x) {
    let gap = 120;
    let pipeTopHeight = Math.floor(Math.random() * (canvas.height - gap));
    let pipeBottomHeight = canvas.height - pipeTopHeight - gap;
    pipes.push({ x, top: pipeTopHeight, bottom: pipeBottomHeight, width: PIPE_WIDTH });
}

function checkCollision(bird, pipe) {
    // Use a slightly smaller hitbox so near-misses do not end the game.
    const birdLeft = bird.x + BIRD_HITBOX_PADDING;
    const birdRight = bird.x + bird.width - BIRD_HITBOX_PADDING;
    const birdTop = bird.y + BIRD_HITBOX_PADDING;
    const birdBottom = bird.y + bird.height - BIRD_HITBOX_PADDING;
    // Side collisions require deeper horizontal overlap than top/bottom hits.
    const pipeLeft = pipe.x + PIPE_HORIZONTAL_COLLISION_PADDING;
    const pipeRight = pipe.x + PIPE_WIDTH - PIPE_HORIZONTAL_COLLISION_PADDING;
    const topPipeBottom = pipe.top - PIPE_VERTICAL_COLLISION_PADDING;
    const bottomPipeTop = canvas.height - pipe.bottom + PIPE_VERTICAL_COLLISION_PADDING;

    const overlapsHorizontally = birdRight > pipeLeft && birdLeft < pipeRight;
    if (!overlapsHorizontally) return false;

    // The bird must actually overlap either pipe's vertical area.
    return birdTop < topPipeBottom || birdBottom > bottomPipeTop;
}

function drawPipes() {
    pipes.forEach(pipe => {
        // Flip the top pipe so its cap faces down into the gap.
        ctx.save();
        ctx.translate(pipe.x, pipe.top);
        ctx.scale(1, -1);
        ctx.drawImage(pipeImg, 0, 0, PIPE_WIDTH, pipe.top);
        ctx.restore();

        ctx.drawImage(pipeImg, pipe.x, canvas.height - pipe.bottom, PIPE_WIDTH, pipe.bottom);
    });
}

function drawScore() {
    ctx.fillStyle = '#000';
    ctx.font = '16px Arial';
    ctx.fillText(`Score: ${score}`, 10, canvas.height - 20);
}

function showGameOver() {
    if (!gameRunning) return;

    gameRunning = false;
    gameOver = true;
    backgroundMusic.pause(); // Pause the background music
    finalScore.innerText = `Your Score: ${score}`;
    gameOverScreen.style.display = 'block';
}

function gameLoop() {
    if (!gameRunning) {
        animationFrameId = null;
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    updateBird();
    drawBird();
    updatePipes();
    drawPipes();
    drawScore();

    frame++;
    if (gameRunning) {
        animationFrameId = requestAnimationFrame(gameLoop);
    } else {
        animationFrameId = null;
    }
}

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        event.preventDefault();

        if (gameOver) {
            restartGame();
            return;
        }

        if (gameRunning) {
            bird.velocity = bird.lift;
        }
    }
});

document.addEventListener('touchstart', function(event) {
    // Keep buttons usable without also triggering a flap or restart.
    if (event.target.closest && event.target.closest('button')) return;

    event.preventDefault();

    if (gameOver) {
        restartGame();
        return;
    }

    if (gameRunning) {
        bird.velocity = bird.lift;
    }
}, { passive: false });

function restartGame() {
    startGame();
}

// The game starts when the player clicks the start button
