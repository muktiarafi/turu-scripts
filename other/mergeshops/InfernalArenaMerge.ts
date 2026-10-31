/*
name: Infernal Arena Merge
description: This bot will farm the items belonging to the selected mode for the Infernal Arena Merge [2334] in /infernalarena
tags: infernal, arena, merge, infernalarena, tainted, naal, cervus, malus, skull, krampus, claws, defiler, scythe, azalith, fallen, crown, , great, wings, divine, wanderer, wanderers, circlet, champions, mantle, guidance, spear, grace, serene, sharpshooter, bow, celestial, dire, engineers, horns
*/
// Port of Scripts/Other/MergeShops/InfernalArenaMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { InfernalArena } from "../../story/queenofmonsters/extra/InfernalArena";

const Adv = new CoreAdvanced();
const IA = new InfernalArena();

export class InfernalArenaMerge {
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
                case "Tainted Blade of Na'al":

                case "Champion's Seal":

                case "Tainted Dagger of Na'al":
                    Core.farmingLogger(req.name, quant);
                    Core.equip(
                        Core.checkInventory("Chaos Avenger")
                            ? "Chaos Avenger"
                            : Core.checkInventory("Void HighLord (IoDA)")
                              ? "Void HighLord (IoDA)"
                              : "Void Highlord",
                    );
                    Core.huntMonster("infernalarena", "Na'al", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Cervus Dente":
                    Core.farmingLogger(req.name, quant);
                    if (
                        Core.checkInventory(["Legion DoomKnight", "Classic Legion DoomKnight"], undefined, {
                            any: true,
                        })
                    ) {
                        Core.equip(
                            Core.checkInventory("Legion DoomKnight")
                                ? "Legion DoomKnight"
                                : "Classic Legion DoomKnight",
                        );
                    }
                    Core.huntMonster("infernalarena", "Cervus Malus", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Infernal Krampus' Claw":

                case "Infernal Emblem":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("infernalarena", "Infernal Krampus", req.name, quant, {
                        isTemp: false,
                        log: false,
                    });
                    break;
                case "Axe of the Infernal Defiler":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("infernalarena", "Destructive Defiler", req.name, quant, {
                        isTemp: false,
                        log: false,
                    });
                    break;
                case "Infernal Incantation":
                    Core.farmingLogger(req.name, quant);
                    Core.useBossClass("Dragon of Time");
                    Core.huntMonster("infernalarena", "Key of Sholemoh", req.name, quant, {
                        isTemp: false,
                        log: false,
                    });
                    break;
                case "Scythe Shard":
                    Core.useDodgeClass("Lord of Order");
                    Core.huntMonster("infernalarena", "Azalith's Scythe", req.name, quant, {
                        isTemp: false,
                        log: false,
                    });
                    break;
                case "Duo's Dinner":
                    Core.farmingLogger(req.name, quant);
                    Core.useBossClass();
                    Core.huntMonster("infernalarena", "Deadly Duo", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Infernal Badge":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("infernalarena", "Infernal Mage", req.name, quant, { isTemp: false, log: false });
                    break;
            }
        };
        IA.doStory(true);
        Core.logger("The mobs are strong so this may take a while.");
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("infernalarena", 2334, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "79721",
            "Tainted Blades of Na'al",
            'Mode: [select] only\nShould the bot buy "Tainted Blades of Na\'al" ?',
            false,
        ),
        option.bool(
            "79723",
            "Tainted Daggers of Na'al",
            'Mode: [select] only\nShould the bot buy "Tainted Daggers of Na\'al" ?',
            false,
        ),
        option.bool(
            "79742",
            "Cervus Malus' Skull",
            'Mode: [select] only\nShould the bot buy "Cervus Malus\' Skull" ?',
            false,
        ),
        option.bool(
            "79748",
            "Infernal Krampus' Claws",
            'Mode: [select] only\nShould the bot buy "Infernal Krampus\' Claws" ?',
            false,
        ),
        option.bool(
            "79750",
            "Axes of the Infernal Defiler",
            'Mode: [select] only\nShould the bot buy "Axes of the Infernal Defiler" ?',
            false,
        ),
        option.bool(
            "79659",
            "Scythe of Azalith",
            'Mode: [select] only\nShould the bot buy "Scythe of Azalith" ?',
            false,
        ),
        option.bool(
            "79660",
            "Scythe of the Fallen",
            'Mode: [select] only\nShould the bot buy "Scythe of the Fallen" ?',
            false,
        ),
        option.bool("79713", "Armor of Azalith", 'Mode: [select] only\nShould the bot buy "Armor of Azalith" ?', false),
        option.bool("79714", "Crown of Azalith", 'Mode: [select] only\nShould the bot buy "Crown of Azalith" ?', false),
        option.bool(
            "79715",
            "Crown + Locks of Azalith",
            'Mode: [select] only\nShould the bot buy "Crown + Locks of Azalith" ?',
            false,
        ),
        option.bool(
            "79717",
            "Great Wings of Azalith",
            'Mode: [select] only\nShould the bot buy "Great Wings of Azalith" ?',
            false,
        ),
        option.bool("79724", "Divine Wanderer", 'Mode: [select] only\nShould the bot buy "Divine Wanderer" ?', false),
        option.bool(
            "79725",
            "Divine Wanderer's Circlet",
            'Mode: [select] only\nShould the bot buy "Divine Wanderer\'s Circlet" ?',
            false,
        ),
        option.bool(
            "79726",
            "Divine Wanderer's Locks",
            'Mode: [select] only\nShould the bot buy "Divine Wanderer\'s Locks" ?',
            false,
        ),
        option.bool(
            "79727",
            "Divine Champion's Mantle",
            'Mode: [select] only\nShould the bot buy "Divine Champion\'s Mantle" ?',
            false,
        ),
        option.bool(
            "79728",
            "Divine Wanderer's Guidance",
            'Mode: [select] only\nShould the bot buy "Divine Wanderer\'s Guidance" ?',
            false,
        ),
        option.bool(
            "79729",
            "Spear of Divine Grace",
            'Mode: [select] only\nShould the bot buy "Spear of Divine Grace" ?',
            false,
        ),
        option.bool(
            "79730",
            "Serene Sharpshooter Bow",
            'Mode: [select] only\nShould the bot buy "Serene Sharpshooter Bow" ?',
            false,
        ),
        option.bool(
            "79731",
            "Celestial Wanderer",
            'Mode: [select] only\nShould the bot buy "Celestial Wanderer" ?',
            false,
        ),
        option.bool(
            "79732",
            "Celestial Champion's Mantle",
            'Mode: [select] only\nShould the bot buy "Celestial Champion\'s Mantle" ?',
            false,
        ),
        option.bool(
            "79733",
            "Celestial Wanderer's Guidance",
            'Mode: [select] only\nShould the bot buy "Celestial Wanderer\'s Guidance" ?',
            false,
        ),
        option.bool(
            "79734",
            "Celestial Sharpshooter Bow",
            'Mode: [select] only\nShould the bot buy "Celestial Sharpshooter Bow" ?',
            false,
        ),
        option.bool(
            "79737",
            "Dire Armor of Na'al",
            'Mode: [select] only\nShould the bot buy "Dire Armor of Na\'al" ?',
            false,
        ),
        option.bool(
            "79738",
            "Dire Helm of Na'al",
            'Mode: [select] only\nShould the bot buy "Dire Helm of Na\'al" ?',
            false,
        ),
        option.bool(
            "79740",
            "Infernal Engineer's Skull + Horns",
            'Mode: [select] only\nShould the bot buy "Infernal Engineer\'s Skull + Horns" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: InfernalArenaMerge.select,
});

export default function main(): void {
    const script = new InfernalArenaMerge();
    Core.bankingBlackList.push(
        "Tainted Blade of Na'al",
        "Champion's Seal",
        "Tainted Dagger of Na'al",
        "Cervus Dente",
        "Infernal Krampus' Claw",
        "Infernal Emblem",
        "Axe of the Infernal Defiler",
        "Infernal Incantation",
        "Scythe Shard",
        "Duo's Dinner",
        "Infernal Badge",
        "Scythe of Azalith",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
