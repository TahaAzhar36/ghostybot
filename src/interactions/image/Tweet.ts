import * as DJS from "discord.js";
import fetch from "node-fetch";
import { Bot } from "structures/Bot";
import { ValidateReturn } from "structures/Command/Command";
import { SubCommand } from "structures/Command/SubCommand";

export default class TweetCommand extends SubCommand {
  constructor(bot: Bot) {
    super(bot, {
      commandName: "image",
      name: "tweet",
      description: "Returns an image with your tweet",
      options: [
        {
          name: "text",
          required: true,
          description: "The text that needs to be displayed",
          type: "STRING",
        },
      ],
    });
  }

  async validate(): Promise<ValidateReturn> {
    return { ok: true };
  }

  async execute(
    interaction: DJS.CommandInteraction,
    lang: typeof import("@locales/english").default,
  ) {
    await interaction.deferReply();

    const text = interaction.options.getString("text", true);

    const data = await fetch(
      `https://nekobot.xyz/api/imagegen?type=tweet&text=${encodeURIComponent(
        text,
      )}&username=${encodeURIComponent(interaction.user.username)}`,
    ).then((res) => res.json());

    const embed = this.bot.utils
      .baseEmbed(interaction)
      .setDescription(`${lang.IMAGE.CLICK_TO_VIEW}(${data.message})`)
      .setImage(data.message);

    await interaction.editReply({ embeds: [embed] });
  }
}