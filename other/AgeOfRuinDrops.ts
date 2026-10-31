/*
name: Age Of Ruin Drops
description: farms all acs drops from Age Of Ruin saga maps.
tags: age, ruin, drops
*/
// Port of Scripts/Other/AgeOfRuinDrops.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../core/CoreBots";
import { CoreAOR } from "../story/ageofruin/CoreAOR";

const AOR = new CoreAOR();

export class AgeOfRuinDrops {
    getDrops(): void {
        AOR.doAll();

        //#region Ashray
        const KitefinSharkBait = ["Midnight Eroder Blade"];

        Core.equipClass(ClassType.Farm);
        this.runEngine(KitefinSharkBait, "ashray", "Enter", "Left");

        const SeafoamElemental = [
            "Crossed Midnight Cutlasses",
            "Dual Nightmare Hunter Pistol",
            "Holstered Midnight Eroder Pistols",
            "Midnight Back Cutlasses",
        ];

        Core.equipClass(ClassType.Solo);
        this.runEngine(SeafoamElemental, "ashray", "r9", "Left");

        const StagnantWater = ["Nightmare Hunter Pistol"];

        Core.equipClass(ClassType.Farm);
        this.runEngine(StagnantWater, "ashray", "r7", "Left");
        //#endregion
        //#region Midnight Zone
        const Sparagmos = [
            "ERAD Arrows",
            "Princess Brittany Portrait",
            "Royal Dress Display",
            "Sleeping Monitor",
            "Sparagmos A.I. Tank",
            "Sparagmos Wires",
            "Undine Coffee Table",
            "Undine Visitor Badge",
            "Water Temple Pedestal",
        ];

        Core.equipClass(ClassType.Solo);
        this.runEngine(Sparagmos, "midnightzone", "r9", "Left");

        const UndeadPrisoner = ["Experimentation Chair", "Scattered Bones", "Undine Observation Lights"];

        Core.equipClass(ClassType.Farm);
        this.runEngine(UndeadPrisoner, "midnightzone", "r4", "Left");
        //#endregion
        //#region Abyssal Zone
        const BlightedWater = ["Avatar of Water Mural", "Drowning Machine Mural", "Waves of Tumult"];

        Core.equipClass(ClassType.Farm);
        this.runEngine(BlightedWater, "abyssalzone", "r4", "Left");

        const FoamScavenger = ["Ancient Fissure", "Devouring Sea Mural"];

        Core.equipClass(ClassType.Farm);
        this.runEngine(FoamScavenger, "abyssalzone", "r7", "Left");

        const ShadowViscera = ["Champion Undine Mural", "Colossus Mural"];

        Core.equipClass(ClassType.Farm);
        this.runEngine(ShadowViscera, "abyssalzone", "r5", "Left");

        const TheAshray = ["Ascending Kathool Tentacle", "Ashray Plaque", "Descending Kathool Tentacle"];

        Core.equipClass(ClassType.Solo);
        this.runEngine(TheAshray, "abyssalzone", "r13", "Right");
        //#endregion
        //#region Trench Observatory
        const LadyNoelle = [
            "Ashray Trench Pedestal",
            "Kathoolian Arms",
            "Kathoolian Pinnacle",
            "Kathoolian Tentacles",
            "Monstrous Fa",
            "Monstrous Fa Morph",
        ];

        Core.equipClass(ClassType.Solo);
        this.runEngine(LadyNoelle, "trenchobserve", "r9", "Left");

        const NecroAdipocere = ["Brackish Coral"];

        Core.equipClass(ClassType.Farm);
        this.runEngine(NecroAdipocere, "trenchobserve", "r8", "Left");

        const SeaSpirit = ["Ashray Leyline", "Corruptive Tentacle"];

        Core.equipClass(ClassType.Farm);
        this.runEngine(SeaSpirit, "trenchobserve", "r6", "Left");

        const SeabaseTurret = ["Portable Sparagmos Table"];

        Core.equipClass(ClassType.Farm);
        this.runEngine(SeabaseTurret, "trenchobserve", "r4", "Left");

        const VeneratedWraith = ["Broken Undine Window", "Colossal Ocean View"];

        Core.equipClass(ClassType.Farm);
        this.runEngine(VeneratedWraith, "trenchobserve", "r2", "Left");
        //#endregion
        //#region Sea Voice
        const VoiceintheSea = [
            "Calamity Atlanticus Trident",
            "Glaucus Companion",
            "Glaucus Hair",
            "Glaucus Locks",
            "Glaucus Mystic",
        ];

        Core.equipClass(ClassType.Solo);
        this.runEngine(VoiceintheSea, "seavoice", "r2", "Left");
        //#endregion
    }

    private runEngine(rewards: string[], map: string, cell: string, pad: string): void {
        for (const drop of rewards) {
            Core.addDrop(drop);
        }

        for (let i = 0; i < rewards.length; i++) {
            const drop = rewards[i];
            if (Core.checkInventory(drop, undefined, { toInv: false })) {
                Core.removeDrop(drop);
                continue;
            }

            Core.logger(`${drop}: (${i + 1}/${rewards.length})`);

            if (map === "seavoice") {
                AOR.fightVoiceInTheSea(drop);
            } else {
                while (!bot.shouldExit && !Core.checkInventory(drop)) {
                    Core.killMonster(map, cell, pad, "*", undefined, undefined, { log: false });
                }
            }
        }

        for (const drop of rewards) {
            Core.jump();
            Core.toBank(drop);
        }
    }
}

export default function main(): void {
    const script = new AgeOfRuinDrops();
    Core.setOptions();

    script.getDrops();

    Core.setOptions(false);
}
