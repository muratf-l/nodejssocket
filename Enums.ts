export enum ResponseCode {
    OK = 200,
    Error = 500,
}

export enum Action {
    Error = 10,
    UserInfo = 7,
    ConnectionOK = 8,
    GameJoin = 4,
    GameLeave = 5,
    GameUserList = 6,
}

export enum UserRegisterStatus {
    Guest = 0,
    Registered = 10
}

export enum UserOnlineStatus {
    Offline = 0,
    Online = 10
}

export enum UserRegisterMethod {
    Unknow = 0,
    Mail = 10,
    Facebook = 20
}

export enum GameStatus {
    Waiting = 0,
    Closed = 10,
    Running = 20,
}