const express = require('express')
const app = express()
app.use(express.static('public'))
app.use(express.json())

class player_t {
    constructor(port) {
        this.port = port
        this.piece = {}
        app.listen(port)
    }
}

class piece_t {
    constructor() {
        this.x
        this.y
    }
    move(x, y) {
        this.x = x
        this.y = y
    }
}

app.get(`/:port`, (request, response) => { // server sends some data
    const port = request.params.port

    if (port == white.port || port == black.port) {
        var color = port == white.port ? 'white' : 'black'
        response.json({ message: `Server: Hello ${port}, you have the ${color} pieces.`, pieces: color })
        //console.log(`Port ${port} has connected.`)
    }

    if (port == 'turn') {
        response.json({
            message: `It is ${portOnTurn}'s turn`,
            onTurn: portOnTurn
        })
    }

    if (port == 'pos') {
        response.json({ white, black })
    }
})

app.post('/turn', (request, response) => {
    const message = request.body.message
    const port = request.body.port

    //console.log(message)
    portOnTurn = port == white.port ? black.port : white.port
})

app.post('/pos', (request, response) => {
    const data = request.body
    if (data.port == white.port) {
        white.piece[data.id] = {
            x: data.pos.x,
            y: data.pos.y
        }
    }
    else {
        black.piece[data.id] = {
            x: data.pos.x,
            y: data.pos.y
        }
    }
})

var white = new player_t(3000)
var black = new player_t(4000)
var portOnTurn = white.port // which port is on turn ?

pieces_enum = ['pawn0', 'pawn1', 'pawn2', 'pawn3', 'pawn4', 'pawn5', 'pawn6', 'pawn7', 'rook0', 'knight0', 'bishop0', 'king', 'queen', 'knight1', 'bishop1', 'rook1']

pieces_enum.forEach(piece => {
    white.piece[piece] = new piece_t(piece_t)
    black.piece[piece] = new piece_t(piece_t)
})

for (var i = 0; i < 8; i++)
    white.piece[`pawn${i}`].move(i, 1)
white.piece['rook0'].move(0, 0)
white.piece['rook1'].move(7, 0)
white.piece['knight0'].move(1, 0)
white.piece['knight1'].move(6, 0)
white.piece['bishop0'].move(2, 0)
white.piece['bishop1'].move(5, 0)
white.piece['king'].move(4, 0)
white.piece['queen'].move(3, 0)

for (var i = 0; i < 8; i++)
    black.piece[`pawn${i}`].move(i, 6)
black.piece['rook0'].move(0, 7)
black.piece['rook1'].move(7, 7)
black.piece['knight0'].move(1, 7)
black.piece['knight1'].move(6, 7)
black.piece['bishop0'].move(2, 7)
black.piece['bishop1'].move(5, 7)
black.piece['king'].move(4, 7)
black.piece['queen'].move(3, 7)