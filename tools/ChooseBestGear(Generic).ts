/*
name: Choose Best Gear
description: Select a boost type you want to optimize for, and the bot will find and equip the best combination of gear for that boost.
tags: best, gear, boost, damage, dmg, dps, exp, gold, reputation, class points
*/
// Port of Scripts/Tools/ChooseBestGear(Generic).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, choices, defineScriptOptions, option } from "turu";
import { CoreAdvanced, GenericGearBoost } from "../core/CoreAdvanced";
import { Core } from "../core/CoreBots";

const Adv = new CoreAdvanced();

export class ChooseGenericBestGear {
    chooseItem(gearBoost: GenericGearBoost = GenericGearBoost.dmgAll, EnhanceEquipment = true): void {
        const _DisableBestGear = Core.cboBool("DisableBestGear") === true;
        if (Core.cboBool("DisableBestGear") !== null && _DisableBestGear) {
            Core.logger(
                "This bot requires you to have Best Gear enabled, please enable it in Options > CoreBots",
                undefined,
                { messageBox: true, stopBot: true },
            );
        }
        const _disableAutoEnhance = Core.cboBool("DisableAutoEnhance") === true;
        if (EnhanceEquipment && Core.cboBool("DisableAutoEnhance") !== null && _disableAutoEnhance) {
            Core.logger(
                "This bot requires you to have Auto-Enhance enabled, please enable it in Options > CoreBots",
                undefined,
                { messageBox: true, stopBot: true },
            );
        }

        if (EnhanceEquipment && bot.player.currentClass != null) {
            Adv.smartEnhance(bot.player.currentClass);
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "ChooseBestGenericGear",
    [
        option.choice(
            "GenericGearBoost",
            "Generic Gear Boost",
            "Choose From dropmenu list what Generic Gear Boost you want to equip ",
            choices(GenericGearBoost),
            GenericGearBoost.dmgAll,
        ),
        option.bool(
            "EnhanceEquipment",
            "Enhance Equipment",
            "Specifiy if your generic equipment to be enhanced or not",
            true,
        ),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    const script = new ChooseGenericBestGear();
    Core.setOptions();

    script.chooseItem(
        bot.config!.get<GenericGearBoost>("GenericGearBoost"),
        bot.config!.get<boolean>("EnhanceEquipment"),
    );

    Core.setOptions(false);
}
