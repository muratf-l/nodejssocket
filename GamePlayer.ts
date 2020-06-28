import Player from "./Player";
import {Action, UserOnlineStatus} from './Enums'


export default class GamePlayer {
    public gameUserStatus: UserOnlineStatus = UserOnlineStatus.Online;

    public index: number = 0;

    private readonly player: Player = null;

    constructor(_player) {
        this.player = _player;
    }

    public getPlayerId(): string {
        return this.player.userInfo.token;
    }

    public getPlayerName(): string {
        return this.player.userInfo.name;
    }

    public getPlayerPicture(): string {
        return this.player.userInfo.picture;
    }

    public getGameId(): string {
        return this.player.gameId;
    }

    public setGameId(gameId: string): void {
        this.player.gameId = gameId
    }

    public sendGameJoinMessage(): void {
        this.player.sendMessage({"action": Action.GameJoin, "game": this.player.gameId});
    }

    public sendGameLeaveMessage(): void {
        this.player.sendMessage({"action": Action.GameLeave, "game": this.player.gameId});
    }

    public sendMessage(msg: object): void {
        this.player.sendMessage(msg);
    }
}