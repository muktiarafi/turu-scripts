/*
name: Army Farm Void Auras
description: Solo-farms Void Auras using custom NSoD-style methods so army sync can be added later without modifying CoreNSOD.
tags: void aura, nsoD, farm, solo, army
*/
// Port of Scripts/Army/ArmyFarmVoidAuras.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { ClassType, Core } from "../core/CoreBots";
import { CoreFarms } from "../core/CoreFarms";
import { ArmyGeneral } from "../ultrasv3/armydependencies/ArmyGeneral";
import { CoreEnginev3 } from "../ultrasv3/dependenciesultras/CoreEnginev3";
import { CoreUltrav3 } from "../ultrasv3/dependenciesultras/CoreUltrav3";
import { UltraEnhancements } from "../ultrasv3/dependenciesultras/UltraEnhancements";

const Engine = new CoreEnginev3();
const Farm = new CoreFarms();
const Enh = new UltraEnhancements();
const Ultra = new CoreUltrav3();

export class ArmyFarmVoidAuras {
    private readonly essenceStages: [
        map: string,
        monsterID: number | null,
        monsterName: string | null,
        essence: string,
    ][] = [
        ["timespace", null, "Astral Ephemerite", "Astral Ephemerite Essence"],
        ["citadel", 21, "Belrot the Fiend", "Belrot the Fiend Essence"],
        ["greenguardwest", 22, "Black Knight", "Black Knight Essence"],
        ["mudluk", 18, "Tiger Leech", "Tiger Leech Essence"],
        ["aqlesson", 17, "Carnax", "Carnax Essence"],
        ["necrocavern", 5, "Chaos Vordred", "Chaos Vordred Essence"],
        ["hachiko", 10, "Dai Tengu", "Dai Tengu Essence"],
        ["timevoid", 12, "Unending Avatar", "Unending Avatar Essence"],
        ["dragonchallenge", 4, "Void Dragon", "Void Dragon Essence"],
        ["maul", 17, "Creature Creation", "Creature Creation Essence"],
    ];

    voidAuras(quant = 7600, useArmySync = false): void {
        if (!useArmySync && Core.checkInventory("Void Aura", quant)) {
            return;
        }

        Core.addDrop("Void Aura");
        Core.farmingLogger("Void Aura", quant);
        this.retrieveVoidAuras(quant, useArmySync);
    }

    retrieveVoidAuras(quant = 7600, useArmySync = false): void {
        if (!useArmySync && Core.checkInventory("Void Aura", quant)) {
            return;
        }

        const essenceQuant = 100;
        const auraSyncFile = "ArmyFarmVoidAuras_VoidAura.sync";

        Farm.evilREP();
        Core.addDrop(...this.essenceStages.map((s) => s[3]));
        if (!Core.checkInventory("Necromancer", undefined, { toInv: false })) {
            bot.drops.add("Creature Shard");
        }

        const stageSyncFile = "ArmyFarmVoidAuras_stage.sync";
        const armySize = bot.config!.get<number>("ArmySize");

        if (useArmySync) {
            ArmyGeneral.prepareSyncFiles(
                Ultra,
                auraSyncFile,
                this.essenceStages.map((s) => s[3]),
                "ArmyFarmVoidAuras_Essence",
            );
            ArmyGeneral.prepareStageSync(Ultra, stageSyncFile);
        }

        while (!bot.shouldExit) {
            if (Core.checkInventory("Void Aura", quant)) {
                if (
                    !useArmySync ||
                    Ultra.checkArmyProgressBool(() => Core.checkInventory("Void Aura", quant), auraSyncFile)
                ) {
                    break;
                }

                Core.logger("Army members still farming. Helping until all are done.");
            }

            Core.ensureAccept(4432);

            const ownStage = this.getOwnStage(essenceQuant);
            const stageIndex = useArmySync
                ? ArmyGeneral.publishAndGetArmyStage(Ultra, bot, ownStage, stageSyncFile, armySize)
                : ownStage;

            if (useArmySync) {
                Core.logger(`Own stage ${ownStage}, army stage ${stageIndex}`);
            }

            if (stageIndex >= this.essenceStages.length) {
                const turnIns = this.getMaxVoidAuraTurnIns();
                Core.logger(`Turning in quest 4432 ${turnIns} time(s) based on essence stacks.`);
                if (turnIns > 0) {
                    Core.ensureCompleteMulti(4432, turnIns);
                    bot.wait.forPickup("Void Aura");
                }

                if (useArmySync) {
                    Ultra.checkArmyProgress("Void Aura", quant, false, auraSyncFile);
                }

                Core.farmingLogger("Void Aura", quant);
                continue;
            }

            const stage = this.essenceStages[stageIndex];
            const syncFile = ArmyGeneral.getSyncFileForItem("ArmyFarmVoidAuras_Essence", stage[3]);
            const stageComplete = Core.checkInventory(stage[3], essenceQuant);
            const isHelper = useArmySync && stageComplete;

            if (isHelper) {
                Core.logger(
                    `Army helper active on ${stage[3]}: ${bot.inventory.getQuantity(stage[3])}/${essenceQuant}`,
                );
            } else {
                Core.logger(`Army stage ${stageIndex + 1}/${this.essenceStages.length}: ${stage[3]}`);
            }

            while (
                !bot.shouldExit &&
                !Ultra.checkArmyProgressBool(() => Core.checkInventory(stage[3], essenceQuant), syncFile)
            ) {
                Core.farmingLogger(stage[3], essenceQuant);

                if (!!stage[2]) {
                    Core.join(stage[0]);
                    bot.wait.forMapLoad(stage[0]);
                    Engine.chooseBestCell(stage[2]!);

                    if (isHelper) {
                        bot.combat.attack(stage[2]!);
                        bot.sleep(300);
                    } else {
                        Core.huntMonster(stage[0], stage[2]!, stage[3], essenceQuant, { isTemp: false });
                    }
                } else if (stage[1] != null) {
                    if (isHelper) {
                        bot.combat.attack(stage[1]);
                        bot.sleep(300);
                    } else {
                        Core.huntMonsterMapID(stage[0], stage[1], stage[3], essenceQuant, {
                            isTemp: false,
                            log: false,
                            publicRoom: false,
                        });
                    }
                } else {
                    break;
                }

                bot.sleep(100);
            }
        }
    }

