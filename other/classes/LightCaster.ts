/*
name: LightCaster
description: null
tags: null
*/
// Port of Scripts/Other/Classes/LightCaster.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { LightMage } from "./LightMage";
import { AvatarOfDeathsScythe } from "../weapons/AvatarOfDeathsScythe";
import { BurningBlade } from "../weapons/BurningBlade";
import { BurningBladeOfAbezeth } from "../weapons/BurningBladeOfAbezeth";
import { GuardianOfSpiritsBlade } from "../weapons/GuardianOfSpiritsBlade";
import { LanceOfTime } from "../weapons/LanceOfTime";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();
const LM = new LightMage();
const AODS = new AvatarOfDeathsScythe();
const GOSB = new GuardianOfSpiritsBlade();
const LOT = new LanceOfTime();
const BB = new BurningBlade();
const BBOA = new BurningBladeOfAbezeth();

export class LightCaster {
    getLC(rankUpClass = true): void {
        if (Core.checkInventory("LightCaster")) {
            if (rankUpClass) {
                Adv.rankUpClass("LightCaster");
            }
            return;
        }

        Core.addDrop("LightCaster", "Aranx's Pure Light");

        Farm.experience(80);
        GOSB.getGoSB();
        AODS.getAoDS();
        LOT.getLoT();
        BB.getBurningBlade();
        LM.getLM(false);
        BBOA.getBBoA();

        Core.equipClass(ClassType.Solo);
        Core.ensureAccept(6495);
        Core.huntMonster("celestialarenad", "Aranx", "Aranx's Pure Light", undefined, { isTemp: false });
        Core.ensureComplete(6495);
        bot.wait.forPickup("LightCaster");

        if (rankUpClass) {
            Adv.rankUpClass("LightCaster");
        }
    }
}

export default function main(): void {
    const script = new LightCaster();
    Core.setOptions();

    script.getLC();

    Core.setOptions(false);
}
