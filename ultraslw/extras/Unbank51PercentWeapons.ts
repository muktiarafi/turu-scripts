/*
name: Unbank 51 Percent Weapons
description: Moves every banked weapon with at least 51 percent generic damage boost into the inventory.
tags: utility, bank, weapons
*/
// Port of Extras/Unbank51PercentWeapons.cs from UltrasLW by l0newolf12 (https://github.com/l0newolf12/UltrasLW, 8e48a9e).
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";

export class Unbank51PercentWeapons {
    unbankWeapons(): void {
        if (bot.flash.get<string>("ui.mcPopup.currentLabel") !== "Bank") {
            bot.bank.open();
        }

        bot.bank.load(false);
        bot.wait.forBankLoad(20);

        const weaponIDs = (bot.bank.items ?? [])
            .filter(
                (item) =>
                    item != null && !Core.noneEnhancableFilter(item) && Core.getBoostFloat(item, "dmgAll") >= 1.51,
            )
            .map((item) => item.id);

        if (weaponIDs.length === 0) {
            Core.logger("No banked 51 percent damage boost weapons were found.");
            return;
        }

        Core.unbank(...weaponIDs);
    }
}

export default function main(): void {
    const script = new Unbank51PercentWeapons();
    script.unbankWeapons();
}
