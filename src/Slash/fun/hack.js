const {
    Client,
    Intents,
    Collection,
    EmbedBuilder,
    Permissions,
    ApplicationCommandType,
    PermissionsBitField,
    ApplicationCommandOptionType
} = require('discord.js');
const crypto = require('crypto')

module.exports = {
    name: 'hack',
    description: 'hack someone !',
    options: [
        {
            name: "user",
            type: ApplicationCommandOptionType.User,
            description: "The user you want to hack",
            required: true
        }
    ],
    run: async (client, interaction) => {
        const getLanguageData = require(`${process.cwd()}/src/lang/getLanguageData`);
        let data = await getLanguageData(interaction.guild.id);
        const wtf = require(`${process.cwd()}/files/ihorizon-api/wtf`);

        const victim = interaction.options.getUser("user")
        var ip = [
            '1',
            '100',
            '168',
            '254',
            '345',
            '128',
            '256',
            '255',
            '0',
            '144',
            '38',
            '67',
            '97',
            '32',
            '64',
            '192',
            '10',
            '172',
            '12',
            '200',
            '87',
            '150',
            '42',
            '99',
            '76',
            '211',
            '172',
            '18',
            '86',
            '55',
            '220',
            '7'
        ];

        var hackerNames = [
            'cyberpunk',
            'zeroday',
            'blackhat',
            'hackmaster',
            'shadowbyte',
            'crypt0',
            'phishr',
            'darknet',
            'rootaccess',
            'sploit3r',
            'hack3rman',
            'v1rus',
            'bytebandit',
            'malware',
            'scriptkiddie'
        ];

        var hackerDomains = [
            'hackmail.com',
            'darkweb.net',
            'blackhat.org',
            'zerodaymail.com',
            'phishmail.net',
            'cryptomail.org',
            'sploitmail.com',
            'hackergang.com',
            'rootmail.org',
            'v1rusmail.com'
        ];

        var hackerPasswords = [
            '5up3rP@$$w0rd',
            'H4x0r!z3d',
            'N0s3cur1ty',
            '3vilG3nius',
            '0bscureC0de',
            'Hacker123!',
            'P@$$phr4s3',
            'D3c3pt10n',
            '0v3rwr1t3',
            'V1rtu4lInf1ltr4t0r',
            'R3v3rse3ng1n33r',
            'C0mpl3xM4tr1x',
            'D1g1t4lS3cr3t',
            'Myst3ryH4ck',
            'Ph4nt0mC0ntrol'
        ];

        function generateRandomNumber() {
            var text = "";
            var possible = "0123456789";
            for (var i = 0; i < 8; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            return text;
        };

        var generatedIp = `${ip[Math.floor(Math.random() * ip.length)]}.${ip[Math.floor(Math.random() * ip.length)]}.${ip[Math.floor(Math.random() * ip.length)]}.${ip[Math.floor(Math.random() * ip.length)]}`;
        var generatedUsername = `${hackerNames[Math.floor(Math.random() * hackerNames.length)]}${generateRandomNumber()}`;
        var generatedEmail = `${generatedUsername}@${hackerDomains[Math.floor(Math.random() * hackerDomains.length)]}`;
        var generatedPhoneNumber = `+${generateRandomNumber()}`;
        var generatedPassword = hackerPasswords[Math.floor(Math.random() * hackerPasswords.length)];



        const idd = 'ihorizon';

        const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-';
        const base64EncodedID = Buffer.from(idd).toString('base64');

        function bruteForce() {
            const middle = generateRandomString(6);
            const end = generateRandomString(27);
            return `${base64EncodedID}.${middle}.${end}`;
        };

        function generateRandomString(length) {
            let result = '';
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result;
        };

        const embed = new EmbedBuilder()
            .setColor("#800000")
            .setDescription(data.hack_embed_description
                .replace(/\${victim\.id}/g, victim.id)
                .replace(/\${interaction\.user\.id}/g, interaction.user.id)
            )
            .addFields({ name: data.hack_embed_fields_ip, value: `\`${generatedIp}\`` },
                { name: data.hack_embed_fields_email, value: `\`${generatedEmail}\`` },
                { name: "☎", value: `\`${generatedPhoneNumber}\`` },
                { name: data.hack_embed_fields_password, value: `\`${generatedPassword}\`` },
                { name: "🔑", value: `\`${bruteForce()}\`` },
                { name: "🏚", value: `\`${wtf.address()}\`` },
                { name: "💳", value: `\`${wtf.cc()}\`` },)
            .setTimestamp()

        return interaction.reply({ embeds: [embed] });
    }
};