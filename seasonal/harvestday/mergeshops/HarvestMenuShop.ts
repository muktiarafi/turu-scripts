/*
name: Harvest Menu Merge
description: Farms the Harvest Menu Merge [2811] in /charityfeast.
tags: charityfeast, merge, harvest, menu, merge
*/
// Port of Scripts/Seasonal/HarvestDay/MergeShops/HarvestMenuShop.cs.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { CoreHarvestDay } from "../CoreHarvestDay";

const Adv = new CoreAdvanced();
const HarvestDay = new CoreHarvestDay();

export class HarvestMenuShop {
    // [Can Change] This should only be changed by the author.
    //              If true, it will not stop the script if the default case triggers and the user chose to only get mats
    private dontStopMissingIng = false;

    buyAllMerge(buyOnlyThis: string | null = null, buyMode: mergeOptionsEnum | null = null): void {
        const findIngredients = (): void => {
            const req = Adv.externalItem;
            const quant = Adv.externalQuant;
            if (req == null) return;

            switch (req.name) {
                case "Bone Harvester Eye":
                case "Bone Harvester Morph":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("charityfeast", "Fall Fae Queen", req.name, quant, { isTemp: req.temp });
                    break;

                case "Hans' Chore Voucher":
                    Core.farmingLogger(req.name, quant);
                    Core.addDrop(req.id);
                    Core.registerQuests(Core.isMember ? 10949 : 10948);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("charityfeast", "Sluagh King", "Sluagh King's Crescent", 1);
                        Core.huntMonster("charityfeast", "Fall Fae Queen", "Fall Queen's Acorn", 1);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;

                default: {
                    const shouldStop = !Adv.matsOnly || !this.dontStopMissingIng;
                    Core.logger(`The bot hasn't been taught how to get ${req.name}.`, undefined, {
                        messageBox: shouldStop,
                        stopBot: shouldStop,
                    });
                    break;
                }
            }
        };

        HarvestDay.charityFeast();
        Adv.startBuyAllMerge("charityfeast", 2811, findIngredients, buyOnlyThis, { buyMode });
    }

    static readonly select = [
        option.bool("100011", "Bone Harvester", 'Mode: [select] only\nShould the bot buy "Bone Harvester" ?', false),
        option.bool(
            "102915",
            "Rogue Executioner",
            'Mode: [select] only\nShould the bot buy "Rogue Executioner" ?',
            false,
        ),
        option.bool("100032", "Bone Meridian", 'Mode: [select] only\nShould the bot buy "Bone Meridian" ?', false),
        option.bool(
            "102919",
            "Executioner's Spare Mace",
            'Mode: [select] only\nShould the bot buy "Executioner\'s Spare Mace" ?',
            false,
        ),
        option.bool("100033", "Bone Meridians", 'Mode: [select] only\nShould the bot buy "Bone Meridians" ?', false),
        option.bool(
            "102921",
            "Executioner's Maces",
            'Mode: [select] only\nShould the bot buy "Executioner\'s Maces" ?',
            false,
        ),
        option.bool(
            "100023",
            "Bone Harvester Mask",
            'Mode: [select] only\nShould the bot buy "Bone Harvester Mask" ?',
            false,
        ),
        option.bool(
            "100025",
            "Bone Harvester Skull",
            'Mode: [select] only\nShould the bot buy "Bone Harvester Skull" ?',
            false,
        ),
        option.bool(
            "102916",
            "Rogue Executioner Mask",
            'Mode: [select] only\nShould the bot buy "Rogue Executioner Mask" ?',
            false,
        ),
        option.bool(
            "102917",
            "Rogue Executioner Helm",
            'Mode: [select] only\nShould the bot buy "Rogue Executioner Helm" ?',
            false,
        ),
        option.bool(
            "102920",
            "Executioner's Mace",
            'Mode: [select] only\nShould the bot buy "Executioner\'s Mace" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: HarvestMenuShop.select,
});

export default function main(): void {
    const script = new HarvestMenuShop();
    Core.bankingBlackList.push("Bone Harvester Eye", "Bone Harvester Morph", "Hans' Chore Voucher");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
