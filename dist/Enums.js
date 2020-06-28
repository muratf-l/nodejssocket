"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameStatus = exports.UserRegisterMethod = exports.UserOnlineStatus = exports.UserRegisterStatus = exports.Action = exports.ResponseCode = void 0;
var ResponseCode;
(function (ResponseCode) {
    ResponseCode[ResponseCode["OK"] = 200] = "OK";
    ResponseCode[ResponseCode["Error"] = 500] = "Error";
})(ResponseCode = exports.ResponseCode || (exports.ResponseCode = {}));
var Action;
(function (Action) {
    Action[Action["Error"] = 10] = "Error";
    Action[Action["UserInfo"] = 7] = "UserInfo";
    Action[Action["ConnectionOK"] = 8] = "ConnectionOK";
    Action[Action["GameJoin"] = 4] = "GameJoin";
    Action[Action["GameLeave"] = 5] = "GameLeave";
    Action[Action["GameUserList"] = 6] = "GameUserList";
})(Action = exports.Action || (exports.Action = {}));
var UserRegisterStatus;
(function (UserRegisterStatus) {
    UserRegisterStatus[UserRegisterStatus["Guest"] = 0] = "Guest";
    UserRegisterStatus[UserRegisterStatus["Registered"] = 10] = "Registered";
})(UserRegisterStatus = exports.UserRegisterStatus || (exports.UserRegisterStatus = {}));
var UserOnlineStatus;
(function (UserOnlineStatus) {
    UserOnlineStatus[UserOnlineStatus["Offline"] = 0] = "Offline";
    UserOnlineStatus[UserOnlineStatus["Online"] = 10] = "Online";
})(UserOnlineStatus = exports.UserOnlineStatus || (exports.UserOnlineStatus = {}));
var UserRegisterMethod;
(function (UserRegisterMethod) {
    UserRegisterMethod[UserRegisterMethod["Unknow"] = 0] = "Unknow";
    UserRegisterMethod[UserRegisterMethod["Mail"] = 10] = "Mail";
    UserRegisterMethod[UserRegisterMethod["Facebook"] = 20] = "Facebook";
})(UserRegisterMethod = exports.UserRegisterMethod || (exports.UserRegisterMethod = {}));
var GameStatus;
(function (GameStatus) {
    GameStatus[GameStatus["Waiting"] = 0] = "Waiting";
    GameStatus[GameStatus["Closed"] = 10] = "Closed";
    GameStatus[GameStatus["Running"] = 20] = "Running";
})(GameStatus = exports.GameStatus || (exports.GameStatus = {}));
