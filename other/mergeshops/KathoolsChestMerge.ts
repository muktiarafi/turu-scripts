/*
name: Kathool's Chest Merge
description: This bot will farm the items belonging to the selected mode for the Kathools Chest Merge [2322] in /kathooldepths
tags: kathool, chest, merge, kathooldepths, adeptus, kathooli, morph, sacrosanct, tendril, fins, barbarous, mindsmasher, mindsmashers, apex, leviathan, domination, spear, spears, thyllian
*/
// Port of Scripts/Other/MergeShops/KathoolsChestMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { AbyssalZoneMerge } from "./AbyssalZoneMerge";
import { MidnightZoneMerge } from "./MidnightZoneMerge";
import { SeaviewSouvenirsMerge } from "./SeaviewSouvenirsMerge";
import { SeaVoiceMerge } from "./SeaVoiceMerge";
import { TrenchObserveMerge } from "./TrenchObserveMerge";
import { TwilightZoneMerge } from "./TwilightZoneMerge";
import { UndineCommissaryMerge } from "./UndineCommissaryMerge";

const Adv = new CoreAdvanced();
const UCM = new UndineCommissaryMerge();
const SSM = new SeaviewSouvenirsMerge();
const TZM = new TwilightZoneMerge();
const AZM = new AbyssalZoneMerge();
const TOM = new TrenchObserveMerge();
const SVM = new SeaVoiceMerge();
const MZM = new MidnightZoneMerge();

export class KathoolsChestMerge {
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
                case "Remnant of the Deep":

                case "Adeptus Relic":

                case "Adeptus Kathooli Hair":

                case "Adeptus Kathooli Locks":

                case "MindSmasher Blade":

                case "MindSmasher Blades":

                case "Psychic Domination Spear":

                case "Psychic Domination Spears":
                    Core.logger(`${req.name}` + " requires ultra boss, you need to prefarm it yourself.");
                    break;
                case "Ashray Villager":
                    SSM.buyAllMerge(req.name);
                    break;
                case "Undine Defence Director":
                    UCM.buyAllMerge(req.name);
                    break;
                case "Evacuation Protocol Suit":
                    TZM.buyAllMerge(req.name);
                    break;
                case "Ashray Elf Warden":
                    AZM.buyAllMerge(req.name);
                    break;
                case "DeepWater Drow":
                    TOM.buyAllMerge(req.name);
                    break;
                case "Midnight Glaucus Sage":
                    SVM.buyAllMerge(req.name);
                    break;
                case "Elven Heritage Guardian":
                    MZM.buyAllMerge(req.name);
                    break;
                case "Kathool Acolyte":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("deepchaos", "Kathool", req.name, quant, { isTemp: false, log: false });
                    break;
            }
        };
        if (!Core.bankingBlackList.includes("Elven Heritage Guardian")) {
            Core.bankingBlackList.push("Elven Heritage Guardian");
        }

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("kathooldepths", 2322, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("78153", "Adeptus Kathooli", 'Mode: [select] only\nShould the bot buy "Adeptus Kathooli" ?', false),
        option.bool(
            "78156",
            "Adeptus Kathooli Morph",
            'Mode: [select] only\nShould the bot buy "Adeptus Kathooli Morph" ?',
            false,
        ),
        option.bool(
            "78157",
            "Adeptus Kathooli Visage",
            'Mode: [select] only\nShould the bot buy "Adeptus Kathooli Visage" ?',
            false,
        ),
        option.bool(
            "78158",
            "Sacrosanct Tendril Morph",
            'Mode: [select] only\nShould the bot buy "Sacrosanct Tendril Morph" ?',
            false,
        ),
        option.bool(
            "78159",
            "Sacrosanct Tendril Visage",
            'Mode: [select] only\nShould the bot buy "Sacrosanct Tendril Visage" ?',
            false,
        ),
        option.bool(
            "78160",
            "Adeptus Kathooli Hood",
            'Mode: [select] only\nShould the bot buy "Adeptus Kathooli Hood" ?',
            false,
        ),
        option.bool(
            "78161",
            "Adeptus Kathooli Fins",
            'Mode: [select] only\nShould the bot buy "Adeptus Kathooli Fins" ?',
            false,
        ),
        option.bool(
            "78164",
            "Barbarous MindSmasher",
            'Mode: [select] only\nShould the bot buy "Barbarous MindSmasher" ?',
            false,
        ),
        option.bool(
            "78165",
            "Barbarous MindSmashers",
            'Mode: [select] only\nShould the bot buy "Barbarous MindSmashers" ?',
            false,
        ),
        option.bool(
            "78166",
            "Apex MindSmasher Blade",
            'Mode: [select] only\nShould the bot buy "Apex MindSmasher Blade" ?',
            false,
        ),
        option.bool(
            "78167",
            "Apex MindSmasher Blades",
            'Mode: [select] only\nShould the bot buy "Apex MindSmasher Blades" ?',
            false,
        ),
        option.bool(
            "78170",
            "Leviathan Domination Spear",
            'Mode: [select] only\nShould the bot buy "Leviathan Domination Spear" ?',
            false,
        ),
        option.bool(
            "78171",
            "Leviathan Domination Spears",
            'Mode: [select] only\nShould the bot buy "Leviathan Domination Spears" ?',
            false,
        ),
        option.bool(
            "78172",
            "Thyllian Domination Spear",
            'Mode: [select] only\nShould the bot buy "Thyllian Domination Spear" ?',
            false,
        ),
        option.bool(
            "78173",
            "Thyllian Domination Spears",
            'Mode: [select] only\nShould the bot buy "Thyllian Domination Spears" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: KathoolsChestMerge.select,
});

export default function main(): void {
    const script = new KathoolsChestMerge();
    Core.bankingBlackList.push(
        "Remnant of the Deep",
        "Ashray Villager",
        "Undine Defence Director",
        "Evacuation Protocol Suit",
        "Ashray Elf Warden",
        "DeepWater Drow",
        "Midnight Glaucus Sage",
        "Elven Heritage Guardian",
        "Kathool Acolyte",
        "Adeptus Relic",
        "Adeptus Kathooli Hair",
        "Adeptus Kathooli Locks",
        "MindSmasher Blade",
        "MindSmasher Blades",
        "Psychic Domination Spear",
        "Psychic Domination Spears",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
