const square = new Array(8).fill().map(() => new Array(8).fill());
const board = document.getElementById('board')
const squareWidth = board.clientWidth / 8
var mouseX, mouseY

addEventListener('mousemove', (event) => {
    mouseX = event.clientX - board.offsetLeft;
    mouseY = event.clientY - board.offsetTop;
})

for (var i = 7; i >= 0; i--) {
    for (var j = 0; j < 8; j++) {
        square[j][i] = document.createElement('div')
        square[j][i].classList.add('square')
        board.appendChild(square[j][i])
        square[j][i].style.background = (i + j) % 2 == 0 ? 'gray' : 'white';
    }
}

class piece_t {
    constructor(piece, color, me = false, id) {

        this.me = me
        this.id = id
        this.x, this.y // current pos
        this.firstMove = true // has the piece moved?
        this.down = -1; // setInterval helper
        this.drag = false // is this current piece draggable

        //#region create DOM elements 
        this.div = document.createElement('div')
        this.img = document.createElement('img')

        this.div.classList.add('div-piece')
        this.div.draggable = false
        this.div.style.zIndex = "1";
        this.div.appendChild(this.img)

        this.img.classList.add('img-piece')
        this.img.src = `/assets/${color}${piece}.png`
        //#endregion

        //#region move the piece 
        this.move = function ({ x, y }) {
            this.x = x;
            this.y = y;
            square[this.x][this.y].appendChild(this.div);
        }
        //#endregion

        //#region mousedown event 
        this.div.addEventListener('mousedown', () => {

            // if it isnt my turn return
            if (!myTurn) return

            // if it isnt my piece
            if (!this.me) return

            this.drag = true

            if (this.down == -1) { // if mouse is held down create interval

                this.down = setInterval(() => {

                    // if mouse is out of bounds
                    if (mouseX < 0 || mouseX > board.clientWidth || mouseY < 0 || mouseY > board.clientWidth) {
                        this.move({ x: this.x, y: this.y });
                        this.div.style.transform = `translate(0px, 0px)`
                        this.div.style.zIndex = "1"
                        this.drag = false
                        clearInterval(this.down)
                        return
                    }

                    // move piece to cursor
                    this.div.style.transform = `translate(${mouseX + board.offsetLeft - this.div.offsetLeft - squareWidth / 2}px, ${mouseY + board.offsetTop - this.div.offsetTop - squareWidth / 2}px)`
                    this.div.style.zIndex = '2'

                }, 20)

            }

        })
        //#endregion

        //#region mouseup event listener 
        document.addEventListener('mouseup', async () => {

            // clear the interval
            if (this.down != -1) {
                clearInterval(this.down)
                this.down = -1
            }

            // if the piece is released
            if (this.drag) {

                // user input x and y
                var x = Math.floor(mouseX / board.clientWidth * 8)
                var y = 7 - Math.floor(mouseY / board.clientWidth * 8)

                // if x or y are different
                if (x != this.x || y != this.y) {
                    this.firstMove = false

                    // if the square is occupied return
                    if (square[x][y].children.length) {
                        this.div.style.transform = `translate(0px, 0px)`
                        this.div.style.zIndex = "1"

                        this.drag = false
                        return
                    }

                    this.move({ x: x, y: y })

                    myTurn = false
                    await endTurn()

                    // reset the position 
                    this.div.style.transform = `translate(0px, 0px)`
                    this.div.style.zIndex = "1"

                    if(color == 'white') {
                        const data = {
                            port: port,
                            id: this.id,
                            pos: { x: x, y: y }
                        }
                        await post(data, '/pos')
                    }
                    else {
                        const data = {
                            port: port,
                            id: this.id,
                            pos: { x: 7 - x, y: 7 - y }
                        }
                        await post(data, '/pos')
                    }

                }

                // reset the position 
                this.div.style.transform = `translate(0px, 0px)`
                this.div.style.zIndex = "1"

                this.drag = false
            }
        })
        //#endregion

    }
}

pieces_enum = ['pawn0', 'pawn1', 'pawn2', 'pawn3', 'pawn4', 'pawn5', 'pawn6', 'pawn7', 'rook0', 'knight0', 'bishop0', 'king', 'queen', 'knight1', 'bishop1', 'rook1']
var me = {}, opp = {}

async function init() {
    pieces_enum.forEach(piece => {
        const type = piece.replace(/\d+/g, '');
        me[piece] = new piece_t(type, color, true, piece)
        opp[piece] = new piece_t(type, color == 'white' ? 'black' : 'white', false, piece)
    })
}

async function arange() {
    await get('/pos').then(response => { // what are the positions of the pieces ?  
        var white = response.white.piece
        const black = response.black.piece

        pieces_enum.forEach(piece => {
            if (color == 'white') {
                me[piece].move(white[piece])
                opp[piece].move(black[piece])
            }
            else {
                white[piece].x = 7 - white[piece].x
                black[piece].x = 7 - black[piece].x
                white[piece].y = 7 - white[piece].y
                black[piece].y = 7 - black[piece].y
                me[piece].move(black[piece])
                opp[piece].move(white[piece])
            }
        })
    })
}