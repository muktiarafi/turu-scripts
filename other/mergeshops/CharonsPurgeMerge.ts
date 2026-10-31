/*
name: CharonsPurgeMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/CharonsPurgeMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreLegion } from "../../legion/CoreLegion";
import { CoreIsleOfFotia } from "../../story/isleoffotia/CoreIsleOfFotia";

const Adv = new CoreAdvanced();
const coreIsleOfFotia = new CoreIsleOfFotia();
const Legion = new CoreLegion();

export class CharonsPurgeMerge {
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
                case "Molten Sword":

                case "Ash Priest Hood":

                case "Priest of the Ashes":
                    Adv.buyItem("Fotia", 649, req.name);
                    break;
                case "Magitech Plating":
                    Adv.buyItem("UnderRealm", 660, req.name);
                    break;
                case "Ancient Undead Helm":
                    Legion.joinLegion();
                    Adv.buyItem("RavenScar", 615, req.name);
                    break;
                case "The Scythe of Lost Hope":
                    Core.farmingLogger(req.name, quant);
                    Legion.approvalAndFavor(0, 50);
                    Adv.buyItem("UnderWorld", 454, req.name);
                    break;
                case "Legion Beast Within":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Legion.obsidianRock(60);
                    Legion.soulForgeHammer();
                    //Soul Forgery 2743
                    Core.registerQuests(2743);
                    while (!Core.checkInventory("Solidified Soul", 50)) {
                        Core.huntMonster("ShadowFallInvasion", "Bone Creeper", "Shards of a Soul", 10);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    Legion.farmLegionToken(50);
                    Adv.buyItem("underworld", 577, req.name);
                    break;
                case "Golden Bough":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.ensureAccept(3010);
                    Core.huntMonster("UnderRealm", "Underworld Soul", "Souls Released", 8);
                    Core.ensureComplete(3010);
                    bot.wait.forPickup(req.name);
                    break;
                case "Molten Staff":
                    Core.huntMonster("Fotia", "Fotia Elemental", req.name, undefined, { isTemp: false });
                    break;
                case "Psyche":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    //Judged on Allegiance to Dage 3041
                    Core.registerQuests(3041);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("Judgement", "Aeacus", "Aeacus' Permission");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        coreIsleOfFotia.completeALL();
        Adv.altFarmItems.push("Psyche");

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("styx", 670, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("17976", "Burning Freeze", 'Mode: [select] only\nShould the bot buy "Burning Freeze" ?', false),
        option.bool("17977", "Glacier Cudgel", 'Mode: [select] only\nShould the bot buy "Glacier Cudgel" ?', false),
        option.bool("18413", "Cerberus", 'Mode: [select] only\nShould the bot buy "Cerberus" ?', false),
        option.bool(
            "18445",
            "Dark Ferryman's Hood",
            'Mode: [select] only\nShould the bot buy "Dark Ferryman\'s Hood" ?',
            false,
        ),
        option.bool(
            "18446",
            "Charon's Skull Mask",
            'Mode: [select] only\nShould the bot buy "Charon\'s Skull Mask" ?',
            false,
        ),
        option.bool("18414", "Cerberus Helm", 'Mode: [select] only\nShould the bot buy "Cerberus Helm" ?', false),
        option.bool(
            "18415",
            "Cerberus Morph Helm",
            'Mode: [select] only\nShould the bot buy "Cerberus Morph Helm" ?',
            false,
        ),
        option.bool(
            "18447",
            "Dual Cerberus Axes",
            'Mode: [select] only\nShould the bot buy "Dual Cerberus Axes" ?',
            false,
        ),
        option.bool("18461", "Charon's Oar", 'Mode: [select] only\nShould the bot buy "Charon\'s Oar" ?', false),
        option.bool("18444", "Dage's Ferryman", 'Mode: [select] only\nShould the bot buy "Dage\'s Ferryman" ?', false),
        option.bool("17978", "Inferno Bow", 'Mode: [select] only\nShould the bot buy "Inferno Bow" ?', false),
        option.bool("18417", "Cerberus Axe", 'Mode: [select] only\nShould the bot buy "Cerberus Axe" ?', false),
        option.bool("18504", "Charon", 'Mode: [select] only\nShould the bot buy "Charon" ?', false),
        option.bool("18505", "Boatman's Hood", 'Mode: [select] only\nShould the bot buy "Boatman\'s Hood" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: CharonsPurgeMerge.select,
});

export default function main(): void {
    const script = new CharonsPurgeMerge();
    Core.bankingBlackList.push(
        "Molten Sword",
        "Magitech Plating",
        "Ancient Undead Helm",
        "Ash Priest Hood",
        "The Scythe of Lost Hope",
        "Priest of the Ashes",
        "Legion Beast Within",
        "Psyche",
        "Molten Staff ",
    );
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
