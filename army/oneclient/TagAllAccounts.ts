/*
name: Tag All
description: use the AutoTag to tag all accounds in the manager.
tags: tags, autotag, auto tag
*/
// Port of Scripts/Army/OneClient/TagAllAccounts.cs.

import { bot } from "turu";
import { CoreArmyLite } from "../CoreArmyLite";
import { Core } from "../../core/CoreBots";

const Army = new CoreArmyLite();

export class TagAll {
    doTheThing(): void {
        bot.options.reloginServer = "Twilly";

        const accounts = bot.army.accounts();
        const AccCount = accounts.length;
        let i = 1;

        while (!bot.shouldExit && Army.doForAll()) {
            while (!bot.shouldExit && !bot.player.loaded) {
                Core.sleep(1000);
                if (bot.wait.forMapLoad("battleon")) {
                    break;
                }
            }
            Core.logger(
                `Adding Tags to ${bot.player.username} [Account ${i}/${AccCount}], please be patient`,
                "Tag All",
            );
            // C# CoreBots.AutoAddTags writes tags to Skua Manager's account list; Turu's scripts
            // can't edit Army > Accounts, so this is skipped (C# disables the script anyway).
            Core.logger("Adding account tags isn't available in Turu, skipping.", "Tag All");
            Core.logger(`Tags for ${bot.player.username}, finished!`, "Tag All");
            i++;
        }
    }
}

export default function main(): void {
    Core.setOptions();

    bot.log(
        'OneClient scripts area bit fucked, and i just cant fix the "not logging into full server" issue.. so they will be disabled -- please use the normal varients of the scripts.',
    );
    // DoTheThing();

    Core.setOptions(false);
}
