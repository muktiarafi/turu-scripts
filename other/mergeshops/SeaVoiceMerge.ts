/*
name: SeaVoice Merge
description: This bot will farm the items belonging to the selected mode for the SeaVoice Merge [2320] in /seavoice
tags: seavoice, merge, seavoice, midnight, glaucus, sage, mystic, morph, companion, abyssal, atlanticus, trident
*/
// Port of Scripts/Other/MergeShops/SeaVoiceMerge.cs.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreAOR } from "../../story/ageofruin/CoreAOR";

const AOR = new CoreAOR();
const Adv = new CoreAdvanced();

export class SeaVoiceMerge {
    // [Can Change] This should only be changed by the author.
    //              If true, it will not stop the script if the default case triggers and the user chose to only get mats
    private dontStopMissingIng = false;

    protectRequiredItems(): void {
        const items = [
            "Algal Bloom",
            "Bioluminessence",
            "Dark Elf Pearl",
            "Glaucus Mystic",
            "Water Elf Pearl",
            "Water Elf Antler",
            "Glaucus Companion",
            "Sundered Tentacle",
            "Calamity Atlanticus Trident",
            "Glaucus Sage",
            "Midnight Glaucus Mystic",
            "Midnight Glaucus Sage",
        ];

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
                case "Bioluminessence":

                case "Calamity Atlanticus Trident":

                case "Glaucus Mystic":

                case "Glaucus Companion":
                    Core.farmingLogger(req.name, req.quantity);
                    this.attackVoiceInTheSea(req.name, quant);
                    break;
                case "Dark Elf Pearl":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(9339);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("trenchobserve", "Lady Noelle", "Noelle's Brooch", undefined, { log: false });
                        Core.huntMonster("trenchobserve", "Sea Spirit", "Green Sea Jelly", 2, { log: false });
                        Core.huntMonster("trenchobserve", "Necro Adipocere", undefined, undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Water Elf Pearl":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(9302);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("midnightzone", "Shadow Viscera", "Fleshy Shadows", 8, { log: false });
                        Core.huntMonster("midnightzone", "Venerated Wraith", "Wraith Memento", 8, { log: false });
                        Core.huntMonster("midnightzone", "Sparagmos", "Memory Card", undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Water Elf Antler":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(9316);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("abyssalzone", "The Ashray", "Ashray Artifacts", undefined, { log: false });
                        Core.huntMonster("abyssalzone", "Necro Adipocere", "Adipocere Antler", 3, { log: false });
                        Core.huntMonster("abyssalzone", "Foam Scavenger", "Scavenger Foam", 6, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
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
            }
        };
        this.protectRequiredItems();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("seavoice", 2320, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    attackVoiceInTheSea(itemName: string, quant: number): void {
        const PossibleSoloClasses = ["ArchPaladin"];

        // C# CBOBool(name, out bool value) && value
        const bestGearDisabled = Core.cboBool("DisableBestGear") === true;
        if (!bestGearDisabled && !Core.checkInventory(PossibleSoloClasses, undefined, { any: true })) {
            Core.logger("ArchPaladin not owned. Continuing with configured Solo class.");
        }

        Core.registerQuests(9349);
        Core.equipClass(ClassType.Solo);
        Core.addDrop("Algal Bloom", itemName);
        Core.unbank("Algal Bloom", itemName);
        Adv.gearStore(undefined, { enhAfter: true });

        let selectedClass = bot.player.currentClass;
        if (!bestGearDisabled) {
            selectedClass =
                PossibleSoloClasses.find(
                    (className) =>
                        bot.inventory.items.some((item) => item.name === className) ||
                        bot.bank.items.some((item) => item.name === className),
                ) ?? selectedClass;
        }
        if (!selectedClass?.trim()) {
            Core.logger("No soloing class found and nothing equipped; aborting SeaVoice.");
            return;
        }

        Core.logger(`Fighting Voice in the Sea with ${selectedClass}`);
        Adv.smartEnhance(selectedClass);
        Core.equip(selectedClass);
        AOR.fightVoiceInTheSea(itemName, quant);
        Adv.gearStore(true, { enhAfter: true });
        Core.cancelRegisteredQuests();
    }

    static readonly select = [
        option.bool(
            "79161",
            "Midnight Glaucus Sage",
            'Mode: [select] only\nShould the bot buy "Midnight Glaucus Sage" ?',
            false,
        ),
        option.bool(
            "79160",
            "Midnight Glaucus Mystic",
            'Mode: [select] only\nShould the bot buy "Midnight Glaucus Mystic" ?',
            false,
        ),
        option.bool("79154", "Glaucus Sage", 'Mode: [select] only\nShould the bot buy "Glaucus Sage" ?', false),
        option.bool(
            "79165",
            "Midnight Glaucus Locks",
            'Mode: [select] only\nShould the bot buy "Midnight Glaucus Locks" ?',
            false,
        ),
        option.bool(
            "79164",
            "Midnight Glaucus Hair",
            'Mode: [select] only\nShould the bot buy "Midnight Glaucus Hair" ?',
            false,
        ),
        option.bool(
            "79163",
            "Midnight Glaucus Visage",
            'Mode: [select] only\nShould the bot buy "Midnight Glaucus Visage" ?',
            false,
        ),
        option.bool(
            "79162",
            "Midnight Glaucus Morph",
            'Mode: [select] only\nShould the bot buy "Midnight Glaucus Morph" ?',
            false,
        ),
        option.bool("79156", "Glaucus Visage", 'Mode: [select] only\nShould the bot buy "Glaucus Visage" ?', false),
        option.bool("79155", "Glaucus Morph", 'Mode: [select] only\nShould the bot buy "Glaucus Morph" ?', false),
        option.bool(
            "79166",
            "Midnight Glaucus Companion",
            'Mode: [select] only\nShould the bot buy "Midnight Glaucus Companion" ?',
            false,
        ),
        option.bool(
            "79167",
            "Abyssal Atlanticus Trident",
            'Mode: [select] only\nShould the bot buy "Abyssal Atlanticus Trident" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: SeaVoiceMerge.select,
});

export default function main(): void {
    const script = new SeaVoiceMerge();
    script.protectRequiredItems();
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
