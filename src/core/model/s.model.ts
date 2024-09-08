// import { SqliteDialect } from '@sequelize/sqlite3';
// import { fileURLToPath } from 'node:url';
// import { dirname } from 'node:path';

// const __dirname = dirname(fileURLToPath(import.meta.url));


// import { DataTypes, Model, InferAttributes, InferCreationAttributes } from '@sequelize/core';

// @Table({
//     tableName: 'db_backups_user_objects',
//     timestamps: false // désactiver les colonnes createdAt et updatedAt
// })
// export class DbBackupsUserObject extends Model {
//     @Column({
//         type: DataType.STRING
//     })
//     backupId!: string;

//     @Column({
//         type: DataType.STRING,
//         allowNull: false
//     })
//     guildName!: string;

//     @Column({
//         type: DataType.INTEGER,
//         allowNull: false
//     })
//     categoryCount!: number;

//     @Column({
//         type: DataType.INTEGER,
//         allowNull: false
//     })
//     channelCount!: number;
// }

// // BlockNewAccountSchema
// @Table({
//   tableName: 'block_new_account_schema',
//   timestamps: false,
// })
// export class BlockNewAccountSchema extends Model {
//   @Column({
//     type: DataType.BOOLEAN,
//     allowNull: false,
//   })
//   state!: boolean;

//   @Column({
//     type: DataType.INTEGER,
//     allowNull: false,
//   })
//   req!: number;
// }

// // ConfessionSchema
// @Table({
//   tableName: 'confession_schema',
//   timestamps: false,
// })
// export class ConfessionSchema extends Model {
//   @Column(DataType.JSON)
//   panel!: object | null;

//   @Column(DataType.BOOLEAN)
//   disable!: boolean | null;

//   @Column(DataType.JSON)
//   ALL_CONFESSIONS!: object | null;

//   @Column(DataType.INTEGER)
//   cooldown!: number | null;
// }

// // DbEmbedObject
// @Table({
//   tableName: 'db_embed_objects',
//   timestamps: false,
// })
// export class DbEmbedObject extends Model {
// //   @PrimaryKey
//   @Column(DataType.STRING)
//   code!: string;

//   @Column(DataType.STRING)
//   embedOwner!: string;

//   @Column(DataType.JSON)
//   embedSource!: object;
// }

// // GhostPingData
// @Table({
//   tableName: 'ghost_ping_data',
//   timestamps: false,
// })
// export class GhostPingData extends Model {
//   @Column(DataType.JSON)
//   channels!: object | null;

//   @Column(DataType.BOOLEAN)
//   active!: boolean | null;
// }

// // EconomyUserSchema
// @Table({
//   tableName: 'economy_user_schema',
//   timestamps: false,
// })
// export class EconomyUserSchema extends Model {
//   @Column(DataType.INTEGER)
//   money!: number | null;

//   @Column(DataType.INTEGER)
//   bank!: number | null;

//   @Column(DataType.INTEGER)
//   daily!: number | null;

//   @Column(DataType.INTEGER)
//   monthly!: number | null;

//   @Column(DataType.INTEGER)
//   weekly!: number | null;

//   @Column(DataType.INTEGER)
//   work!: number | null;
// }

// // GuildConfigSchema
// @Table({
//   tableName: 'guild_config_schema',
//   timestamps: false,
// })
// export class GuildConfigSchema extends Model {
//   @Column(DataType.STRING)
//   joinmessage!: string | null;

//   @Column(DataType.JSON)
//   joinbanner!: object | null;

//   @Column(DataType.STRING)
//   joinbannerStates!: string | null;

//   @Column(DataType.STRING)
//   join!: string | null;

//   @Column(DataType.STRING)
//   leave!: string | null;

//   @Column(DataType.STRING)
//   joindm!: string | null;

//   @Column(DataType.JSON)
//   joinroles!: object | null;

//   @Column(DataType.STRING)
//   leavemessage!: string | null;

//   @Column(DataType.STRING)
//   mass_mention!: string | null;

//   @Column(DataType.STRING)
//   antipub!: string | null;

//   @Column(DataType.STRING)
//   spam!: string | null;

//   @Column(DataType.BOOLEAN)
//   hey_reaction!: boolean | null;

//   @Column(DataType.JSON)
//   rolesaver!: object | null;

//   @Column(DataType.JSON)
//   GHOST_PING!: object | null;
// }

