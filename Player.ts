import * as utils from './utils';

import {database} from './Database'
import {appserver} from './AppServer'
import {Action, ResponseCode, UserOnlineStatus} from './Enums'
import UserInfo from './models/UserInfo';


export default class Player {

    private readonly connection: any = null;

    public readonly connectionId: string = null;

    public userInfo: UserInfo = null;

    public gameId: string = null;

    private readonly isDebug: boolean = false;

    constructor(_connection) {
        this.connection = _connection;
        this.connectionId = utils.getId();

        if (process.env.NODE_ENV !== 'production') {
            this.isDebug = true;
        }

        this.OnWsConnected()
    }

    private log(message): void {
        if (this.isDebug)
            console.log("[Player]", "     ", message)
    }

    public sendMessage(message: object): void {
        this.connection.sendUTF(utils.stringJSON(message));
    }

    private OnWsConnected(): void {
        // this.log(`${this.connectionId} OnWsConnected`)
        this.sendMessage({"action": Action.ConnectionOK});
    }

    public OnWsDisconnected(reasonCode, description): void {
        // this.log(`${this.connectionId} OnWsDisconnected`)

        if (this.userInfo !== null)
            database.setUserOnlineStatus(this.userInfo, UserOnlineStatus.Offline, () => {

            });

        if (this.gameId !== null)
            appserver.host.GameLeft(this);
    }

    public OnWsReceived(message: string): void {
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
                    appserver.host.GameFindOrCreate(this, action_req.data.player);
                }
                break;

            case 5:
                //GameLeave
                if (this.userInfo !== null) {
                    appserver.host.GameLeft(this);
                }
                break;

            default:
            // code block
        }
    }

    private static ActionUserRegisterFacebook(player: Player, data): void {
        database.registerUserFromFacebook(data, (code, userInfo) => {

            if (code !== ResponseCode.OK || userInfo === null) {
                player.userInfo = null;
                player.sendMessage({"action": code});
                return;
            }

            player.userInfo = userInfo;

            database.setUserOnlineStatus(player.userInfo, UserOnlineStatus.Online, () => {
                player.sendMessage({"action": Action.UserInfo, "user": player.userInfo});
            });
        });
    }

    private static ActionUserRegisterMail(player: Player, data): void {
        database.registerUserFromMail(data, (code, userInfo) => {

            if (code !== ResponseCode.OK || userInfo === null) {
                player.userInfo = null;
                player.sendMessage({"action": code});
                return;
            }

            player.userInfo = userInfo;

            database.setUserOnlineStatus(player.userInfo, UserOnlineStatus.Online, () => {
                player.sendMessage({"action": Action.UserInfo, "user": player.userInfo});
            });
        });
    }

    private static ActionUserLoginMail(player: Player, data): void {
        database.loginUserFromMailPassword(data, (code, userInfo) => {

            if (code !== ResponseCode.OK || userInfo === null) {
                player.userInfo = null;
                player.sendMessage({"action": code});
                return;
            }

            player.userInfo = userInfo;

            database.setUserOnlineStatus(player.userInfo, UserOnlineStatus.Online, () => {
                player.sendMessage({"action": Action.UserInfo, "user": player.userInfo});
            });
        });
    }
}


