/*
name: ShipWreckMerge[non-ac]
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/ShipWreckMerge[non-ac].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { ShipWreck } from "../../story/ShipWreck";

const Adv = new CoreAdvanced();
const shipWreck = new ShipWreck();

export class ShipWreckMerge {
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
                case "Enchanted Gauntlet Leather":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(4429);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("shipwreck", "Gilded Water", "Lifeless Water", 14);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Anti-Au Crystals":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(4430);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("shipwreck", "Gilded Crystal Undead", "Crystal Crew Shards", 8);
                        Core.huntMonster("shipwreck", "Captain Nubar", "Pirate Pistols", 8);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        shipWreck.storyLine();

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("shipwreck", 105, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "30503",
            "Gilded Dragonlord",
            'Mode: [select] only\nShould the bot buy "Gilded Dragonlord" ?',
            false,
        ),
        option.bool(
            "30504",
            "Gilded Dragon Faceplate",
            'Mode: [select] only\nShould the bot buy "Gilded Dragon Faceplate" ?',
            false,
        ),
        option.bool(
            "30505",
            "Gilded Dragon Crown",
            'Mode: [select] only\nShould the bot buy "Gilded Dragon Crown" ?',
            false,
        ),
        option.bool(
            "30506",
            "Amber Dragon Cape",
            'Mode: [select] only\nShould the bot buy "Amber Dragon Cape" ?',
            false,
        ),
        option.bool(
            "30507",
            "Amber Dragon Wings",
            'Mode: [select] only\nShould the bot buy "Amber Dragon Wings" ?',
            false,
        ),
        option.bool("30508", "Aurous Blessing", 'Mode: [select] only\nShould the bot buy "Aurous Blessing" ?', false),
        option.bool(
            "30509",
            "Golden Dragon Cape",
            'Mode: [select] only\nShould the bot buy "Golden Dragon Cape" ?',
            false,
        ),
        option.bool(
            "30510",
            "Golden Dragon Wings",
            'Mode: [select] only\nShould the bot buy "Golden Dragon Wings" ?',
            false,
        ),
        option.bool(
            "30441",
            "Killer Coral Crown",
            'Mode: [select] only\nShould the bot buy "Killer Coral Crown" ?',
            false,
        ),
        option.bool(
            "30442",
            "Shell Warrior Shag",
            'Mode: [select] only\nShould the bot buy "Shell Warrior Shag" ?',
            false,
        ),
        option.bool(
            "30443",
            "Shell Warrior Locks",
            'Mode: [select] only\nShould the bot buy "Shell Warrior Locks" ?',
            false,
        ),
        option.bool("30445", "Splashy Shag", 'Mode: [select] only\nShould the bot buy "Splashy Shag" ?', false),
        option.bool("30446", "Splashy Locks", 'Mode: [select] only\nShould the bot buy "Splashy Locks" ?', false),
        option.bool(
            "30092",
            "Wrath of Lobthulu",
            'Mode: [select] only\nShould the bot buy "Wrath of Lobthulu" ?',
            false,
        ),
        option.bool("30093", "Jewel of the Sea", 'Mode: [select] only\nShould the bot buy "Jewel of the Sea" ?', false),
        option.bool(
            "30094",
            "Gilded Widowmaker",
            'Mode: [select] only\nShould the bot buy "Gilded Widowmaker" ?',
            false,
        ),
        option.bool("30433", "Aquatic Defender", 'Mode: [select] only\nShould the bot buy "Aquatic Defender" ?', false),
        option.bool(
            "30440",
            "Killer Coral Crown Locks",
            'Mode: [select] only\nShould the bot buy "Killer Coral Crown Locks" ?',
            false,
        ),
        option.bool("30556", "Treasure Egg", 'Mode: [select] only\nShould the bot buy "Treasure Egg" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ShipWreckMerge.select,
});

export default function main(): void {
    const script = new ShipWreckMerge();
    Core.bankingBlackList.push("Enchanted Gauntlet Leather", "Anti-Au Crystals ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