// // GuildStats
// @Table({
//   tableName: 'guild_stats',
//   timestamps: false,
// })
// export class GuildStats extends Model {
//   @Column(DataType.JSON)
//   USER!: object | null;
// }

// // InvitesUserData
// @Table({
//   tableName: 'invites_user_data',
//   timestamps: false,
// })
// export class InvitesUserData extends Model {
//   @Column(DataType.STRING)
//   inviter!: string | null;

//   @Column(DataType.STRING)
//   invite!: string | null;

//   @Column(DataType.INTEGER)
//   regular!: number | null;

//   @Column(DataType.INTEGER)
//   invites!: number | null;

//   @Column(DataType.INTEGER)
//   bonus!: number | null;

//   @Column(DataType.INTEGER)
//   leaves!: number | null;
// }

// // JoinBannerOptions
// @Table({
//   tableName: 'join_banner_options',
//   timestamps: false,
// })
// export class JoinBannerOptions extends Model {
//   @Column(DataType.STRING)
//   backgroundURL!: string;

//   @Column({
//     type: DataType.ENUM('hexProfileColor', 'status'),
//     allowNull: false,
//   })
//   profilePictureRound!: string;

//   @Column(DataType.STRING)
//   message!: string;

//   @Column(DataType.STRING)
//   textColour!: string;

//   @Column(DataType.STRING)
//   textSize!: string;

//   @Column(DataType.STRING)
//   avatarSize!: string;
// }

// // MemberCountSchema
// @Table({
//   tableName: 'member_count_schema',
//   timestamps: false,
// })
// export class MemberCountSchema extends Model {
//   @Column(DataType.JSON)
//   member!: object | null;

//   @Column(DataType.JSON)
//   roles!: object | null;

//   @Column(DataType.JSON)
//   bot!: object | null;

//   @Column(DataType.JSON)
//   boost!: object | null;

//   @Column(DataType.JSON)
//   channel!: object | null;
// }

// // NotifierLastNotifiedMedias Model
// @Table({ tableName: 'notifier_last_notified_medias', timestamps: false })
// export class NotifierLastNotifiedMedias extends Model<NotifierLastNotifiedMedias> {
//   @Column({
//     type: DataType.STRING,
//     allowNull: false
//   })
//   userId!: string;

//   @Column({
//     type: DataType.STRING,
//     allowNull: false
//   })
//   mediaId!: string;
// }

// // NotifierSchema Model
// @Table({ tableName: 'notifier_schema', timestamps: false })
// export class NotifierSchema extends Model<NotifierSchema> {
//   @Column({
//     type: DataType.STRING,
//     allowNull: true
//   })
//   message?: string;

//   @Column({
//     type: DataType.JSON,
//     allowNull: true
//   })
//   users?: any; // Specify a more accurate type if possible

//   @Column({
//     type: DataType.JSON,
//     allowNull: true
//   })
//   lastMediaNotified?: any; // Specify a more accurate type if possible

//   @Column({
//     type: DataType.STRING,
//     allowNull: false
//   })
//   channelId!: string;
// }

// // NotifierUserSchema Model
// @Table({ tableName: 'notifier_user_schema', timestamps: false })
// export class NotifierUserSchema extends Model<NotifierUserSchema> {
//   @Column({
//     type: DataType.STRING,
//     allowNull: false
//   })
//   id_or_username!: string;

//   @Column({
//     type: DataType.STRING,
//     allowNull: false
//   })
//   platform!: string;
// }

// // PunishPubSchema Model
// @Table({ tableName: 'punish_pub_schema', timestamps: false })
// export class PunishPubSchema extends Model<PunishPubSchema> {
//   @Column({
//     type: DataType.INTEGER,
//     allowNull: true
//   })
//   amountMax?: number;

//   @Column({
//     type: DataType.STRING,
//     allowNull: true
//   })
//   punishmentType?: string;

//   @Column({
//     type: DataType.STRING,
//     allowNull: true
//   })
//   state?: string;
// }

// // ReactionRolesData Model
// @Table({ tableName: 'reaction_roles_data', timestamps: false })
// export class ReactionRolesData extends Model<ReactionRolesData> {
//   @Column({
//     type: DataType.STRING,
//     primaryKey: true
//   })
//   messageId!: string;

//   @Column({
//     type: DataType.JSON,
//     allowNull: false
//   })
//   reaction!: any; // Specify a more accurate type if possible
// }

