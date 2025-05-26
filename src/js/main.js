document.body.style.cursor = 'none';

function requestFullscreenIfAllowed() {
  const el = document.documentElement;
  if (el.requestFullscreen) {
    el.requestFullscreen().catch((err) => {
      console.warn("Не удалось включить полноэкранный режим:", err);
    });
  }
}

document.addEventListener("click", requestFullscreenIfAllowed, { once: true });
document.addEventListener("keydown", requestFullscreenIfAllowed, { once: true });

const terminal = document.getElementById("terminal");

const bootLines = [
  {
    text: `
░▒▓███████▓▒░░░▒▓█▓▒░░▒▓█▓▒░░░▒▓██████▓▒░░░▒▓████████▓▒░░▒▓███████▓▒░░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░   ░▒▓███████▓▒░░░▒▓█▓▒░░░▒▓██████▓▒░░░░▒▓███████▓▒░ ///,        ////
░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░       ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░   ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░        7  /,      /  >.
░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░       ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░   ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░         7  /,   _/  /. 
░▒▓███████▓▒░░░▒▓████████▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓██████▓▒░  ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░░▒▓██████▓▒░░   ░▒▓███████▓▒░░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░░▒▓██████▓▒░    7_  /_/   /.  
░▒▓█▓▒░       ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░       ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░   ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░       ░▒▓█▓▒░    7__/_   <    
░▒▓█▓▒░       ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░       ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░   ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░       ░▒▓█▓▒░    /<<< 7_7_    
░▒▓█▓▒░       ░▒▓█▓▒░░▒▓█▓▒░░░▒▓██████▓▒░░░▒▓████████▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░   ░▒▓███████▓▒░░░▒▓█▓▒░░░▒▓██████▓▒░░░▒▓███████▓▒░    /,)^>>_._ 7   
                                                                                                                                                  (/   77 /777  
                                                                                                                                                        // ----- 
                                                                                                                                                 ======((======= 
`,
    className: "logo-text",
    speed: 0
  },
  { text: "PhoenixBIOS 4.0 Release 6.0" },
  { text: "Copyright 1985-2001 Phoenix Technologies Ltd." },
  { text: "All Rights Reserved" },
  { text: "CPU = Intel(R) Pentium(R) CPU 3.00GHz" },
  { text: "Memory Test : 1048576K OK" },
  { text: "Initializing USB Controllers .. Done." },
  { text: "Detected IDE Drives ..." },
  { text: "Booting from CD-ROM..." },
  { text: "Booting from Hard Drive..." },
  { text: "" },
  { text: "Type 'start' to launch the game." },
  { text: "Type 'options' to configure settings." },
  { text: "Type 'exit' to shut down." },
  { text: "" }
];

let currentLine = 0;

function typeText({ text, className = "", speed = 14 }, callback = () => {}) {
  const el = document.createElement("div");
  if (className) el.classList.add(className);
  terminal.appendChild(el);

  let i = 0;
  const interval = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(interval);
      terminal.scrollTop = terminal.scrollHeight;
      callback();
    }
  }, speed);
}

function bootSequence() {
  const logoLine = bootLines[0];
  typeText(logoLine); 

  function printNextLine() {
    if (currentLine >= bootLines.length) {
      addInputField();
      return;
    }

    if (currentLine === 0) {
      currentLine++;
      printNextLine();
      return;
    }

    typeText(bootLines[currentLine], () => {
      currentLine++;
      printNextLine();
    });
  }

  setTimeout(printNextLine, 1900); 
}

bootSequence();

window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    document.addEventListener("keydown", (e) => {
      const gameCanvas = document.getElementById("gameCanvas");
      const isGameVisible =
        gameCanvas &&
        gameCanvas instanceof HTMLElement &&
        window.getComputedStyle(gameCanvas).display !== "none" &&
        gameCanvas.offsetParent !== null;

      if (isGameVisible) return;

      if (e.key === "Enter") {
        const input = terminal.querySelector("input.terminal-input");
        if (!input || document.activeElement !== input) {
          addInputField();
        }
      }
    });
  }, 8900);
});




function addInputField() {
  terminal.querySelectorAll("input.terminal-input").forEach((el) => el.remove());

  const input = document.createElement("input");
  input.classList.add("terminal-input");
  terminal.appendChild(input);
  input.focus();
  terminal.scrollTop = terminal.scrollHeight;

  input.addEventListener("input", () => {
    terminal.scrollTop = terminal.scrollHeight;
  });

  input.addEventListener("focus", () => {
    terminal.scrollTop = terminal.scrollHeight;
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const command = input.value.trim().toLowerCase();
      terminal.removeChild(input);

      const response = document.createElement("div");
      response.textContent = "> " + command;
      terminal.appendChild(response);
      terminal.scrollTop = terminal.scrollHeight;

      handleCommand(command);
    }
  });
}


