/*
name: SkadePass Merge
description: This bot will farm the items belonging to the selected mode for the SkadePass Merge [2642] in /skadespass
tags: skadepass, merge, skadespass, frostborne, dragonslayer, cloak, dragonblade, shield, luminary, scythe, skade, skades, winged, snowpiercer, dragonblades, permafrost, juggernaut, snowsaga
*/
// Port of Scripts/Seasonal/Frostvale/SkadePassMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class SkadePassMerge {
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
                case "Icy Bone":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonsterQuest(Core.isMember ? 10513 : 10512, "skadespass", "Permafrost Dragon");
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Skade's Snowpiercer":

                case "Permafrost Heart":

                case "Frostborne Dragonslayer Helm":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    Core.huntMonster("skadespass", "Permafrost Dragon", req.name, quant, {
                        isTemp: req.temp,
                        log: false,
                    });
                    break;
                //#endregion
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("skadespass", 2642, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "97438",
            "Frostborne Dragonslayer",
            'Mode: [select] only\nShould the bot buy "Frostborne Dragonslayer" ?',
            false,
        ),
        option.bool(
            "97441",
            "Frostborne Dragonslayer Cloak",
            'Mode: [select] only\nShould the bot buy "Frostborne Dragonslayer Cloak" ?',
            false,
        ),
        option.bool(
            "97447",
            "Frostborne DragonBlade and Shield",
            'Mode: [select] only\nShould the bot buy "Frostborne DragonBlade and Shield" ?',
            false,
        ),
        option.bool(
            "97439",
            "Frostborne Luminary",
            'Mode: [select] only\nShould the bot buy "Frostborne Luminary" ?',
            false,
        ),
        option.bool(
            "97442",
            "Frostborne Scythe of Skade",
            'Mode: [select] only\nShould the bot buy "Frostborne Scythe of Skade" ?',
            false,
        ),
        option.bool(
            "97446",
            "Skade's Winged Snowpiercer",
            'Mode: [select] only\nShould the bot buy "Skade\'s Winged Snowpiercer" ?',
            false,
        ),
        option.bool(
            "97443",
            "Frostborne DragonBlade",
            'Mode: [select] only\nShould the bot buy "Frostborne DragonBlade" ?',
            false,
        ),
        option.bool(
            "97444",
            "Frostborne DragonBlades",
            'Mode: [select] only\nShould the bot buy "Frostborne DragonBlades" ?',
            false,
        ),
        option.bool(
            "97448",
            "Permafrost Dragonslayer",
            'Mode: [select] only\nShould the bot buy "Permafrost Dragonslayer" ?',
            false,
        ),
        option.bool(
            "97449",
            "Permafrost Juggernaut",
            'Mode: [select] only\nShould the bot buy "Permafrost Juggernaut" ?',
            false,
        ),
        option.bool(
            "97450",
            "Permafrost Dragonslayer Helm",
            'Mode: [select] only\nShould the bot buy "Permafrost Dragonslayer Helm" ?',
            false,
        ),
        option.bool(
            "97451",
            "Permafrost Dragonslayer Cloak",
            'Mode: [select] only\nShould the bot buy "Permafrost Dragonslayer Cloak" ?',
            false,
        ),
        option.bool(
            "97452",
            "Permafrost Scythe of Skade",
            'Mode: [select] only\nShould the bot buy "Permafrost Scythe of Skade" ?',
            false,
        ),
        option.bool(
            "97453",
            "Permafrost DragonBlade",
            'Mode: [select] only\nShould the bot buy "Permafrost DragonBlade" ?',
            false,
        ),
        option.bool(
            "97454",
            "Permafrost DragonBlades",
            'Mode: [select] only\nShould the bot buy "Permafrost DragonBlades" ?',
            false,
        ),
        option.bool(
            "97455",
            "Skade's Snowsaga",
            'Mode: [select] only\nShould the bot buy "Skade\'s Snowsaga" ?',
            false,
        ),
        option.bool(
            "97456",
            "Skade's Winged Snowsaga",
            'Mode: [select] only\nShould the bot buy "Skade\'s Winged Snowsaga" ?',
            false,
        ),
        option.bool(
            "97457",
            "Permafrost DragonBlade and Shield",
            'Mode: [select] only\nShould the bot buy "Permafrost DragonBlade and Shield" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: SkadePassMerge.select,
});

export default function main(): void {
    const script = new SkadePassMerge();
    Core.bankingBlackList.push("Icy Bone", "Skade's Snowpiercer", "Permafrost Heart", "Frostborne Dragonslayer Helm");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
