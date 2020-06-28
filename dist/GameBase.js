"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require("./utils");
const _ = require("lodash");
const GamePlayerInfo_1 = require("./models/GamePlayerInfo");
const Enums_1 = require("./Enums");
class GameBase {
    constructor() {
        this.gameStatus = Enums_1.GameStatus.Waiting;
        this.isDebug = false;
        this.gamePlayers = {};
        this.gameCapacity = 0;
        if (process.env.NODE_ENV !== 'production') {
            this.isDebug = true;
        }
        this.gameId = utils.getId();
    }
    log(message) {
        if (this.isDebug)
            console.log("[GameBase]", "     ", this.gameId, message);
    }
    GameStarted() {
    }
    GameClosed() {
    }
    PlayerAdd(gamePlayer) {
        if (this.gameStatus !== Enums_1.GameStatus.Waiting)
            return;
        if (this.IsPlayerInGame(gamePlayer))
            return;
        this.gamePlayers[gamePlayer.getPlayerId()] = gamePlayer;
        gamePlayer.index = _.size(this.gamePlayers);
        gamePlayer.setGameId(this.gameId);
        gamePlayer.sendGameJoinMessage();
        this.PlayerJoined(gamePlayer);
        this.sendGamePlayerList();
        if (this.IsFull()) {
            this.gameStatus = Enums_1.GameStatus.Running;
            this.GameStarted();
        }
    }
    PlayerJoined(gamePlayer) {
    }
    PlayerRemove(gamePlayer) {
        const gmPl = this.gamePlayers[gamePlayer.getPlayerId()];
        if (gmPl === null)
            return;
        gmPl.sendGameLeaveMessage();
        gmPl.setGameId(null);
        gmPl.gameUserStatus = Enums_1.UserOnlineStatus.Offline;
        this.PlayerLeft(gamePlayer);
        this.sendGamePlayerList();
        const countOnline = _.size(_.find(this.gamePlayers, function (p) {
            return p.gameUserStatus == Enums_1.UserOnlineStatus.Online;
        }));
        if (countOnline <= 1) {
            this.gameStatus = Enums_1.GameStatus.Closed;
            this.GameClosed();
        }
    }
    PlayerLeft(gamePlayer) {
    }
    IsEmpty() {
        if (this.gameStatus == Enums_1.GameStatus.Closed)
            return true;
        const count = _.find(this.gamePlayers, function (p) {
            return p.gameUserStatus == Enums_1.UserOnlineStatus.Online;
        });
        return _.size(count) <= 0;
    }
    IsFull() {
        if (this.gameStatus == Enums_1.GameStatus.Closed)
            return true;
        return _.size(this.gamePlayers) >= this.gameCapacity;
    }
    IsPlayerInGame(gamePlayer) {
        return _.find(this.gamePlayers, function (p) {
            return p.getPlayerId() === gamePlayer.getPlayerId();
        });
    }
    AttemptSetup(capacity) {
        this.gameCapacity = capacity;
    }
    sendGamePlayerList() {
        let playerList = new Array();
        _.forEach(this.gamePlayers, function (el, index, arr) {
            const playerInfo = new GamePlayerInfo_1.default();
            playerInfo.index = el.index;
            playerInfo.name = el.getPlayerName();
            playerInfo.picture = el.getPlayerPicture();
            playerInfo.status = el.gameUserStatus;
            playerList.push(playerInfo);
        });
        this.BroadcastMessage({ "action": Enums_1.Action.GameUserList, "game": this.gameId, "data": playerList });
    }
    BroadcastMessage(msg) {
        _.forEach(this.gamePlayers, function (el, index, arr) {
            if (el.gameUserStatus == Enums_1.UserOnlineStatus.Online)
                el.sendMessage(msg);
        });
    }
}
exports.default = GameBase;