function handleCommand(cmd) {
  switch (cmd.trim().toLowerCase()) {
    case "start":
      terminal.innerHTML += "\nLaunching game...\n";
      loadGameUI();
      break;

    case "options":
       SettingsManager.enter();
       break;

       case "exit":
        terminal.innerHTML += "\nShutting down...\n";
        setTimeout(() => {
          document.body.style.transition = "all 1.5s ease";
          document.body.style.opacity = "0";
          
          setTimeout(() => {
            document.body.innerHTML = `
              <style>
                body {
                  background: #000;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                  margin: 0;
                  color: #333;
                  font-family: monospace;
                }
                .power-off {
                  font-size: 24px;
                  text-align: center;
                }
              </style>
            `;
            
            document.body.style.pointerEvents = "none";
            
            const oldBody = document.body.cloneNode(true);
            document.body.replaceWith(oldBody);
            
          }, 1500);
        }, 500);
        break;

    default:
      terminal.innerHTML += "\nUnknown command. Try: start, options, exit\n";
      addInputField();
  }

  terminal.scrollTop = terminal.scrollHeight;
}

document.addEventListener("keydown", (e) => {
  if (SettingsManager.isActive()) {
    if (SettingsManager.handleKey(e.key)) {
      e.preventDefault();
      return;
    }
  }
});


let gameLoopId = null;
let gameOver = false;


function loadGameUI() {
  const existing = document.getElementById("game-ui");
  if (existing) existing.remove();

  const gameContainer = document.createElement("div");
  gameContainer.id = "game-ui";
  gameContainer.innerHTML = `
    <div class="game-box">
      <canvas id="gameCanvas" width="400" height="300"></canvas>
      <p>[W] ↑  [S] ↓ — Player 1 | [↑] [↓] — Player 2</p>
      <p>Type "Q" to EXIT.</p>
    </div>
  `;
  terminal.appendChild(gameContainer);

  initPongGame();
  terminal.scrollTop = terminal.scrollHeight;
}

