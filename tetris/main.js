const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

// Calculate size of canvas from constants.
ctx.canvas.width = COLS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;

// Scale blcoks
ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

let board = new Board();

function play() {  
  board.reset();  
  console.table(board.grid);  
}

moves = {
  [KEY.UP]: p => board.rotate(p, ROTATION.RIGHT),
  [KEY.SPACE]: p => ({ ...p, y: p.y + 1 }),
  [KEY.LEFT]: p => ({...p, x: p.x - 1}),
  [KEY.RIGHT]: p => ({...p, x: p.x + 1}),
  [KEY.DOWN]: p => ({...p, y: p.y + 1}),
}

document.addEventListener('keydown', event => {
  if(moves[event.keyCode]) {
    event.preventDefault();

    // 조각의 새 상태를 얻음
    let p = moves[event.keyCode](board.piece);
	
	  // 스페이스 누를 경우 하드 드롭
    if (event.keyCode === KEY.SPACE) {
      while (board.valid(p)) {
        board.piece.move(p);   
        p = moves[KEY.DOWN](board.piece);
      }
    }
    
	if(board.valid(p)) {
      // 이동 가능한 조각을 이동
      board.piece.move(p);
      // 그리기 전에 이전 좌표를 삭제
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      // 테트로미노 그림
      board.piece.draw();
    }
  }
});

time = { start: 0, elapsed: 0, level: 1000 };

function animate(now=0){
  time.elapsed = now - time.start;

  // 1초마다 아래로 한칸씩 움직이는 drop()메서드를 호출
  if(time.elapsed > time.level) {
    time.start = now;
    board.drop();
  }  

  // 새로운 상태로 그리기 전에 보드를 지운다.
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); 

  board.piece.draw();  

  // drop()메서드를 호출을 애니메이션으로 반복 처리
  requestId = requestAnimationFrame(animate);
}