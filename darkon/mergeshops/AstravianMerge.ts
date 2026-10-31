/*
name: Astravian Merge
description: This bot will farm the items belonging to the selected mode for the Astravian Merge [1987] in /astravia
tags: astravian, merge, astravia, gold, voucher, k, moons, amalgamation, hallowed, cloak, officer, officers, , carltons, taliss, kaspers, rosas, mercenarys, boomstick, karmic, battlegear, urban, duelist, morph, rebel, katana, katanas, reversed, sheath, sheathe
*/
// Port of Scripts/Darkon/MergeShops/AstravianMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreDarkon } from "../CoreDarkon";
import { CoreAstravia } from "../../story/elegyofmadness(darkon)/CoreAstravia";

const Adv = new CoreAdvanced();
const Darkon = new CoreDarkon();
const Astravia = new CoreAstravia();

export class AstravianMerge {
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
                case "La's Gratitude":
                    Darkon.lasGratitude(quant);
                    break;
                case "The Moon's Head":

                case "The Moon's Cloak":
                    Core.huntMonster("astravia", "The Moon", req.name, undefined, { isTemp: false });
                    break;
                case "Astravian Sickle":

                case "Sheathed Urban Duelist Katana":

                case "Urban Duelist Katana and Sheath":

                case "Condensed Aversion":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("astravia", "Creature 28", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Astravian Urban Duelist Locks":

                case "Astravian Urban Duelist Hair":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("astravia", "Creature 27", req.name, quant, { isTemp: false, log: false });
                    break;
            }
        };
        Astravia.astravia();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("astravia", 1987, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "60172",
            "The Moon's Amalgamation",
            'Mode: [select] only\nShould the bot buy "The Moon\'s Amalgamation" ?',
            false,
        ),
        option.bool(
            "60175",
            "The Moon's Hallowed Cloak",
            'Mode: [select] only\nShould the bot buy "The Moon\'s Hallowed Cloak" ?',
            false,
        ),
        option.bool(
            "60156",
            "Astravian Officer",
            'Mode: [select] only\nShould the bot buy "Astravian Officer" ?',
            false,
        ),
        option.bool(
            "60166",
            "Astravian Officer's Hat + Locks",
            'Mode: [select] only\nShould the bot buy "Astravian Officer\'s Hat + Locks" ?',
            false,
        ),
        option.bool(
            "60165",
            "Astravian Officer's Hat",
            'Mode: [select] only\nShould the bot buy "Astravian Officer\'s Hat" ?',
            false,
        ),
        option.bool("60161", "Carlton's Hair", 'Mode: [select] only\nShould the bot buy "Carlton\'s Hair" ?', false),
        option.bool("60164", "Talis's Hair", 'Mode: [select] only\nShould the bot buy "Talis\'s Hair" ?', false),
        option.bool("60162", "Kasper's Hair", 'Mode: [select] only\nShould the bot buy "Kasper\'s Hair" ?', false),
        option.bool("60163", "Rosa's Hair", 'Mode: [select] only\nShould the bot buy "Rosa\'s Hair" ?', false),
        option.bool(
            "58078",
            "Astravian Mercenary's Dagger",
            'Mode: [select] only\nShould the bot buy "Astravian Mercenary\'s Dagger" ?',
            false,
        ),
        option.bool(
            "58082",
            "Astravia Mercenary's Boomstick",
            'Mode: [select] only\nShould the bot buy "Astravia Mercenary\'s Boomstick" ?',
            false,
        ),
        option.bool(
            "58079",
            "Karmic Battlegear",
            'Mode: [select] only\nShould the bot buy "Karmic Battlegear" ?',
            false,
        ),
        option.bool(
            "84267",
            "Astravian Urban Duelist",
            'Mode: [select] only\nShould the bot buy "Astravian Urban Duelist" ?',
            false,
        ),
        option.bool(
            "84271",
            "Astravian Urban Duelist Visage",
            'Mode: [select] only\nShould the bot buy "Astravian Urban Duelist Visage" ?',
            false,
        ),
        option.bool(
            "84270",
            "Astravian Urban Duelist Morph",
            'Mode: [select] only\nShould the bot buy "Astravian Urban Duelist Morph" ?',
            false,
        ),
        option.bool(
            "84275",
            "Urban Duelist Rebel Katana",
            'Mode: [select] only\nShould the bot buy "Urban Duelist Rebel Katana" ?',
            false,
        ),
        option.bool(
            "84276",
            "Urban Duelist Rebel Katanas",
            'Mode: [select] only\nShould the bot buy "Urban Duelist Rebel Katanas" ?',
            false,
        ),
        option.bool(
            "84277",
            "Reversed Urban Duelist Rebel Katana",
            'Mode: [select] only\nShould the bot buy "Reversed Urban Duelist Rebel Katana" ?',
            false,
        ),
        option.bool(
            "84278",
            "Reversed Urban Duelist Rebel Katanas",
            'Mode: [select] only\nShould the bot buy "Reversed Urban Duelist Rebel Katanas" ?',
            false,
        ),
        option.bool(
            "84279",
            "Urban Duelist Rebel Katana and Sheath",
            'Mode: [select] only\nShould the bot buy "Urban Duelist Rebel Katana and Sheath" ?',
            false,
        ),
        option.bool(
            "84280",
            "Urban Duelist Rebel Sheathe and Katana",
            'Mode: [select] only\nShould the bot buy "Urban Duelist Rebel Sheathe and Katana" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: AstravianMerge.select,
});

export default function main(): void {
    const script = new AstravianMerge();
    Core.bankingBlackList.push(
        "The Moon's Head",
        "La's Gratitude",
        "The Moon's Cloak",
        "Astravian Sickle",
        "Astravian Urban Duelist Locks",
        "Astravian Urban Duelist Hair",
        "Sheathed Urban Duelist Katana",
        "Urban Duelist Katana and Sheath",
        "Condensed Aversion",
    );
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
