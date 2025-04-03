"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let GameGateway = class GameGateway {
    server;
    rooms = new Map();
    handleStartGame(socket, roomId) {
        console.log(`User started the game: ${socket.id} in room ${roomId}`);
        socket.join(roomId);
        this.rooms.set(roomId, [socket.id]);
        this.server.to(roomId).emit('game-started', {
            roomId,
            player1: socket.id
        });
    }
    handleJoinGame(socket, roomId) {
        const roomPlayers = this.rooms.get(roomId) || [];
        if (roomPlayers.length < 2) {
            console.log(`User joined the game: ${socket.id} in room ${roomId}`);
            socket.join(roomId);
            roomPlayers.push(socket.id);
            this.rooms.set(roomId, roomPlayers);
            this.server.to(roomId).emit('player-2-joined', {
                player2: socket.id,
                roomId
            });
        }
        else {
            socket.emit('room-full', 'This game room is already full');
        }
    }
    handleMove(socket, moveData) {
        console.log('Move received:', moveData);
        const { roomId } = moveData;
        this.server.to(roomId).emit('board-update', moveData);
    }
    handleGameOver(socket, data) {
        const { roomId, winningMsg } = data;
        this.server.to(roomId).emit('game-over', winningMsg);
    }
};
exports.GameGateway = GameGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GameGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('start-game'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleStartGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-game'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleJoinGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('move'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleMove", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('game-over'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleGameOver", null);
exports.GameGateway = GameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
            allowedHeaders: '*',
            credentials: true
        },
        transports: ['websocket']
    })
], GameGateway);
//# sourceMappingURL=tic-tac-toe.gateway.js.map