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
	
  
}

let board = new Board();

function play() {
  board.reset(); // 보드판 초기화
  console.table(board.grid);

  let piece = new Piece(ctx);
  piece.draw(); // 테트로미노 그리기

  board.piece=piece;
}