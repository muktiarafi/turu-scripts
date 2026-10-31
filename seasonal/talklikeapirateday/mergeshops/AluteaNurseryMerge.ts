/*
name: Alutea Nursery Merge
description: This will farm and buy all the items from the Alutea Nursery Merge Shop.
tags: farm, merge, shop, alutea, nursery, pirate
*/
// Port of Scripts/Seasonal/TalkLikeaPirateDay/MergeShops/AluteaNurseryMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { AluteaNursery } from "../AluteaNursery";

const Adv = new CoreAdvanced();
const AN = new AluteaNursery();

export class AluteaNurseryMerge {
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
                case "Sea Salt":

                case "Naval Guard":

                case "Naval Guard's Tricorn + Hair":

                case "Naval Guard's Tricorn + Locks":

                case "Naval Guard's Cutlass":

                case "Naval Guard's Cutlasses":

                case "Naval Guard's Rapier":

                case "Naval Guard's Rapiers":

                case "Naval Guard's ArmBlade":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(8858);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("aluteanursery", "Last Alutian", "Angler Antena");
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("aluteanursery", "Stagnant Water", "Stale Seawater", 6);
                        Core.huntMonster("aluteanursery", "Bone Crustacean", "Pale Shell", 6);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "DeepSea Star Pirate":

                case "DeepSea Star Pirate's Hair":

                case "DeepSea Star Pirate's Locks":

                case "DeepSea Star Pirate's Morph":

                case "DeepSea Star Pirate's Morph + Locks":

                case "DeepSea Star Pirate's Light Gun":

                case "DeepSea Star Pirate's Light Guns":

