import { userMention } from "@discordjs/builders";
import * as DJS from "discord.js";
import { Bot } from "structures/Bot";
import { ValidateReturn } from "structures/Command/Command";
import { SubCommand } from "structures/Command/SubCommand";

export default class RemoveRoleCommand extends SubCommand {
  constructor(bot: Bot) {
    super(bot, {
      commandName: "admin",
      name: "nuke",
      description:
        "Nuke the current channel. Note: The channel will instantly be deleted and re-created.",
    });
  }

  async validate(
    interaction: DJS.CommandInteraction,
    lang: typeof import("@locales/english").default,
  ): Promise<ValidateReturn> {
    const perms = this.bot.utils.formatMemberPermissions(
      [DJS.Permissions.FLAGS.ADMINISTRATOR],
      interaction,
      lang,
    );
    if (perms) {
      return { ok: false, error: { content: perms, ephemeral: true } };
    }

    const botPerms = this.bot.utils.formatBotPermissions(
      [DJS.Permissions.FLAGS.MANAGE_CHANNELS],
      interaction,
      lang,
    );

    if (botPerms) {
      return { ok: false, error: { embeds: [botPerms], ephemeral: true } };
    }

    return { ok: true };
  }

  async execute(
    interaction: DJS.CommandInteraction,
    lang: typeof import("@locales/english").default,
  ) {
    const channel = interaction.channel as DJS.TextChannel;
    if (!channel) {
      return interaction.reply({ ephemeral: true, content: lang.GLOBAL.ERROR });
    }

    if (!channel.deletable) {
      return interaction.reply({
        ephemeral: true,
        content: lang.ADMIN.CHANNEL_CANNOT_BE_DELETED,
      });
    }

    const position = channel.position;
    const topic = channel.topic;

    const channel2 = await channel.clone({ position, topic: topic ?? "" });

    await channel.delete();

    await channel2.send({
      content: `${lang.ADMIN.NUKE_NUKED}. ${userMention(interaction.user.id)}`,
    });
  }
}