/*
name: Candyshell Merge
description: This bot will farm the items belonging to the selected mode for the Candyshell Merge [1873] in /grenwog
tags: candyshell, merge, grenwog, chocolate, egg, creme, caramel, rainbow, shadow, chaos, golden, antinegg, evil, bunny, suit, ears, pet, white, rabbit, smile, worshipper, hoodie, , greatsword, egghunter, berserker, berserkers, drone, dracogrenwog, slayer, soft, gray, cut, side, resting, dracospear, dracosword, dracoswords
*/
// Port of Scripts/Seasonal/Grenwog(Easter)/CandyshellMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class CandyshellMerge {
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
                case "Chocolate Eggshells":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("GreenguardEast", "Gurushroom", req.name, quant, { isTemp: req.temp });
                    break;
                case "Creme Eggshells":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("GreenShell", "Tsukumogami", req.name, quant, { isTemp: req.temp });
                    break;
                case "Caramel Eggshells":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("GreenguardWest", "Kittarian", req.name, quant, { isTemp: req.temp });
                    break;
                case "Rainbow Eggshells":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("Greendragon", "Greenguard Dragon", req.name, quant, { isTemp: req.temp });
                    break;
                case "Shadow Eggshells":

                case "DraGrenwog Scale":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("Grenwog", "Grenwog", req.name, quant, { isTemp: req.temp });
                    break;
                case "Chaotic Eggshells":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("Grenstory", "Imposter Egg", req.name, quant, { isTemp: req.temp });
                    break;
                case "Golden Eggshells":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("Greed", "Treasure Pile", req.name, quant, { isTemp: req.temp });
                    break;
                case "Anti-Neggshells":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("Greymoor", "Spooky Treeant", req.name, quant, { isTemp: req.temp });
                    break;
            }
        };
        if (!Core.isSeasonalMapActive("grenwog")) {
            return;
        }

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("grenwog", 1873, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("54254", "Chocolate Egg", 'Mode: [select] only\nShould the bot buy "Chocolate Egg" ?', false),
        option.bool("54252", "Creme Egg", 'Mode: [select] only\nShould the bot buy "Creme Egg" ?', false),
        option.bool("54253", "Caramel Egg", 'Mode: [select] only\nShould the bot buy "Caramel Egg" ?', false),
        option.bool("54251", "Rainbow Egg", 'Mode: [select] only\nShould the bot buy "Rainbow Egg" ?', false),
        option.bool("54255", "Shadow Egg", 'Mode: [select] only\nShould the bot buy "Shadow Egg" ?', false),
        option.bool("54257", "Chaos Egg", 'Mode: [select] only\nShould the bot buy "Chaos Egg" ?', false),
        option.bool("54256", "Golden Egg", 'Mode: [select] only\nShould the bot buy "Golden Egg" ?', false),
        option.bool("54258", "Anti-Negg", 'Mode: [select] only\nShould the bot buy "Anti-Negg" ?', false),
        option.bool("54227", "Evil Bunny Suit", 'Mode: [select] only\nShould the bot buy "Evil Bunny Suit" ?', false),
        option.bool("54228", "Evil Bunny Ears", 'Mode: [select] only\nShould the bot buy "Evil Bunny Ears" ?', false),
        option.bool("54229", "Evil Bunny Pet", 'Mode: [select] only\nShould the bot buy "Evil Bunny Pet" ?', false),
        option.bool(
            "54224",
            "White Rabbit Hair",
            'Mode: [select] only\nShould the bot buy "White Rabbit Hair" ?',
            false,
        ),
        option.bool("54225", "White Rabbit Hat", 'Mode: [select] only\nShould the bot buy "White Rabbit Hat" ?', false),
        option.bool(
            "54226",
            "White Rabbit Smile",
            'Mode: [select] only\nShould the bot buy "White Rabbit Smile" ?',
            false,
        ),
        option.bool(
            "54085",
            "Grenwog Worshipper",
            'Mode: [select] only\nShould the bot buy "Grenwog Worshipper" ?',
            false,
        ),
        option.bool(
            "54088",
            "Grenwog Worshipper Hoodie + Mask",
            'Mode: [select] only\nShould the bot buy "Grenwog Worshipper Hoodie + Mask" ?',
            false,
        ),
        option.bool(
            "54086",
            "Grenwog Worshipper Helmet",
            'Mode: [select] only\nShould the bot buy "Grenwog Worshipper Helmet" ?',
            false,
        ),
        option.bool(
            "54087",
            "Grenwog Worshipper Hoodie",
            'Mode: [select] only\nShould the bot buy "Grenwog Worshipper Hoodie" ?',
            false,
        ),
        option.bool(
            "54094",
            "Grenwog Worshipper Greatsword",
            'Mode: [select] only\nShould the bot buy "Grenwog Worshipper Greatsword" ?',
            false,
        ),
        option.bool(
            "54397",
            "White Rabbit Suit",
            'Mode: [select] only\nShould the bot buy "White Rabbit Suit" ?',
            false,
        ),
        option.bool(
            "60145",
            "EggHunter Berserker",
            'Mode: [select] only\nShould the bot buy "EggHunter Berserker" ?',
            false,
        ),
        option.bool(
            "60146",
            "EggHunter Berserker's Helm",
            'Mode: [select] only\nShould the bot buy "EggHunter Berserker\'s Helm" ?',
            false,
        ),
        option.bool(
            "60147",
            "EggHunter Berserker's Rune Cape",
            'Mode: [select] only\nShould the bot buy "EggHunter Berserker\'s Rune Cape" ?',
            false,
        ),
        option.bool(
            "60148",
            "EggHunter Berserker's Cape",
            'Mode: [select] only\nShould the bot buy "EggHunter Berserker\'s Cape" ?',
            false,
        ),
        option.bool(
            "60149",
            "EggHunter Berserker's Polearm",
            'Mode: [select] only\nShould the bot buy "EggHunter Berserker\'s Polearm" ?',
            false,
        ),
        option.bool(
            "60150",
            "EggHunter Berserker's Drone Pet",
            'Mode: [select] only\nShould the bot buy "EggHunter Berserker\'s Drone Pet" ?',
            false,
        ),
        option.bool(
            "85185",
            "DracoGrenwog Slayer",
            'Mode: [select] only\nShould the bot buy "DracoGrenwog Slayer" ?',
            false,
        ),
        option.bool(
            "85188",
            "Soft Gray Cut Mask",
            'Mode: [select] only\nShould the bot buy "Soft Gray Cut Mask" ?',
            false,
        ),
        option.bool(
            "85189",
            "Soft Gray Locks Mask",
            'Mode: [select] only\nShould the bot buy "Soft Gray Locks Mask" ?',
            false,
        ),
        option.bool(
            "85190",
            "DracoGrenwog Slayer Helm",
            'Mode: [select] only\nShould the bot buy "DracoGrenwog Slayer Helm" ?',
            false,
        ),
        option.bool(
            "85192",
            "DracoGrenwog Side Blades",
            'Mode: [select] only\nShould the bot buy "DracoGrenwog Side Blades" ?',
            false,
        ),
        option.bool(
            "85193",
            "Resting Grenwog DracoSpear",
            'Mode: [select] only\nShould the bot buy "Resting Grenwog DracoSpear" ?',
            false,
        ),
        option.bool(
            "85195",
            "Grenwog DracoSword",
            'Mode: [select] only\nShould the bot buy "Grenwog DracoSword" ?',
            false,
        ),
        option.bool(
            "85196",
            "Grenwog DracoSwords",
            'Mode: [select] only\nShould the bot buy "Grenwog DracoSwords" ?',
            false,
        ),
        option.bool(
            "85197",
            "Grenwog DracoSpear",
            'Mode: [select] only\nShould the bot buy "Grenwog DracoSpear" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: CandyshellMerge.select,
});

export default function main(): void {
    const script = new CandyshellMerge();
    Core.bankingBlackList.push(
        "Chocolate Eggshells",
        "Creme Eggshells",
        "Caramel Eggshells",
        "Rainbow Eggshells",
        "Shadow Eggshells",
        "Chaotic Eggshells",
        "Golden Eggshells",
        "Anti-Neggshells",
        "DraGrenwog Scale",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
