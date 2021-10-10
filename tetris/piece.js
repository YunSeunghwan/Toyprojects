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

  spawn() {
    this.color = 'blue';
    this.shape = [
      [2, 0, 0],
      [2, 2, 2],
      [0, 0, 0]
    ];
    // 시작 위치
    this.x = 3;
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
