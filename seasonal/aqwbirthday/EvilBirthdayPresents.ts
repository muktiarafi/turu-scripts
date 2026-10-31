/*
name: Evil Birthday Presents Merge
description: Farms the Evil Birthday Presents Merge [2779] in /fortressparty.
tags: fortressparty, merge, evil, birthday, presents, merge
*/
// Port of Scripts/Seasonal/AqwBirthday/EvilBirthdayPresents.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { Fortressparty } from "./Fortressparty";

const Adv = new CoreAdvanced();
const FortressParty = new Fortressparty();

export class EvilBirthdayPresents {
    private dontStopMissingIng = false;

    buyAllMerge(buyOnlyThis: string | null = null, buyMode: mergeOptionsEnum | null = null): void {
        const findIngredients = (): void => {
            const req = Adv.externalItem;
            const quant = Adv.externalQuant;
            if (req == null) {
                return;
            }

            switch (req.name) {
                case "Costume Supplies":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("fortressparty", "Athon Cosplayer", req.name, quant, { isTemp: req.temp });
                    break;
                case "Doomed Memory":

                case "Shadow Celebrant Hair":

                case "Shadow Celebrant Hair + Mask":

                case "Shadow Celebrant Locks":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("fortressparty", "Hopeful Shadow", req.name, quant, { isTemp: req.temp });
                    break;
                case "Heraldic Deathknight Helm":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("fortressparty", "Photoghoulpher", req.name, quant, { isTemp: req.temp });
                    break;
                default: {
                    const shouldStop = !Adv.matsOnly || !this.dontStopMissingIng;
                    Core.logger(`The bot hasn't been taught how to get ${req.name}.`, undefined, {
                        messageBox: shouldStop,
                        stopBot: shouldStop,
                    });
                    break;
                }
            }
        };
        Adv.startBuyAllMerge("fortressparty", 2779, findIngredients, buyOnlyThis, { buyMode });
    }

    static readonly select = [
        option.bool(
            "47108",
            "ShadowFall Celebrant",
            'Mode: [select] only\nShould the bot buy "ShadowFall Celebrant" ?',
            false,
        ),
        option.bool(
            "103789",
            "Heraldic Deathknight",
            'Mode: [select] only\nShould the bot buy "Heraldic Deathknight" ?',
            false,
        ),
        option.bool(
            "103793",
            "Deathknight's Tribute Cape",
            'Mode: [select] only\nShould the bot buy "Deathknight\'s Tribute Cape" ?',
            false,
        ),
        option.bool(
            "103795",
            "Heraldic Deathknight Blades",
            'Mode: [select] only\nShould the bot buy "Heraldic Deathknight Blades" ?',
            false,
        ),
        option.bool(
            "103790",
            "Heraldic Deathknight Skull",
            'Mode: [select] only\nShould the bot buy "Heraldic Deathknight Skull" ?',
            false,
        ),
        option.bool(
            "103792",
            "Heraldic Deathknight Morph",
            'Mode: [select] only\nShould the bot buy "Heraldic Deathknight Morph" ?',
            false,
        ),
        option.bool(
            "47109",
            "Shadow Celebrant Hair + Skull + Mask",
            'Mode: [select] only\nShould the bot buy "Shadow Celebrant Hair + Skull + Mask" ?',
            false,
        ),
        option.bool(
            "47112",
            "Shadow Celebrant Hair + Skull",
            'Mode: [select] only\nShould the bot buy "Shadow Celebrant Hair + Skull" ?',
            false,
        ),
        option.bool(
            "47114",
            "Shadow Celebrant Locks + Skull",
            'Mode: [select] only\nShould the bot buy "Shadow Celebrant Locks + Skull" ?',
            false,
        ),
        option.bool(
            "47116",
            "Shadow Celebrant Locks + Skull + Mask",
            'Mode: [select] only\nShould the bot buy "Shadow Celebrant Locks + Skull + Mask" ?',
            false,
        ),
        option.bool(
            "47118",
            "Shadow Celebrant Skull Morph",
            'Mode: [select] only\nShould the bot buy "Shadow Celebrant Skull Morph" ?',
            false,
        ),
        option.bool(
            "47121",
            "ShadowFall Reaper's Scythe",
            'Mode: [select] only\nShould the bot buy "ShadowFall Reaper\'s Scythe" ?',
            false,
        ),
        option.bool(
            "47120",
            "Shadow Celebrant's Staff",
            'Mode: [select] only\nShould the bot buy "Shadow Celebrant\'s Staff" ?',
            false,
        ),
        option.bool(
            "47119",
            "Shadow Celebrant's Blade",
            'Mode: [select] only\nShould the bot buy "Shadow Celebrant\'s Blade" ?',
            false,
        ),
        option.bool(
            "103794",
            "Heraldic Deathknight Blade",
            'Mode: [select] only\nShould the bot buy "Heraldic Deathknight Blade" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: EvilBirthdayPresents.select,
});

export default function main(): void {
    const script = new EvilBirthdayPresents();
    Core.bankingBlackList.push(
        "Costume Supplies",
        "Doomed Memory",
        "Heraldic Deathknight Helm",
        "Shadow Celebrant Hair",
        "Shadow Celebrant Hair + Mask",
        "Shadow Celebrant Locks",
    );
    Core.setOptions();
    FortressParty.storyline();
    script.buyAllMerge();
    Core.setOptions(false);
}
