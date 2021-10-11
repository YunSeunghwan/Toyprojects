class Board {
  grid;    // 보드 그리드
  piece;   // 현재 조각 객체
  next;    // 다음 조각 객체
  ctx;     // 현재 조각의 캔버스
  ctxNext; // 다음 조각의 캔버스
  requestId;
  time;

  constructor(ctx, ctxNext) {
    this.ctx = ctx;
    this.ctxNext = ctxNext;
    this.init();
  }

  init() {
    // 캔버스 크기 계산
    this.ctx.canvas.width = COLS * BLOCK_SIZE;
    this.ctx.canvas.height = ROWS * BLOCK_SIZE;

    // 블록 크기 변경: 매번 BLOCK_SIZE로 계산할 필요가 없이 블록의 크기를 1로 취급
    this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
  }

  // 게임 초기화
  reset() {
    // 보드 초기화
    this.grid = this.getEmptyBoard();
    // 새로 조각 생성
    this.piece = new Piece(this.ctx);
    this.piece.setStartingPosition();
    this.getNewPiece();
  }
 
  // 행(20)만큼 length를 가진 객체를 배열로 만들껀데 열(10)을 0으로 배열로 만들어라
  getEmptyBoard() {
    return Array.from(
      {length: ROWS}, () => Array(COLS).fill(0)
    );
  }

  insideWalls(x) {
    return x >= 0 && x < COLS;
  }

  aboveFloor(y) {
    return y <= ROWS;
  }

  notOccupied(x, y) {
    return this.grid[y] && this.grid[y][x] === 0;
  }

  valid(p) {
    if(p) {
      // 조각의 모든 블록 좌표를 계산하고 유효한 위치인지 확인한다
      return p.shape.every((row, dy) => {
        return row.every((value, dx) => {
          let x = p.x + dx;
          let y = p.y + dy;
          return (
            value === 0 ||
            (this.insideWalls(x) && this.aboveFloor(y) && this.notOccupied(x, y))
          );
        });
      });
    }
  }

  rotate(piece){
    // 불변성을 위해 JSON으로 복사
    let p = JSON.parse(JSON.stringify(piece));
    
    // 행과 열을 서로 바꾸는 반사행렬 처리
    for (let y = 0; y < p.shape.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [p.shape[x][y], p.shape[y][x]] = 
        [p.shape[y][x], p.shape[x][y]];
      }
    }
    
    // 열 순서대로 뒤집는다.
    p.shape.forEach(row => row.reverse());

    return p;
  }

  drop() {
    let p = moves[KEY.DOWN](this.piece);
    if (this.valid(p)) {
      this.piece.move(p);
    } else {
      // 유효한 공간이 아니면 못움직이게 고정
      this.freeze();
      // 한 라인이 꽉차면 블록 삭제
      this.clearLines();
      if (this.piece.y === 0) {
        // Game over
        return false;
      }
      // 끝까지 내려오면 새로운 조각 생성
      this.piece = this.next;
      this.piece.ctx = this.ctx;
      this.piece.setStartingPosition();
      this.getNewPiece();
    }
    return true;
  }

  freeze() {
    this.piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.grid[y + this.piece.y][x + this.piece.x] = value;
        }
      });
    });
  }

  drawBoard() {
    this.grid.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.ctx.fillStyle = COLORS[value];
          this.ctx.fillRect(x, y, 1, 1);
        }
      });
    });
  }

  draw() {
    this.piece.draw(); // 조각을 칠해서 테트로미노로 만듬
    this.drawBoard();  // 테트로미노 색으로 칠해서 화면을 그림
  }

  // 다음 조각 생성
  getNewPiece() {
    this.next = new Piece(this.ctxNext);
    this.ctxNext.clearRect(
      0,
      0, 
      this.ctxNext.canvas.width, 
      this.ctxNext.canvas.height
    );
    this.next.draw();
  }

  clearLines() {
    let lines = 0; // 지운 라인 수

    this.grid.forEach((row, y) => {
      // 모든 값이 0보다 큰지 비교한다.
      if (row.every(value => value > 0)) {
        lines++;

        // 행을 삭제한다.
        this.grid.splice(y, 1);
        
        // 맨 위에 0으로 채워진 행을 추가한다.
        this.grid.unshift(Array(COLS).fill(0));
      } 
    });

    if (lines > 0) {    
      // 지워진 라인들이 있다면 점수를 추가
      account.score += this.getLineClearPoints(lines);  
      account.lines += lines;

      // 다음 레벨을 위한 라인 수에 달성했다면
      if (account.lines >= LINES_PER_LEVEL) {
        account.level++;  
        
        // 다음 레벨을 작동하기 위해 라인을 지운다.
        account.lines -= LINES_PER_LEVEL;

        // 게임 속도를 높인다.
        time.level = LEVEL[account.level];
      }
    }
  }

  // 지운 라인 갯수당 점수 제공
  getLineClearPoints(lines) {  
    let score = 
      lines === 1 ? POINTS.SINGLE :
      lines === 2 ? POINTS.DOUBLE :  
      lines === 3 ? POINTS.TRIPLE :     
      lines === 4 ? POINTS.TETRIS : 
      0;
    // 레벨에 따라 점수 차등 적용
    return (account.level + 1) * score;
  }
}