/*
name: EternalChaosMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/EternalChaosMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class EternalChaosMerge {
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
                case "Reality Shard":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(8456);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("eternalchaos", "Chaos Time Fairy", "Preserved Chaos Fairy Wing", 5, {
                            log: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("eternalchaos", 2089, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("64866", "Chaos Poncho", 'Mode: [select] only\nShould the bot buy "Chaos Poncho" ?', false),
        option.bool("64867", "Chaos Stetson", 'Mode: [select] only\nShould the bot buy "Chaos Stetson" ?', false),
        option.bool(
            "64868",
            "Chaos Stetson + Locks",
            'Mode: [select] only\nShould the bot buy "Chaos Stetson + Locks" ?',
            false,
        ),
        option.bool("64869", "Chaotic Hood", 'Mode: [select] only\nShould the bot buy "Chaotic Hood" ?', false),
        option.bool(
            "64870",
            "Chaotic Hood + Bangs",
            'Mode: [select] only\nShould the bot buy "Chaotic Hood + Bangs" ?',
            false,
        ),
        option.bool("64871", "Chaotic Mask", 'Mode: [select] only\nShould the bot buy "Chaotic Mask" ?', false),
        option.bool(
            "64872",
            "Chaotic Mask + Bangs",
            'Mode: [select] only\nShould the bot buy "Chaotic Mask + Bangs" ?',
            false,
        ),
        option.bool(
            "64873",
            "Chaos Trench Coat",
            'Mode: [select] only\nShould the bot buy "Chaos Trench Coat" ?',
            false,
        ),
        option.bool(
            "64874",
            "Chaos Trench Coat + Sword",
            'Mode: [select] only\nShould the bot buy "Chaos Trench Coat + Sword" ?',
            false,
        ),
        option.bool(
            "64875",
            "Sheathed Chaos Sword",
            'Mode: [select] only\nShould the bot buy "Sheathed Chaos Sword" ?',
            false,
        ),
        option.bool("64876", "Chaos Longsword", 'Mode: [select] only\nShould the bot buy "Chaos Longsword" ?', false),
        option.bool("64877", "Chaos Revolver", 'Mode: [select] only\nShould the bot buy "Chaos Revolver" ?', false),
        option.bool(
            "64878",
            "Dual Chaos Revolvers",
            'Mode: [select] only\nShould the bot buy "Dual Chaos Revolvers" ?',
            false,
        ),
        option.bool(
            "64879",
            "Chaos Backstabber",
            'Mode: [select] only\nShould the bot buy "Chaos Backstabber" ?',
            false,
        ),
        option.bool(
            "64880",
            "Dual Chaos Backstabbers",
            'Mode: [select] only\nShould the bot buy "Dual Chaos Backstabbers" ?',
            false,
        ),
        option.bool(
            "64881",
            "Reversed Chaos Backstabber",
            'Mode: [select] only\nShould the bot buy "Reversed Chaos Backstabber" ?',
            false,
        ),
        option.bool(
            "64882",
            "Dual Reversed Chaos Backstabbers",
            'Mode: [select] only\nShould the bot buy "Dual Reversed Chaos Backstabbers" ?',
            false,
        ),
        option.bool(
            "64883",
            "Chaos Dagger Revolvers",
            'Mode: [select] only\nShould the bot buy "Chaos Dagger Revolvers" ?',
            false,
        ),
        option.bool("67059", "TimeReaper", 'Mode: [select] only\nShould the bot buy "TimeReaper" ?', false),
        option.bool(
            "67061",
            "TimeReaper Halo Hair",
            'Mode: [select] only\nShould the bot buy "TimeReaper Halo Hair" ?',
            false,
        ),
        option.bool(
            "67063",
            "TimeReaper Halo Locks",
            'Mode: [select] only\nShould the bot buy "TimeReaper Halo Locks" ?',
            false,
        ),
        option.bool("67064", "TimeReaper Hat", 'Mode: [select] only\nShould the bot buy "TimeReaper Hat" ?', false),
        option.bool(
            "67065",
            "TimeReaper Hat + Locks",
            'Mode: [select] only\nShould the bot buy "TimeReaper Hat + Locks" ?',
            false,
        ),
        option.bool(
            "67068",
            "TimeReaper Mantle",
            'Mode: [select] only\nShould the bot buy "TimeReaper Mantle" ?',
            false,
        ),
        option.bool(
            "67069",
            "TimeReaper Awakened Mantle",
            'Mode: [select] only\nShould the bot buy "TimeReaper Awakened Mantle" ?',
            false,
        ),
        option.bool("67070", "TimeReaper Runes", 'Mode: [select] only\nShould the bot buy "TimeReaper Runes" ?', false),
        option.bool("67071", "TimeReaper Blade", 'Mode: [select] only\nShould the bot buy "TimeReaper Blade" ?', false),
        option.bool(
            "67072",
            "Dual TimeReaper Blades",
            'Mode: [select] only\nShould the bot buy "Dual TimeReaper Blades" ?',
            false,
        ),
        option.bool("67077", "TimeReaper Claw", 'Mode: [select] only\nShould the bot buy "TimeReaper Claw" ?', false),
        option.bool("67078", "TimeReaper Claws", 'Mode: [select] only\nShould the bot buy "TimeReaper Claws" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: EternalChaosMerge.select,
});

export default function main(): void {
    const script = new EternalChaosMerge();
    Core.bankingBlackList.push("Reality Shard");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
