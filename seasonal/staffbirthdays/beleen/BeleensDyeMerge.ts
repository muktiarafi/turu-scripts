/*
name: Beleens Dye Merge
description: This bot will farm the items belonging to the selected mode for the Beleens Dye Merge [1550] in /chateau
tags: beleens, dye, merge, chateau, magentity, mrs, cuddles, pet, on, your, head, fists, fierceness, like, a, pretty, battlemoglin, pink, sockatana, chainsaw, katana, unarmed, derp, llama, overlord, face, rose, ebil, ninja
*/
// Port of Scripts/Seasonal/StaffBirthdays/Beleen/BeleensDyeMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { ArtixWeddingMerge } from "../../../other/mergeshops/ArtixWeddingMerge";
import { CyseroMergeShop } from "../../../other/mergeshops/CyseroMerge";
import { SwaggysChateau } from "../../herosheartday/SwaggysChateau";

const Adv = new CoreAdvanced();
const CyseroMerge = new CyseroMergeShop();
const artixWeddingMerge = new ArtixWeddingMerge();
const swaggysChateau = new SwaggysChateau();

export class BeleensDyeMerge {
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
                case "Astral Entity":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("Ledgermayne", "Ledgermayne", req.name, undefined, { isTemp: false });
                    break;
                case "Pink Potion":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("chateau", "Pinky", req.name, quant, { isTemp: false });
                    break;
                case "Mr. Cuddles Pet":

                case "Mr. Cuddles on your Head":
                    Core.huntMonster("lovelockdown", "Ultra Cuddles", req.name, undefined, { isTemp: false });
                    break;
                case "Fists of Fire":
                    Core.huntMonster("xancave", "Shurpu Ring Guardian", req.name, undefined, { isTemp: false });
                    break;
                case "Like a Battlemoglin":
                    Adv.buyItem("ariapet", 12, req.name);
                    break;
                case "Green Sockatana":
                    CyseroMerge.buyAllMerge(req.name);
                    break;
                case "Chainsaw Katana":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("darkoviahorde", "Zombie Dragon", req.name, quant, { isTemp: false });
                    break;
                case "Unarmed":
                    Adv.buyItem(bot.map.name, 1536, req.name);
                    break;
                case "BaconCat Force Face":

                case "Kitty SkyFighter":
                    Adv.buyItem("baconcatlair", 1260, req.name);
                    break;
                case "Ebil Ninja":

                case "Ebil Ninja Hood":
                    artixWeddingMerge.buyAllMerge(req.name);
                    break;
            }
        };
        swaggysChateau.completeStory();

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("chateau", 1550, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("42721", "Magentity", 'Mode: [select] only\nShould the bot buy "Magentity" ?', false),
        option.bool("42722", "Mrs. Cuddles Pet", 'Mode: [select] only\nShould the bot buy "Mrs. Cuddles Pet" ?', false),
        option.bool(
            "42723",
            "Mrs. Cuddles on Your Head",
            'Mode: [select] only\nShould the bot buy "Mrs. Cuddles on Your Head" ?',
            false,
        ),
        option.bool(
            "42725",
            "Fists of Fierceness",
            'Mode: [select] only\nShould the bot buy "Fists of Fierceness" ?',
            false,
        ),
        option.bool(
            "42730",
            "Like A Pretty Battlemoglin",
            'Mode: [select] only\nShould the bot buy "Like A Pretty Battlemoglin" ?',
            false,
        ),
        option.bool("42732", "Pink Sockatana", 'Mode: [select] only\nShould the bot buy "Pink Sockatana" ?', false),
        option.bool(
            "42735",
            "Pink Chainsaw Katana",
            'Mode: [select] only\nShould the bot buy "Pink Chainsaw Katana" ?',
            false,
        ),
        option.bool("42729", "Pink Unarmed", 'Mode: [select] only\nShould the bot buy "Pink Unarmed" ?', false),
        option.bool(
            "42737",
            "Derp Llama Overlord",
            'Mode: [select] only\nShould the bot buy "Derp Llama Overlord" ?',
            false,
        ),
        option.bool("42738", "Derp Llama Face", 'Mode: [select] only\nShould the bot buy "Derp Llama Face" ?', false),
        option.bool("42739", "Rose Ebil Ninja", 'Mode: [select] only\nShould the bot buy "Rose Ebil Ninja" ?', false),
        option.bool("42741", "Rose Ninja Hood", 'Mode: [select] only\nShould the bot buy "Rose Ninja Hood" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: BeleensDyeMerge.select,
});

export default function main(): void {
    const script = new BeleensDyeMerge();
    Core.bankingBlackList.push(
        "Astral Entity",
        "Pink Potion",
        "Mr. Cuddles Pet",
        "Mr. Cuddles on your Head",
        "Fists of Fire",
        "Like a Battlemoglin",
        "Green Sockatana",
        "Chainsaw Katana",
        "Unarmed",
        "Kitty SkyFighter",
        "BaconCat Force Face",
        "Ebil Ninja",
        "Ebil Ninja Hood",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
