// 현재 블록
const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
// 다음 블록
const canvasNext = document.getElementById('next');
const ctxNext = canvasNext.getContext('2d');

// 캔버스 크기 계산
// ctx.canvas.width = COLS * BLOCK_SIZE;
// ctx.canvas.height = ROWS * BLOCK_SIZE;

// 블록 크기 변경: 매번 BLOCK_SIZE로 계산할 필요가 없이 블록의 크기를 1로 취급
// ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

let requestId;

let board = new Board(ctx, ctxNext);

initNext();

function initNext() {
  // Calculate size of canvas from constants.
  ctxNext.canvas.width = 4 * BLOCK_SIZE;
  ctxNext.canvas.height = 4 * BLOCK_SIZE;
  ctxNext.scale(BLOCK_SIZE, BLOCK_SIZE);
}

function play() {
  resetGame();
  time.start = performance.now();
  if (requestId) {
    cancelAnimationFrame(requestId);
  }
  
  animate();
}

moves = {
  [KEY.LEFT]: p => ({...p, x: p.x - 1}),
  [KEY.RIGHT]: p => ({...p, x: p.x + 1}),
  [KEY.DOWN]: p => ({...p, y: p.y + 1}),
  [KEY.SPACE]: p => ({...p, y: p.y + 1 }),
  [KEY.UP]: p => board.rotate(p),
}

time = { start: 0, elapsed: 0, level: 1000 };

function animate(now=0){
  time.elapsed = now - time.start;

  // 1초마다 아래로 한칸씩 움직이는 drop()메서드를 호출
  if(time.elapsed > time.level) {
    time.start = now;
    if (!board.drop()) {
      gameOver();
      return;
    }
  }  

  // 새로운 상태로 그리기 전에 보드를 지운다.
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); 

  // board에 piece 추가했으므로 piece 삭제
  board.draw();  

  // drop()메서드를 호출을 애니메이션으로 반복 처리
  requestId = requestAnimationFrame(animate);
}

document.addEventListener('keydown', event => {
  if (event.keyCode === KEY.P) {
    pause();
  }
  
  // 키입력에 따른 블럭 이동
  if(moves[event.keyCode]) {
    event.preventDefault();
    
    // 조각의 새 상태를 얻음
    let p = moves[event.keyCode](board.piece);
    
    // 스페이스 누를 경우 하드 드롭
    if (event.keyCode === KEY.SPACE) {
      while (board.valid(p)) {
        account.score += POINTS.HARD_DROP; // 하드 드롭시 점수 증가
        board.piece.move(p);   
        p = moves[KEY.DOWN](board.piece);
      }
      board.piece.hardDrop();
    } else if (board.valid(p)) {
      board.piece.move(p);
      if (event.keyCode === KEY.DOWN) {
        account.score += POINTS.SOFT_DROP; // 아래 방향키 눌러서 빨리 내리면 점수 증가
      }
    }
  }
});

// 점수 계산
let accountValues = {
  score: 0,
  lines: 0,
  level: 0,
}

function updateAccount(key, value) {
  let element = document.getElementById(key);
  if (element) {
    element.textContent = value;
  }
}

let account = new Proxy(accountValues, {
  set: (target, key, value) => {
    target[key] = value;
    updateAccount(key, value);
    return true;
  }
});

function resetGame() {
  account.score = 0;
  account.lines = 0;
  account.level = 0;
  board.reset(); // 보드판 초기화
  time = { start: 0, elapsed: 0, level: LEVEL[account.level] };
}

function gameOver() {
  cancelAnimationFrame(requestId);
  ctx.fillStyle = 'black';
  ctx.fillRect(1, 3, 8, 1.2);
  ctx.font = '1px Arial';
  ctx.fillStyle = 'red';
  ctx.fillText('GAME OVER', 1.8, 4);
}

function pause() {
  if (!requestId) {
    animate();
    return;
  }
  cancelAnimationFrame(requestId);
  requestId = null;
  
  ctx.fillStyle = 'black';
  ctx.fillRect(1, 3, 8, 1.2);
  ctx.font = '1px Arial';
  ctx.fillStyle = 'yellow';
  ctx.fillText('PAUSED', 3, 4);
}