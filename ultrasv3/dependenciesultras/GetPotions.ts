/*
name: Potions
description: null
tags: null
*/
// Port of Scripts/Ultrasv3/DependenciesUltras/GetPotions.cs.
// The variant of Other/Various/Potions.cs (other/various/Potions.ts) the Ultras use: it farms Divine
// Elixirs too and crafts each potion once instead of until the quantity is reached.
//
// Turu: `INeedYourStrongestPotions` reads its options with `configOr`, as UltraPotions calls it from
// scripts that don't declare them (VibeSkua's `Bot.Config.Get` gives the default there).

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { configOr, Core } from "../../core/CoreBots";
import { AlchemyRunes, AlchemyTraits, CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();

export class PotionBuyerv2 {
    //2ndary potions that are obtained alongside the normal versions, to be banked and added as a drop.
    secondaryPotions: string[] = ["Potent Malice Potion", "Potent Soul Potion"];

    iNeedYourStrongestPotions(
        Potions: string[] | null = null,
        PotionsFarm: boolean[] | null = null,
        PotionQuant = 300,
        BuyReagents = false,
        Seperate = false,
    ): void {
        // Clean boolean logic
        BuyReagents = configOr("BuyReagents", false) || BuyReagents;

        Farm.alchemyREP(8);
        Farm.goodREP();

        Core.logger(BuyReagents ? "Method Choose: Buy Reagents" : "Farm Reagents");

        const maxAll = configOr("MaxAll", false);

        // Default potion list
        Potions ??= [
            "Judgment Tonic",
            "Fortitude Tonic",
            "Fate Tonic",
            "Sage Tonic",
            "Potent Battle Elixir",
            "Potent Malevolence Elixir",
            "Potent Honor Potion",
            "Unstable Divine Elixir",
            "Divine Elixir",
            "Potent Revitalize Elixir",
            "Endurance Draught",
            "Felicitous Philtre",
            "Potent Destruction Elixir",
            "Body Tonic",
            "Soul Potion",
            "Unstable Battle Elixir",
            "Unstable Body Tonic",
            "Unstable Fate Tonic",
            "Unstable Keen Elixir",
            "Unstable Mastery Tonic",
            "Unstable Might Tonic",
            "Unstable Wise Tonic",
            "Might Tonic",
            "Malice Potion",
            "Potent Life Potion",
        ];

        // Selection mapping (NO MORE INDEX DEPENDENCY)
        const potionSelection = new Map([
            ["Judgment Tonic", () => configOr("FarmJudgment", false)],
            ["Fortitude Tonic", () => configOr("FarmFortitude", false)],
            ["Fate Tonic", () => configOr("FarmFate", false)],
            ["Sage Tonic", () => configOr("FarmSage", false)],
            ["Potent Battle Elixir", () => configOr("FarmBattle", false)],
            ["Potent Malevolence Elixir", () => configOr("FarmMalevolence", false)],
            ["Potent Honor Potion", () => configOr("FarmHonor", false)],
            ["Unstable Divine Elixir", () => configOr("FarmUnstableDivine", false)],
            ["Divine Elixir", () => configOr("FarmDivine", false)],
            ["Potent Revitalize Elixir", () => configOr("FarmRevitalize", false)],
            ["Endurance Draught", () => configOr("FarmEnduranceDraught", false)],
            ["Felicitous Philtre", () => configOr("FarmFelicitousPhiltre", false)],
            ["Potent Destruction Elixir", () => configOr("FarmDestruction", false)],
            ["Body Tonic", () => configOr("FarmBody", false)],
            ["Soul Potion", () => configOr("FarmSoul", false)],
            // Unstable potions only farmed if MaxAll is enabled
            ["Unstable Battle Elixir", () => maxAll],
            ["Unstable Body Tonic", () => maxAll],
            ["Unstable Fate Tonic", () => maxAll],
            ["Unstable Keen Elixir", () => maxAll],
            ["Unstable Mastery Tonic", () => maxAll],
            ["Unstable Might Tonic", () => maxAll],
            ["Unstable Wise Tonic", () => maxAll],
            ["Might Tonic", () => configOr("FarmMight", false)],
            ["Malice Potion", () => configOr("FarmMalice", false)],
            ["Potent Life Potion", () => configOr("FarmLife", false)],
        ]);

        // Validation
        if (
            (!Seperate && !maxAll && ![...potionSelection.values()].some((select) => select())) ||
            PotionQuant < 1 ||
            PotionQuant > 300
        ) {
            Core.logger("No Potions selected or invalid quantity. Stopping.", undefined, {
                messageBox: true,
                stopBot: true,
            });
            return;
        }

        Core.addDrop(...Potions);
        Core.toBank(...this.secondaryPotions);
        Core.addDrop(...this.secondaryPotions);

        // Debug (super useful)
        Core.logger(`Selected: ${Potions.filter((p) => maxAll || Seperate || potionSelection.get(p)!()).join(", ")}`);

        for (const Potion of Potions) {
            const BulkGrind = (reagent1: string, reagent2: string, rune: AlchemyRunes = AlchemyRunes.Gebo): void => {
                if (bot.shouldExit || Core.checkInventory(Potion, PotionQuant)) {
                    return;
                }

                GetIngredient(reagent1);
                GetIngredient(reagent2);

                Core.join("alchemy");
                Farm.alchemyPacket(reagent1, reagent2, rune, { trait: currTrait, item: Potion, quant: PotionQuant });

                Core.logger(`Finished one crafting attempt for ${Potion}. Not retrying.`);
            };
            const GetIngredient = (ingredient: string, ingreQuant = 30): void => {
                if (Core.checkInventory(ingredient, ingreQuant)) {
                    return;
                }

                Core.toggleAggro(false);

                switch (ingredient) {
                    case "Ice Vapor":
                        if (!BuyReagents) {
                            Core.killMonster("lair", "Enter", "Spawn", "*", "Ice Vapor", 2, {
                                isTemp: false,
                                log: false,
                            });
                        } else {
                            Adv.buyItem("alchemyacademy", 397, 11478, ingreQuant, 1235);
                        }
                        break;
                    case "Moglin Tears":
                        if (!Core.isMember && !BuyReagents) {
                            Core.logger("Farming map is members only, buying the materials");
                        }
                        if (!BuyReagents && Core.isMember) {
                            Core.huntMonster("twig", "Sweetish Fish", ingredient, ingreQuant, { isTemp: false });
                        } else {
                            Adv.buyItem("alchemyacademy", 397, 11472, ingreQuant, 1229);
                        }
                        break;
                    case "Lemurphant Tears":
                        if (!BuyReagents) {
                            Core.huntMonster("ravinetemple", "Lemurphant", ingredient, ingreQuant, { isTemp: false });
                        } else {
                            Adv.buyItem("alchemyacademy", 397, 11479, ingreQuant, 1236);
                        }
                        break;
                    case "Dried Slime":
                        if (!BuyReagents) {
                            Core.huntMonster("orecavern", "Crashroom", ingredient, ingreQuant, { isTemp: false });
                        } else {
                            Adv.buyItem("alchemyacademy", 397, 11474, ingreQuant, 1231);
                        }
                        break;
                    case "Arashtite Ore":
                        if (!BuyReagents) {
                            Core.huntMonster("orecavern", "Deathmole", ingredient, ingreQuant, { isTemp: false });
                        } else {
                            Adv.buyItem("alchemyacademy", 397, 11473, ingreQuant, 1230);
                        }
                        break;
                    case "Chaos Entity":
                        Adv.buyItem("alchemyacademy", 2114, 11482, ingreQuant, 9740);
                        break;
                    case "Fish Oil":
                        Adv.buyItem("alchemyacademy", 397, 11467, ingreQuant, 1224);
                        break;
                    case "Doomatter":
                        if (!BuyReagents) {
                            if (bot.player.isMember) {
                                Core.huntMonster("Creepy", "Fear Feeder", ingredient, ingreQuant, { isTemp: false });
                            } else {
                                Core.huntMonster("maul", "Creature Creation", ingredient, ingreQuant, {
                                    isTemp: false,
                                });
                            }
                        } else {
                            Adv.buyItem("alchemyacademy", 397, 11477, ingreQuant, 1234);
                        }
                        break;
                    case "Chaoroot":
                        if (!BuyReagents) {
                            Core.huntMonster("orecavern", "Naga Baas", ingredient, ingreQuant, { isTemp: false });
                        } else {
                            Adv.buyItem("tercessuinotlim", 1951, 11481, ingreQuant, 7911);
                        }
                        break;
                    case "Nimblestem":
                        if (!BuyReagents) {
                            Core.huntMonster("mudluk", "Swamp Frogdrake", "Nimblestem", ingreQuant, { isTemp: false });
                        } else {
                            Adv.buyItem("alchemyacademy", 397, 11469, ingreQuant, 1226);
                        }
                        break;
                    case "Trollola Nectar":
                        if (!BuyReagents) {
                            Core.huntMonster("bloodtusk", "Trollola Plant", ingredient, ingreQuant, { isTemp: false });
                        } else {
                            Adv.buyItem("alchemyacademy", 397, 11476, ingreQuant, 1233);
                        }
                        break;
                    case "Searbush":
                        if (!BuyReagents) {
                            Core.huntMonster("mafic", "Living Fire", ingredient, ingreQuant, { isTemp: false });
                        } else {
                            Adv.buyItem("alchemyacademy", 397, 11468, ingreQuant, 1225);
                        }
                        break;
                    case "Dragon Scale":
                        Core.addDrop(11475);
                        if (!BuyReagents) {
                            while (!bot.shouldExit && !Core.checkInventory(11475, ingreQuant)) {
                                Core.killMonster("lair", "Hole", "Center", "*", undefined, undefined, {
                                    isTemp: false,
                                    log: false,
                                });
                            }
                        } else if (!Core.checkInventory(11475, ingreQuant)) {
                            Adv.buyItem("alchemyacademy", 397, 11475, ingreQuant, 1232);
                        }
                        break;
                    case "Roc Tongue":
                        if (!BuyReagents) {
                            Core.huntMonster("roc", "Rock Roc", ingredient, ingreQuant, { isTemp: false, log: false });
                        } else {
                            Adv.buyItem("alchemyacademy", 397, 11471, ingreQuant, 1228);
                        }
                        break;
                    case "Necrot":
                        if (!BuyReagents) {
                            Core.huntMonster("deathsrealm", "Skeleton Fighter", ingredient, ingreQuant, {
                                isTemp: false,
                                log: false,
                            });
                        } else {
                            Adv.buyItem("alchemyacademy", 397, 11480, ingreQuant, 1237);
                        }
                        break;
                    case "Rhison Blood":
                        if (!BuyReagents) {
                            Core.huntMonster("bloodtusk", "Rhison", ingredient, ingreQuant, {
                                isTemp: false,
                                log: false,
                            });
                        } else {
                            Adv.buyItem("alchemyacademy", 397, 11470, ingreQuant, 1227);
                        }
                        break;
                    default:
                        Core.logger(`Unknown ingredient: ${ingredient}`);
                        break;
                }
            };
            const shouldFarm = maxAll || Seperate || potionSelection.get(Potion)!();

            Core.logger(`${Potion}: ${shouldFarm}`);

            if (!shouldFarm) {
                continue;
            }

            if (Core.checkInventory(Potion, PotionQuant)) {
                continue;
            }

            Core.farmingLogger(Potion, PotionQuant);

            let currTrait = AlchemyTraits.Int;

            switch (Potion) {
                case "Fate Tonic":

                case "Sage Tonic":
                    currTrait = Potion === "Sage Tonic" ? AlchemyTraits.Int : AlchemyTraits.Luc;
                    BulkGrind("Arashtite Ore", "Dried Slime");
                    break;
                case "Potent Battle Elixir":

                case "Potent Malevolence Elixir":
                    currTrait = Potion === "Potent Malevolence Elixir" ? AlchemyTraits.SPw : AlchemyTraits.APw;
                    BulkGrind("Doomatter", "Chaoroot");
                    break;
                case "Potent Honor Potion":

                case "Malice Potion":
                    currTrait = AlchemyTraits.Dam;
                    BulkGrind("Chaoroot", "Chaos Entity");
                    break;
                case "Potent Life Potion":
                    currTrait = AlchemyTraits.Hea;
                    BulkGrind("Dragon Scale", "Searbush");
                    break;
                case "Might Tonic":
                    currTrait = AlchemyTraits.Dam;
                    BulkGrind("Chaos Entity", "Rhison Blood");
                    break;
                case "Unstable Divine Elixir":
                    if (PotionQuant > 99) {
                        Core.logger(`Max quant for [${Potion}] is [99] - Adjusting`);
                        PotionQuant = 99;
                    }
                    currTrait = AlchemyTraits.hOu;
                    BulkGrind("Dragon Scale", "Lemurphant Tears");
                    break;
                case "Divine Elixir":
                    if (PotionQuant > 99) {
                        Core.logger(`Max quant for [${Potion}] is [99] - Adjusting`);
                        PotionQuant = 99;
                    }
                    currTrait = AlchemyTraits.hOu;
                    BulkGrind("Dragon Scale", "Ice Vapor");
                    break;
                case "Potent Revitalize Elixir":
                    currTrait = AlchemyTraits.hRe;
                    BulkGrind("Chaoroot", "Lemurphant Tears");
                    break;
                case "Felicitous Philtre":

                case "Endurance Draught":
                    Core.logger(`[${Potion}] has no farm method, buying.`);
                    Adv.buyItem("alchemyacademy", 2036, Potion, PotionQuant);
                    break;
                case "Potent Destruction Elixir":
                    currTrait = AlchemyTraits.mRe;
                    BulkGrind("Dried Slime", "Arashtite Ore");
                    break;
                case "Body Tonic":
                    currTrait = AlchemyTraits.End;
                    BulkGrind("Roc Tongue", "Chaoroot");
                    break;
                case "Soul Potion":
                    currTrait = AlchemyTraits.Dam;
                    BulkGrind("Necrot", "Nimblestem");
                    break;
                case "Unstable Battle Elixir":
                    currTrait = AlchemyTraits.APw;
                    BulkGrind("Doomatter", "Nimblestem");
                    break;
                case "Unstable Body Tonic":
                    currTrait = AlchemyTraits.End;
                    BulkGrind("Nimblestem", "Roc Tongue");
                    break;
                case "Unstable Fate Tonic":
                    currTrait = AlchemyTraits.Luc;
                    BulkGrind("Dried Slime", "Trollola Nectar");
                    break;
                case "Unstable Keen Elixir":
                    currTrait = AlchemyTraits.Cri;
                    BulkGrind("Trollola Nectar", "Doomatter");
                    break;
                case "Unstable Mastery Tonic":
                    currTrait = AlchemyTraits.Dex;
                    BulkGrind("Chaos Entity", "Dried Slime");
                    break;
                case "Unstable Might Tonic":
                    currTrait = AlchemyTraits.Str;
                    BulkGrind("Chaos Entity", "Fish Oil");
                    break;
                case "Unstable Wise Tonic":
                    currTrait = AlchemyTraits.Wis; // C# (AlchemyTraits)13
                    BulkGrind("Moglin Tears", "Rhison Blood");
                    break;
                case "Judgment Tonic":
                    currTrait = AlchemyTraits.Wis; // C# (AlchemyTraits)13
                    BulkGrind("Dragon Scale", "Moglin Tears", AlchemyRunes.Jera);
                    break;
                case "Fortitude Tonic":
                    currTrait = AlchemyTraits.End;
                    BulkGrind("Necrot", "Roc Tongue", AlchemyRunes.Fehu);
                    break;
                default:
                    Core.logger(`Unknown potion: ${Potion}`);
                    break;
            }
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "Potionv2",
    [
        option.bool(
            "BuyReagents",
            "Buy Reagents?",
            "Use gold to buy the reagents for the Potions [this takes ALOT of gold.].",
            false,
        ),
        option.int("PotionQuant", "Potion Quantity", "Desired stack amount [max - 300]", 0),
        option.bool("MaxAll", "Max all Potions within the script.", "as the name says", false),
        Core.skipOptions, // Tonic
        option.bool("FarmFate", "Fate", "Should the bot Farm Fate Tonics?", false),
        option.bool("FarmSage", "Sage", "Should the bot Farm Sage Tonics?", false),
        option.bool("FarmMight", "Might", "Should the bot Farm Might Tonics?", false),
        option.bool("FarmFortitude", "Fortitude", "Should the bot Farm Fortitude Tonics?", false),
        option.bool("FarmJudgment", "Judgment", "Should the bot Farm Judgment Tonics?", false), // Elixir
        option.bool("FarmBattle", "Battle", "Should the bot Farm Battle Elixirs?", false),
        option.bool("FarmMalevolence", "Malevolence", "Should the bot Farm Malevolence Elixirs?", false),
        option.bool("FarmUnstableDivine", "Unstable Divine", "Should the bot Farm Unstable Divine Elixirs?", false),
        option.bool("FarmDivine", "Divine Elixir", "Should the bot Farm Divine Elixirs?", false),
        option.bool("FarmRevitalize", "Revitalize", "Should the bot Farm Potent Revitalize Elixirs", false),
        option.bool("FarmDestruction", "Destruction", "Should the bot Farm Potent Destruction Elixir?", false),
        option.bool("FarmFelicitousPhiltre", "Felicitous Philtre", "Should the bot get Felicitous Philtre?", false),
        option.bool("FarmEnduranceDraught", "Endurance Draught", "Should the bot get Endurance Draught?", false), // Potion
        option.bool("FarmMalice", "Malice", "Should the bot Farm Malice Potions?", false), // FIXED NAME
        option.bool("FarmHonor", "Honor", "Should the bot Farm Honor Potions?", false),
        option.bool("FarmLife", "Life", "Should the bot Farm Potent Life Potion?", false),
        option.bool("FarmBody", "Body", "Should the bot Farm Body Tonics?", false),
        option.bool("FarmSoul", "Soul", "Should the bot Farm Soul Potions?", false),
    ],
    true,
);

export default function main(): void {
    const script = new PotionBuyerv2();
    // Add items that should never be banked
    Core.bankingBlackList.push("Dragon Runestone");
    Core.bankingBlackList.push(...script.secondaryPotions);

    Core.setOptions();

    // Determine if MaxAll is enabled
    const maxAll = bot.config!.get<boolean>("MaxAll");

    // Prepare Potions and PotionsFarm arrays if MaxAll is true
    const potions = maxAll
        ? [
              "Judgment Tonic",
              "Fortitude Tonic",
              "Fate Tonic",
              "Sage Tonic",
              "Potent Battle Elixir",
              "Potent Malevolence Elixir",
              "Potent Honor Potion",
              "Unstable Divine Elixir",
              "Divine Elixir",
              "Potent Revitalize Elixir",
              "Endurance Draught",
              "Felicitous Philtre",
              "Potent Destruction Elixir",
              "Body Tonic",
              "Soul Potion",
              "Unstable Battle Elixir",
              "Unstable Body Tonic",
              "Unstable Fate Tonic",
              "Unstable Keen Elixir",
              "Unstable Mastery Tonic",
              "Unstable Might Tonic",
              "Unstable Wise Tonic",
              "Might Tonic",
              "Malice Potion",
              "Potent Life Potion",
          ]
        : null;

    const potionsFarm = maxAll ? [...new Array(potions!.length).fill(true)] : null;

    const raw = bot.config!.get<string>("PotionQuant") ?? "";

    let potionQuant = /^\s*[+-]?\d+\s*$/.test(String(raw)) ? Number(raw) : NaN;

    if (!Number.isInteger(potionQuant)) {
        Core.logger(`Invalid PotionQuant '${raw}', defaulting to 300`);
        potionQuant = 300;
    }

    potionQuant = maxAll ? 300 : potionQuant;
    // Call the main potion farming method
    script.iNeedYourStrongestPotions(potions, potionsFarm, potionQuant, bot.config!.get<boolean>("BuyReagents"));

    Core.setOptions(false);
}
