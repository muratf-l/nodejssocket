import * as utils from './utils';
import * as _ from "lodash";
import GamePlayer from './GamePlayer';
import GamePlayerInfo from './models/GamePlayerInfo';
import {Action, GameStatus, UserOnlineStatus} from "./Enums";

export default abstract class GameBase {

    public gameStatus: GameStatus = GameStatus.Waiting;

    private readonly isDebug: boolean = false;

    private readonly gamePlayers: any = {};

    public readonly gameId: string;

    public gameCapacity: number = 0;

    public constructor() {
        if (process.env.NODE_ENV !== 'production') {
            this.isDebug = true;
        }

        this.gameId = utils.getId();
    }

    private log(message): void {
        if (this.isDebug)
            console.log("[GameBase]", "     ", this.gameId, message)
    }

    public GameStarted(): void {

    }

    public GameClosed(): void {

    }

    public PlayerAdd(gamePlayer: GamePlayer): void {
        if (this.gameStatus !== GameStatus.Waiting) return;
        if (this.IsPlayerInGame(gamePlayer)) return;

        this.gamePlayers[gamePlayer.getPlayerId()] = gamePlayer;

        gamePlayer.index = _.size(this.gamePlayers)
        gamePlayer.setGameId(this.gameId)
        gamePlayer.sendGameJoinMessage()

        this.PlayerJoined(gamePlayer)
        this.sendGamePlayerList()

        if (this.IsFull()) {
            this.gameStatus = GameStatus.Running;
            this.GameStarted()
        }
    }

    public PlayerJoined(gamePlayer: GamePlayer): void {

    }

    public PlayerRemove(gamePlayer: GamePlayer): void {

        const gmPl: GamePlayer = this.gamePlayers[gamePlayer.getPlayerId()]

        if (gmPl === null) return

        gmPl.sendGameLeaveMessage()
        gmPl.setGameId(null)
        gmPl.gameUserStatus = UserOnlineStatus.Offline

        this.PlayerLeft(gamePlayer)
        this.sendGamePlayerList()

        const countOnline = _.size(_.find(this.gamePlayers, function (p) {
            return p.gameUserStatus == UserOnlineStatus.Online;
        }));

        if (countOnline <= 1) {
            this.gameStatus = GameStatus.Closed;
            this.GameClosed();
        }
    }

    public PlayerLeft(gamePlayer: GamePlayer): void {

    }

    public IsEmpty(): boolean {
        if (this.gameStatus == GameStatus.Closed)
            return true;

        const count = _.find(this.gamePlayers, function (p) {
            return p.gameUserStatus == UserOnlineStatus.Online;
        });

        return _.size(count) <= 0;
    }

    public IsFull(): boolean {
        if (this.gameStatus == GameStatus.Closed)
            return true;

        return _.size(this.gamePlayers) >= this.gameCapacity;
    }

    public IsPlayerInGame(gamePlayer: GamePlayer): boolean {
        return _.find(this.gamePlayers, function (p) {
            return p.getPlayerId() === gamePlayer.getPlayerId();
        });
    }

    public AttemptSetup(capacity: number): void {
        this.gameCapacity = capacity;
    }

    private sendGamePlayerList() {
        let playerList: Array<GamePlayerInfo> = new Array<GamePlayerInfo>()

        _.forEach(this.gamePlayers, function (el, index, arr) {
            const playerInfo: GamePlayerInfo = new GamePlayerInfo()
            playerInfo.index = el.index;
            playerInfo.name = el.getPlayerName();
            playerInfo.picture = el.getPlayerPicture();
            playerInfo.status = el.gameUserStatus;

            playerList.push(playerInfo)
        })

        this.BroadcastMessage({"action": Action.GameUserList, "game": this.gameId, "data": playerList})
    }

    private BroadcastMessage(msg: object): void {
        _.forEach(this.gamePlayers, function (el, index, arr) {
            if (el.gameUserStatus == UserOnlineStatus.Online)
                el.sendMessage(msg)
        })
    }
}
