const { ApplicationCommandOptionType, Client, Interaction, AttachmentBuilder } = require("discord.js");
const canvacord = require('canvacord');
const calculateLevelXp = require('../../utils/calculatelevelxp');
const Level = require('../../models/Level');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        if (!interaction.inGuild()) {
            interaction.reply('You can only run this command inside the server.');
            return;
        }

        await interaction.deferReply();

        const mentionUserId = interaction.options.get('target-user')?.value;
        const targetUserId = mentionUserId || interaction.member.id;
        const targetUserObject = await interaction.guild.members.fetch(targetUserId)

        const fetchedLevel = await Level.findOne({
            userId: targetUserId,
            guildId: interaction.guild.id,
        });

        if (!fetchedLevel) {
            interaction.editReply(
                mentionUserId
                 ? `${targetUserObject.user.tag} doesn't have any level yet. Try again when they chat more.`
                 : `You don't have any levels yet. Chat more and try again.`
            );
            return;
        }

        let allLevels = await Level.find({ guildId: interaction.guild.id }).select('-_id userId level xp');

        allLevels.sort((a, b) => {
            if (a.level === b.level) {
                return b.xp - a.xp;
            } else {
                return b.level - a.level;
            }
        });

        let currentRank = allLevels.findIndex((lvl) => lvl.userId === targetUserId) + 1;
        const { Font } = require('canvacord');
        Font.loadDefault();


        const rank = new canvacord.RankCardBuilder()
            .setAvatar(targetUserObject.user.displayAvatarURL({ size: 512 }))
            .setRank(currentRank)
            .setLevel(fetchedLevel.level)
            .setCurrentXP(fetchedLevel.xp)
            .setRequiredXP(calculateLevelXp(fetchedLevel.level))
            .setStatus(targetUserObject.presence.status)
            .setDisplayName(targetUserObject.user.displayName)
            .setUsername(targetUserObject.user.username)
            .setTextStyles({
                level: "LEVEL:", 
                xp: "EXP:", 
                rank: "RANK:",
            })
            .setStyles({
                progressbar: {
                    thumb: {
                        style: {
                            backgroundColor: "#FFC300",
                        },
                    },
                },
            });
           
            const image = await rank.build({ format: 'png',});
            const attachment = new AttachmentBuilder(image);
            interaction.editReply({ files: [attachment] });
    },
    
    name: 'level',
    description: "Shows your/someone's level.",
    options: [
        {
            name: 'target-user',
            description: 'The user whose level you want to see.',
            type: ApplicationCommandOptionType.Mentionable,
        }
    ]

}