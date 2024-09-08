import { Sequelize, DataTypes, Model } from 'sequelize';

// Configuration Sequelize
export const sequelize = new Sequelize('ihrz_test', 'ihrz_test', 'MS94yuYb~R}2-9[j', {
    host: 'ca1.ihorizon.me',
    port: 25570,
    dialect: 'mysql',  // Ou 'postgres', 'sqlite', etc.
});

class DbBackupsUserObject extends Model { }

DbBackupsUserObject.init({
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

class BlockNewAccountSchema extends Model { }

BlockNewAccountSchema.init({
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

class ConfessionSchema extends Model { }

ConfessionSchema.init({
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

class DbEmbedObject extends Model { }

DbEmbedObject.init({
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

class GhostPingData extends Model { }

GhostPingData.init({
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

class EconomyUserSchema extends Model { }

EconomyUserSchema.init({
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

class GuildConfigSchema extends Model { }

GuildConfigSchema.init({
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

class GuildStats extends Model { }

GuildStats.init({
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


class InvitesUserData extends Model { }

InvitesUserData.init({
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

class JoinBannerOptions extends Model { }

JoinBannerOptions.init({
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

class MemberCountSchema extends Model { }

MemberCountSchema.init({
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

class NotifierLastNotifiedMedias extends Model { }

NotifierLastNotifiedMedias.init({
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

class NotifierSchema extends Model { }

NotifierSchema.init({
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


class NotifierUserSchema extends Model { }

NotifierUserSchema.init({
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

class PunishPubSchema extends Model { }

PunishPubSchema.init({
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


class ReactionRolesData extends Model { }

ReactionRolesData.init({
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

class RoleSaverData extends Model { }

RoleSaverData.init({
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

class RoleSaverSchema extends Model { }

RoleSaverSchema.init({
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


class SecuritySchema extends Model { }

SecuritySchema.init({
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

class SnipeData extends Model { }

SnipeData.init({
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

class StatsMessage extends Model { }

StatsMessage.init({
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


class StatsVoice extends Model { }

StatsVoice.init({
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

class SuggestionData extends Model { }

SuggestionData.init({
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


class SuggestSchema extends Model { }

SuggestSchema.init({
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

class TicketUserData extends Model { }

TicketUserData.init({
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

class TicketData extends Model { }

TicketData.init({
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


class UserStats extends Model { }

UserStats.init({
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


class UtilsData extends Model { }

UtilsData.init({
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

class VoiceData extends Model { }

VoiceData.init({
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


class XpLevelingUserSchema extends Model { }

XpLevelingUserSchema.init({
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

class AllowListData extends Model { }

AllowListData.init({
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

(async () => {
    try {
        // Synchronisation de tous les modèles
        await sequelize.sync({ force: true });
        console.log('Tous les modèles ont été synchronisés avec succès.');
    } catch (error) {
        console.error('Erreur lors de la synchronisation des modèles :', error);
    }
})();

export const models = {
    AllowListData,
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
