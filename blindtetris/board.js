const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
class Board{
	grid;
	ctx;

	constructor(ctx){
		this.ctx = ctx;
		this.init()
	}

	init(){
		this.ctx.canvas.width = COLS * BLOCK_SIZE
		this.ctx.canvas.height = ROWS * BLOCK_SIZE
	}
}
let board = new Board(ctx)