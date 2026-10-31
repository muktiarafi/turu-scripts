/*
name: Yes, Ma'am's Merge
description: This bot will farm the items belonging to the selected mode for the Yes, Maams Merge [2425] in /ebilart
tags: yes, ma'ams, merge, ebilart, ebilnet, specialist, operator, ebil, company, scavenger, broken, binary, monitor, flashlights, flashlight, signs, sign, neganet, protective, gear, code, tank, tanks, netspace, portal, red, shadescadoo, banner, gray, tear, in, reality, chairmans, signature
*/
// Port of Scripts/Seasonal/AprilFools/YesMaamsMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { EbilArt } from "./EbilArt";

const Adv = new CoreAdvanced();
const EA = new EbilArt();

export class YesMaamsMerge {
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
                case "Epic Item Name":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(9660);
                    // Gathering Evidence (9660)
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("ebilart", "Ebil AI Blender", "AI Learning Algorithm", 1643631, {
                            log: false,
                        });
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("ebilart", "UNUNSkellingdens", "Blurry Teeth", 94543, { log: false });
                        Core.huntMonster("ebilart", "Fish", "Wet Sashimi", 64731, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Ebil Company Sign":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("ebilart", "Ebil AI Blender", req.name, quant, { isTemp: false, log: false });
                    break;
            }
        };
        if (!Core.isSeasonalMapActive("ebilart")) {
            return;
        }

        EA.storyLine();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("ebilart", 2425, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "85061",
            "EbilNet Specialist Operator",
            'Mode: [select] only\nShould the bot buy "EbilNet Specialist Operator" ?',
            false,
        ),
        option.bool("85060", "EbilNet Operator", 'Mode: [select] only\nShould the bot buy "EbilNet Operator" ?', false),
        option.bool(
            "85050",
            "Ebil Company Scavenger",
            'Mode: [select] only\nShould the bot buy "Ebil Company Scavenger" ?',
            false,
        ),
        option.bool("85049", "Ebil Company", 'Mode: [select] only\nShould the bot buy "Ebil Company" ?', false),
        option.bool("85062", "EbilNet Helm", 'Mode: [select] only\nShould the bot buy "EbilNet Helm" ?', false),
        option.bool(
            "85052",
            "Ebil Company Helmet",
            'Mode: [select] only\nShould the bot buy "Ebil Company Helmet" ?',
            false,
        ),
        option.bool(
            "84987",
            "Broken Binary Monitor",
            'Mode: [select] only\nShould the bot buy "Broken Binary Monitor" ?',
            false,
        ),
        option.bool(
            "85067",
            "EbilNet Flashlights",
            'Mode: [select] only\nShould the bot buy "EbilNet Flashlights" ?',
            false,
        ),
        option.bool(
            "85066",
            "EbilNet Flashlight",
            'Mode: [select] only\nShould the bot buy "EbilNet Flashlight" ?',
            false,
        ),
        option.bool("85065", "EbilNet Signs", 'Mode: [select] only\nShould the bot buy "EbilNet Signs" ?', false),
        option.bool("85064", "EbilNet Sign", 'Mode: [select] only\nShould the bot buy "EbilNet Sign" ?', false),
        option.bool(
            "84994",
            "NegaNet Protective Gear",
            'Mode: [select] only\nShould the bot buy "NegaNet Protective Gear" ?',
            false,
        ),
        option.bool(
            "85063",
            "EbilNet Code Tank",
            'Mode: [select] only\nShould the bot buy "EbilNet Code Tank" ?',
            false,
        ),
        option.bool(
            "85053",
            "Ebil Company Tanks",
            'Mode: [select] only\nShould the bot buy "Ebil Company Tanks" ?',
            false,
        ),
        option.bool("84990", "Netspace Portal", 'Mode: [select] only\nShould the bot buy "Netspace Portal" ?', false),
        option.bool(
            "85021",
            "Red ShadeScadoo Banner",
            'Mode: [select] only\nShould the bot buy "Red ShadeScadoo Banner" ?',
            false,
        ),
        option.bool(
            "85020",
            "Gray ShadeScadoo Banner",
            'Mode: [select] only\nShould the bot buy "Gray ShadeScadoo Banner" ?',
            false,
        ),
        option.bool("85013", "Tear in Reality", 'Mode: [select] only\nShould the bot buy "Tear in Reality" ?', false),
        option.bool(
            "85012",
            "Chairman's Signature",
            'Mode: [select] only\nShould the bot buy "Chairman\'s Signature" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: YesMaamsMerge.select,
});

export default function main(): void {
    const script = new YesMaamsMerge();
    Core.bankingBlackList.push("Epic Item Name", "Ebil Company Sign");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
