/*
name: Choose Best Gear (Racial)
description: Select a boost type you want to optimize for, and the bot will find and equip the best combination of gear for that boost.
tags: best, gear, boost, damage, dmg, dps, race, racial, racist, chaos, dragonkin, drakath, elemental, human, orc, undead
*/
// Port of Scripts/Tools/ChooseBestGear(Racial).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, choices, defineScriptOptions, option } from "turu";
import { CoreAdvanced, RacialGearBoost } from "../core/CoreAdvanced";
import { Core } from "../core/CoreBots";

const Adv = new CoreAdvanced();

export class ChooseRacialBestGear {
    chooseItem(gearBoost: RacialGearBoost = RacialGearBoost.None, EnhanceEquipment = true): void {
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
    "ChooseBestRacialGear",
    [
        option.choice(
            "RacialGearBoost",
            "Racial Gear Boost",
            "Choose From dropmenu list what Racial Damage Boost you want to equip ",
            choices(RacialGearBoost),
            RacialGearBoost.None,
        ),
        option.bool(
            "EnhanceEquipment",
            "Enhance Equipment",
            "Specifiy if your racial equipment to be enhanced or not",
            true,
        ),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    const script = new ChooseRacialBestGear();
    Core.setOptions();

    script.chooseItem(
        bot.config!.get<RacialGearBoost>("RacialGearBoost"),
        bot.config!.get<boolean>("EnhanceEquipment"),
    );

    Core.setOptions(false);
}
