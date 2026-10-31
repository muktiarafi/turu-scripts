/*
name: Colossal Wares Merge
description: This bot will farm the items belonging to the selected mode for the Colossal Wares Merge [2591] in /moreskulls
tags: colossal, wares, merge, moreskulls, deathbound, knight, thorn, crown, skull, shroud, vestal, gold, awakened, vordred, plate, nictos, necronomicon
*/
// Port of Scripts/Seasonal/Friday13th/MergeShops/ColossalWaresMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { VordredArmor } from "../../../evil/VordredsArmor";
import { MoreSkullsWorldBoss } from "../../../prototypes/MoreSkullsBoss";

const Adv = new CoreAdvanced();
const VA = new VordredArmor();
const MSWB = new MoreSkullsWorldBoss();

export class ColossalWaresMerge {
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
                case "Pristine Skull":
                    MSWB.setup(quant);
                    break;
                case "Vordred's Armor":

                case "Vordred's Helm":

                case "Vordred's Chestpiece":

                case "Vordred's Cape":
                    VA.getVordredsArmor(true);
                    Adv.buyItem("stonewood", 2063, req.name);
                    break;
                //#endregion
                //#region Known items
                case "Grimskull's Favor":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger("Grimskull's Favor requires membership to farm, skipping.");
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.registerQuests(10282, 10283);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonster("lichwar", "Noxus Warrior", undefined, undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Noxus' Favor":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger("Noxus' Favor requires membership to farm, skipping.");
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.registerQuests(10278, 10279);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonster("lichwar", "Grim Soldier", undefined, undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                //#endregion
            }
        };
        if (!Core.isSeasonalMapActive("moreskulls")) {
            Core.logger("The seasonal map 'moreskulls' is not active.");
            return;
        }

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("moreskulls", 2591, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "94066",
            "Deathbound Knight",
            'Mode: [select] only\nShould the bot buy "Deathbound Knight" ?',
            false,
        ),
        option.bool(
            "94067",
            "Deathbound Thorn Crown",
            'Mode: [select] only\nShould the bot buy "Deathbound Thorn Crown" ?',
            false,
        ),
        option.bool(
            "94068",
            "Deathbound Thorn Hood",
            'Mode: [select] only\nShould the bot buy "Deathbound Thorn Hood" ?',
            false,
        ),
        option.bool(
            "94069",
            "Deathbound Knight Skull",
            'Mode: [select] only\nShould the bot buy "Deathbound Knight Skull" ?',
            false,
        ),
        option.bool(
            "94070",
            "Deathbound Knight Shroud",
            'Mode: [select] only\nShould the bot buy "Deathbound Knight Shroud" ?',
            false,
        ),
        option.bool(
            "94071",
            "Vestal Gold Blade",
            'Mode: [select] only\nShould the bot buy "Vestal Gold Blade" ?',
            false,
        ),
        option.bool(
            "94072",
            "Vestal Gold Blades",
            'Mode: [select] only\nShould the bot buy "Vestal Gold Blades" ?',
            false,
        ),
        option.bool("94073", "Vestal Gold Axe", 'Mode: [select] only\nShould the bot buy "Vestal Gold Axe" ?', false),
        option.bool("94074", "Vestal Gold Axes", 'Mode: [select] only\nShould the bot buy "Vestal Gold Axes" ?', false),
        option.bool("94136", "Awakened Vordred", 'Mode: [select] only\nShould the bot buy "Awakened Vordred" ?', false),
        option.bool(
            "94137",
            "Awakened Vordred Helm",
            'Mode: [select] only\nShould the bot buy "Awakened Vordred Helm" ?',
            false,
        ),
        option.bool(
            "94138",
            "Awakened Vordred Plate",
            'Mode: [select] only\nShould the bot buy "Awakened Vordred Plate" ?',
            false,
        ),
        option.bool(
            "94139",
            "Awakened Vordred Cape",
            'Mode: [select] only\nShould the bot buy "Awakened Vordred Cape" ?',
            false,
        ),
        option.bool(
            "94052",
            "Nicto's Necronomicon",
            'Mode: [select] only\nShould the bot buy "Nicto\'s Necronomicon" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ColossalWaresMerge.select,
});

export default function main(): void {
    const script = new ColossalWaresMerge();
    Core.bankingBlackList.push(
        "Pristine Skull",
        "Vordred's Armor",
        "Vordred's Helm",
        "Vordred's Chestpiece",
        "Vordred's Cape",
        "Grimskull's Favor",
        "Noxus' Favor",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
