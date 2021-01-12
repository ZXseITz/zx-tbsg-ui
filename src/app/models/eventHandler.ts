import {GameComponent} from '../views/game/game.component';

export interface EventHandler {
  invoke(parent: GameComponent, code: number, args: any): void;
}
