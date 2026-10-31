/*
name: Forge Maleno Merge
description: This bot will farm the items belonging to the selected mode for the Forge Maleno Merge [2615] in /mountmaleno
tags: forge, maleno, merge, mountmaleno, idalions, shadowbrand, flame, halberd, shadowcleaver, shadowcleavers, drow, oathkeeper, morph, silver, saber, sabers, blazing, fang, fangs
*/
// Port of Scripts/Other/MergeShops/ForgeMalenoMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreAOR } from "../../story/ageofruin/CoreAOR";

const Adv = new CoreAdvanced();
const AOR = new CoreAOR();

export class ForgeMalenoMerge {
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
                case "Black Flame of Maleno": {
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.addDrop(req.id);
                    let questID = 10369;
                    if (Core.isMember) {
                        questID = 10370;
                    }
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.ensureAccept(questID);
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("mountmaleno", "Draconian Bandit", "Lapis Infernalis", 9);
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("mountmaleno", "Maleno Elemental", "Plumbago", 3);
                        Core.huntMonster("mountmaleno", "Idalion", "Powder of Algaroth");
                        Core.ensureComplete(questID);
                        bot.wait.forPickup(req.name);
                    }
                    break;
                }
                case "Shadowbrand's Edge":

                case "Shadowbrand's Edges":

                case "Blackfire Halberd":

                case "Nightcleaver":

                case "Nightcleavers":

                case "Maleno's Fang":

                case "Maleno's Fangs":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("mountmaleno", "Idalion", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Yew Ember":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("warwickforest", "Rubedo Elemental", req.name, quant, { isTemp: false });
                    break;
                case "Maleno Obsidian":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    Core.huntMonster("thelimacity", "Maleno Elemental", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Drow Silver":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.huntMonster("thelimacity", "Drow Soldier", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Steel Ingot":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.addDrop(req.id);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonsterQuest(
                            Core.isMember ? 10358 : 10357,
                            ["thelimacity", "Maleno Elemental", ClassType.Solo],
                            ["thelimacity", "Maleno Match", ClassType.Farm],
                            ["thelimacity", "Flame of Maleno", ClassType.Solo],
                        );
                        bot.wait.forPickup(req.name);
                    }
                    break;
            }
        };
        AOR.mountMaleno();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("mountmaleno", 2615, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("94685", "Drow Oathkeeper", 'Mode: [select] only\nShould the bot buy "Drow Oathkeeper" ?', false),
        option.bool("100873", "Flame of Maleno", 'Mode: [select] only\nShould the bot buy "Flame of Maleno" ?', false),
        option.bool(
            "92814",
            "Idalion's ShadowCleaver",
            'Mode: [select] only\nShould the bot buy "Idalion\'s ShadowCleaver" ?',
            false,
        ),
        option.bool(
            "100875",
            "Ferrum Flame Cape",
            'Mode: [select] only\nShould the bot buy "Ferrum Flame Cape" ?',
            false,
        ),
        option.bool(
            "94689",
            "Silver Drow Sabers",
            'Mode: [select] only\nShould the bot buy "Silver Drow Sabers" ?',
            false,
        ),
        option.bool(
            "95111",
            "Idalion's Blazing Fangs",
            'Mode: [select] only\nShould the bot buy "Idalion\'s Blazing Fangs" ?',
            false,
        ),
        option.bool(
            "92815",
            "Idalion's ShadowCleavers",
            'Mode: [select] only\nShould the bot buy "Idalion\'s ShadowCleavers" ?',
            false,
        ),
        option.bool(
            "92800",
            "Idalion's Shadowbrand Blades",
            'Mode: [select] only\nShould the bot buy "Idalion\'s Shadowbrand Blades" ?',
            false,
        ),
        option.bool(
            "94686",
            "Drow Oathkeeper Morph",
            'Mode: [select] only\nShould the bot buy "Drow Oathkeeper Morph" ?',
            false,
        ),
        option.bool(
            "94687",
            "Drow Oathkeeper Visage",
            'Mode: [select] only\nShould the bot buy "Drow Oathkeeper Visage" ?',
            false,
        ),
        option.bool(
            "100874",
            "Flame of Maleno Hood",
            'Mode: [select] only\nShould the bot buy "Flame of Maleno Hood" ?',
            false,
        ),
        option.bool(
            "92810",
            "Idalion's Flame Halberd",
            'Mode: [select] only\nShould the bot buy "Idalion\'s Flame Halberd" ?',
            false,
        ),
        option.bool(
            "95110",
            "Idalion's Blazing Fang",
            'Mode: [select] only\nShould the bot buy "Idalion\'s Blazing Fang" ?',
            false,
        ),
        option.bool("100876", "Blade of Maleno", 'Mode: [select] only\nShould the bot buy "Blade of Maleno" ?', false),
        option.bool(
            "94688",
            "Silver Drow Saber",
            'Mode: [select] only\nShould the bot buy "Silver Drow Saber" ?',
            false,
        ),
        option.bool(
            "92799",
            "Idalion's Shadowbrand Blade",
            'Mode: [select] only\nShould the bot buy "Idalion\'s Shadowbrand Blade" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ForgeMalenoMerge.select,
});

export default function main(): void {
    const script = new ForgeMalenoMerge();
    Core.bankingBlackList.push(
        "Yew Ember",
        "Black Flame of Maleno",
        "Shadowbrand's Edge",
        "Shadowbrand's Edges",
        "Blackfire Halberd",
        "Nightcleaver",
        "Nightcleavers",
        "Maleno Obsidian",
        "Drow Silver",
        "Maleno's Fang",
        "Maleno's Fangs",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
