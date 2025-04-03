import { WebSocketGateway, WebSocketServer, SubscribeMessage, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';


@WebSocketGateway({
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: '*',
        credentials: true
    },
    transports: ['websocket']
})
export class GameGateway {
    @WebSocketServer()
    server: Server;

    private rooms: Map<string, string[]> = new Map();

    @SubscribeMessage('start-game')
    handleStartGame(@ConnectedSocket() socket: Socket, @MessageBody() roomId: string) {
        console.log(`User started the game: ${socket.id} in room ${roomId}`);
        socket.join(roomId);
        this.rooms.set(roomId, [socket.id]);

        this.server.to(roomId).emit('game-started', {
            roomId,
            player1: socket.id
        });
    }

    @SubscribeMessage('join-game')
    handleJoinGame(@ConnectedSocket() socket: Socket, @MessageBody() roomId: string) {
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
        } else {
            socket.emit('room-full', 'This game room is already full');
        }
    }

    @SubscribeMessage('move')
    handleMove(
        @ConnectedSocket() socket: Socket,
        @MessageBody() moveData: { symbol: string; roomId: string; col: number; row: number }
    ) {
        console.log('Move received:', moveData);
        const { roomId } = moveData
        this.server.to(roomId).emit('board-update', moveData)
    }

    @SubscribeMessage('game-over')
    handleGameOver(
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: { roomId: string; winningMsg: string }
    ) {
        const { roomId, winningMsg } = data;
        this.server.to(roomId).emit('game-over', winningMsg);
    }
}