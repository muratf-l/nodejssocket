import * as _ from "lodash";
import Player from './Player';
import Game from './Game';
import GamePlayer from './GamePlayer';

export default class GameHost {
    private readonly isDebug: boolean = false;

    private readonly runningGames: any = {};

    private gameTimer: NodeJS.Timer;

    private gameTimerTimeOut: number = 25 * 1000;

    public constructor() {
        if (process.env.NODE_ENV !== 'production') {
            this.isDebug = true;
        }

        this.gameTimer = setTimeout(() => this.GameCheckLoop(), this.gameTimerTimeOut);
        this.log(`init GameHost`);
    }

    private log(message): void {
        if (this.isDebug)
            console.log("[GameHost]", "     ", message)
    }

    public GameFindOrCreate(player: Player, capacity: number): void {
        const gamePlayer: GamePlayer = new GamePlayer(player);

        let game: Game

        let findingGame = _.find(this.runningGames, function (g: Game) {
            return g.gameCapacity === capacity && !g.IsFull() && !g.IsPlayerInGame(gamePlayer);
        });

        if (findingGame)
            game = findingGame
        else
            game = this.GameCreate(capacity)

        game.PlayerAdd(gamePlayer)
    }

    public GameLeft(player: Player): void {

        const gamePlayer: GamePlayer = new GamePlayer(player);

        const game: Game = this.runningGames[player.gameId]

        if (game !== null)
            game.PlayerRemove(gamePlayer)
    }

    private GameCreate(capacity: number): Game {
        const game = new Game();

        game.AttemptSetup(capacity)

        this.runningGames[game.gameId] = game

        return game
    }

    private GameCheckLoop(): void {
        clearTimeout(this.gameTimer)

        const emptyList = _.filter(this.runningGames, function (g: Game) {
            return g.IsEmpty();
        });

        emptyList.forEach((game: Game) => {
            game.GameClosed()
            delete this.runningGames[game.gameId];
        });

        const emptyCount = _.size(emptyList)

        const onlineCount = _.size(this.runningGames)

        this.log(`GameCheckLoop online: ${onlineCount} closed: ${emptyCount}`)

        this.gameTimer = setTimeout(() => this.GameCheckLoop(), this.gameTimerTimeOut);
    }
}