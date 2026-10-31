/*
name: ArchFiendWarlordMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/ArchFiendWarlordMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreHollowborn } from "../../hollowborn/CoreHollowborn";
import { WillpowerExtraction } from "../../nation/afdl/WillpowerExtraction";
import { CoreNation } from "../../nation/CoreNation";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();
const Nation = new CoreNation();
const HB = new CoreHollowborn();
const WPE = new WillpowerExtraction();

export class ArchFiendWarlordMerge {
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
                case "Unidentified 36":
                    Core.equipClass(ClassType.Farm);
                    HB.freshSouls(1, 0);
                    bot.wait.forPickup(req.name);
                    break;
                case "Diamond of Nulgath":
                    Core.equipClass(ClassType.Farm);
                    Nation.farmDiamondofNulgath(quant);
                    bot.wait.forPickup(req.name);
                    break;
                case "Bone Dust":
                    Core.equipClass(ClassType.Farm);
                    Farm.battleUnderB("Bone Dust", quant);
                    bot.wait.forPickup(req.name);
                    break;
                case "Gem of Nulgath":
                    Core.equipClass(ClassType.Farm);
                    Nation.farmGemofNulgath(quant);
                    bot.wait.forPickup(req.name);
                    break;
                case "Blood Gem of the Archfiend":
                    Core.equipClass(ClassType.Farm);
                    Nation.farmBloodGem(quant);
                    bot.wait.forPickup(req.name);
                    break;
                case "Fresh Soul":
                    Core.equipClass(ClassType.Farm);
                    HB.freshSouls(0, quant);
                    bot.wait.forPickup(req.name);
                    break;
                case "Unidentified 13":
                    Core.equipClass(ClassType.Farm);
                    Nation.farmUni13(quant);
                    bot.wait.forPickup(req.name);
                    break;
                case "Unidentified 34":
                    Core.equipClass(ClassType.Farm);
                    WPE.unidentified34(quant);
                    bot.wait.forPickup(req.name);
                    break;
                case "Voucher of Nulgath (non-mem)":
                    Core.equipClass(ClassType.Farm);
                    Nation.farmVoucher({ member: false });
                    bot.wait.forPickup(req.name);
                    break;
                case "Voucher of Nulgath":
                    Core.equipClass(ClassType.Farm);
                    Nation.farmVoucher({ member: true });
                    bot.wait.forPickup(req.name);
                    break;
                case "Dark Crystal Shard":
                    Core.equipClass(ClassType.Farm);
                    Nation.farmDarkCrystalShard(quant);
                    bot.wait.forPickup(req.name);
                    break;
                case "Totem of Nulgath":
                    Core.equipClass(ClassType.Farm);
                    Nation.farmTotemofNulgath(quant);
                    bot.wait.forPickup(req.name);
                    break;
                case "Strand of Vath's Hair":
                    Core.equipClass(ClassType.Farm);
                    Core.killVath(req.name, quant);
                    bot.wait.forPickup(req.name);
                    break;
                case "Unidentified 25":
                    Core.equipClass(ClassType.Farm);
                    Adv.buyItem("tercessuinotlim", 1951, "Unidentified 25");
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("tercessuinotlim", 1820, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("52599", "Fiend Minion", 'Mode: [select] only\nShould the bot buy "Fiend Minion" ?', false),
        option.bool("52600", "Fiend Warrior", 'Mode: [select] only\nShould the bot buy "Fiend Warrior" ?', false),
        option.bool(
            "52601",
            "Archfiend Warlord",
            'Mode: [select] only\nShould the bot buy "Archfiend Warlord" ?',
            false,
        ),
        option.bool(
            "52602",
            "Fiend Minion Horns",
            'Mode: [select] only\nShould the bot buy "Fiend Minion Horns" ?',
            false,
        ),
        option.bool(
            "52603",
            "Fiend Warrior Horns",
            'Mode: [select] only\nShould the bot buy "Fiend Warrior Horns" ?',
            false,
        ),
        option.bool("52604", "Archfiend Horns", 'Mode: [select] only\nShould the bot buy "Archfiend Horns" ?', false),
        option.bool(
            "52605",
            "Fiend Warrior Mask",
            'Mode: [select] only\nShould the bot buy "Fiend Warrior Mask" ?',
            false,
        ),
        option.bool(
            "52606",
            "Fiend Warrior Mask + Locks",
            'Mode: [select] only\nShould the bot buy "Fiend Warrior Mask + Locks" ?',
            false,
        ),
        option.bool(
            "52607",
            "Fiend Warrior Mask + Hair",
            'Mode: [select] only\nShould the bot buy "Fiend Warrior Mask + Hair" ?',
            false,
        ),
        option.bool("52608", "Fiend Minion Fur", 'Mode: [select] only\nShould the bot buy "Fiend Minion Fur" ?', false),
        option.bool(
            "52620",
            "ArchFiend Enchanted Orbs",
            'Mode: [select] only\nShould the bot buy "ArchFiend Enchanted Orbs" ?',
            false,
        ),
        option.bool(
            "52615",
            "Mortal Fiend Armblades",
            'Mode: [select] only\nShould the bot buy "Mortal Fiend Armblades" ?',
            false,
        ),
        option.bool(
            "52614",
            "Mortal Fiend Armblade",
            'Mode: [select] only\nShould the bot buy "Mortal Fiend Armblade" ?',
            false,
        ),
        option.bool(
            "52625",
            "Mortal Fiend Fangs Spear",
            'Mode: [select] only\nShould the bot buy "Mortal Fiend Fangs Spear" ?',
            false,
        ),
        option.bool(
            "52626",
            "Mortal Fiend Staff",
            'Mode: [select] only\nShould the bot buy "Mortal Fiend Staff" ?',
            false,
        ),
        option.bool(
            "52623",
            "Fiend Minion Staff",
            'Mode: [select] only\nShould the bot buy "Fiend Minion Staff" ?',
            false,
        ),
        option.bool(
            "52618",
            "Mortal Fiend Katana",
            'Mode: [select] only\nShould the bot buy "Mortal Fiend Katana" ?',
            false,
        ),
        option.bool(
            "52619",
            "Mortal Fiend Katanas",
            'Mode: [select] only\nShould the bot buy "Mortal Fiend Katanas" ?',
            false,
        ),
        option.bool(
            "52621",
            "Mortal Fiend Reaver",
            'Mode: [select] only\nShould the bot buy "Mortal Fiend Reaver" ?',
            false,
        ),
        option.bool(
            "52622",
            "Mortal Fiend Reavers",
            'Mode: [select] only\nShould the bot buy "Mortal Fiend Reavers" ?',
            false,
        ),
        option.bool(
            "52616",
            "Mortal Fiend Claw",
            'Mode: [select] only\nShould the bot buy "Mortal Fiend Claw" ?',
            false,
        ),
        option.bool(
            "52617",
            "Mortal Fiend Claws",
            'Mode: [select] only\nShould the bot buy "Mortal Fiend Claws" ?',
            false,
        ),
        option.bool("52624", "ArchFiend Spear", 'Mode: [select] only\nShould the bot buy "ArchFiend Spear" ?', false),
        option.bool(
            "52610",
            "Fiend Warrior Tail",
            'Mode: [select] only\nShould the bot buy "Fiend Warrior Tail" ?',
            false,
        ),
        option.bool(
            "52611",
            "Fiend Warrior Tail + Fur",
            'Mode: [select] only\nShould the bot buy "Fiend Warrior Tail + Fur" ?',
            false,
        ),
        option.bool(
            "52612",
            "Archfiend Warlord Wings",
            'Mode: [select] only\nShould the bot buy "Archfiend Warlord Wings" ?',
            false,
        ),
        option.bool(
            "52613",
            "Archfiend Warlord Wings + Tail",
            'Mode: [select] only\nShould the bot buy "Archfiend Warlord Wings + Tail" ?',
            false,
        ),
        option.bool(
            "52609",
            "Fiend Warrior Orbs",
            'Mode: [select] only\nShould the bot buy "Fiend Warrior Orbs" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ArchFiendWarlordMerge.select,
});

export default function main(): void {
    const script = new ArchFiendWarlordMerge();
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
