/*
name: Nova Genesis Hangar Merge
description: This bot will farm the items belonging to the selected mode for the Nova Genesis Hangar Merge [2732] in /carcossacabins
tags: nova, genesis, hangar, merge, carcossacabins, wolfblade, suit, runehawk, mystraven, swainson, mk, iii, wings, amplified, hawk, ci, orion, visor, awakened, ii, cc, imparatus
*/
// Port of Scripts/Other/MergeShops/NovaGenesisHangarMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreOasis } from "../../story/oasis/CoreOasis";

const Adv = new CoreAdvanced();
const COasis = new CoreOasis();

export class NovaGenesisHangarMerge {
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
                case "EP Cell":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.addDrop(
                        "Wolfblade Nova Genesis Helm",
                        "Mystraven Nova Genesis Visor",
                        "Runehawk Nova Genesis Visor",
                    );
                    Core.addDrop(req.id);
                    Core.registerQuests(Core.isMember ? 10761 : 10760);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("carcossacabins", "Clementine", "Clementine's Blood Sample");
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("carcossacabins", "Evolved Lifeform", "Lifeform's Fingers", 9);
                        Core.huntMonster("carcossacabins", "Doom Leech", "Leech's Ganglion", 9);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Wolfblade Nova Genesis Helm":

                case "Mystraven Nova Genesis Visor":

                case "Runehawk Nova Genesis Visor":

                case "Mystraven Nova Genesis Hood":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    // Add all because they are ac tagged and we may need them or can bank them
                    Core.addDrop(
                        "Wolfblade Nova Genesis Helm",
                        "Mystraven Nova Genesis Visor",
                        "Runehawk Nova Genesis Visor",
                    );
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonster("carcossacabins", "Clementine", req.name, undefined, { isTemp: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                //#endregion
            }
        };
        COasis.carcossaCabins();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("carcossacabins", 2732, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "101556",
            "Wolfblade Nova Genesis Suit",
            'Mode: [select] only\nShould the bot buy "Wolfblade Nova Genesis Suit" ?',
            false,
        ),
        option.bool(
            "101564",
            "Runehawk Nova Genesis Suit",
            'Mode: [select] only\nShould the bot buy "Runehawk Nova Genesis Suit" ?',
            false,
        ),
        option.bool(
            "101573",
            "Mystraven Nova Genesis Suit",
            'Mode: [select] only\nShould the bot buy "Mystraven Nova Genesis Suit" ?',
            false,
        ),
        option.bool("101572", "Swainson MK III", 'Mode: [select] only\nShould the bot buy "Swainson MK III" ?', false),
        option.bool(
            "101577",
            "Mystraven Nova Genesis Wings",
            'Mode: [select] only\nShould the bot buy "Mystraven Nova Genesis Wings" ?',
            false,
        ),
        option.bool(
            "101568",
            "Amplified Nova Hawk Wings",
            'Mode: [select] only\nShould the bot buy "Amplified Nova Hawk Wings" ?',
            false,
        ),
        option.bool(
            "101559",
            "Wolfblade Nova Genesis Wings",
            'Mode: [select] only\nShould the bot buy "Wolfblade Nova Genesis Wings" ?',
            false,
        ),
        option.bool("101563", "Dual C.I. Orion", 'Mode: [select] only\nShould the bot buy "Dual C.I. Orion" ?', false),
        option.bool(
            "101565",
            "Runehawk Nova Genesis Helm",
            'Mode: [select] only\nShould the bot buy "Runehawk Nova Genesis Helm" ?',
            false,
        ),
        option.bool(
            "101558",
            "Wolfblade Nova Genesis Visor",
            'Mode: [select] only\nShould the bot buy "Wolfblade Nova Genesis Visor" ?',
            false,
        ),
        option.bool(
            "101574",
            "Mystraven Nova Genesis Helm",
            'Mode: [select] only\nShould the bot buy "Mystraven Nova Genesis Helm" ?',
            false,
        ),
        option.bool(
            "101576",
            "Awakened Nova Genesis Helm",
            'Mode: [select] only\nShould the bot buy "Awakened Nova Genesis Helm" ?',
            false,
        ),
        option.bool("101571", "Swainson MK II", 'Mode: [select] only\nShould the bot buy "Swainson MK II" ?', false),
        option.bool(
            "101580",
            "C.C. Imparatus MK II",
            'Mode: [select] only\nShould the bot buy "C.C. Imparatus MK II" ?',
            false,
        ),
        option.bool(
            "101581",
            "C.C. Imparatus MK III",
            'Mode: [select] only\nShould the bot buy "C.C. Imparatus MK III" ?',
            false,
        ),
        option.bool("101562", "C.I. Orion", 'Mode: [select] only\nShould the bot buy "C.I. Orion" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: NovaGenesisHangarMerge.select,
});

export default function main(): void {
    const script = new NovaGenesisHangarMerge();
    Core.bankingBlackList.push(
        "EP Cell",
        "Runehawk Nova Genesis Visor",
        "Wolfblade Nova Genesis Helm",
        "Mystraven Nova Genesis Visor",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
