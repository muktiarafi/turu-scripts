/*
name: Aspiring Necromancer Merge
description: This will get all or selected items on this merge shop.
tags: aspiring-necromancer-merge, seasonal, aqw-anniversary
*/
// Port of Scripts/Seasonal/AqwBirthday/AspiringNecromancerMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class AspiringNecromancerMerge {
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
                case "Necromancer's Pride":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    //I Want to Be The Very Best Necromancer 7751
                    Core.registerQuests(7751);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonsterMapID("battleundera", 10, "Skeleton Captured", 10, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Necromancer's Joy":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    //Like No One Ever Was 7752
                    Core.registerQuests(7752);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("doomwood", "r8", "Left", "*", "Bones Collected", 15, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Necromancer's Insanity":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    //To Raise Them is my Real Quest 7753
                    bot.quests.updateQuest(2060);
                    bot.quests.updateQuest(3019);
                    Core.registerQuests(7753);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonsterMapID("necrodungeon", 46, "Dracolich Head");
                        Core.huntMonsterMapID("necrodungeon", 47, "Yet Another Dracolich Head");
                        Core.huntMonsterMapID("necrodungeon", 49, "More Dracolich Heads");
                        Core.huntMonsterMapID("underrealm", 24, "Fresh Agony Wraps", 5);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        if (!Core.isSeasonalMapActive("mogloween")) {
            return;
        }

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("mogloween", 1924, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "56830",
            "Ambitious Necromancer",
            'Mode: [select] only\nShould the bot buy "Ambitious Necromancer" ?',
            false,
        ),
        option.bool(
            "56831",
            "Ambitious Necromancer Hair",
            'Mode: [select] only\nShould the bot buy "Ambitious Necromancer Hair" ?',
            false,
        ),
        option.bool(
            "56832",
            "Ambitious Necromancer Locks",
            'Mode: [select] only\nShould the bot buy "Ambitious Necromancer Locks" ?',
            false,
        ),
        option.bool(
            "56833",
            "Ambitious Necromancer Hair + Scarf",
            'Mode: [select] only\nShould the bot buy "Ambitious Necromancer Hair + Scarf" ?',
            false,
        ),
        option.bool(
            "56834",
            "Ambitious Necromancer Locks + Scarf",
            'Mode: [select] only\nShould the bot buy "Ambitious Necromancer Locks + Scarf" ?',
            false,
        ),
        option.bool(
            "56835",
            "Ambitious Necromancer Hat + Locks",
            'Mode: [select] only\nShould the bot buy "Ambitious Necromancer Hat + Locks" ?',
            false,
        ),
        option.bool(
            "56836",
            "Ambitious Necromancer Hat",
            'Mode: [select] only\nShould the bot buy "Ambitious Necromancer Hat" ?',
            false,
        ),
        option.bool(
            "56837",
            "Ambitious Necro Lantern on your back",
            'Mode: [select] only\nShould the bot buy "Ambitious Necro Lantern on your back" ?',
            false,
        ),
        option.bool(
            "56838",
            "Ambitious Necro Dagger",
            'Mode: [select] only\nShould the bot buy "Ambitious Necro Dagger" ?',
            false,
        ),
        option.bool(
            "56840",
            "Ambitious Necro Lantern + Dagger",
            'Mode: [select] only\nShould the bot buy "Ambitious Necro Lantern + Dagger" ?',
            false,
        ),
        option.bool("56841", "Deaddron", 'Mode: [select] only\nShould the bot buy "Deaddron" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: AspiringNecromancerMerge.select,
});

export default function main(): void {
    const script = new AspiringNecromancerMerge();
    Core.bankingBlackList.push("Necromancer's Pride", "Necromancer's Joy", "Necromancer's Insanity ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