// // RoleSaverData Model
// @Table({ tableName: 'role_saver_data', timestamps: false })
// export class RoleSaverData extends Model<RoleSaverData> {
//   @Column({
//     type: DataType.STRING,
//     primaryKey: true
//   })
//   userId!: string;

//   @Column({
//     type: DataType.JSON,
//     allowNull: false
//   })
//   roles!: any; // Specify a more accurate type if possible
// }

// // RoleSaverSchema Model
// @Table({ tableName: 'role_saver_schema', timestamps: false })
// export class RoleSaverSchema extends Model<RoleSaverSchema> {
//   @Column({
//     type: DataType.BOOLEAN,
//     allowNull: true
//   })
//   enable?: boolean;

//   @Column({
//     type: DataType.STRING,
//     allowNull: true
//   })
//   timeout?: string;

//   @Column({
//     type: DataType.STRING,
//     allowNull: true
//   })
//   admin?: string;
// }

// // SecuritySchema Model
// @Table({ tableName: 'security_schema', timestamps: false })
// export class SecuritySchema extends Model<SecuritySchema> {
//   @Column({
//     type: DataType.STRING,
//     allowNull: true
//   })
//   channel?: string;

//   @Column({
//     type: DataType.BOOLEAN,
//     allowNull: true
//   })
//   disable?: boolean;

//   @Column({
//     type: DataType.STRING,
//     allowNull: true
//   })
//   role?: string;
// }

// // SnipeData Model
// @Table({ tableName: 'snipe_data', timestamps: false })
// export class SnipeData extends Model<SnipeData> {
//   @Column({
//     type: DataType.STRING,
//     primaryKey: true
//   })
//   channelId!: string;

//   @Column({
//     type: DataType.STRING,
//     allowNull: false
//   })
//   snipe!: string;

//   @Column({
//     type: DataType.STRING,
//     allowNull: false
//   })
//   snipeUserInfoTag!: string;

//   @Column({
//     type: DataType.STRING,
//     allowNull: false
//   })
//   snipeUserInfoPp!: string;

//   @Column({
//     type: DataType.INTEGER,
//     allowNull: false
//   })
//   snipeTimestamp!: number;
// }

// // StatsMessage Model
// @Table({ tableName: 'stats_messages', timestamps: false })
// export class StatsMessage extends Model<StatsMessage> {
//   @Column({
//     type: DataType.BIGINT,
//     allowNull: false
//   })
//   sentTimestamp!: number;

//   @Column({
//     type: DataType.INTEGER,
//     allowNull: false
//   })
//   contentLength!: number;

//   @Column({
//     type: DataType.STRING,
//     allowNull: false
//   })
//   channelId!: string;
// }

// // StatsVoice Model
// @Table({ tableName: 'stats_voices', timestamps: false })
// export class StatsVoice extends Model<StatsVoice> {
//   @Column({
//     type: DataType.BIGINT,
//     allowNull: false
//   })
//   startTimestamp!: number;

//   @Column({
//     type: DataType.BIGINT,
//     allowNull: false
//   })
//   endTimestamp!: number;

//   @Column({
//     type: DataType.STRING,
//     allowNull: false
//   })
//   channelId!: string;
// }

// // SuggestionData Model
// @Table({ tableName: 'suggestion_data', timestamps: false })
// export class SuggestionData extends Model<SuggestionData> {
//   @Column({
//     type: DataType.STRING,
//     primaryKey: true
//   })
//   suggestCode!: string;

//   @Column({
//     type: DataType.STRING,
//     allowNull: false
//   })
//   author!: string;

//   @Column({
//     type: DataType.STRING,
//     allowNull: false
//   })
//   msgId!: string;

//   @Column({
//     type: DataType.BOOLEAN,
//     allowNull: true
//   })
//   replied?: boolean;
// }

// // SuggestSchema Model
// @Table({ tableName: 'suggest_schema', timestamps: false })
// export class SuggestSchema extends Model<SuggestSchema> {
//   @Column({
//     type: DataType.STRING,
//     allowNull: false
//   })
//   channel!: string;

//   @Column({
//     type: DataType.BOOLEAN,
//     allowNull: true
//   })
//   disable?: boolean;
// }

// // TicketUserData Model
// @Table({ tableName: 'ticket_user_data', timestamps: false })
// export class TicketUserData extends Model<TicketUserData> {
//   @Column({
//     type: DataType.STRING,
//     primaryKey: true
//   })
//   channelId!: string;

