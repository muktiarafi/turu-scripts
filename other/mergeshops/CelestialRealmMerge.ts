/*
name: CelestialRealmMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/CelestialRealmMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreQOM } from "../../story/queenofmonsters/CoreQoM";

const Adv = new CoreAdvanced();
const QOM = new CoreQOM();

export class CelestialRealmMerge {
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
                case "Infernal Token":
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("Celestialrealm", "Fallen Knight", req.name, quant, { isTemp: false });
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Uncorrupt Spear Feather":
                    QOM.completeEverything();
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(4508);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        //Defeat the Diabolical Warlord! 4508
                        Core.huntMonster("lostruinswar", "Diabolical Warlord", "Diabolical Warlord Defeated!");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Diabolical Minion's Seed":
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("lostruinswar", "Diabolical Warlord", req.name, quant, { isTemp: false });
                        bot.wait.forPickup(req.name);
                    }
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("celestialrealm", 132, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "30942",
            "Knight of the Fallen",
            'Mode: [select] only\nShould the bot buy "Knight of the Fallen" ?',
            false,
        ),
        option.bool("30943", "Impure Wings", 'Mode: [select] only\nShould the bot buy "Impure Wings" ?', false),
        option.bool("30944", "Vile Knight Cape", 'Mode: [select] only\nShould the bot buy "Vile Knight Cape" ?', false),
        option.bool(
            "30947",
            "Fiery Infernal Helm",
            'Mode: [select] only\nShould the bot buy "Fiery Infernal Helm" ?',
            false,
        ),
        option.bool(
            "30946",
            "Knight of the Fallen Helm",
            'Mode: [select] only\nShould the bot buy "Knight of the Fallen Helm" ?',
            false,
        ),
        option.bool("30948", "Infernal Helm", 'Mode: [select] only\nShould the bot buy "Infernal Helm" ?', false),
        option.bool(
            "30949",
            "Spear of the Fallen",
            'Mode: [select] only\nShould the bot buy "Spear of the Fallen" ?',
            false,
        ),
        option.bool("30950", "Celestial Knight", 'Mode: [select] only\nShould the bot buy "Celestial Knight" ?', false),
        option.bool(
            "30951",
            "Celestial Knight Helm",
            'Mode: [select] only\nShould the bot buy "Celestial Knight Helm" ?',
            false,
        ),
        option.bool(
            "30952",
            "Uncorrupt Celestial Spear",
            'Mode: [select] only\nShould the bot buy "Uncorrupt Celestial Spear" ?',
            false,
        ),
        option.bool(
            "31018",
            "Exalted Golden Guardian",
            'Mode: [select] only\nShould the bot buy "Exalted Golden Guardian" ?',
            false,
        ), // new Option<bool>("13275", "Celestial Amadis", "Mode: [select] only\nShould the bot buy \"Celestial Amadis\" ?", false),
        option.bool(
            "31039",
            "Celestial Double Wings",
            'Mode: [select] only\nShould the bot buy "Celestial Double Wings" ?',
            false,
        ),
        option.bool(
            "31041",
            "Prismatic Austere Wings",
            'Mode: [select] only\nShould the bot buy "Prismatic Austere Wings" ?',
            false,
        ),
        option.bool("30264", "Avatar Of Life", 'Mode: [select] only\nShould the bot buy "Avatar Of Life" ?', false),
        option.bool(
            "31020",
            "Devout Celestial Hood",
            'Mode: [select] only\nShould the bot buy "Devout Celestial Hood" ?',
            false,
        ),
        option.bool(
            "31021",
            "Avatar Of Life Hood",
            'Mode: [select] only\nShould the bot buy "Avatar Of Life Hood" ?',
            false,
        ),
        option.bool(
            "31022",
            "Sanctified Wings of Life",
            'Mode: [select] only\nShould the bot buy "Sanctified Wings of Life" ?',
            false,
        ),
        option.bool(
            "31023",
            "Radiant Hood of Life",
            'Mode: [select] only\nShould the bot buy "Radiant Hood of Life" ?',
            false,
        ),
        option.bool(
            "31024",
            "Prismatic Wings of Life",
            'Mode: [select] only\nShould the bot buy "Prismatic Wings of Life" ?',
            false,
        ),
        option.bool(
            "31025",
            "Gilded Prismatic Life Wings",
            'Mode: [select] only\nShould the bot buy "Gilded Prismatic Life Wings" ?',
            false,
        ),
        option.bool(
            "31043",
            "Avatar Of Life Aura Wings",
            'Mode: [select] only\nShould the bot buy "Avatar Of Life Aura Wings" ?',
            false,
        ),
        option.bool(
            "13276",
            "Celestial Amadis Helm",
            'Mode: [select] only\nShould the bot buy "Celestial Amadis Helm" ?',
            false,
        ),
        option.bool("31080", "Avatar Of Life", 'Mode: [select] only\nShould the bot buy "Avatar Of Life" ?', false), // new Option<bool>("31083", "Celestial Amadis", "Mode: [select] only\nShould the bot buy \"Celestial Amadis\" ?", false),
        option.bool(
            "31084",
            "Celestial Amadis Helm",
            'Mode: [select] only\nShould the bot buy "Celestial Amadis Helm" ?',
            false,
        ),
        option.bool(
            "36438",
            "Celestial Defender",
            'Mode: [select] only\nShould the bot buy "Celestial Defender" ?',
            false,
        ),
        option.bool(
            "36439",
            "Celestial Defender Helm",
            'Mode: [select] only\nShould the bot buy "Celestial Defender Helm" ?',
            false,
        ),
        option.bool(
            "36440",
            "Celestial Accoutrements",
            'Mode: [select] only\nShould the bot buy "Celestial Accoutrements" ?',
            false,
        ),
        option.bool(
            "36475",
            "High Celestial Priest",
            'Mode: [select] only\nShould the bot buy "High Celestial Priest" ?',
            false,
        ),
        option.bool(
            "36476",
            "High Celestial Staff",
            'Mode: [select] only\nShould the bot buy "High Celestial Staff" ?',
            false,
        ),
        option.bool(
            "36477",
            "Haloed Hood of Light",
            'Mode: [select] only\nShould the bot buy "Haloed Hood of Light" ?',
            false,
        ),
        option.bool(
            "36478",
            "Celestial Faceplate",
            'Mode: [select] only\nShould the bot buy "Celestial Faceplate" ?',
            false,
        ),
        option.bool(
            "36482",
            "Celestial Defender Mace",
            'Mode: [select] only\nShould the bot buy "Celestial Defender Mace" ?',
            false,
        ),
        option.bool(
            "36479",
            "Celestial Wings of Guiding",
            'Mode: [select] only\nShould the bot buy "Celestial Wings of Guiding" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: CelestialRealmMerge.select,
});

export default function main(): void {
    const script = new CelestialRealmMerge();
    Core.bankingBlackList.push("Infernal Token", "Uncorrupt Spear Feather", "Diabolical Minion's Seed ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
