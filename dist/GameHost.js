"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const Game_1 = require("./Game");
const GamePlayer_1 = require("./GamePlayer");
class GameHost {
    constructor() {
        this.isDebug = false;
        this.runningGames = {};
        this.gameTimerTimeOut = 25 * 1000;
        if (process.env.NODE_ENV !== 'production') {
            this.isDebug = true;
        }
        this.gameTimer = setTimeout(() => this.GameCheckLoop(), this.gameTimerTimeOut);
        this.log(`init GameHost`);
    }
    log(message) {
        if (this.isDebug)
            console.log("[GameHost]", "     ", message);
    }
    GameFindOrCreate(player, capacity) {
        const gamePlayer = new GamePlayer_1.default(player);
        let game;
        let findingGame = _.find(this.runningGames, function (g) {
            return g.gameCapacity === capacity && !g.IsFull() && !g.IsPlayerInGame(gamePlayer);
        });
        if (findingGame)
            game = findingGame;
        else
            game = this.GameCreate(capacity);
        game.PlayerAdd(gamePlayer);
    }
    GameLeft(player) {
        const gamePlayer = new GamePlayer_1.default(player);
        const game = this.runningGames[player.gameId];
        if (game !== null)
            game.PlayerRemove(gamePlayer);
    }
    GameCreate(capacity) {
        const game = new Game_1.default();
        game.AttemptSetup(capacity);
        this.runningGames[game.gameId] = game;
        return game;
    }
    GameCheckLoop() {
        clearTimeout(this.gameTimer);
        const emptyList = _.filter(this.runningGames, function (g) {
            return g.IsEmpty();
        });
        emptyList.forEach((game) => {
            game.GameClosed();
            delete this.runningGames[game.gameId];
        });
        const emptyCount = _.size(emptyList);
        const onlineCount = _.size(this.runningGames);
        this.log(`GameCheckLoop online: ${onlineCount} closed: ${emptyCount}`);
        this.gameTimer = setTimeout(() => this.GameCheckLoop(), this.gameTimerTimeOut);
    }
}
exports.default = GameHost;
