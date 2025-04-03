import { Module } from '@nestjs/common';
import { GameGateway } from './tic-tac-toe.gateway';

@Module({
  imports: [GameGateway],
  controllers: [],
  providers: [],
})
export class AppModule { }
