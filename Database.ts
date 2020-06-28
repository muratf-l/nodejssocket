import {Sequelize} from 'sequelize-typescript';
import * as utils from './utils';
import UserInfo from './models/UserInfo';
import User from './models/User';

import {ResponseCode, UserOnlineStatus, UserRegisterMethod, UserRegisterStatus} from './Enums'

export interface DatabaseUserInfoCbType {
    (code: number, userInfo: UserInfo, message: string): void
}

class Database {
    private static databaseInstance: Database;

    private readonly isDebug: boolean = false;

    private sequelize: Sequelize;

    public static bootstrap(): Database {
        if (!this.databaseInstance) {
            this.databaseInstance = new Database();
            return this.databaseInstance;
        } else {
            return this.databaseInstance;
        }
    }

    private log(message): void {
        if (this.isDebug)
            console.log("[Database]","     ", message)
    }

    public constructor() {
        if (process.env.NODE_ENV !== 'production') {
            this.isDebug = true;
        }
    }

    public init(config): void {
        this.sequelize = new Sequelize(config.PostgreSQL.DB, config.PostgreSQL.USER, config.PostgreSQL.PASSWORD, {
            host: config.PostgreSQL.HOST,
            dialect: config.PostgreSQL.dialect,
            logging: false,
            pool: {
                max: config.PostgreSQL.pool.max,
                min: config.PostgreSQL.pool.min,
                acquire: config.PostgreSQL.pool.acquire,
                idle: config.PostgreSQL.pool.idle
            }
        });

        this.sequelize.addModels([User]);

        this.log(`init ${config.PostgreSQL.DB}`);

        // this.sequelize.sync({force: true}).then(() => {
        //     this.log("Drop and re-sync db.");
        // });
    }

    public registerUserFromFacebook(data, cb: DatabaseUserInfoCbType): void {
        User.findOne({
            where: {
                PlatformId: data.id
            }
        }).then(resultEntity => {

            if (resultEntity !== null) {
                const dataObj = resultEntity.get() as User
                database.getUserInfoFromRecord(dataObj, cb)
                return
            }

            const user = new User(
                {
                    UserToken: utils.getId(),
                    PlatformId: data.id,
                    NameFirst: data.name,
                    ProfileImageUrl: data.photo,
                    Locale: data.locale,
                    PlatformMethod: data.platform,
                    RegisterStatus: UserRegisterStatus.Registered,
                    OnlineStatus: UserOnlineStatus.Online,
                        RegisterMethod: UserRegisterMethod.Facebook
                }
            );

            user.save()
                .then(resultEntity => {
                    const dataObj = resultEntity.get() as User

                    database.getUserInfoFromRecord(dataObj, cb)
                })
                .catch(err => {
                    cb(ResponseCode.Error, null, err.message || "not save")
                });

        }).catch(err => {
            cb(ResponseCode.Error, null, err.message || "not save")
        });
    }

    public registerUserFromMail(data, cb: DatabaseUserInfoCbType): void {
        User.findOne({
            where: {
                Email: data.mail
            }
        }).then(resultEntity => {
            if (resultEntity !== null) {
                cb(ResponseCode.Error, null, "already exists")
                return
            }

            const user = new User(
                {
                    UserToken: utils.getId(),
                    NameFirst: data.name,
                    Email: data.mail,
                    Password: data.pass,
                    RegisterStatus: UserRegisterStatus.Registered,
                    OnlineStatus: UserOnlineStatus.Online,
                    RegisterMethod: UserRegisterMethod.Mail
                }
            );

            user.save()
                .then(resultEntity => {
                    const dataObj = resultEntity.get() as User
                    database.getUserInfoFromRecord(dataObj, cb)
                })
                .catch(err => {
                    cb(ResponseCode.Error, null, err.message || "not save")
                });

        }).catch(err => {
            cb(ResponseCode.Error, null, err.message || "not save")
        });
    }

    public loginUserFromMailPassword(data, cb: DatabaseUserInfoCbType): void {
        User.findOne({
            where: {
                Email: data.mail,
                Password: data.pass
            }
        }).then(resultEntity => {
            if (resultEntity !== null) {
                const dataObj = resultEntity.get() as User
                database.getUserInfoFromRecord(dataObj, cb)
                return
            }

            cb(ResponseCode.Error, null, "not found user")

        }).catch(err => {
            cb(ResponseCode.Error, null, err.message || "not save")
        });
    }

    public getUserInfoFromRecord(user: User, cb: DatabaseUserInfoCbType): void {
        const userInfo = new UserInfo()
        userInfo.token = user.UserToken;
        userInfo.coin = 2500;
        userInfo.name = user.NameFirst;
        userInfo.picture = user.ProfileImageUrl;
        cb(ResponseCode.OK, userInfo, null);
    }

    public setUserOnlineStatus(userInfo: UserInfo, status: UserOnlineStatus, cb: DatabaseUserInfoCbType): void {
        User.update({
                OnlineStatus: status
            },
            {
                limit: 1,
                where: {UserToken: userInfo.token}
            })
            .then(() => {
                cb(ResponseCode.OK, null, null);
            }).catch(err => {
            cb(ResponseCode.Error, null, err.message || "not save");
        });
    }
}

export const database = Database.bootstrap();