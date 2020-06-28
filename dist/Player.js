"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require("./utils");
const Database_1 = require("./Database");
const AppServer_1 = require("./AppServer");
const Enums_1 = require("./Enums");
class Player {
    constructor(_connection) {
        this.connection = null;
        this.connectionId = null;
        this.userInfo = null;
        this.gameId = null;
        this.isDebug = false;
        this.connection = _connection;
        this.connectionId = utils.getId();
        if (process.env.NODE_ENV !== 'production') {
            this.isDebug = true;
        }
        this.OnWsConnected();
    }
    log(message) {
        if (this.isDebug)
            console.log("[Player]", "     ", message);
    }
    sendMessage(message) {
        this.connection.sendUTF(utils.stringJSON(message));
    }
    OnWsConnected() {
        // this.log(`${this.connectionId} OnWsConnected`)
        this.sendMessage({ "action": Enums_1.Action.ConnectionOK });
    }
    OnWsDisconnected(reasonCode, description) {
        // this.log(`${this.connectionId} OnWsDisconnected`)
        if (this.userInfo !== null)
            Database_1.database.setUserOnlineStatus(this.userInfo, Enums_1.UserOnlineStatus.Offline, () => {
            });
        if (this.gameId !== null)
            AppServer_1.appserver.host.GameLeft(this);
    }
    OnWsReceived(message) {
        // this.log(`${this.connectionId} OnWsReceived : ${message}`)
        let action_req = utils.parseJSON(message);
        if (action_req === null || !action_req.hasOwnProperty('action')) {
            this.log("no action");
            return;
        }
        switch (action_req.action) {
            case 1:
                //UserRegisterFacebook
                if (action_req.hasOwnProperty('data') && this.userInfo === null) {
                    Player.ActionUserRegisterFacebook(this, action_req.data);
                }
                break;
            case 2:
                //UserRegisterMail
                if (action_req.hasOwnProperty('data') && this.userInfo === null) {
                    Player.ActionUserRegisterMail(this, action_req.data);
                }
                break;
            case 3:
                //UserLoginMail
                if (action_req.hasOwnProperty('data') && this.userInfo === null) {
                    Player.ActionUserLoginMail(this, action_req.data);
                }
                break;
            case 4:
                //GameJoin
                if (action_req.hasOwnProperty('data') && this.userInfo !== null) {
                    AppServer_1.appserver.host.GameFindOrCreate(this, action_req.data.player);
                }
                break;
            case 5:
                //GameLeave
                if (this.userInfo !== null) {
                    AppServer_1.appserver.host.GameLeft(this);
                }
                break;
            default:
            // code block
        }
    }
    static ActionUserRegisterFacebook(player, data) {
        Database_1.database.registerUserFromFacebook(data, (code, userInfo) => {
            if (code !== Enums_1.ResponseCode.OK || userInfo === null) {
                player.userInfo = null;
                player.sendMessage({ "action": code });
                return;
            }
            player.userInfo = userInfo;
            Database_1.database.setUserOnlineStatus(player.userInfo, Enums_1.UserOnlineStatus.Online, () => {
                player.sendMessage({ "action": Enums_1.Action.UserInfo, "user": player.userInfo });
            });
        });
    }
    static ActionUserRegisterMail(player, data) {
        Database_1.database.registerUserFromMail(data, (code, userInfo) => {
            if (code !== Enums_1.ResponseCode.OK || userInfo === null) {
                player.userInfo = null;
                player.sendMessage({ "action": code });
                return;
            }
            player.userInfo = userInfo;
            Database_1.database.setUserOnlineStatus(player.userInfo, Enums_1.UserOnlineStatus.Online, () => {
                player.sendMessage({ "action": Enums_1.Action.UserInfo, "user": player.userInfo });
            });
        });
    }
    static ActionUserLoginMail(player, data) {
        Database_1.database.loginUserFromMailPassword(data, (code, userInfo) => {
            if (code !== Enums_1.ResponseCode.OK || userInfo === null) {
                player.userInfo = null;
                player.sendMessage({ "action": code });
                return;
            }
            player.userInfo = userInfo;
            Database_1.database.setUserOnlineStatus(player.userInfo, Enums_1.UserOnlineStatus.Online, () => {
                player.sendMessage({ "action": Enums_1.Action.UserInfo, "user": player.userInfo });
            });
        });
    }
}
exports.default = Player;