//   @Column({
//     type: DataType.STRING,
//     allowNull: false
//   })
//   channel!: string;

//   @Column({
//     type: DataType.STRING,
//     allowNull: false
//   })
//   author!: string;

//   @Column({
//     type: DataType.BOOLEAN,
//     allowNull: false
//   })
//   alive!: boolean;
// }

// // TicketData Model
// @Table({ tableName: 'ticket_data', timestamps: false })
// export class TicketData extends Model<TicketData> {
//   @Column({
//     type: DataType.STRING,
//     primaryKey: true
//   })
//   userId!: string;

//   @HasMany(() => TicketUserData, { foreignKey: 'userId' })
//   ticketUserData?: TicketUserData[];
// }

// // UserStats Model
// @Table({ tableName: 'user_stats', timestamps: false })
// export class UserStats extends Model<UserStats> {
//   @Column({
//     type: DataType.JSON,
//     allowNull: true
//   })
//   messages?: any; // Specify a more accurate type if possible

//   @Column({
//     type: DataType.JSON,
//     allowNull: true
//   })
//   voices?: any; // Specify a more accurate type if possible
// }

// // UtilsData Model
// @Table({ tableName: 'utils_data', timestamps: false })
// export class UtilsData extends Model<UtilsData> {
//   @Column({
//     type: DataType.JSON,
//     allowNull: true
//   })
//   PERMS?: any; // Specify a more accurate type if possible

//   @Column({
//     type: DataType.JSON,
//     allowNull: true
//   })
//   USER_PERMS?: any; // Specify a more accurate type if possible
// }

// // VoiceData Model
// @Table({ tableName: 'voice_data', timestamps: false })
// export class VoiceData extends Model<VoiceData> {
//   @Column({
//     type: DataType.STRING,
//     allowNull: true
//   })
//   staff_role?: string;

//   @Column({
//     type: DataType.JSON,
//     allowNull: true
//   })
//   interface?: any; // Specify a more accurate type if possible

//   @Column({
//     type: DataType.STRING,
//     allowNull: true
//   })
//   voice_channel?: string;
// }

// // XpLevelingUserSchema Model
// @Table({ tableName: 'xp_leveling_user_schema', timestamps: false })
// export class XpLevelingUserSchema extends Model<XpLevelingUserSchema> {
//   @Column({
//     type: DataType.INTEGER,
//     allowNull: true
//   })
//   xp?: number;

//   @Column({
//     type: DataType.INTEGER,
//     allowNull: true
//   })
//   xptotal?: number;

//   @Column({
//     type: DataType.INTEGER,
//     allowNull: true
//   })
//   level?: number;
// }

// // AllowListData Model
// @Table({ tableName: 'allow_list_data', timestamps: false })
// export class AllowListData extends Model<AllowListData> {
//   @Column({
//     type: DataType.BOOLEAN,
//     allowNull: true
//   })
//   enable?: boolean;

//   @Column({
//     type: DataType.JSON,
//     allowNull: true
//   })
//   list?: any; // Specify a more accurate type if possible
// }

// // AntiSpam Model
// @Table({ tableName: 'antispam', timestamps: false })
// export class AntiSpam extends Model<AntiSpam> {
//   @Column({
//     type: DataType.JSON,
//     allowNull: true
//   })
//   bypassRoles?: any; // Specify a more accurate type if possible

//   @Column({
//     type: DataType.JSON,
//     allowNull: true
//   })
//   bypassChannels?: any; // Specify a more accurate type if possible

//   @Column({
//     type: DataType.BOOLEAN,
//     allowNull: true
//   })
//   ignoreBots?: boolean;

//   @Column({
//     type: DataType.INTEGER,
//     allowNull: true
//   })
//   maxInterval?: number;

//   @Column({
//     type: DataType.BOOLEAN,
//     allowNull: true
//   })
//   Enabled?: boolean;

//   @Column({
//     type: DataType.INTEGER,
//     allowNull: true
//   })
//   threshold?: number;

//   @Column({
//     type: DataType.BOOLEAN,
//     allowNull: true
//   })
//   removeMessages?: boolean;

//   @Column({
//     type: DataType.STRING,
//     allowNull: true
//   })
//   punishmentType?: string;

//   @Column({
//     type: DataType.INTEGER,
//     allowNull: true
//   })
//   punishTime?: number;
// }
