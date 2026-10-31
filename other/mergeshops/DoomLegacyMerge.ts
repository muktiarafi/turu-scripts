/*
name: DoomLegacyMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/DoomLegacyMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreDoomwood } from "../../story/doomwood/CoreDoomwood";

const Adv = new CoreAdvanced();
const DWp3 = new CoreDoomwood();

export class DoomLegacyMerge {
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
                case "Shadowscythe Trooper":

                case "ShadowScythe Trooper's Helm":

                case "ShadowScythe Trooper's Cape":

                case "ShadowScythe Blade":
                    Core.huntMonsterMapID("thorngarde", 2, req.name, undefined, { isTemp: false });
                    break;
                case "Salvaged Deadtech Node":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(7601);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("thorngarde", "CryptHacker", "Deadtech Power Core", 7);
                        Core.huntMonster("thorngarde", "CryptHacker", "CryptHacker Circuitry", 15);
                        Core.huntMonster("thorngarde", "NecroMech", "NecroMech Targeting Systems", 5);

                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("thorngarde", "Zyrus the BioKnight", "BioKnight Engine", 3);

                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "ShadowScythe Rogue":

                case "ShadowScythe Rogue's Helm":

                case "ShadowScythe Rogue's Cape":

                case "ShadowScythe Reversed Daggers":

                case "ShadowScythe Daggers":
                    Core.huntMonsterMapID("thorngarde", 3, req.name, undefined, { isTemp: false });
                    break;
                case "ShadowScythe Mage":

                case "ShadowScythe Mage's Hat":

                case "ShadowScythe Mage's Hat + Locks":

                case "ShadowScythe Mage's Rune":

                case "ShadowScythe Staff":
                    Core.huntMonsterMapID("thorngarde", 5, req.name, undefined, { isTemp: false });
                    break;
                case "Zealous Paladin":

                case "Zealous Veil":

                case "Zealous Cherubs":

                case "Cryptborg":

                case "Cryptborg Wrap":

                case "Cryptborg Torpedo":

                case "Cryptborg Blade":

                case "Cryptborg Helm":
                    Core.huntMonster("techdungeon", "Kalron the Cryptborg", req.name, quant, { isTemp: false });
                    break;
                case "Zealous Badge":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(7616);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("techdungeon", "Kalron the Cryptborg", "Immutable Dedication", 7, {
                            log: false,
                        });
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("techdungeon", "DoomBorg Guard", "Paladin Armor Scraps", 30, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Zealous Rays Of Light":

                case "Zealous Censer":
                    Core.huntMonster("stonewood", "BioKnight", req.name, undefined, { isTemp: false });
                    break;
                case "Deadtech Booster":
                    Core.killMonster("stonewooddeep", "r2", "Left", "*", req.name, quant, { isTemp: false });
                    break;
                case "DoomMaster":

                case "DoomMaster Horns":

                case "DoomMaster's Wrap":

                case "DoomMaster's Whip":
                    bot.quests.updateQuest(7635);
                    Core.huntMonster("stonewood", "Sir Kut", req.name, undefined, { isTemp: false });
                    break;
            }
        };
        DWp3.doomwoodPart3();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("stonewood", 1899, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "55532",
            "High ShadowScythe Trooper",
            'Mode: [select] only\nShould the bot buy "High ShadowScythe Trooper" ?',
            false,
        ),
        option.bool(
            "55534",
            "High ShadowScythe Rogue",
            'Mode: [select] only\nShould the bot buy "High ShadowScythe Rogue" ?',
            false,
        ),
        option.bool(
            "55536",
            "High ShadowScythe Mage",
            'Mode: [select] only\nShould the bot buy "High ShadowScythe Mage" ?',
            false,
        ),
        option.bool(
            "55538",
            "High ShadowScythe Trooper's Helm",
            'Mode: [select] only\nShould the bot buy "High ShadowScythe Trooper\'s Helm" ?',
            false,
        ),
        option.bool(
            "55540",
            "High ShadowScythe Rogue's Helm",
            'Mode: [select] only\nShould the bot buy "High ShadowScythe Rogue\'s Helm" ?',
            false,
        ),
        option.bool(
            "55542",
            "High ShadowScythe Hat + Locks",
            'Mode: [select] only\nShould the bot buy "High ShadowScythe Hat + Locks" ?',
            false,
        ),
        option.bool(
            "55544",
            "High ShadowScythe Mage's Hat",
            'Mode: [select] only\nShould the bot buy "High ShadowScythe Mage\'s Hat" ?',
            false,
        ),
        option.bool(
            "55546",
            "High ShadowScythe Mage's Rune",
            'Mode: [select] only\nShould the bot buy "High ShadowScythe Mage\'s Rune" ?',
            false,
        ),
        option.bool(
            "55548",
            "High ShadowScythe Rogue's Cape",
            'Mode: [select] only\nShould the bot buy "High ShadowScythe Rogue\'s Cape" ?',
            false,
        ),
        option.bool(
            "55550",
            "High ShadowScythe Trooper's Cape",
            'Mode: [select] only\nShould the bot buy "High ShadowScythe Trooper\'s Cape" ?',
            false,
        ),
        option.bool(
            "55554",
            "High ShadowScythe Blade",
            'Mode: [select] only\nShould the bot buy "High ShadowScythe Blade" ?',
            false,
        ),
        option.bool(
            "55557",
            "High ShadowScythe Staff",
            'Mode: [select] only\nShould the bot buy "High ShadowScythe Staff" ?',
            false,
        ),
        option.bool(
            "55561",
            "High Reversed Shadow Daggers",
            'Mode: [select] only\nShould the bot buy "High Reversed Shadow Daggers" ?',
            false,
        ),
        option.bool(
            "55580",
            "High ShadowScythe Daggers",
            'Mode: [select] only\nShould the bot buy "High ShadowScythe Daggers" ?',
            false,
        ),
        option.bool(
            "54787",
            "Zealous Aegis Paladin",
            'Mode: [select] only\nShould the bot buy "Zealous Aegis Paladin" ?',
            false,
        ),
        option.bool("54789", "Zealous Crown", 'Mode: [select] only\nShould the bot buy "Zealous Crown" ?', false),
        option.bool(
            "54790",
            "Zealous Great Helm",
            'Mode: [select] only\nShould the bot buy "Zealous Great Helm" ?',
            false,
        ),
        option.bool("54791", "Zealous Miter", 'Mode: [select] only\nShould the bot buy "Zealous Miter" ?', false),
        option.bool(
            "54792",
            "Zealous Miter And Stola",
            'Mode: [select] only\nShould the bot buy "Zealous Miter And Stola" ?',
            false,
        ),
        option.bool(
            "54794",
            "Zealous Seraphim Cape",
            'Mode: [select] only\nShould the bot buy "Zealous Seraphim Cape" ?',
            false,
        ),
        option.bool(
            "54799",
            "Zealous Light of Fate",
            'Mode: [select] only\nShould the bot buy "Zealous Light of Fate" ?',
            false,
        ),
        option.bool(
            "55826",
            "Necrodrone Trooper",
            'Mode: [select] only\nShould the bot buy "Necrodrone Trooper" ?',
            false,
        ),
        option.bool("55825", "Necrodrone Rogue", 'Mode: [select] only\nShould the bot buy "Necrodrone Rogue" ?', false),
        option.bool("55824", "Necrodrone Mage", 'Mode: [select] only\nShould the bot buy "Necrodrone Mage" ?', false),
        option.bool(
            "55736",
            "Charged Cryptborg",
            'Mode: [select] only\nShould the bot buy "Charged Cryptborg" ?',
            false,
        ),
        option.bool(
            "55739",
            "Cryptborg Laser Mount",
            'Mode: [select] only\nShould the bot buy "Cryptborg Laser Mount" ?',
            false,
        ),
        option.bool(
            "55742",
            "Cryptborg Laser Blade",
            'Mode: [select] only\nShould the bot buy "Cryptborg Laser Blade" ?',
            false,
        ),
        option.bool(
            "55737",
            "Charged Cryptborg Helm",
            'Mode: [select] only\nShould the bot buy "Charged Cryptborg Helm" ?',
            false,
        ),
        option.bool("55747", "FireMaster", 'Mode: [select] only\nShould the bot buy "FireMaster" ?', false),
        option.bool(
            "55748",
            "FireMaster's Horns",
            'Mode: [select] only\nShould the bot buy "FireMaster\'s Horns" ?',
            false,
        ),
        option.bool(
            "55749",
            "FireMaster's Cape",
            'Mode: [select] only\nShould the bot buy "FireMaster\'s Cape" ?',
            false,
        ),
        option.bool(
            "55750",
            "FireMaster's Whip",
            'Mode: [select] only\nShould the bot buy "FireMaster\'s Whip" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: DoomLegacyMerge.select,
});

export default function main(): void {
    const script = new DoomLegacyMerge();
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
