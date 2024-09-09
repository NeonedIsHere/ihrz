import { Sequelize, DataTypes, Model, WhereOptions, ModelCtor, ModelStatic } from 'sequelize';

// Configuration Sequelize
export const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: process.cwd() + "/db.sqlite",
    logging: false,
    logQueryParameters: false
});

// const sequelize = new Sequelize('ihrz_test', 'ihrz_test', 'MS94yuYb~R}2-9[j', {
//     host: 'ca1.ihorizon.me',
//     port: 25570,
//     dialect: 'mysql',  // Ou 'postgres', 'sqlite', etc.
//     logging: false,
// });

class DbBackupsUserObject extends Model { }
class BlockNewAccountSchema extends Model { }
class ConfessionSchema extends Model { }
class DbEmbedObject extends Model { }
class GhostPingData extends Model { }
class EconomyUserSchema extends Model { }
class GuildConfigSchema extends Model { }
class GuildStats extends Model { }
class InvitesUserData extends Model { }
class JoinBannerOptions extends Model { }
class MemberCountSchema extends Model { }
class NotifierLastNotifiedMedias extends Model { }
class NotifierSchema extends Model { }
class NotifierUserSchema extends Model { }
class PunishPubSchema extends Model { }
class ReactionRolesData extends Model { }
class RoleSaverData extends Model { }
class RoleSaverSchema extends Model { }
class SecuritySchema extends Model { }
class SnipeData extends Model { }
class StatsMessage extends Model { }
class StatsVoice extends Model { }
class SuggestionData extends Model { }
class SuggestSchema extends Model { }
class TicketUserData extends Model { }
class TicketData extends Model { }
class UserStats extends Model { }
class UtilsData extends Model { }
class VoiceData extends Model { }
class AllowListData extends Model { }
class AntiSpam extends Model { }
class XpLevelingUserSchema extends Model { }

DbBackupsUserObject.init({
    guildId: {
        type: DataTypes.STRING,
        primaryKey: false
    },
    backupId: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    guildName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    categoryCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    channelCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'DbBackupsUserObject',
    tableName: 'db_backups_user_objects',
    timestamps: false
});

BlockNewAccountSchema.init({
    guildId: {
        type: DataTypes.STRING,
        primaryKey: false
    },
    state: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    req: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'BlockNewAccountSchema',
    tableName: 'block_new_account_schema',
    timestamps: false
});

ConfessionSchema.init({
    guildId: {
        type: DataTypes.STRING,
        primaryKey: false
    },
    panel: {
        type: DataTypes.JSON,
        allowNull: true
    },
    disable: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    ALL_CONFESSIONS: {
        type: DataTypes.JSON,
        allowNull: true
    },
    cooldown: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'ConfessionSchema',
    tableName: 'confession_schema',
    timestamps: false
});

