/*
name: Termina Temple Merge
description: This bot will farm the items belonging to the selected mode for the Termina Temple Merge [2259] in /terminatemple
tags: termina, temple, merge, terminatemple, dragonlord, good, golden, dragonlords, royal, wrap, evil, tyrannical, doomblade, chaos, chaorrupted, dragonblade, battle, cleric, dragon, clerics, bright, cloak, accoutrements
*/
// Port of Scripts/Other/MergeShops/TerminaTempleMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreNSOD } from "../../evil/nsod/CoreNSOD";
import { CoreBLOD } from "../../good/blod/CoreBLOD";

const Adv = new CoreAdvanced();
const BLOD = new CoreBLOD();
const NSOD = new CoreNSOD();

export class TerminaTempleMerge {
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
                case "Bright Dragon Shield":

                case "Battle Cleric's Draconic Spear":

                case "DragonGuard Badge":

                case "Termina Sigil":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(9215);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("terminatemple", "Termina Defender", "Defender Sparred With", 8, {
                            log: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Bright Aura":
                    BLOD.brightAura(quant);
                    break;
                case "Void Aura":
                    NSOD.voidAuras(quant);
                    break;
                case "Trace of Chaos":
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("ultradrakath", "Champion of Chaos", undefined, undefined, { isTemp: false });
                        bot.wait.forPickup(req.name);
                    }
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("terminatemple", 2259, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "77403",
            "Dragonlord of Good",
            'Mode: [select] only\nShould the bot buy "Dragonlord of Good" ?',
            false,
        ),
        option.bool(
            "77404",
            "Golden Dragonlord's Helmet",
            'Mode: [select] only\nShould the bot buy "Golden Dragonlord\'s Helmet" ?',
            false,
        ),
        option.bool(
            "77405",
            "Royal Dragonlord's Wrap",
            'Mode: [select] only\nShould the bot buy "Royal Dragonlord\'s Wrap" ?',
            false,
        ),
        option.bool(
            "77406",
            "Golden Dragonlord's Blade",
            'Mode: [select] only\nShould the bot buy "Golden Dragonlord\'s Blade" ?',
            false,
        ),
        option.bool(
            "77407",
            "Dragonlord of Evil",
            'Mode: [select] only\nShould the bot buy "Dragonlord of Evil" ?',
            false,
        ),
        option.bool(
            "77408",
            "Tyrannical Dragonlord's Helmet",
            'Mode: [select] only\nShould the bot buy "Tyrannical Dragonlord\'s Helmet" ?',
            false,
        ),
        option.bool(
            "77409",
            "Tyrannical Dragonlord's Wrap",
            'Mode: [select] only\nShould the bot buy "Tyrannical Dragonlord\'s Wrap" ?',
            false,
        ),
        option.bool(
            "77410",
            "Tyrannical Dragonlord's Doomblade",
            'Mode: [select] only\nShould the bot buy "Tyrannical Dragonlord\'s Doomblade" ?',
            false,
        ),
        option.bool(
            "77411",
            "Dragonlord of Chaos",
            'Mode: [select] only\nShould the bot buy "Dragonlord of Chaos" ?',
            false,
        ),
        option.bool(
            "77412",
            "Chaorrupted Dragonlord's Helmet",
            'Mode: [select] only\nShould the bot buy "Chaorrupted Dragonlord\'s Helmet" ?',
            false,
        ),
        option.bool(
            "77413",
            "Chaorrupted Dragonlord's Wrap",
            'Mode: [select] only\nShould the bot buy "Chaorrupted Dragonlord\'s Wrap" ?',
            false,
        ),
        option.bool(
            "77414",
            "Chaorrupted Dragonblade",
            'Mode: [select] only\nShould the bot buy "Chaorrupted Dragonblade" ?',
            false,
        ),
        option.bool(
            "77668",
            "Battle Cleric of the Dragon",
            'Mode: [select] only\nShould the bot buy "Battle Cleric of the Dragon" ?',
            false,
        ),
        option.bool(
            "77669",
            "Battle Cleric's Helm",
            'Mode: [select] only\nShould the bot buy "Battle Cleric\'s Helm" ?',
            false,
        ),
        option.bool(
            "77670",
            "Battle Cleric's Bright Cloak",
            'Mode: [select] only\nShould the bot buy "Battle Cleric\'s Bright Cloak" ?',
            false,
        ),
        option.bool(
            "77673",
            "Battle Cleric's Bright Accoutrements",
            'Mode: [select] only\nShould the bot buy "Battle Cleric\'s Bright Accoutrements" ?',
            false,
        ),
        option.bool(
            "85297",
            "Chaos Gaze Scythe",
            'Mode: [select] only\nShould the bot buy "Chaos Gaze Scythe" ?',
            false,
        ),
        option.bool(
            "85298",
            "Empire's Origin Scythe",
            'Mode: [select] only\nShould the bot buy "Empire\'s Origin Scythe" ?',
            false,
        ),
        option.bool(
            "85299",
            "Justified Victory Scythe",
            'Mode: [select] only\nShould the bot buy "Justified Victory Scythe" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: TerminaTempleMerge.select,
});

export default function main(): void {
    const script = new TerminaTempleMerge();
    Core.bankingBlackList.push(
        "Termina Sigil",
        "Bright Aura",
        "Void Aura",
        "Trace of Chaos",
        "DragonGuard Badge",
        "Battle Cleric's Draconic Spear",
        "Bright Dragon Shield",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
