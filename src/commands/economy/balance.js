const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js');
const User = require('../../models/User');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        if (!interaction.inGuild()) {
            interaction.reply({
                content: 'You can only run this command insede the server.',
                ephemeral: true,
            });
            return;
        }

        const targetUserId = interaction.options.get('user')?.value || interaction.member.id;

        await interaction.deferReply();

        const user = await User.findOne({ userId: targetUserId, guildId: interaction.guild.id });

        if (!user) {
            interaction.editReply(`<@${targetUserId}> doens't have a balance profile yet.`);
            return;
        }

        interaction.editReply(
            targetUserId === interaction.member.id
                ? `Your current balance is: **${user.balance}$**.`
                : `<@${targetUserId}>'s current balance is **${user.balance}$**.`
        )
    },

    name: 'balance',
    description: "See your/someone's balance.",
    options: [
        {
            name: 'user',
            description: 'The user whose you want to get the balance.',
            type: ApplicationCommandOptionType.User,
        },
    ],
};