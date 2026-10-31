/*
name: ShadowfallDefenseMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/ShadowfallDefenseMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { ShadowGates } from "../../story/ShadowGates";

const Adv = new CoreAdvanced();
const shadowGates = new ShadowGates();

export class ShadowfallDefenseMerge {
    // [Can Change] This should only be changed by the author.
    //              If true, it will not stop the script if the default case triggers and the user chose to only get mats
    private dontStopMissingIng = false;

    buyAllMerge(buyOnlyThis: string | null = null, buyMode: mergeOptionsEnum | null = null): void {
        const findIngredients = (): void => {
            const req = Adv.externalItem;
            const quant = Adv.externalQuant;
            if (req == null) {
                Core.logger("req is NULL");
                return;
            }

            switch (req.name) {
                default: {
                    const shouldStop = !Adv.matsOnly || !this.dontStopMissingIng;
                    Core.logger(
                        `The bot hasn't been taught how to get ${req.name}.` +
                            (shouldStop ? " Please report the issue." : " Skipping"),
                        undefined,
                        { messageBox: shouldStop, stopBot: shouldStop },
                    );
                    break;
                }
                //#endregion
                case "Dark Heart Medal":
                    shadowGates.storyLine();
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(3294);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        //Gravelyn's Dark Rewards 3294
                        Core.huntMonster("Shadowfall", "Skeletal Knight", "Infected Skull", 7);
                        Core.huntMonster("ShadowGates", "Chaos Warrior", "Chaorrupted Bones", 6);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("shadowgates", 803, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("22172", "Tentacular Locks", 'Mode: [select] only\nShould the bot buy "Tentacular Locks" ?', false),
        option.bool(
            "22171",
            "Tentacular Buzzcut",
            'Mode: [select] only\nShould the bot buy "Tentacular Buzzcut" ?',
            false,
        ),
        option.bool("22169", "Chaos Gem Staff", 'Mode: [select] only\nShould the bot buy "Chaos Gem Staff" ?', false),
        option.bool(
            "22168",
            "Runes, Interrupted",
            'Mode: [select] only\nShould the bot buy "Runes, Interrupted" ?',
            false,
        ),
        option.bool("22167", "Tentacular Crown", 'Mode: [select] only\nShould the bot buy "Tentacular Crown" ?', false),
        option.bool(
            "22166",
            "Chaorrupted Arcana Mage",
            'Mode: [select] only\nShould the bot buy "Chaorrupted Arcana Mage" ?',
            false,
        ),
        option.bool(
            "22162",
            "Chaorrupted Basher",
            'Mode: [select] only\nShould the bot buy "Chaorrupted Basher" ?',
            false,
        ),
        option.bool(
            "22161",
            "Broken Horn Basher",
            'Mode: [select] only\nShould the bot buy "Broken Horn Basher" ?',
            false,
        ),
        option.bool(
            "22103",
            "Burning Shadow Horns",
            'Mode: [select] only\nShould the bot buy "Burning Shadow Horns" ?',
            false,
        ),
        option.bool(
            "22102",
            "Blade of Rage and Fury",
            'Mode: [select] only\nShould the bot buy "Blade of Rage and Fury" ?',
            false,
        ),
        option.bool("22101", "Cloak of Shadows", 'Mode: [select] only\nShould the bot buy "Cloak of Shadows" ?', false),
        option.bool(
            "22100",
            "Knight of Shadows",
            'Mode: [select] only\nShould the bot buy "Knight of Shadows" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ShadowfallDefenseMerge.select,
});

export default function main(): void {
    const script = new ShadowfallDefenseMerge();
    Core.bankingBlackList.push("Dark Heart Medal ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
