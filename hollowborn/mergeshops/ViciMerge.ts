/*
name: Vici Merge
description: This bot will farm the items belonging to the selected mode for the Vici Merge [2635] in /hbchallenge
tags: vici, merge, hbchallenge, hollowborn, darkblood, morph, face, backblades, darkdwellers, backhand, spear, chains, fallen, warden, keeper, venis, vicis, crown, vidis, armet
*/
// Port of Scripts/Hollowborn/MergeShops/ViciMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class ViciMerge {
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
                //#region Items not setup
                case "Hollow Horn":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonsterQuest(10488, "hbchallenge", "The Darkdweller");
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Hollow Hoof":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonsterQuest(10487, "hbchallenge", "Fallen Darkblood");
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Fallen Darkblood Skull":

                case "Vici's Hood":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    Core.huntMonster("hbchallenge", "Fallen Darkblood", req.name, quant, {
                        isTemp: req.temp,
                        log: false,
                    });
                    break;
                //#endregion
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("hbchallenge", 2635, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "96713",
            "Hollowborn Darkblood",
            'Mode: [select] only\nShould the bot buy "Hollowborn Darkblood" ?',
            false,
        ),
        option.bool(
            "96714",
            "Hollowborn Darkblood Hair",
            'Mode: [select] only\nShould the bot buy "Hollowborn Darkblood Hair" ?',
            false,
        ),
        option.bool(
            "96715",
            "Hollowborn Darkblood Locks",
            'Mode: [select] only\nShould the bot buy "Hollowborn Darkblood Locks" ?',
            false,
        ),
        option.bool(
            "96716",
            "Hollowborn Darkblood Morph",
            'Mode: [select] only\nShould the bot buy "Hollowborn Darkblood Morph" ?',
            false,
        ),
        option.bool(
            "96717",
            "Hollowborn Darkblood Face",
            'Mode: [select] only\nShould the bot buy "Hollowborn Darkblood Face" ?',
            false,
        ),
        option.bool(
            "96719",
            "Hollowborn Darkblood Backblades",
            'Mode: [select] only\nShould the bot buy "Hollowborn Darkblood Backblades" ?',
            false,
        ),
        option.bool(
            "96721",
            "Darkdweller's Backhand Spear",
            'Mode: [select] only\nShould the bot buy "Darkdweller\'s Backhand Spear" ?',
            false,
        ),
        option.bool(
            "96722",
            "Hollowborn Darkblood Blades",
            'Mode: [select] only\nShould the bot buy "Hollowborn Darkblood Blades" ?',
            false,
        ),
        option.bool(
            "96723",
            "Hollowborn Darkblood Blade",
            'Mode: [select] only\nShould the bot buy "Hollowborn Darkblood Blade" ?',
            false,
        ),
        option.bool(
            "96724",
            "Hollowborn Darkblood Axe",
            'Mode: [select] only\nShould the bot buy "Hollowborn Darkblood Axe" ?',
            false,
        ),
        option.bool(
            "96725",
            "Hollowborn Darkblood Axes",
            'Mode: [select] only\nShould the bot buy "Hollowborn Darkblood Axes" ?',
            false,
        ),
        option.bool(
            "96726",
            "Hollowborn Darkblood Chains",
            'Mode: [select] only\nShould the bot buy "Hollowborn Darkblood Chains" ?',
            false,
        ),
        option.bool("96727", "Fallen Darkblood", 'Mode: [select] only\nShould the bot buy "Fallen Darkblood" ?', false),
        option.bool(
            "96728",
            "Fallen Darkblood Morph",
            'Mode: [select] only\nShould the bot buy "Fallen Darkblood Morph" ?',
            false,
        ),
        option.bool(
            "96720",
            "Darkdweller's Spear",
            'Mode: [select] only\nShould the bot buy "Darkdweller\'s Spear" ?',
            false,
        ),
        option.bool(
            "96703",
            "Hollowborn Warden",
            'Mode: [select] only\nShould the bot buy "Hollowborn Warden" ?',
            false,
        ),
        option.bool(
            "96704",
            "Hollowborn Keeper",
            'Mode: [select] only\nShould the bot buy "Hollowborn Keeper" ?',
            false,
        ),
        option.bool("96705", "Veni's Helmet", 'Mode: [select] only\nShould the bot buy "Veni\'s Helmet" ?', false),
        option.bool("96706", "Vici's Crown", 'Mode: [select] only\nShould the bot buy "Vici\'s Crown" ?', false),
        option.bool("96708", "Vidi's Armet", 'Mode: [select] only\nShould the bot buy "Vidi\'s Armet" ?', false),
        option.bool(
            "96736",
            "Darkdweller's Backhand Spear",
            'Mode: [select] only\nShould the bot buy "Darkdweller\'s Backhand Spear" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ViciMerge.select,
});

export default function main(): void {
    const script = new ViciMerge();
    Core.bankingBlackList.push("Hollow Horn", "Hollow Hoof", "Fallen Darkblood Skull", "Vici's Hood");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
