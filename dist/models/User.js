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
const sequelize_typescript_2 = require("sequelize-typescript");
let User = class User extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column({ type: sequelize_typescript_2.DataType.BIGINT }),
    __metadata("design:type", Number)
], User.prototype, "UserId", void 0);
__decorate([
    sequelize_typescript_1.Unique(true),
    sequelize_typescript_1.Index,
    sequelize_typescript_1.Column({ type: sequelize_typescript_2.DataType.STRING }),
    __metadata("design:type", String)
], User.prototype, "UserToken", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(true),
    sequelize_typescript_1.Index,
    sequelize_typescript_1.Column({ type: sequelize_typescript_2.DataType.STRING }),
    __metadata("design:type", String)
], User.prototype, "PlatformId", void 0);
__decorate([
    sequelize_typescript_1.Column({ type: sequelize_typescript_2.DataType.STRING }),
    __metadata("design:type", String)
], User.prototype, "NameFirst", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(true),
    sequelize_typescript_1.Column({ type: sequelize_typescript_2.DataType.STRING }),
    __metadata("design:type", String)
], User.prototype, "NameLast", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(true),
    sequelize_typescript_1.Index,
    sequelize_typescript_1.Column({ type: sequelize_typescript_2.DataType.STRING }),
    __metadata("design:type", String)
], User.prototype, "Email", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(true),
    sequelize_typescript_1.Column({ type: sequelize_typescript_2.DataType.STRING }),
    __metadata("design:type", String)
], User.prototype, "ProfileImageUrl", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(true),
    sequelize_typescript_1.Column({ type: sequelize_typescript_2.DataType.STRING }),
    __metadata("design:type", String)
], User.prototype, "Locale", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(true),
    sequelize_typescript_1.Column({ type: sequelize_typescript_2.DataType.STRING }),
    __metadata("design:type", String)
], User.prototype, "Password", void 0);
__decorate([
    sequelize_typescript_1.Column({ type: sequelize_typescript_2.DataType.INTEGER }),
    __metadata("design:type", Number)
], User.prototype, "RegisterStatus", void 0);
__decorate([
    sequelize_typescript_1.Column({ type: sequelize_typescript_2.DataType.INTEGER }),
    __metadata("design:type", Number)
], User.prototype, "OnlineStatus", void 0);
__decorate([
    sequelize_typescript_1.Column({ type: sequelize_typescript_2.DataType.INTEGER }),
    __metadata("design:type", Number)
], User.prototype, "RegisterMethod", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Date)
], User.prototype, "creationDate", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", Date)
], User.prototype, "updatedOn", void 0);
__decorate([
    sequelize_typescript_1.DeletedAt,
    __metadata("design:type", Date)
], User.prototype, "deletionDate", void 0);
User = __decorate([
    sequelize_typescript_1.Table({ timestamps: true, tableName: "ZUsers", paranoid: true })
], User);
exports.default = User;
