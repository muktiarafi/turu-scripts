/*
name: DreadspaceReplicatorMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/DreadspaceReplicatorMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreSummer } from "../../story/summer2015adventuremap/CoreSummer";

const Adv = new CoreAdvanced();
const Dread = new CoreSummer();

export class DreadspaceReplicatorMerge {
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
                case "Red Space Fabric":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("dreadspace", "Red Trobble", req.name, quant, { isTemp: false });
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Blue Space Fabric":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("dreadspace", "Trobble", req.name, quant, { isTemp: false });
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Yellow Space Fabric":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("dreadspace", "Troblor", req.name, quant, { isTemp: false });
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Scrap Metal":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("dreadspace", "Undead Space Marine", req.name, quant, { isTemp: false });
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Antimatter dye":

                case "Star Scrap Metal":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(4289);
                    Core.addDrop(req.id);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("dreadspace", "Undead Space Marine", "Golden Spork of Justice");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Daimyo":
                    if (!Core.isMember) {
                        Core.logger("Space Daimyo requires membership, unselect it to proceed.");
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Adv.buyItem("necropolis", 422, "Daimyo");
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Cyber Brain Core":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("dreadspace", "Dread Space", req.name, quant);
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Unstable Isotope":

                case "Blinding Light of Dread Space":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonsterQuest(4294, "dreadspace", "Dra'gorn");
                        bot.wait.forPickup(req.name);
                    }
                    break;
            }
        };
        Dread.dreadSpace(true);
        Adv.startBuyAllMerge("dreadspace", 527, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "29982",
            "Red Space Crew Shirt",
            'Mode: [select] only\nShould the bot buy "Red Space Crew Shirt" ?',
            false,
        ),
        option.bool(
            "29986",
            "Blue Space Crew Shirt",
            'Mode: [select] only\nShould the bot buy "Blue Space Crew Shirt" ?',
            false,
        ),
        option.bool(
            "29984",
            "Yellow Space Crew Shirt",
            'Mode: [select] only\nShould the bot buy "Yellow Space Crew Shirt" ?',
            false,
        ),
        option.bool("29731", "Space Daimyo", 'Mode: [select] only\nShould the bot buy "Space Daimyo" ?', false),
        option.bool(
            "29985",
            "Green Space Crew Shirt",
            'Mode: [select] only\nShould the bot buy "Green Space Crew Shirt" ?',
            false,
        ),
        option.bool(
            "29988",
            "Pink Space Crew Shirt",
            'Mode: [select] only\nShould the bot buy "Pink Space Crew Shirt" ?',
            false,
        ),
        option.bool(
            "29987",
            "Purple Space Crew Shirt",
            'Mode: [select] only\nShould the bot buy "Purple Space Crew Shirt" ?',
            false,
        ),
        option.bool(
            "29990",
            "Black Space Crew Shirt",
            'Mode: [select] only\nShould the bot buy "Black Space Crew Shirt" ?',
            false,
        ),
        option.bool(
            "29989",
            "White Space Crew Shirt",
            'Mode: [select] only\nShould the bot buy "White Space Crew Shirt" ?',
            false,
        ),
        option.bool(
            "30000",
            "Black Space Paladin",
            'Mode: [select] only\nShould the bot buy "Black Space Paladin" ?',
            false,
        ),
        option.bool(
            "29999",
            "White Space Paladin",
            'Mode: [select] only\nShould the bot buy "White Space Paladin" ?',
            false,
        ),
        option.bool(
            "29992",
            "Red Space Paladin",
            'Mode: [select] only\nShould the bot buy "Red Space Paladin" ?',
            false,
        ),
        option.bool(
            "29993",
            "Orange Space Paladin",
            'Mode: [select] only\nShould the bot buy "Orange Space Paladin" ?',
            false,
        ),
        option.bool(
            "29994",
            "Yellow Space Paladin",
            'Mode: [select] only\nShould the bot buy "Yellow Space Paladin" ?',
            false,
        ),
        option.bool(
            "29995",
            "Green Space Paladin",
            'Mode: [select] only\nShould the bot buy "Green Space Paladin" ?',
            false,
        ),
        option.bool(
            "29997",
            "Purple Space Paladin",
            'Mode: [select] only\nShould the bot buy "Purple Space Paladin" ?',
            false,
        ),
        option.bool(
            "29996",
            "Blue Space Paladin",
            'Mode: [select] only\nShould the bot buy "Blue Space Paladin" ?',
            false,
        ),
        option.bool(
            "29998",
            "Pink Space Paladin",
            'Mode: [select] only\nShould the bot buy "Pink Space Paladin" ?',
            false,
        ),
        option.bool("29933", "Starship House", 'Mode: [select] only\nShould the bot buy "Starship House" ?', false),
        option.bool(
            "29932",
            "Space Station House",
            'Mode: [select] only\nShould the bot buy "Space Station House" ?',
            false,
        ),
        option.bool(
            "30031",
            "Blackhole Light of Dread Space",
            'Mode: [select] only\nShould the bot buy "Blackhole Light of Dread Space" ?',
            false,
        ),
        option.bool(
            "29983",
            "Orange Space Crew Shirt",
            'Mode: [select] only\nShould the bot buy "Orange Space Crew Shirt" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: DreadspaceReplicatorMerge.select,
});

export default function main(): void {
    const script = new DreadspaceReplicatorMerge();
    Core.bankingBlackList.push(
        "Red Space Fabric",
        "Blue Space Fabric",
        "Yellow Space Fabric",
        "Star Scrap Metal",
        "Daimyo",
        "Antimatter dye",
        "Cyber Brain Core",
        "Blinding Light of Dread Space",
        "Unstable Isotope",
    );
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
