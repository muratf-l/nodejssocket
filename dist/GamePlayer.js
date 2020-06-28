"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Enums_1 = require("./Enums");
class GamePlayer {
    constructor(_player) {
        this.gameUserStatus = Enums_1.UserOnlineStatus.Online;
        this.index = 0;
        this.player = null;
        this.player = _player;
    }
    getPlayerId() {
        return this.player.userInfo.token;
    }
    getPlayerName() {
        return this.player.userInfo.name;
    }
    getPlayerPicture() {
        return this.player.userInfo.picture;
    }
    getGameId() {
        return this.player.gameId;
    }
    setGameId(gameId) {
        this.player.gameId = gameId;
    }
    sendGameJoinMessage() {
        this.player.sendMessage({ "action": Enums_1.Action.GameJoin, "game": this.player.gameId });
    }
    sendGameLeaveMessage() {
        this.player.sendMessage({ "action": Enums_1.Action.GameLeave, "game": this.player.gameId });
    }
    sendMessage(msg) {
        this.player.sendMessage(msg);
    }
}
exports.default = GamePlayer;