    private getOwnStage(quant: number): number {
        for (let i = 0; i < this.essenceStages.length; i++) {
            if (!Core.checkInventory(this.essenceStages[i][3], quant)) {
                return i;
            }
        }

        return this.essenceStages.length;
    }

    private getMaxVoidAuraTurnIns(): number {
        const minEssenceStacks = Math.min(...this.essenceStages.map((stage) => bot.inventory.getQuantity(stage[3])));
        return minEssenceStacks / 20;
    }

    setupArmy(armySize: number, enableClassSync: boolean): void {
        const readySyncFile = "ArmyFarmVoidAuras.ready.sync";
        Ultra.clearSyncFile(Ultra.resolveSyncPath(readySyncFile));
        bot.sleep(2500);
        Core.logger(`Waiting for army ready (${armySize - 1} other players)...`);
        Ultra.waitForArmy(armySize - 1, readySyncFile);

        if (enableClassSync) {
            Core.logger("Starting army class sync...");
            ArmyGeneral.prepareClassSync(Ultra, bot, armySize, "ArmyFarmVoidAuras.class.sync");
        }
    }

    doEnhs(): void {
        Core.logger("Applying UltraEnhancements...");
        Enh.apply();
    }

    huntMonsterBatch(
        quant: number,
        isTemp: boolean,
        publicRoom: boolean,
        log: boolean,
        ...monsters: [map: string, monster: number, essence: string][]
    ): void {
        Core.addDrop(...monsters.map((x) => x[2]));
        Core.equipClass(ClassType.Solo);
        for (const monster of monsters.filter((x) => x[2] != null && x[1] > 0 && !Core.checkInventory(x[2], quant))) {
            Core.huntMonsterMapID(monster[0], monster[1], monster[2], quant, { isTemp, log, publicRoom });
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "ArmyFarmVoidAuras",
    [
        option.int("Quantity", "Void Aura Quantity", "Number of Void Auras to farm.", 7600),
        option.int(
            "ArmySize",
            "Army Size",
            "How many players are in your army (including yourself). Set to 1 for solo.",
            4,
        ),
        option.bool(
            "UseArmySync",
            "Enable Army Sync",
            "Use army sync to coordinate Void Aura and essence progress.",
            true,
        ),
        option.bool(
            "EnableClassSync",
            "Enable Class Sync",
            "Auto-equip classes from the army class presets before farming starts.",
            true,
        ),
        option.bool("DoEnh", "Do Enhancements", "Apply UltraEnhancements for the equipped class before farming.", true),
        option.text(
            "Class1",
            "Class 1",
            "Preset class 1 to auto-equip before the fight. Use format: ClassName,Username.",
            "Chaos Avenger",
        ),
        option.text(
            "Class2",
            "Class 2",
            "Preset class 2 to auto-equip before the fight. Use format: ClassName,Username.",
            "Chaos Avenger",
        ),
        option.text(
            "Class3",
            "Class 3",
            "Preset class 3 to auto-equip before the fight. Use format: ClassName,Username.",
            "Chaos Avenger",
        ),
        option.text(
            "Class4",
            "Class 4",
            "Preset class 4 to auto-equip before the fight. Use format: ClassName,Username.",
            "Chaos Avenger",
        ),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    const script = new ArmyFarmVoidAuras();
    Core.setOptions();

    const quant = bot.config!.get<number>("Quantity");
    const armySize = bot.config.get<number>("ArmySize");
    const useArmySync = bot.config.get<boolean>("UseArmySync");
    const enableClassSync = bot.config.get<boolean>("EnableClassSync");

    if (useArmySync && armySize > 1) {
        script.setupArmy(armySize, enableClassSync);
    }

    if (bot.config.get<boolean>("DoEnh")) {
        script.doEnhs();
    }

    script.voidAuras(quant, useArmySync);

    Core.setOptions(false);
}
