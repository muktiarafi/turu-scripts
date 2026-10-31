/*
name: Doom Metal Necro[class]
description: does the battle concert even quests for the classes.
tags: concert, metal necro, doom metal necro, neo metal necro
*/
// Port of Scripts/Other/Concerts/DoomMetalNecro.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreDailies } from "../../core/CoreDailies";
import { ArchDoomKnight } from "../../evil/ADK";
import { VordredArmor } from "../../evil/VordredsArmor";
import { BattleConcertClassQuests } from "./BattleConcert2023";
import { NeoMetalNecro } from "./NeoMetalNecro";

const Daily = new CoreDailies();
const Adv = new CoreAdvanced();
const BCCQ = new BattleConcertClassQuests();
const NMN = new NeoMetalNecro();
const ADK = new ArchDoomKnight();
const VA = new VordredArmor();

export class DoomMetalNecro {
    getClass(rankUpClass = true): void {
        if (Core.checkInventory("Doom Metal Necro")) {
            if (rankUpClass) {
                Adv.rankUpClass("Doom Metal Necro");
            }
            return;
        }

        BCCQ.battleConcertQuests();
        NMN.getClass();

        // Doom Metal Necro Class 9328
        Core.ensureAccept(9328);

        //Arch DoomKnight (takes the longest?)
        ADK.doAll(true);
        Core.unbank("Arch DoomKnight");

        Core.equipClass(ClassType.Solo);
        //Doom Metal Ore x200
        Core.huntMonster("shadowsong", "Oh'Garr", "Doom Metal Ore", 200, { isTemp: false });
        //Rotting Ectoplasm x100
        Core.huntMonster("ectocave", "Ektorax", "Rotting Ectoplasm", 100, { isTemp: false });
        Core.addDrop("Bone Pick");
        Core.registerQuests(9327);
        while (!bot.shouldExit && !Core.checkInventory("Bone Pick", 150)) {
            Core.huntMonster("brainmeat", "Brain Matter");
        }

        //Voiduminance Necrock-Morph Spell
        VA.getVordredsArmor(true);
        Adv.buyItem("stonewood", 2063, 78923, undefined, 48545);

        //Neverborn Ritual
        Adv.buyItem("dragonrune", 691, 77458, undefined, 47277);

        //Darkness Sigil
        Daily.pyromancer();
        if (Core.checkInventory("Pyromancer")) {
            Adv.buyItem("fireforge", 1142, 29684, undefined, 18695);
        } else {
            Core.logger("Can't continue, missing Pyromancer");
        }
        Core.ensureComplete(9328);

        if (rankUpClass) {
            Adv.rankUpClass("Doom Metal Necro");
        }
    }
}

export default function main(): void {
    const script = new DoomMetalNecro();
    Core.setOptions();

    script.getClass();

    Core.setOptions(false);
}
