/*
name: ShadowSlayerKMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/ShadowSlayerKMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.
//cs_Include Scripts/Farm/BuyScrolls.cs

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreDailies } from "../../core/CoreDailies";

const Adv = new CoreAdvanced();
const Dailies = new CoreDailies();

export class ShadowSlayerKMerge {
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
                case "Meat Ration":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(8263);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("cellar", "GreenRat", "Green Mystery Meat", 10, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Grain Ration":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(8264);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("castletunnels", "r5", "Left", "Blood Maggot", "Bundle of Rice", 3);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Dairy Ration":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(8265);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("odokuro", "Boss", "Right", "O-dokuro", "Bone Hurt Juice", 5, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Shadowslayer Apprentice Badge":
                    Core.farmingLogger(req.name, quant);
                    if (!Core.checkInventory("Chibi Eldritch Yume")) {
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("chaosbeast", "Kathool", "Chibi Eldritch Yume", undefined, { isTemp: false });
                    }
                    Core.registerQuests(8266);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        if (!Core.checkInventory("Holy Wasabi")) {
                            Core.addDrop("Holy Wasabi");
                            Core.ensureAccept(1075);

                            Core.equipClass(ClassType.Farm);
                            Core.huntMonster("doomwood", "Doomwood Ectomancer", "Dried Wasabi Powder", 4);
                            Core.getMapItem(428, 1, "lightguard");
                            Core.join("lightguard");

                            Core.ensureComplete(1075);
                            bot.wait.forPickup("Holy Wasabi");
                        }
                        Adv.buyItem("alchemyacademy", 2036, "Sage Tonic", 3);
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("Sloth", "Phlegnn", "Unnatural Ooze", 8);
                        Core.huntMonster("beehive", "Killer Queen Bee", "Sleepy Honey");

                        Dailies.eldersBlood();
                        if (!Core.checkInventory("Elders' Blood")) {
                            Core.logger("You ran out Elders' Blood, run the bot again at a later date.", undefined, {
                                messageBox: true,
                                stopBot: true,
                            });
                        }

                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        const result = bot.showMessageBox(
            'Items containing the word "Shadow" in this shop cost 1 Elders\' Blood per piece, ' +
                "which is a valuable resource used to get Void Highlord. Are you sure you want to continue?",
            "Warning: Elders' Blood Usage",
            true,
        );
        if (result !== true) {
            return;
        }

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("safiria", 2044, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "62993",
            "Imperial Infantry",
            'Mode: [select] only\nShould the bot buy "Imperial Infantry" ?',
            false,
        ),
        option.bool("62994", "Imperial Morion", 'Mode: [select] only\nShould the bot buy "Imperial Morion" ?', false),
        option.bool("62995", "Imperial Arsenal", 'Mode: [select] only\nShould the bot buy "Imperial Arsenal" ?', false),
        option.bool(
            "62996",
            "Imperial Shield Cape",
            'Mode: [select] only\nShould the bot buy "Imperial Shield Cape" ?',
            false,
        ),
        option.bool("62997", "Imperial Gladius", 'Mode: [select] only\nShould the bot buy "Imperial Gladius" ?', false),
        option.bool(
            "62999",
            "Imperial Longcast Rifle",
            'Mode: [select] only\nShould the bot buy "Imperial Longcast Rifle" ?',
            false,
        ),
        option.bool(
            "62998",
            "Imperial Gladius + Pavise",
            'Mode: [select] only\nShould the bot buy "Imperial Gladius + Pavise" ?',
            false,
        ),
        option.bool("59117", "Surtara Myrmidon", 'Mode: [select] only\nShould the bot buy "Surtara Myrmidon" ?', false),
        option.bool("59118", "Surtara Armet", 'Mode: [select] only\nShould the bot buy "Surtara Armet" ?', false),
        option.bool("59119", "Surtara Kabuto", 'Mode: [select] only\nShould the bot buy "Surtara Kabuto" ?', false),
        option.bool("59120", "Surtara Mantle", 'Mode: [select] only\nShould the bot buy "Surtara Mantle" ?', false),
        option.bool("59121", "Surtara Rings", 'Mode: [select] only\nShould the bot buy "Surtara Rings" ?', false),
        option.bool("59122", "Surtara Wings", 'Mode: [select] only\nShould the bot buy "Surtara Wings" ?', false),
        option.bool("59123", "Surtara Gladius", 'Mode: [select] only\nShould the bot buy "Surtara Gladius" ?', false),
        option.bool("59124", "Surtara Maul", 'Mode: [select] only\nShould the bot buy "Surtara Maul" ?', false),
        option.bool("59125", "Surtara Nagamaki", 'Mode: [select] only\nShould the bot buy "Surtara Nagamaki" ?', false),
        option.bool(
            "63034",
            "ShadowSlayer's Apprentice",
            'Mode: [select] only\nShould the bot buy "ShadowSlayer\'s Apprentice" ?',
            false,
        ),
        option.bool(
            "59115",
            "Chibi ShadowSlayer K",
            'Mode: [select] only\nShould the bot buy "Chibi ShadowSlayer K" ?',
            false,
        ),
        option.bool(
            "56038",
            "Antiquated Shadowslayer",
            'Mode: [select] only\nShould the bot buy "Antiquated Shadowslayer" ?',
            false,
        ),
        option.bool(
            "56039",
            "Antiquated Shadow Hair",
            'Mode: [select] only\nShould the bot buy "Antiquated Shadow Hair" ?',
            false,
        ),
        option.bool(
            "56040",
            "Antiquated Shadow Hat",
            'Mode: [select] only\nShould the bot buy "Antiquated Shadow Hat" ?',
            false,
        ),
        option.bool(
            "56041",
            "Antiquated Shadow Locks",
            'Mode: [select] only\nShould the bot buy "Antiquated Shadow Locks" ?',
            false,
        ),
        option.bool(
            "56042",
            "Antiquated Shadow Hat + Locks",
            'Mode: [select] only\nShould the bot buy "Antiquated Shadow Hat + Locks" ?',
            false,
        ),
        option.bool(
            "56043",
            "Antiquated Shadow Cloak",
            'Mode: [select] only\nShould the bot buy "Antiquated Shadow Cloak" ?',
            false,
        ),
        option.bool(
            "56044",
            "Antiquated Shadow Sabre",
            'Mode: [select] only\nShould the bot buy "Antiquated Shadow Sabre" ?',
            false,
        ),
        option.bool(
            "56045",
            "Antiquated Shadow Swordstaff",
            'Mode: [select] only\nShould the bot buy "Antiquated Shadow Swordstaff" ?',
            false,
        ),
        option.bool(
            "56046",
            "Antiquated Shadow Pistolsword",
            'Mode: [select] only\nShould the bot buy "Antiquated Shadow Pistolsword" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ShadowSlayerKMerge.select,
});

export default function main(): void {
    const script = new ShadowSlayerKMerge();
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
