import {environment} from '../../environments/environment';

export class Client {
  private mConnected: boolean;
  private mInGame: boolean;
  private websocket: WebSocket;
  private eventHandlers: Map<number, (args: Map<string, any>) => void>;
  private connectedHandlers: Map<number, () => void>;
  private disconnectedHandlers: Map<number, () => void>;

  public readonly url: string;

  public constructor(url: string) {
    this.url = url;
    this.mConnected = false;
    this.mInGame = false;
    this.eventHandlers = new Map<number, (args: Map<string, any>) => void>();
    this.connectedHandlers = new Map<number, () => void>();
    this.disconnectedHandlers = new Map<number, () => void>();
  }

  public get connected(): boolean {
    return this.mConnected;
  }

  public get inGame(): boolean {
    return this.mInGame;
  }

  public set inGame(value: boolean) {
    this.mInGame = this.mConnected && value;
  }

  public registerOnEvent(code: number, handler: (args: Map<string, any>) => void): void {
    this.eventHandlers.set(code, handler);
  }

  public unregisterOnEvent(code: number): boolean {
    return this.eventHandlers.delete(code);
  }

  public registerOnConnected(id: number, handler: () => void): void {
    this.connectedHandlers.set(id, handler);
  }

  public unregisterOnConnected(id: number): boolean {
    return this.connectedHandlers.delete(id);
  }

  public registerOnDisconnected(id: number, handler: () => void): void {
    this.disconnectedHandlers.set(id, handler);
  }

  public unregisterOnDisconnected(id: number): boolean {
    return this.disconnectedHandlers.delete(id);
  }

  public connect(): void {
    this.websocket = new WebSocket(this.url);
    this.websocket.onopen = () => {
      this.mConnected = true;
      console.log(`connected to ${this.url}`);
      this.connectedHandlers.forEach(handler => {
        handler();
      });
    };
    this.websocket.onclose = (message) => {
      this.mConnected = false;
      console.log(`disconnected from ${this.url}`);
      this.disconnectedHandlers.forEach(handler => {
        handler();
      });
    };
    this.websocket.onerror = (error) => {
      console.error(error);
    };
    this.websocket.onmessage = (message) => {
      const data = message.data;
      if (typeof data === 'string') {
        if (!environment.production) {
          console.log(`received message: ${data}`);
        }
        const event = JSON.parse(data);
        if ('code' in event && typeof event.code === 'number'
          && 'args' in event && typeof event.args === 'object') {
          const handler = this.eventHandlers.get(event.code);
          if (handler) {
            handler(new Map<string, any>(Object.entries(event.args)));
          }
        }
      }
    };
  }

  public send(code: number, args: object): void {
    const event = JSON.stringify({
      code,
      args
    });
    if (!environment.production) {
      console.log(`send message: ${event}`);
    }
    this.websocket.send(event);
  }

  public disconnect(): void {
    this.websocket.close();
  }
}
