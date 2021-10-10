class Board {
  
  // Reset the board when we start a new game.
  reset() {
    this.grid = this.getEmptyBoard();
  }
  
  // Get matrix filled with zeros.
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
  
  rotate(p){
    // 불변성을 위해 JSON으로 복사
    let clone = JSON.parse(JSON.stringify(p));

    // 행과 열을 서로 바꾸는 반사행렬 처리
    for (let y = 0; y < p.shape.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [p.shape[x][y], p.shape[y][x]] = 
        [p.shape[y][x], p.shape[x][y]];
      }
    }

    // 열 순서대로 뒤집는다.
    p.shape.forEach(row => row.reverse());

    return clone;
  }	
	
  drop() {
    let p = moves[KEY.DOWN](this.piece);
    if (this.valid(p)) {
      this.piece.move(p);
    }
    return true;
  }
}

let board = new Board();

function play() {
  board.reset(); // 보드판 초기화
  console.table(board.grid);

  let piece = new Piece(ctx);
  piece.draw(); // 테트로미노 그리기

  board.piece=piece;
}