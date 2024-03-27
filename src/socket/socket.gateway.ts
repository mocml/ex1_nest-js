import { OnModuleInit } from "@nestjs/common";
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from "@nestjs/websockets";
import { from, Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { Server } from "socket.io";
// @WebSocketGateway(8080) //wssocket
@WebSocketGateway()
export class SocketGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('Connected');
      console.log(socket.rooms);
      socket.join('room-vanhv-1');
      console.log(socket);
    })
  }

  @SubscribeMessage('sent')//just name define
  onSent(@MessageBody() data?: any) {
    this.server.emit('sent-ms', data);
  }

  @SubscribeMessage('receive')
  async receive(@MessageBody() data: number) {
    this.server.emit('receive-ms', 'data receive')
  }
  
}