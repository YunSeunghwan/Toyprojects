class Piece {
  x;
  y;
  color;
  shape;
  ctx;
  typeId; // 조각타입도 인스턴스마다 할당(this.typeId으로 접근)
  hardDropped;

  constructor(ctx) {
    this.ctx = ctx;
    this.spawn();
  }

  // Play 버튼을 누를 때마다 다른 모양과 색상의 조각들 생성
  spawn() {
    this.typeId = this.randomizeTetrominoType(COLORS.length -1);
    this.shape = SHAPES[this.typeId];
    this.color = COLORS[this.typeId];
    this.x = 0;
    this.y = 0;
    this.hardDropped = false;
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
    if(!this.hardDropped){
      this.x = p.x;
      this.y = p.y;
    }
    this.shape = p.shape;
  }
  
  // 한 조각을 선택하기 위해 조각들의 인덱스를 랜덤화
  randomizeTetrominoType(noOfTypes) {
    return Math.floor(Math.random() * noOfTypes + 1);
  }

  // 시작 위치
  setStartingPosition() {
    this.x = this.typeId === 4 ? 4 : 3;
  }

  hardDrop(){
    this.hardDropped = true;
  }
}