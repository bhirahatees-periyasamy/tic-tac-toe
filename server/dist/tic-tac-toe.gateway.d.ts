import { Server, Socket } from 'socket.io';
export declare class GameGateway {
    server: Server;
    private rooms;
    handleStartGame(socket: Socket, roomId: string): void;
    handleJoinGame(socket: Socket, roomId: string): void;
    handleMove(socket: Socket, moveData: {
        symbol: string;
        roomId: string;
        col: number;
        row: number;
    }): void;
    handleGameOver(socket: Socket, data: {
        roomId: string;
        winningMsg: string;
    }): void;
}
