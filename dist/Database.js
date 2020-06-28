"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const utils = require("./utils");
const UserInfo_1 = require("./models/UserInfo");
const User_1 = require("./models/User");
const Enums_1 = require("./Enums");
class Database {
    constructor() {
        this.isDebug = false;
        if (process.env.NODE_ENV !== 'production') {
            this.isDebug = true;
        }
    }
    static bootstrap() {
        if (!this.databaseInstance) {
            this.databaseInstance = new Database();
            return this.databaseInstance;
        }
        else {
            return this.databaseInstance;
        }
    }
    log(message) {
        if (this.isDebug)
            console.log("[Database]", "     ", message);
    }
    init(config) {
        this.sequelize = new sequelize_typescript_1.Sequelize(config.PostgreSQL.DB, config.PostgreSQL.USER, config.PostgreSQL.PASSWORD, {
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
        this.sequelize.addModels([User_1.default]);
        this.log(`init ${config.PostgreSQL.DB}`);
        // this.sequelize.sync({force: true}).then(() => {
        //     this.log("Drop and re-sync db.");
        // });
    }
    registerUserFromFacebook(data, cb) {
        User_1.default.findOne({
            where: {
                PlatformId: data.id
            }
        }).then(resultEntity => {
            if (resultEntity !== null) {
                const dataObj = resultEntity.get();
                exports.database.getUserInfoFromRecord(dataObj, cb);
                return;
            }
            const user = new User_1.default({
                UserToken: utils.getId(),
                PlatformId: data.id,
                NameFirst: data.name,
                ProfileImageUrl: data.photo,
                Locale: data.locale,
                PlatformMethod: data.platform,
                RegisterStatus: Enums_1.UserRegisterStatus.Registered,
                OnlineStatus: Enums_1.UserOnlineStatus.Online,
                RegisterMethod: Enums_1.UserRegisterMethod.Facebook
            });
            user.save()
                .then(resultEntity => {
                const dataObj = resultEntity.get();
                exports.database.getUserInfoFromRecord(dataObj, cb);
            })
                .catch(err => {
                cb(Enums_1.ResponseCode.Error, null, err.message || "not save");
            });
        }).catch(err => {
            cb(Enums_1.ResponseCode.Error, null, err.message || "not save");
        });
    }
    registerUserFromMail(data, cb) {
        User_1.default.findOne({
            where: {
                Email: data.mail
            }
        }).then(resultEntity => {
            if (resultEntity !== null) {
                cb(Enums_1.ResponseCode.Error, null, "already exists");
                return;
            }
            const user = new User_1.default({
                UserToken: utils.getId(),
                NameFirst: data.name,
                Email: data.mail,
                Password: data.pass,
                RegisterStatus: Enums_1.UserRegisterStatus.Registered,
                OnlineStatus: Enums_1.UserOnlineStatus.Online,
                RegisterMethod: Enums_1.UserRegisterMethod.Mail
            });
            user.save()
                .then(resultEntity => {
                const dataObj = resultEntity.get();
                exports.database.getUserInfoFromRecord(dataObj, cb);
            })
                .catch(err => {
                cb(Enums_1.ResponseCode.Error, null, err.message || "not save");
            });
        }).catch(err => {
            cb(Enums_1.ResponseCode.Error, null, err.message || "not save");
        });
    }
    loginUserFromMailPassword(data, cb) {
        User_1.default.findOne({
            where: {
                Email: data.mail,
                Password: data.pass
            }
        }).then(resultEntity => {
            if (resultEntity !== null) {
                const dataObj = resultEntity.get();
                exports.database.getUserInfoFromRecord(dataObj, cb);
                return;
            }
            cb(Enums_1.ResponseCode.Error, null, "not found user");
        }).catch(err => {
            cb(Enums_1.ResponseCode.Error, null, err.message || "not save");
        });
    }
    getUserInfoFromRecord(user, cb) {
        const userInfo = new UserInfo_1.default();
        userInfo.token = user.UserToken;
        userInfo.coin = 2500;
        userInfo.name = user.NameFirst;
        userInfo.picture = user.ProfileImageUrl;
        cb(Enums_1.ResponseCode.OK, userInfo, null);
    }
    setUserOnlineStatus(userInfo, status, cb) {
        User_1.default.update({
            OnlineStatus: status
        }, {
            limit: 1,
            where: { UserToken: userInfo.token }
        })
            .then(() => {
            cb(Enums_1.ResponseCode.OK, null, null);
        }).catch(err => {
            cb(Enums_1.ResponseCode.Error, null, err.message || "not save");
        });
    }
}
exports.database = Database.bootstrap();
