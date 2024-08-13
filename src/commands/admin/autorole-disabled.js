const { Client, Interaction, PermissionFlagsBits } = require('discord.js');
const AutoRole = require('../../models/AutoRole');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async(client, interaction) => {
        try {
            await interaction.deferReply();

            if (!(await AutoRole.exists({ guildId: interaction.guild.id }))) {
                interaction.editReply("Auto role has been disabled for the server. Use `/autorole-configure` to enable it.");
                return;
            }

            await AutoRole.findOneAndDelete({ guildId: interaction.guild.id });
            interaction.editReply("Auto role has been disabled for the server. Use `/autorole-configure` to enable it again.")
        } catch (error) {
           console.log(`There was an error(autorole-disabled.js): ${error}.`) 
        }
    },
    name: 'autorole-disable',
    description: "Disable auto-role in the sever.",
    permissionsRequired: [PermissionFlagsBits.Administrator],
}