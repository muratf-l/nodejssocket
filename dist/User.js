"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
let User = class User extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.Unique(true),
    __metadata("design:type", String)
], User.prototype, "UserToken", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.AllowNull(true),
    __metadata("design:type", String)
], User.prototype, "PlatformId", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], User.prototype, "NameFirst", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.AllowNull(true),
    __metadata("design:type", String)
], User.prototype, "NameLast", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.AllowNull(true),
    __metadata("design:type", String)
], User.prototype, "Email", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.AllowNull(true),
    __metadata("design:type", String)
], User.prototype, "ProfileImageUrl", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.AllowNull(true),
    __metadata("design:type", String)
], User.prototype, "Locale", void 0);
__decorate([
    sequelize_typescript_1.Column,
    sequelize_typescript_1.AllowNull(true),
    __metadata("design:type", String)
], User.prototype, "Password", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], User.prototype, "RegisterStatus", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], User.prototype, "OnlineStatus", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], User.prototype, "RegisterMethod", void 0);
User = __decorate([
    sequelize_typescript_1.Table
], User);
exports.default = User;
//
// module.exports = (sequelize: Sequelize.Sequelize) => {
//     const User = sequelize.define("ZUsers", {
//         UserToken: {
//             type: Sequelize.DataTypes.STRING
//         },
//         PlatformId: {
//             type: Sequelize.DataTypes.STRING,
//             allowNull: true,
//         },
//         NameFirst: {
//             type: Sequelize.DataTypes.STRING
//         },
//         NameLast: {
//             type: Sequelize.DataTypes.STRING,
//             allowNull: true,
//         },
//         Email: {
//             type: Sequelize.DataTypes.STRING
//         },
//         ProfileImageUrl: {
//             type: Sequelize.DataTypes.STRING,
//             allowNull: true,
//         },
//         Locale: {
//             type: Sequelize.DataTypes.STRING,
//             allowNull: true,
//         },
//         Password: {
//             type: Sequelize.DataTypes.STRING
//         },
//         RegisterStatus: {
//             type: Sequelize.DataTypes.INTEGER
//         },
//         OnlineStatus: {
//             type: Sequelize.DataTypes.INTEGER
//         },
//         RegisterMethod: {
//             type: Sequelize.DataTypes.INTEGER
//         }
//     });
//
//     return User;
// };
