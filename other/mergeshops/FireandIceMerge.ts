/*
name: FireandIceMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/FireandIceMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { DragonFableOrigins } from "../../story/DragonFableOrigins";

const Adv = new CoreAdvanced();
const DFO = new DragonFableOrigins();

export class FireandIceMerge {
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
                case "Fire and Ice Token":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(6326);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("drakonnan", "Fire Dragon", "Dragon Scale");
                        Core.huntMonster("drakonnan", "Living Fire", "Ember of a Living Flame");
                        Core.huntMonster("drakonnan", "Fire Elemental", "Fire Elemental's Gauntlet");
                        Core.huntMonster("drakonnan", "Living Lava", "Lava Rock");
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Ice Katana":
                    Core.equipClass(ClassType.Farm);
                    Core.ensureAccept(6319);
                    Core.huntMonster("drakonnan", "Living Fire", "Inferno Heart");
                    Core.ensureComplete(6319);
                    break;
            }
        };
        DFO.dragonFableOriginsAll();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("drakonnan", 1596, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "43757",
            "Floating Fire Orb Replica",
            'Mode: [select] only\nShould the bot buy "Floating Fire Orb Replica" ?',
            false,
        ),
        option.bool("43760", "Dual Ice Katanas", 'Mode: [select] only\nShould the bot buy "Dual Ice Katanas" ?', false),
        option.bool(
            "43777",
            "Cold as Ice Katana",
            'Mode: [select] only\nShould the bot buy "Cold as Ice Katana" ?',
            false,
        ),
        option.bool(
            "43685",
            "Enchanted Ice Katana",
            'Mode: [select] only\nShould the bot buy "Enchanted Ice Katana" ?',
            false,
        ),
        option.bool(
            "43761",
            "Dual Enchanted Ice Katanas",
            'Mode: [select] only\nShould the bot buy "Dual Enchanted Ice Katanas" ?',
            false,
        ),
        option.bool("43778", "Ice Cold Katana", 'Mode: [select] only\nShould the bot buy "Ice Cold Katana" ?', false),
        option.bool("43768", "Lava Pillar I", 'Mode: [select] only\nShould the bot buy "Lava Pillar I" ?', false),
        option.bool("43769", "Lava Pillar II", 'Mode: [select] only\nShould the bot buy "Lava Pillar II" ?', false),
        option.bool("43770", "Lava Pillar III", 'Mode: [select] only\nShould the bot buy "Lava Pillar III" ?', false),
        option.bool("43771", "Lava Pillar IV", 'Mode: [select] only\nShould the bot buy "Lava Pillar IV" ?', false),
        option.bool("43772", "Lava Pool I", 'Mode: [select] only\nShould the bot buy "Lava Pool I" ?', false),
        option.bool("43773", "Lava Pool II", 'Mode: [select] only\nShould the bot buy "Lava Pool II" ?', false),
        option.bool(
            "43774",
            "Large Lava Pool I",
            'Mode: [select] only\nShould the bot buy "Large Lava Pool I" ?',
            false,
        ),
        option.bool(
            "43775",
            "Large Lava Pool II",
            'Mode: [select] only\nShould the bot buy "Large Lava Pool II" ?',
            false,
        ),
        option.bool(
            "43776",
            "Vanilla Ice Katana",
            'Mode: [select] only\nShould the bot buy "Vanilla Ice Katana" ?',
            false,
        ),
        option.bool(
            "43579",
            "FlameDragon Knight",
            'Mode: [select] only\nShould the bot buy "FlameDragon Knight" ?',
            false,
        ),
        option.bool(
            "43580",
            "FlameDragon Knight's Helm",
            'Mode: [select] only\nShould the bot buy "FlameDragon Knight\'s Helm" ?',
            false,
        ),
        option.bool(
            "43581",
            "FlameDragon Knight's Blade",
            'Mode: [select] only\nShould the bot buy "FlameDragon Knight\'s Blade" ?',
            false,
        ),
        option.bool(
            "43582",
            "Wings of the Flame Dragon",
            'Mode: [select] only\nShould the bot buy "Wings of the Flame Dragon" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: FireandIceMerge.select,
});

export default function main(): void {
    const script = new FireandIceMerge();
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
