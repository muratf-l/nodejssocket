import {
    Table,
    Column,
    Model,
    AllowNull,
    Unique,
    AutoIncrement,
    PrimaryKey,
    CreatedAt,
    UpdatedAt, DeletedAt, Index
} from 'sequelize-typescript';

import {DataType} from 'sequelize-typescript';

@Table({timestamps: true, tableName: "ZUsers",paranoid: true})
export default class User extends Model<User> {

    @PrimaryKey
    @AutoIncrement
    @Column({type: DataType.BIGINT})
    UserId: number;

    @Unique(true)
    @Index
    @Column({type: DataType.STRING})
    UserToken: string;

    @AllowNull(true)
    @Index
    @Column({type: DataType.STRING})
    PlatformId: string;

    @Column({type: DataType.STRING})
    NameFirst: string;

    @AllowNull(true)
    @Column({type: DataType.STRING})
    NameLast: string;

    @AllowNull(true)
    @Index
    @Column({type: DataType.STRING})
    Email: string;

    @AllowNull(true)
    @Column({type: DataType.STRING})
    ProfileImageUrl: string;

    @AllowNull(true)
    @Column({type: DataType.STRING})
    Locale: string;

    @AllowNull(true)
    @Column({type: DataType.STRING})
    Password: string;

    @Column({type: DataType.INTEGER})
    RegisterStatus: number;

    @Column({type: DataType.INTEGER})
    OnlineStatus: number;

    @Column({type: DataType.INTEGER})
    RegisterMethod: number;

    @CreatedAt
    creationDate: Date;

    @UpdatedAt
    updatedOn: Date;

    @DeletedAt
    deletionDate: Date;
}