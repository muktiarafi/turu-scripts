/*
name: Twilight Zone Merge
description: This bot will farm the items belonging to the selected mode for the Twilight Zone Merge [2293] in /twilightzone
tags: twilight, zone, merge, twilightzone, evacuation, protocol, suit, emergency, scuba, drill, , beard, sea, base, flotation, device, hose, ring, rings, mindflayers, infested, bow, arrow, devouring, seas, eldritch, dirk
*/
// Port of Scripts/Other/MergeShops/TwilightZoneMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreAOR } from "../../story/ageofruin/CoreAOR";

const Adv = new CoreAdvanced();
const AoR = new CoreAOR();

export class TwilightZoneMerge {
    // [Can Change] This should only be changed by the author.
    //If true, it will not stop the script if the default case triggers and the user chose to only get mats
    private dontStopMissingIng = false;

    protectRequiredItems(): void {
        const items = ["Undine Visitor Badge", "Sundered Tentacle", "Leviathan Scale"];

        for (const item of items) {
            if (!Core.bankingBlackList.includes(item)) {
                Core.bankingBlackList.push(item);
            }
        }
    }

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
                case "Undine Visitor Badge":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("sunlightzone", "Astravian Illusion", req.name, quant, {
                        isTemp: false,
                        log: false,
                    });
                    bot.wait.forPickup(req.name);
                    break;
                case "Sundered Tentacle":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(9269);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("twilightzone", "Leviathan", "Leviathan Tentacle", 1, {
                            isTemp: true,
                            log: false,
                        });
                        Core.huntMonster("twilightzone", "Decay Spirit", "Decay Essence", 8, {
                            isTemp: true,
                            log: false,
                        });
                        Core.huntMonster("twilightzone", "Ice Guardian", "Tarnished Icicle", 8, {
                            isTemp: true,
                            log: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Leviathan Scale":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.logger("Better to use alts to farm it faster.");
                    Core.huntMonster("twilightzone", "Leviathan", "Leviathan Scale", quant, {
                        isTemp: false,
                        log: false,
                    });
                    bot.wait.forPickup(req.name);
                    break;
            }
        };
        this.protectRequiredItems();
        AoR.twilightZone();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("twilightzone", 2293, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "77092",
            "Evacuation Protocol Suit",
            'Mode: [select] only\nShould the bot buy "Evacuation Protocol Suit" ?',
            false,
        ),
        option.bool(
            "77093",
            "Emergency Scuba Hood",
            'Mode: [select] only\nShould the bot buy "Emergency Scuba Hood" ?',
            false,
        ),
        option.bool(
            "77094",
            "Evacuation Drill Hair + Beard",
            'Mode: [select] only\nShould the bot buy "Evacuation Drill Hair + Beard" ?',
            false,
        ),
        option.bool(
            "77095",
            "Evacuation Drill Locks",
            'Mode: [select] only\nShould the bot buy "Evacuation Drill Locks" ?',
            false,
        ),
        option.bool(
            "77097",
            "Sea Base Flotation Device",
            'Mode: [select] only\nShould the bot buy "Sea Base Flotation Device" ?',
            false,
        ),
        option.bool(
            "77101",
            "Sea Base Emergency Hose",
            'Mode: [select] only\nShould the bot buy "Sea Base Emergency Hose" ?',
            false,
        ),
        option.bool(
            "77102",
            "Sea Base Flotation Ring",
            'Mode: [select] only\nShould the bot buy "Sea Base Flotation Ring" ?',
            false,
        ),
        option.bool(
            "77103",
            "Sea Base Flotation Rings",
            'Mode: [select] only\nShould the bot buy "Sea Base Flotation Rings" ?',
            false,
        ),
        option.bool(
            "78056",
            "Mindflayer's Infested Bow and Arrow",
            'Mode: [select] only\nShould the bot buy "Mindflayer\'s Infested Bow and Arrow" ?',
            false,
        ),
        option.bool(
            "78051",
            "Devouring Sea's Blade",
            'Mode: [select] only\nShould the bot buy "Devouring Sea\'s Blade" ?',
            false,
        ),
        option.bool(
            "78052",
            "Devouring Sea's Blades",
            'Mode: [select] only\nShould the bot buy "Devouring Sea\'s Blades" ?',
            false,
        ),
        option.bool(
            "78053",
            "Eldritch Twilight Dirk",
            'Mode: [select] only\nShould the bot buy "Eldritch Twilight Dirk" ?',
            false,
        ),
        option.bool(
            "78054",
            "Eldritch Twilight Daggers",
            'Mode: [select] only\nShould the bot buy "Eldritch Twilight Daggers" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: TwilightZoneMerge.select,
});

export default function main(): void {
    const script = new TwilightZoneMerge();
    script.protectRequiredItems();
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
