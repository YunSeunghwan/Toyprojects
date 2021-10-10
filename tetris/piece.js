class Piece {
  x;
  y;
  color;
  shape;
  ctx;

  constructor(ctx) {
    this.ctx = ctx;
    this.spawn();
  }

  randomizeTetrominoType(noOfTypes) {
    return Math.floor(Math.random() * noOfTypes + 1);
  }

  spawn() {
    // this.color = 'blue';
    // this.shape = [
    //   [2, 0, 0],
    //   [2, 2, 2],
    //   [0, 0, 0]
    // ];

    // Play 버튼을 누를 때마다 다른 모양과 색상의 조각들 생성
    const typeId = this.randomizeTetrominoType(COLORS.length);
    this.shape = SHAPES[typeId];
    this.color = COLORS[typeId];

    // 시작 위치
    this.x = 0;
    this.y = 0;
  }

  draw() {
    this.ctx.fillStyle=this.color;
    // shape의 셀을 순회하면서 0보다 크면 색을 칠한다.
    this.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if(value > 0) this.ctx.fillRect(this.x + x, this.y + y, 1, 1);
      });
    });
  }
	
    // 키보드로 움직이기
  move(p) {
    this.x = p.x;
    this.y = p.y;
  }
}