function initPongGame() {
  if (gameLoopId) {
    cancelAnimationFrame(gameLoopId);
    gameLoopId = null;
  }

  gameOver = false;

  const maxScore = 5;
  const canvas = document.getElementById("gameCanvas");
  canvas.style.display = "block";
  const ctx = canvas.getContext("2d");

  const paddleWidth = 10;
  const paddleHeight = 60;
  let leftY = canvas.height / 2 - paddleHeight / 2;
  let rightY = canvas.height / 2 - paddleHeight / 2;

  const paddle = {
    baseSpeed: 3,
    boostSpeed: 6,
  };

  const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 4,
    dx: 3,
    dy: 3,
    speed: 3,
    maxSpeed: 6,
    history: [],
  };

  let leftScore = 0;
  let rightScore = 0;

  const keys = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false,
  };

  function onKeyDown(e) {
    if (e.key in keys) {
      keys[e.key] = true;
      e.preventDefault(); 
    }
  
    if (e.key === "q") {
      endGame("quit");
    }
  }


  function onKeyUp(e) {
    if (e.key in keys) keys[e.key] = false;
  }

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);

  function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  }

  function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawText(text, x, y) {
    ctx.fillStyle = "white";
    ctx.font = "20px monospace";
    ctx.fillText(text, x, y);
  }

  function drawNet() {
    ctx.fillStyle = "white";
    for (let i = 0; i < canvas.height; i += 15) {
      ctx.fillRect(canvas.width / 2 - 1, i, 2, 10);
    }
  }

  function resetBall() {
    if (leftScore >= maxScore) {
      endGame("win1");
      return;
    } else if (rightScore >= maxScore) {
      endGame("win2");
      return;
    }

    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 3.5;
    const angle = (Math.random() * Math.PI / 2 - Math.PI / 4); // -45°..+45°
    const direction = Math.random() < 0.5 ? 1 : -1;
    ball.dx = Math.cos(angle) * ball.speed * direction;
    ball.dy = Math.sin(angle) * ball.speed;
  }

  function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
      ball.dy *= -1;
      if (window.GameSounds && window.GameSounds.wallHit) {
        window.GameSounds.wallHit.currentTime = 0;
        window.GameSounds.wallHit.play().catch(() => {});
     }
    }

    if (
      checkPaddleCollision(0, leftY, 'left') ||
      checkPaddleCollision(canvas.width - paddleWidth, rightY, 'right')
    ) return;

    if (ball.x < 0) {
      if (window.GameSounds && window.GameSounds.scoreSound) {
        window.GameSounds.scoreSound.currentTime = 0;
        window.GameSounds.scoreSound.play().catch(() => {});
      }
      rightScore++;
      rightScore >= maxScore ? endGame("win2") : resetBall();
    } else if (ball.x > canvas.width) {
      if (window.GameSounds && window.GameSounds.scoreSound) {
        window.GameSounds.scoreSound.currentTime = 0;
        window.GameSounds.scoreSound.play().catch(() => {});
     }
      leftScore++;
      leftScore >= maxScore ? endGame("win1") : resetBall();
    }
  }

  function checkPaddleCollision(px, py, side) {
    const isLeft = side === 'left';
    if (
      ball.x - ball.radius < px + paddleWidth &&
      ball.x + ball.radius > px &&
      ball.y > py &&
      ball.y < py + paddleHeight
    ) {
      try {
        if (window.GameSounds?.paddleHit) {
            window.GameSounds.paddleHit.currentTime = 0;
            window.GameSounds.paddleHit.playbackRate = 0.8 + Math.random() * 0.4;
            window.GameSounds.paddleHit.play().catch(() => {});
        }
    } catch (e) {
        console.error("Sound error:", e);
    }
      const paddleCenter = py + paddleHeight / 2;
      const offset = (ball.y - paddleCenter) / (paddleHeight / 2);
      let angle = offset * (Math.PI / 4);
      const randomAngleOffset = (Math.random() - 0.5) * (Math.PI / 12);
      angle += randomAngleOffset;

      const direction = isLeft ? 1 : -1;
      const speed = Math.min(ball.speed * 1.05, ball.maxSpeed);
      ball.speed = speed;

      ball.dx = speed * Math.cos(angle) * direction;
      ball.dy = speed * Math.sin(angle);
    }
  }

  function movePaddles() {
    let lSpeed = keys.w || keys.s ? paddle.boostSpeed : paddle.baseSpeed;
    let rSpeed = keys.ArrowUp || keys.ArrowDown ? paddle.boostSpeed : paddle.baseSpeed;

    if (keys.w) leftY -= lSpeed;
    if (keys.s) leftY += lSpeed;
    if (keys.ArrowUp) rightY -= rSpeed;
    if (keys.ArrowDown) rightY += rSpeed;

    leftY = Math.max(0, Math.min(canvas.height - paddleHeight, leftY));
    rightY = Math.max(0, Math.min(canvas.height - paddleHeight, rightY));
  }

  function draw() {
    ctx.fillStyle = "rgba(0,0,0,0.9)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawNet();
    drawText(leftScore, canvas.width / 4, 30);
    drawText(rightScore, (canvas.width * 3) / 4, 30);

    drawRect(0, leftY, paddleWidth, paddleHeight, "white");
    drawRect(canvas.width - paddleWidth, rightY, paddleWidth, paddleHeight, "white");

    for (let i = 0; i < ball.history.length; i++) {
      const alpha = i / ball.history.length;
      drawCircle(ball.history[i].x, ball.history[i].y, ball.radius, `rgba(255,255,255,${alpha})`);
    }

    drawCircle(ball.x, ball.y, ball.radius, "white");
  }

  function endGame(reason) {
    if (gameOver) return;
    gameOver = true;

    cancelAnimationFrame(gameLoopId);
    gameLoopId = null;

    document.removeEventListener("keydown", onKeyDown);
    document.removeEventListener("keyup", onKeyUp);

    canvas.style.display = "none";

    if (reason === "win1") {
      terminal.innerHTML += `\n🏆 Player 1 wins!\n\nType 'start' to play again or 'exit' to leave.\n`;
    } else if (reason === "win2") {
      terminal.innerHTML += `\n🏆 Player 2 wins!\n\nType 'start' to play again or 'exit' to leave.\n`;
    } else if (reason === "quit") {
      terminal.innerHTML += `\n❌ You exited the game.\nType 'start' to play again.\n`;
    }

    addInputField();
  }

  function loop() {
    if (gameOver) return;
    movePaddles();
    moveBall();
    draw();
    gameLoopId = requestAnimationFrame(loop);
  }

  loop();
}