                case "DeepSea Smol Wave":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("aluteanursery", "Last Alutian", req.name, undefined, { isTemp: false });
                    break;
            }
        };
        AN.doAll();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("aluteanursery", 2168, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "71167",
            "Enchanted Naval Guard",
            'Mode: [select] only\nShould the bot buy "Enchanted Naval Guard" ?',
            false,
        ),
        option.bool(
            "71168",
            "Enchanted Naval Guard's Tricorn",
            'Mode: [select] only\nShould the bot buy "Enchanted Naval Guard\'s Tricorn" ?',
            false,
        ),
        option.bool(
            "71169",
            "Enchanted Naval Guard's Tricorn + Locks",
            'Mode: [select] only\nShould the bot buy "Enchanted Naval Guard\'s Tricorn + Locks" ?',
            false,
        ),
        option.bool(
            "71170",
            "Enchanted Naval Guard's Cutlass",
            'Mode: [select] only\nShould the bot buy "Enchanted Naval Guard\'s Cutlass" ?',
            false,
        ),
        option.bool(
            "71171",
            "Enchanted Naval Guard's Cutlasses",
            'Mode: [select] only\nShould the bot buy "Enchanted Naval Guard\'s Cutlasses" ?',
            false,
        ),
        option.bool(
            "71172",
            "Enchanted Naval Guard's Rapier",
            'Mode: [select] only\nShould the bot buy "Enchanted Naval Guard\'s Rapier" ?',
            false,
        ),
        option.bool(
            "71173",
            "Enchanted Naval Guard's Rapiers",
            'Mode: [select] only\nShould the bot buy "Enchanted Naval Guard\'s Rapiers" ?',
            false,
        ),
        option.bool(
            "71867",
            "Magical DeepSea Star Pirate",
            'Mode: [select] only\nShould the bot buy "Magical DeepSea Star Pirate" ?',
            false,
        ),
        option.bool(
            "71873",
            "DeepSea Star Pirate's Hat",
            'Mode: [select] only\nShould the bot buy "DeepSea Star Pirate\'s Hat" ?',
            false,
        ),
        option.bool(
            "71874",
            "DeepSea Star Pirate's Hat + Locks",
            'Mode: [select] only\nShould the bot buy "DeepSea Star Pirate\'s Hat + Locks" ?',
            false,
        ),
        option.bool(
            "71875",
            "DeepSea Star Pirate's Morph Hat",
            'Mode: [select] only\nShould the bot buy "DeepSea Star Pirate\'s Morph Hat" ?',
            false,
        ),
        option.bool(
            "71876",
            "DeepSea Star Pirate's Morph Hat + Locks",
            'Mode: [select] only\nShould the bot buy "DeepSea Star Pirate\'s Morph Hat + Locks" ?',
            false,
        ),
        option.bool(
            "71885",
            "DeepSea Star Pirate's Spear",
            'Mode: [select] only\nShould the bot buy "DeepSea Star Pirate\'s Spear" ?',
            false,
        ),
        option.bool(
            "71886",
            "DeepSea Star Pirate's Trident",
            'Mode: [select] only\nShould the bot buy "DeepSea Star Pirate\'s Trident" ?',
            false,
        ),
        option.bool(
            "71889",
            "DeepSea Star Pirate's Dark Gun",
            'Mode: [select] only\nShould the bot buy "DeepSea Star Pirate\'s Dark Gun" ?',
            false,
        ),
        option.bool(
            "71890",
            "DeepSea Star Pirate's Dark Guns",
            'Mode: [select] only\nShould the bot buy "DeepSea Star Pirate\'s Dark Guns" ?',
            false,
        ),
        option.bool(
            "72485",
            "Malevolent Marauder",
            'Mode: [select] only\nShould the bot buy "Malevolent Marauder" ?',
            false,
        ),
        option.bool("72486", "Marauder's Hair", 'Mode: [select] only\nShould the bot buy "Marauder\'s Hair" ?', false),
        option.bool(
            "72487",
            "Marauder's Beard",
            'Mode: [select] only\nShould the bot buy "Marauder\'s Beard" ?',
            false,
        ),
        option.bool(
            "72488",
            "Marauder's Locks",
            'Mode: [select] only\nShould the bot buy "Marauder\'s Locks" ?',
            false,
        ),
        option.bool("72489", "Marauder's Hat", 'Mode: [select] only\nShould the bot buy "Marauder\'s Hat" ?', false),
        option.bool(
            "72490",
            "Marauder's Hat + Beard",
            'Mode: [select] only\nShould the bot buy "Marauder\'s Hat + Beard" ?',
            false,
        ),
        option.bool(
            "72491",
            "Marauder's Hat + Locks",
            'Mode: [select] only\nShould the bot buy "Marauder\'s Hat + Locks" ?',
            false,
        ),
        option.bool(
            "72492",
            "Marauder's Rapier Cape",
            'Mode: [select] only\nShould the bot buy "Marauder\'s Rapier Cape" ?',
            false,
        ),
        option.bool(
            "72493",
            "Marauder's Gear Cape",
            'Mode: [select] only\nShould the bot buy "Marauder\'s Gear Cape" ?',
            false,
        ),
        option.bool(
            "72494",
            "Marauder's Rapier",
            'Mode: [select] only\nShould the bot buy "Marauder\'s Rapier" ?',
            false,
        ),
        option.bool(
            "72495",
            "Marauder's Rapiers",
            'Mode: [select] only\nShould the bot buy "Marauder\'s Rapiers" ?',
            false,
        ),
        option.bool(
            "72496",
            "Marauder's Cutlass",
            'Mode: [select] only\nShould the bot buy "Marauder\'s Cutlass" ?',
            false,
        ),
        option.bool(
            "72497",
            "Marauder's Cutlasses",
            'Mode: [select] only\nShould the bot buy "Marauder\'s Cutlasses" ?',
            false,
        ),
        option.bool(
            "72498",
            "Marauder's Pistol",
            'Mode: [select] only\nShould the bot buy "Marauder\'s Pistol" ?',
            false,
        ),
        option.bool(
            "72499",
            "Marauder's Pistols",
            'Mode: [select] only\nShould the bot buy "Marauder\'s Pistols" ?',
            false,
        ),
        option.bool("72500", "Marauder's Cane", 'Mode: [select] only\nShould the bot buy "Marauder\'s Cane" ?', false),
        option.bool(
            "72501",
            "Marauder's Rapier + Cutlass",
            'Mode: [select] only\nShould the bot buy "Marauder\'s Rapier + Cutlass" ?',
            false,
        ),
        option.bool(
            "72502",
            "Marauder's Cutlass + Pistol",
            'Mode: [select] only\nShould the bot buy "Marauder\'s Cutlass + Pistol" ?',
            false,
        ),
        option.bool(
            "71174",
            "Enchanted Naval Guard's ArmBlade",
            'Mode: [select] only\nShould the bot buy "Enchanted Naval Guard\'s ArmBlade" ?',
            false,
        ),
        option.bool(
            "71880",
            "DeepSea Tidal Wave",
            'Mode: [select] only\nShould the bot buy "DeepSea Tidal Wave" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: AluteaNurseryMerge.select,
});

export default function main(): void {
    const script = new AluteaNurseryMerge();
    Core.bankingBlackList.push(
        "Sea Salt",
        "Naval Guard",
        "Naval Guard's Tricorn + Hair",
        "Naval Guard's Tricorn + Locks",
        "Naval Guard's Cutlass",
        "Naval Guard's Cutlasses",
        "Naval Guard's Rapier",
        "Naval Guard's Rapiers",
        "DeepSea Star Pirate",
        "DeepSea Star Pirate's Hair",
        "DeepSea Star Pirate's Locks",
        "DeepSea Star Pirate's Morph",
        "DeepSea Star Pirate's Morph + Locks",
        "DeepSea Star Pirate's Light Gun",
        "DeepSea Star Pirate's Light Guns",
        "Naval Guard's ArmBlade",
        "DeepSea Smol Wave ",
    );
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