DbEmbedObject.init({
    guildId: {
        type: DataTypes.STRING,
        primaryKey: false
    },
    code: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    embedOwner: {
        type: DataTypes.STRING,
        allowNull: false
    },
    embedSource: {
        type: DataTypes.JSON,  // Storing embed source as JSON
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'DbEmbedObject',
    tableName: 'db_embed_objects',
    timestamps: false
});

GhostPingData.init({
    guildId: {
        type: DataTypes.STRING,
        primaryKey: false
    },
    channels: {
        type: DataTypes.JSON,
        allowNull: true
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'GhostPingData',
    tableName: 'ghost_ping_data',
    timestamps: false
});

EconomyUserSchema.init({
    guildId: {
        type: DataTypes.STRING,
        primaryKey: false
    },
    money: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    bank: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    daily: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    monthly: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    weekly: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    work: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'EconomyUserSchema',
    tableName: 'economy_user_schema',
    timestamps: false
});

GuildConfigSchema.init({
    guildId: {
        type: DataTypes.STRING,
        primaryKey: false
    },
    joinmessage: {
        type: DataTypes.STRING,
        allowNull: true
    },
    joinbanner: {
        type: DataTypes.JSON, // Stores join banner options
        allowNull: true
    },
    joinbannerStates: {
        type: DataTypes.STRING,
        allowNull: true
    },
    join: {
        type: DataTypes.STRING,
        allowNull: true
    },
    leave: {
        type: DataTypes.STRING,
        allowNull: true
    },
    joindm: {
        type: DataTypes.STRING,
        allowNull: true
    },
    joinroles: {
        type: DataTypes.JSON, // Stores join roles
        allowNull: true
    },
    leavemessage: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mass_mention: {
        type: DataTypes.STRING,
        allowNull: true
    },
    antipub: {
        type: DataTypes.STRING,
        allowNull: true
    },
    spam: {
        type: DataTypes.STRING,
        allowNull: true
    },
    hey_reaction: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    rolesaver: {
        type: DataTypes.JSON, // Stores role saver options
        allowNull: true
    },
    GHOST_PING: {
        type: DataTypes.JSON, // Stores ghost ping settings
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'GuildConfigSchema',
    tableName: 'guild_config_schema',
    timestamps: false
});

GuildStats.init({
    guildId: {
        type: DataTypes.STRING,
        primaryKey: false
    },
    USER: {
        type: DataTypes.JSON, // Stores user stats as JSON
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'GuildStats',
    tableName: 'guild_stats',
    timestamps: false
});

InvitesUserData.init({
    guildId: {
        type: DataTypes.STRING,
        primaryKey: false
    },
    inviter: {
        type: DataTypes.STRING,
        allowNull: true
    },
    invite: {
        type: DataTypes.STRING,
        allowNull: true
    },
    regular: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    invites: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    bonus: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    leaves: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'InvitesUserData',
    tableName: 'invites_user_data',
    timestamps: false
});

JoinBannerOptions.init({
    guildId: {
        type: DataTypes.STRING,
        primaryKey: false
    },
    backgroundURL: {
        type: DataTypes.STRING,
        allowNull: false
    },
    profilePictureRound: {
        type: DataTypes.ENUM("hexProfileColor", "status"), // Enum for profile picture round
        allowNull: false
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false
    },
    textColour: {
        type: DataTypes.STRING,
        allowNull: false
    },
    textSize: {
        type: DataTypes.STRING,
        allowNull: false
    },
    avatarSize: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'JoinBannerOptions',
    tableName: 'join_banner_options',
    timestamps: false
});

MemberCountSchema.init({
    guildId: {
        type: DataTypes.STRING,
        primaryKey: false
    },
    member: {
        type: DataTypes.JSON, // Stores member count settings as JSON
        allowNull: true
    },
    roles: {
        type: DataTypes.JSON, // Stores roles count settings as JSON
        allowNull: true
    },
    bot: {
        type: DataTypes.JSON, // Stores bot count settings as JSON
        allowNull: true
    },
    boost: {
        type: DataTypes.JSON, // Stores boost count settings as JSON
        allowNull: true
    },
    channel: {
        type: DataTypes.JSON, // Stores channel count settings as JSON
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'MemberCountSchema',
    tableName: 'member_count_schema',
    timestamps: false
});

NotifierLastNotifiedMedias.init({
    guildId: {
        type: DataTypes.STRING,
        primaryKey: false
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mediaId: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'NotifierLastNotifiedMedias',
    tableName: 'notifier_last_notified_medias',
    timestamps: false
});

NotifierSchema.init({
    guildId: {
        type: DataTypes.STRING,
        primaryKey: false
    },
    message: {
        type: DataTypes.STRING,
        allowNull: true
    },
    users: {
        type: DataTypes.JSON, // Stores list of NotifierUserSchema
        allowNull: true
    },
    lastMediaNotified: {
        type: DataTypes.JSON, // Stores last notified media
        allowNull: true
    },
    channelId: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'NotifierSchema',
    tableName: 'notifier_schema',
    timestamps: false
});

NotifierUserSchema.init({
    guildId: {
        type: DataTypes.STRING,
        primaryKey: false
    },
    id_or_username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    platform: {
        type: DataTypes.STRING, // Platform enumeration or string
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'NotifierUserSchema',
    tableName: 'notifier_user_schema',
    timestamps: false
});

PunishPubSchema.init({
    guildId: {
        type: DataTypes.STRING,
        primaryKey: false
    },
    amountMax: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    punishmentType: {
        type: DataTypes.STRING,
        allowNull: true
    },
    state: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'PunishPubSchema',
    tableName: 'punish_pub_schema',
    timestamps: false
});

ReactionRolesData.init({
    guildId: {
        type: DataTypes.STRING,
        primaryKey: false
    },
    messageId: {
        type: DataTypes.STRING,
        primaryKey: false
    },
    reaction: {
        type: DataTypes.JSON,  // Store reaction roles as JSON object
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'ReactionRolesData',
    tableName: 'reaction_roles_data',
    timestamps: false
});

RoleSaverData.init({
    guildId: {
        type: DataTypes.STRING,
        primaryKey: false
    },
    userId: {
        type: DataTypes.STRING,
        primaryKey: false
    },
    roles: {
        type: DataTypes.JSON,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'RoleSaverData',
    tableName: 'role_saver_data',
    timestamps: false
});

RoleSaverSchema.init({
    guildId: {
        type: DataTypes.STRING,
        primaryKey: false
    },
    enable: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    timeout: {
        type: DataTypes.STRING,
        allowNull: true
    },
    admin: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'RoleSaverSchema',
    tableName: 'role_saver_schema',
    timestamps: false
});

SecuritySchema.init({
    guildId: {
        type: DataTypes.STRING,
        primaryKey: false
    },
    channel: {
        type: DataTypes.STRING,
        allowNull: true
    },
    disable: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    role: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'SecuritySchema',
    tableName: 'security_schema',
    timestamps: false
});

SnipeData.init({
    guildId: {
        type: DataTypes.STRING,
        primaryKey: false
    },
    channelId: {
        type: DataTypes.STRING,
        primaryKey: false
    },
    snipe: {
        type: DataTypes.STRING,
        allowNull: false
    },
    snipeUserInfoTag: {
        type: DataTypes.STRING,
        allowNull: false
    },
    snipeUserInfoPp: {
        type: DataTypes.STRING,
        allowNull: false
    },
    snipeTimestamp: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'SnipeData',
    tableName: 'snipe_data',
    timestamps: false
});


StatsMessage.init({
    guildId: {
        type: DataTypes.STRING,
        primaryKey: false
    },
    sentTimestamp: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    contentLength: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    channelId: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'StatsMessage',
    tableName: 'stats_messages',
    timestamps: false
});

StatsVoice.init({
    guildId: {
        type: DataTypes.STRING,
        primaryKey: false
    },
    startTimestamp: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    endTimestamp: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    channelId: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'StatsVoice',
    tableName: 'stats_voices',
    timestamps: false
});

SuggestionData.init({
    guildId: {
        type: DataTypes.STRING,
        primaryKey: false
    },
    suggestCode: {
        type: DataTypes.STRING,
        primaryKey: false
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false
    },
    msgId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    replied: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'SuggestionData',
    tableName: 'suggestion_data',
    timestamps: false
});

SuggestSchema.init({
    guildId: {
        type: DataTypes.STRING,
        primaryKey: false
    },
    channel: {
        type: DataTypes.STRING,
        allowNull: false
    },
    disable: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'SuggestSchema',
    tableName: 'suggest_schema',
    timestamps: false
});


TicketUserData.init({
    guildId: {
        type: DataTypes.STRING,
        primaryKey: false
    },
    channelId: {
        type: DataTypes.STRING,
        primaryKey: false
    },
    channel: {
        type: DataTypes.STRING,
        allowNull: false
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false
    },
    alive: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'TicketUserData',
    tableName: 'ticket_user_data',
    timestamps: false
});

TicketData.init({
    guildId: {
        type: DataTypes.STRING,
        primaryKey: false
    },
    userId: {
        type: DataTypes.STRING,
        primaryKey: false
    }
}, {
    sequelize,
    modelName: 'TicketData',
    tableName: 'ticket_data',
    timestamps: false
});

TicketData.hasMany(TicketUserData, { foreignKey: 'userId' });
TicketUserData.belongsTo(TicketData, { foreignKey: 'userId' });



UserStats.init({
    guildId: {
        type: DataTypes.STRING,
        primaryKey: false
    },
    messages: {
        type: DataTypes.JSON, // Stores messages as JSON array
        allowNull: true
    },
    voices: {
        type: DataTypes.JSON, // Stores voice activity as JSON array
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'UserStats',
    tableName: 'user_stats',
    timestamps: false
});



UtilsData.init({
    guildId: {
        type: DataTypes.STRING,
        primaryKey: false
    },
    PERMS: {
        type: DataTypes.JSON, // Stores permissions as JSON
        allowNull: true
    },
    USER_PERMS: {
        type: DataTypes.JSON, // Stores user permissions as JSON
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'UtilsData',
    tableName: 'utils_data',
    timestamps: false
});

VoiceData.init({
    guildId: {
        type: DataTypes.STRING,
        primaryKey: false
    },
    staff_role: {
        type: DataTypes.STRING,
        allowNull: true
    },
    interface: {
        type: DataTypes.JSON,
        allowNull: true
    },
    voice_channel: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'VoiceData',
    tableName: 'voice_data',
    timestamps: false
});


XpLevelingUserSchema.init({
    guildId: {
        type: DataTypes.STRING,
        primaryKey: false
    },
    xp: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    xptotal: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    level: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'XpLevelingUserSchema',
    tableName: 'xp_leveling_user_schema',
    timestamps: false
});



AllowListData.init({
    guildId: {
        type: DataTypes.STRING,
        primaryKey: false
    },
    enable: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    list: {
        type: DataTypes.JSON,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'AllowListData',
    tableName: 'allow_list_data',
    timestamps: false
});


AntiSpam.init({
    guildId: {
        type: DataTypes.STRING,
        primaryKey: false
    },
    bypassRoles: {
        type: DataTypes.JSON,
        primaryKey: false
    },
    bypassChannels: {
        type: DataTypes.JSON,
        primaryKey: false
    },
    ignoreBots: {
        type: DataTypes.BOOLEAN,
        primaryKey: false
    },
    maxInterval: {
        type: DataTypes.INTEGER,
        primaryKey: false
    },
    Enabled: {
        type: DataTypes.BOOLEAN,
        primaryKey: false
    },
    Threshold: {
        type: DataTypes.INTEGER,
        primaryKey: false
    },
    removeMessages: {
        type: DataTypes.BOOLEAN,
        primaryKey: false
    },
    punishmentType: {
        type: DataTypes.STRING,
        primaryKey: false
    },
    punishTime: {
        type: DataTypes.INTEGER,
        primaryKey: false
    },

}, {
    sequelize,
    modelName: 'AntiSpam',
    tableName: 'antispam',
    timestamps: false
});

(async () => {
    try {
        // Synchronisation de tous les modèles
        await sequelize.sync({ alter: false, logging: false });
        console.log('Tous les modèles ont été synchronisés avec succès.');
    } catch (error) {
        console.error('Erreur slors de la synchronisation des modèles :', error);
    }
})();

interface GuildModel extends Model {
    guildId: string;
}

class SequelizeWrapper {
    constructor() { }

    async get<T extends GuildModel>(model: { findOne: Function }, guildId: string, key?: keyof T): Promise<T["dataValues"] | T[keyof T] | null> {
        const instance = (await model.findOne({ where: { guildId } })).dataValues;
        if (!instance) return null;

        if (key) {
            return instance[key] !== undefined ? instance[key] : null;
        }

        return instance;
    }

    async delete<T extends Model>(model: { new(): T; findOne: any }, key: any, options: object = {}): Promise<boolean> {
        const record = await model.findOne({ where: { guildId: key }, ...options });
        if (record) {
            await record.destroy();
            return true;
        }
        return false;
    }

    async push<T extends Model>(model: { new(): T; findOne: any }, key: any, updateData: object, options: object = {}): Promise<T | null> {
        const record = await model.findOne({ where: { guildId: key }, ...options });
        if (record) {
            return await record.update(updateData);
        }
        return null;
    }

    async sub<T extends Model>(model: { new(): T; findOne: any }, key: any, field: string, value: number, options: object = {}): Promise<T | null> {
        const record = await model.findOne({ where: { guildId: key }, ...options });
        if (record && typeof record[field] === 'number') {
            record[field] -= value;
            return await record.save();
        }
        return null;
    }

    async find<T extends Model>(model: { new(): T; findAll: any }, conditions: WhereOptions, options: object = {}): Promise<T[]> {
        return await model.findAll({ where: conditions, ...options });
    }

    async add<T extends Model>(model: { findOne: Function }, guildId: string, key: keyof T, value: number): Promise<T | null> {
        const instance = await model.findOne({ where: { guildId } });
        if (!instance) return null;

        if (typeof instance[key] === 'number') {
            (instance[key] as unknown as number) += value;
            await instance.save();
            return instance;
        } else {
            throw new Error(`Key ${String(key)} does not exist or is not a number on model`);
        }
    }

    async set<T extends Model>(
        model: ModelStatic<T>,
        fields: Partial<T['_attributes']>
    ): Promise<T | null> {
        if (!fields.guildId) {
            throw new Error('guildId is required in the fields object');
        }

        let instance = await model.findOne({ where: { guildId: fields.guildId } });

        if (!instance) {
            instance = await model.create(fields as T['_creationAttributes']);
        } else {
            Object.assign(instance, fields);
            await instance.save();
        }

        return instance;
    }
}

const exec = new SequelizeWrapper();

export const models = {
    exec,
    AllowListData,
    AntiSpam,
    BlockNewAccountSchema,
    ConfessionSchema,
    EconomyUserSchema,
    GhostPingData,
    GuildConfigSchema,
    GuildStats,
    InvitesUserData,
    JoinBannerOptions,
    MemberCountSchema,
    NotifierLastNotifiedMedias,
    NotifierSchema,
    NotifierUserSchema,
    PunishPubSchema,
    ReactionRolesData,
    RoleSaverData,
    RoleSaverSchema,
    SecuritySchema,
    TicketData,
    TicketUserData,
    UserStats,
    UtilsData,
    VoiceData,
    XpLevelingUserSchema,
}
