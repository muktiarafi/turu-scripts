/*
name: Do All Ultras Story Prerequisites
description: Completes all story prerequisites needed to unlock every Ultra boss. Covers: Ultra Ezrajal, Ultra Warden, Ultra Engineer (ExaltiaTower), Ultra Avatar Tyndarius + Ultra Speaker (Shadows of War), Ultra Dage (Isle of Fotia), Champion Drakath (13 Lords of Chaos), Ultra Drago + Ultra Darkon (Elegy of Madness / Astravia). Skipped: Ultra Nulgath and Ultra Gramiel (Level 80 only, no story required).
tags: story, quest, ultra, ezrajal, warden, engineer, tyndarius, speaker, dage, drakath, darkon, drago, all, complete
*/
// Port of Scripts/Ultrasv3/DoAllUltrasStorys.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../core/CoreBots";
import { CoreFarms } from "../core/CoreFarms";
import { CoreAstravia } from "../story/elegyofmadness(darkon)/CoreAstravia";
import { ExaltiaTower } from "../story/ExaltiaTower";
import { CoreHollowbornStory } from "../story/hollowborn/CoreHollowbornStory";
import { DageChallengeStory } from "../story/legion/DageChallengeStory";
import { Core13LoC } from "../story/lordsofchaos/Core13LoC";
import { CoreSoW } from "../story/shadowsofwar/CoreSoW";

const Farm = new CoreFarms();
const Exaltia = new ExaltiaTower();
const SoW = new CoreSoW();
const LoC = new Core13LoC();
const Astravia = new CoreAstravia();
const Hollowborn = new CoreHollowbornStory();
const DageChallenge = new DageChallengeStory();

export class DoAllUltrasStory {
    doAllUltrasPrereqs(): void {
        // Ultra Nulgath  → Level 80 only, no story required
        Core.logger("Leveling to 80 for Ultra Nulgath");
        Farm.experience(80);

        // Unlocks: Ultra Ezrajal, Ultra Warden, Ultra Engineer
        Core.logger("Exaltia Tower story → Ultra Ezrajal / Warden / Engineer");
        Exaltia.storyLine();

        // Unlocks: Ultra Avatar Tyndarius
        Core.logger("Shadows of War story → Ultra Avatar Tyndarius");
        SoW.tyndarius();

        // Unlocks: Champion Drakath
        Core.logger("13 Lords of Chaos story → Champion Drakath");
        LoC.complete13LOC(true);

        // Unlocks: Ultra Dage
        Core.logger("Dage Challenge story → Ultra Dage");
        DageChallenge.dageChallengeQuests();

        // Unlocks: Ultra Drago (AstraviaJudgement / Mahapadma) + Ultra Darkon (TheWorld)
        Core.logger("Elegy of Madness / Astravia story → Ultra Drago + Ultra Darkon");
        Astravia.completeCoreAstravia();

        // Unlocks: Ultra Gramiel
        Core.logger("Hollowborn story → Ultra Gramiel");
        Hollowborn.doAll();

        // Unlocks: Ultra Avatar Tyndarius (Tyndarius step) + Ultra Speaker (ManaCradle step)
        Core.logger("Shadows of War story → Ultra Avatar Tyndarius + Ultra Speaker");
        SoW.completeCoreSoW();
    }
}

export default function main(): void {
    const script = new DoAllUltrasStory();
    Core.setOptions();
    Core.equipClass(ClassType.Solo);

    script.doAllUltrasPrereqs();

    Core.setOptions(false);
}
