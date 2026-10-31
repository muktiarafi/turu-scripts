/*
name: Infernal Arena LW
description: Completes Infernal Arena with custom combat behavior for Deadly Duo through Naal.
tags: story, quest, queen of monsters, infernal arena, deadly duo, naal, lonewolf12
*/
// Port of Scripts/Prototypes/InfernalArenaLW.cs.

import { bot, choices, ClassUseMode, defineScriptOptions, option, SkillUseMode } from "turu";
import { CapeSpecial, CoreAdvanced, EnhancementType, HelmSpecial, WeaponSpecial } from "../core/CoreAdvanced";
import { ClassType, Core, rethrowIfStopped } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";
import { CelestialArenaQuests } from "../story/queenofmonsters/extra/CelestialArena";

const Adv = new CoreAdvanced();
const Story = new CoreStory();
const CelestialArena = new CelestialArenaQuests();

export enum ClassChoice {
    Optimized = "Optimized",
    ArchPaladin = "ArchPaladin",
    Void_Highlord = "Void_Highlord",
    Shaman = "Shaman",
    Unselected = "Unselected",
}

export class InfernalArenaLW {
    static readonly setup = [
        option.choice(
            "ClassChoice",
            "Choose Class",
            "Optimized: Uses AP and Shaman to beat all." +
                "\nArchPaladin: Beats all except for Azalith's Scythe." +
                "\nVoid Highlord: Beats all except for Cervus Malus." +
                "\nShaman: Beats Azalith's Scythe.",
            choices(ClassChoice),
            ClassChoice.Optimized,
        ),
        option.bool("UsePotions", "Use Potions?", "Use the selected class potion setup for the custom fights.", true),
        option.bool(
            "DoEnhancements",
            "Do Enhancements?",
            "Apply the selected class enhancement setup" +
                "\nArchPaladin: Lucky, Penitence cape, and Lucky Health Vamp." +
                "\nVoid Highlord: Lucky with Ravenous, Anima, and Vainglory when unlocked." +
                "\nShaman: Wizard with Elysium and Absolution when unlocked.",
            true,
        ),
    ];

    static readonly farm = [
        option.bool("FarmDeadlyDuo", "Farm Deadly Duo?", "Farm Deadly Duo repeatedly.", false),
        option.bool("FarmCervusMalus", "Farm Cervus Malus?", "Farm Cervus Malus repeatedly.", false),
        option.bool("FarmKeyOfSholemoh", "Farm Key of Sholemoh?", "Farm Key of Sholemoh repeatedly.", false),
        option.bool("FarmAzalithsScythe", "Farm Azalith's Scythe?", "Farm Azalith's Scythe repeatedly.", false),
        option.bool("FarmNaal", "Farm Na'al?", "Farm Na'al repeatedly.", false),
    ];

    run(): void {
        const selectedFarmCount = this.selectedFarmCount();
        if (selectedFarmCount > 1) {
            Core.logger("WARNING: Select only one Farm option at a time. Stopping the script.");
            return;
        }

        const farmSelected = selectedFarmCount === 1;
        Story.preLoad(this.run);

        if (farmSelected) {
            const classChoice = this.tryGetSelectedClass();
            if (classChoice == null) {
                return;
            }

            if (!this.prepareSelectedFarm(classChoice)) {
                return;
            }

            while (!bot.shouldExit) {
                if (!this.runSelectedFarms(classChoice)) {
                    return;
                }
            }

            return;
        }

        if (Core.isCompletedBefore(9377)) {
            return;
        }

        if (!Core.isCompletedBefore(9372)) {
            CelestialArena.doAll();
            this.completeStandardFights();
        }

        if (!Core.isCompletedBefore(9372)) {
            return;
        }

        const selectedClass = this.tryGetSelectedClass();
        if (selectedClass == null) {
            return;
        }

        this.completeProgression(selectedClass);
    }

    private completeStandardFights(): void {
        Story.killQuest(9356, "infernalarena", "Infernal Mage");
        Story.killQuest(9357, "infernalarena", "Infernal Revenger");
        Story.killQuest(9358, "infernalarena", "Infernal Harbinger");
        Story.killQuest(9359, "infernalarena", "First Fallen");
        Story.killQuest(9360, "infernalarena", "Fallen Warlord");
        Story.killQuest(9361, "infernalarena", "Malicious Maw");
        Story.killQuest(9362, "infernalarena", "Wicked Rotfinger");
        Story.killQuest(9363, "infernalarena", "Dark Devourax");
        Story.killQuest(9364, "infernalarena", "Corrupt Terror");
        Story.killQuest(9365, "infernalarena", "Infernal Abominator");
        Story.killQuest(9366, "infernalarena", "Twisted Harpy");
        Story.killQuest(9367, "infernalarena", "Infernal Izotz");
        Story.killQuest(9368, "infernalarena", "Infernal Krampus");
        Story.killQuest(9369, "infernalarena", "Destructive Defiler");
        Story.killQuest(9370, "infernalarena", "Infernal Naga");
        Story.killQuest(9371, "infernalarena", "Accursed Agape");
        Story.killQuest(9372, "infernalarena", "Accursed Apephyrx");
    }

    private completeProgression(classChoice: ClassChoice): boolean {
        if (!Core.isCompletedBefore(9373) && !this.fightDeadlyDuo(classChoice)) {
            return false;
        }
        if (!Core.isCompletedBefore(9374) && !this.fightCervusMalus(classChoice)) {
            return false;
        }
        if (!Core.isCompletedBefore(9375) && !this.fightKeyOfSholemoh(classChoice)) {
            return false;
        }
        if (!Core.isCompletedBefore(9376) && !this.fightAzalithsScythe(classChoice)) {
            return false;
        }
        return Core.isCompletedBefore(9377) || this.fightNaal(classChoice);
    }

    private runSelectedFarms(classChoice: ClassChoice): boolean {
        if (this.farmEnabled("FarmDeadlyDuo") && !this.fightDeadlyDuo(classChoice, false)) {
            return false;
        }
        if (this.farmEnabled("FarmCervusMalus") && !this.fightCervusMalus(classChoice, false)) {
            return false;
        }
        if (this.farmEnabled("FarmKeyOfSholemoh") && !this.fightKeyOfSholemoh(classChoice, false)) {
            return false;
        }
        if (this.farmEnabled("FarmAzalithsScythe") && !this.fightAzalithsScythe(classChoice, false)) {
            return false;
        }
        if (this.farmEnabled("FarmNaal") && !this.fightNaal(classChoice, false)) {
            return false;
        }
        return true;
    }

    private prepareSelectedFarm(classChoice: ClassChoice): boolean {
        const farmClass = this.resolveClass(classChoice, this.farmEnabled("FarmAzalithsScythe"));
        if (this.equipClass(farmClass) == null) {
            return false;
        }

        const useRevitalize =
            this.farmEnabled("FarmKeyOfSholemoh") ||
            this.farmEnabled("FarmAzalithsScythe") ||
            (classChoice === ClassChoice.Void_Highlord && this.farmEnabled("FarmNaal"));
        this.prepareLoadout(farmClass, useRevitalize);
        return true;
    }

    private selectedFarmCount(): number {
        return ["FarmDeadlyDuo", "FarmCervusMalus", "FarmKeyOfSholemoh", "FarmAzalithsScythe", "FarmNaal"].filter(
            this.farmEnabled,
        ).length;
    }

    private farmEnabled(option: string): boolean {
        return bot.config?.get<boolean>("Farm", option) ?? false;
    }

    /** The class chosen in the options; null (C# false) when none is. */
    private tryGetSelectedClass(): ClassChoice | null {
        const classChoice = bot.config?.get<ClassChoice>("Setup", "ClassChoice") ?? ClassChoice.Optimized;
        if (classChoice !== ClassChoice.Unselected) {
            return classChoice;
        }

        Core.logger("WARNING: Choose Optimized, ArchPaladin, Void Highlord, or Shaman for the custom fights.");
        return null;
    }

    private resolveClass(classChoice: ClassChoice, useShaman: boolean): ClassChoice {
        return classChoice === ClassChoice.Optimized
            ? useShaman
                ? ClassChoice.Shaman
                : ClassChoice.ArchPaladin
            : classChoice;
    }

    farmDeadlyDuo(item: string, quantity: number, isTemp = false): void {
        this.farmBossItem(ClassChoice.ArchPaladin, "Deadly Duo", item, quantity, isTemp, "1 | 2 | 4", () => {
            if (bot.player.hasTarget && bot.target.hasActiveAura("Eating")) {
                this.useConditionalSkill(3);
            }
        });
    }

    farmCervusMalus(item: string, quantity: number, isTemp = false): void {
        this.farmBossItem(ClassChoice.ArchPaladin, "Cervus Malus", item, quantity, isTemp, "3 | 1 | 4", () => {
            if (!bot.self.hasActiveAura("Contrarium")) {
                this.useConditionalSkill(2);
            }
        });
    }

    farmKeyOfSholemoh(item: string, quantity: number, isTemp = false): void {
        this.farmBossItem(ClassChoice.ArchPaladin, "Key of Sholemoh", item, quantity, isTemp, "3 | 1 | 4", () => {
            if (this.playerHealthBelow(0.5)) {
                this.useConditionalSkill(2);
            }
        });
    }

    farmAzalithsScythe(item: string, quantity: number, isTemp = false): void {
        this.farmBossItem(ClassChoice.Shaman, "Azalith's Scythe", item, quantity, isTemp, "1 | 2", () => {}, true);
    }

    farmNaal(item: string, quantity: number, isTemp = false): void {
        this.farmBossItem(
            ClassChoice.ArchPaladin,
            "Na'al",
            item,
            quantity,
            isTemp,
            "1",
            () => {
                if (bot.player.hasTarget && bot.target.hasActiveAura("Restrained")) {
                    return;
                }

                if (bot.self.hasActiveAura("Veni")) {
                    this.useConditionalSkill(3);
                } else if (bot.self.hasActiveAura("Vidi")) {
                    this.useConditionalSkill(4);
                } else if (this.playerHealthBelow(0.67)) {
                    this.useConditionalSkill(2);
                }
            },
            undefined,
            () => (bot.player.hasTarget && bot.target.hasActiveAura("Restrained") ? "1 | 2" : "1"),
        );
    }

    private farmBossItem(
        classChoice: ClassChoice,
        monsterName: string,
        item: string,
        quantity: number,
        isTemp: boolean,
        initialCombo: string,
        mechanics: () => void,
        attackWithoutTarget = false,
        comboSelector: (() => string) | null = null,
    ): void {
        if (!item?.trim() || quantity <= 0 || this.hasFarmItem(item, quantity, isTemp)) {
            return;
        }

        Adv.gearStore(undefined, { enhAfter: true });

        try {
            if (!isTemp) {
                Core.addDrop(item);
            }

            Core.farmingLogger(item, quantity);

            const className = this.equipClass(classChoice, false);
            if (className == null) {
                const requiredClass = classChoice === ClassChoice.Shaman ? "Shaman" : "ArchPaladin";
                Core.logger(
                    `WARNING: ${requiredClass} is unavailable. Falling back to the standard farm method for ${monsterName}.`,
                );
                Core.equipClass(ClassType.Solo);
                Core.huntMonster("infernalarena", monsterName, item, quantity, { isTemp });
                return;
            }

            this.prepareLoadout(classChoice, undefined, false, true);
            this.fightBoss(
                classChoice,
                className,
                monsterName,
                initialCombo,
                mechanics,
                attackWithoutTarget,
                comboSelector,
                () => this.hasFarmItem(item, quantity, isTemp),
            );
        } finally {
            Adv.gearStore(true, { enhAfter: true });
        }
    }

    private hasFarmItem(item: string, quantity: number, isTemp: boolean): boolean {
        return isTemp ? bot.tempInv.contains(item, quantity) : Core.checkInventory(item, quantity);
    }

    private fightDeadlyDuo(classChoice: ClassChoice, prepareLoadout = true): boolean {
        return this.fightQuest(
            classChoice,
            9373,
            "Deadly Duo",
            "Deadly Duo",
            "Duo Construct Defeated",
            "1 | 2 | 4",
            () => {
                if (bot.player.hasTarget && bot.target.hasActiveAura("Eating")) {
                    this.useConditionalSkill(3);
                }
            },
            undefined,
            undefined,
            undefined,
            prepareLoadout,
        );
    }

    private fightCervusMalus(classChoice: ClassChoice, prepareLoadout = true): boolean {
        return this.fightQuest(
            classChoice,
            9374,
            "Cervus Malus",
            "Cervus Malus",
            "Cervus Construct Defeated",
            "3 | 1 | 4",
            () => {
                if (!bot.self.hasActiveAura("Contrarium")) {
                    this.useConditionalSkill(2);
                }
            },
            undefined,
            undefined,
            undefined,
            prepareLoadout,
        );
    }

    private fightKeyOfSholemoh(classChoice: ClassChoice, prepareLoadout = true): boolean {
        return this.fightQuest(
            classChoice,
            9375,
            "Key of Sholemoh",
            "Key of Sholemoh",
            "Key Construct Defeated",
            "3 | 1 | 4",
            () => {
                if (this.playerHealthBelow(0.5)) {
                    this.useConditionalSkill(2);
                }
            },
            true,
            undefined,
            undefined,
            prepareLoadout,
        );
    }

    private fightAzalithsScythe(classChoice: ClassChoice, prepareLoadout = true): boolean {
        return this.fightQuest(
            classChoice,
            9376,
            "Azaliths Scythe",
            "Azalith's Scythe",
            "Scythe Construct Defeated",
            "3 | 1 | 4",
            () => {
                if (this.playerHealthBelow(0.5)) {
                    this.useConditionalSkill(2);
                }
            },
            true,
            true,
            undefined,
            prepareLoadout,
        );
    }

    private fightNaal(classChoice: ClassChoice, prepareLoadout = true): boolean {
        return this.fightQuest(
            classChoice,
            9377,
            "Naal",
            "Na'al",
            "Na'al Defeated",
            "1",
            () => {
                if (bot.player.hasTarget && bot.target.hasActiveAura("Restrained")) {
                    return;
                }

                if (bot.self.hasActiveAura("Veni")) {
                    this.useConditionalSkill(3);
                } else if (bot.self.hasActiveAura("Vidi")) {
                    this.useConditionalSkill(4);
                } else if (this.playerHealthBelow(0.67)) {
                    this.useConditionalSkill(2);
                }
            },
            classChoice === ClassChoice.Void_Highlord,
            undefined,
            () => (bot.player.hasTarget && bot.target.hasActiveAura("Restrained") ? "1 | 2" : "1"),
            prepareLoadout,
        );
    }

    private fightQuest(
        classChoice: ClassChoice,
        questID: number,
        logName: string,
        monsterName: string,
        questItem: string,
        initialCombo: string,
        mechanics: () => void,
        useRevitalize = false,
        attackWithoutTarget = false,
        comboSelector: (() => string) | null = null,
        prepareLoadout = true,
    ): boolean {
        classChoice = this.resolveClass(classChoice, questID === 9376);

        const className = this.equipClass(classChoice);
        if (className == null) {
            return false;
        }

        if (prepareLoadout) {
            this.prepareLoadout(classChoice, useRevitalize);
        } else {
            this.applyPotions(useRevitalize);
        }

        if (!Core.ensureAccept(questID)) {
            Core.logger(`WARNING: ${logName} quest could not be accepted.`);
            return false;
        }

        Core.logger(`Fighting ${logName}.`);

        if (
            !bot.tempInv.contains(questItem) &&
            !this.fightBoss(
                classChoice,
                className,
                monsterName,
                initialCombo,
                mechanics,
                attackWithoutTarget,
                comboSelector,
                () => bot.tempInv.contains(questItem),
            )
        ) {
            return false;
        }

        if (!Core.ensureComplete(questID)) {
            Core.logger(`WARNING: ${logName} quest could not be completed.`);
            return false;
        }

        return true;
    }

    private fightBoss(
        classChoice: ClassChoice,
        className: string,
        monsterName: string,
        initialCombo: string,
        mechanics: () => void,
        attackWithoutTarget: boolean,
        comboSelector: (() => string) | null,
        stopCondition: () => boolean,
    ): boolean {
        const map = "infernalarena";
        const previousAttackWithoutTarget = bot.options.attackWithoutTarget;
        let activeCombo = initialCombo;

        try {
            Core.join(map);
            bot.options.attackWithoutTarget = attackWithoutTarget;
            bot.skills.stop();
            if (!bot.wait.forTrue(() => !bot.skills.timerRunning, 100)) {
                Core.logger("WARNING: The previous skill timer did not stop. The fight cannot start safely.");
                return false;
            }

            if (classChoice === ClassChoice.Void_Highlord) {
                bot.skills.startAdvanced(className, false, ClassUseMode.Def);
            } else if (classChoice === ClassChoice.Shaman) {
                bot.skills.startSkills("1 | 2", -1, SkillUseMode.UseIfAvailable);
            } else {
                bot.skills.startSkills(initialCombo, -1, SkillUseMode.UseIfAvailable);
            }

            while (!bot.shouldExit && !stopCondition()) {
                if (!bot.player.alive) {
                    bot.wait.forTrue(() => bot.player.alive, 20);
                    continue;
                }

                if (!(bot.map.name?.toLowerCase() === map?.toLowerCase())) {
                    Core.join(map);
                }

                const boss =
                    bot.monsters.mapMonsters.find(
                        (monster) =>
                            monster.hp > 0 &&
                            monster.state > 0 &&
                            monster.name?.toLowerCase() === monsterName?.toLowerCase(),
                    ) ?? null;

                if (boss == null) {
                    bot.sleep(250);
                    continue;
                }

                if (!(bot.player.cell?.toLowerCase() === boss.cell?.toLowerCase())) {
                    Core.jump(boss.cell, "Left");
                }

                if (!bot.player.hasTarget || bot.player.target?.mapId !== boss.mapId) {
                    bot.combat.attack(boss.mapId);
                }

                const targetingBoss = bot.player.hasTarget && bot.player.target?.mapId === boss.mapId;
                if (targetingBoss && classChoice === ClassChoice.ArchPaladin) {
                    if (comboSelector != null) {
                        activeCombo = this.setAdvancedCombo(comboSelector(), activeCombo);
                    }

                    mechanics();
                } else if (targetingBoss && classChoice === ClassChoice.Shaman) {
                    const elementalEmbraceRemaining =
                        bot.target.getAuraSnapshot("Elemental Embrace")?.remainingTime ?? 0;
                    if (elementalEmbraceRemaining <= 5) {
                        this.useConditionalSkill(4);
                    }
                }

                bot.sleep(100);
            }
        } finally {
            bot.skills.stop();
            bot.options.attackWithoutTarget = previousAttackWithoutTarget;
        }

        return stopCondition();
    }

    /**
     * Switches the running rotation to `combo` and returns the one now active. C# loads it into
     * the running timer (`LoadAdvanced` and the override provider); Turu restarts the rotation.
     */
    private setAdvancedCombo(combo: string, activeCombo: string): string {
        if (combo === activeCombo) {
            return activeCombo;
        }

        bot.skills.startSkills(combo, -1, SkillUseMode.UseIfAvailable);
        return combo;
    }

    private useConditionalSkill(skill: number): void {
        if (bot.skills.canUseSkill(skill)) {
            bot.skills.useSkill(skill);
        }
    }

    private playerHealthBelow(percentage: number): boolean {
        return bot.player.health < bot.player.maxHealth * percentage;
    }

    /** Equips the class for `classChoice` and returns its name; null (C# false) when it can't. */
    private equipClass(classChoice: ClassChoice, logFailure = true): string | null {
        const className =
            classChoice === ClassChoice.ArchPaladin && Core.checkInventory("ArchPaladin")
                ? "ArchPaladin"
                : classChoice === ClassChoice.Void_Highlord && Core.checkInventory("Void Highlord (IoDA)")
                  ? "Void Highlord (IoDA)"
                  : classChoice === ClassChoice.Void_Highlord && Core.checkInventory("Void Highlord")
                    ? "Void Highlord"
                    : classChoice === ClassChoice.Shaman && Core.checkInventory("Shaman")
                      ? "Shaman"
                      : "";

        if (!className) {
            const missingClass =
                classChoice === ClassChoice.Void_Highlord
                    ? "Void Highlord"
                    : classChoice === ClassChoice.Shaman
                      ? "Shaman"
                      : "ArchPaladin";
            if (logFailure) {
                Core.logger(`WARNING: ${missingClass} was not found.`);
            }
            return null;
        }

        Core.equip(className);
        bot.wait.forItemEquip(className);

        if (bot.player.currentClass?.toLowerCase() === className.toLowerCase()) {
            return className;
        }

        if (logFailure) {
            Core.logger(`WARNING: ${className} could not be equipped.`);
        }
        return null;
    }

    private prepareLoadout(
        classChoice: ClassChoice,
        useRevitalize = false,
        usePotions: boolean | null = null,
        doEnhancements: boolean | null = null,
    ): void {
        if (doEnhancements ?? bot.config?.get<boolean>("Setup", "DoEnhancements") ?? true) {
            bot.sleep(3000);
            this.applyEnhancements(classChoice);
        }

        const shouldUsePotions = usePotions ?? bot.config?.get<boolean>("Setup", "UsePotions") ?? true;
        if (!shouldUsePotions) {
            return;
        }

        this.preparePotion("Fate Tonic", "Gold Voucher 500k", 4, 500000, 10, 8);
        this.preparePotion(
            useRevitalize ? "Potent Revitalize Elixir" : "Potent Battle Elixir",
            "Gold Voucher 500k",
            useRevitalize ? 8 : 4,
            500000,
            useRevitalize ? 20 : 8,
        );
        this.preparePotion("Felicitous Philtre", "Gold Voucher 100k", 2, 100000, 25);

        this.applyPotions(useRevitalize, true);
    }

    private applyPotions(useRevitalize: boolean, usePotions: boolean | null = null): void {
        if (!(usePotions ?? bot.config?.get<boolean>("Setup", "UsePotions") ?? true)) {
            return;
        }

        this.usePotion("Fate Tonic", "Fate");
        const elixir = useRevitalize ? "Potent Revitalize Elixir" : "Potent Battle Elixir";
        this.usePotion(elixir, elixir);
        this.usePotion("Felicitous Philtre", "Felicitous Philtre");
    }

    private applyEnhancements(classChoice: ClassChoice): void {
        try {
            if (Core.cboBool("DisableAutoEnhance") === true) {
                Core.logger(
                    "AutoEnhance is disabled in CoreBots Options. The custom Infernal Arena enhancement setup will override it.",
                );
            }

            let capeEnhancement: CapeSpecial;
            let helmEnhancement: HelmSpecial;
            let weaponEnhancement: WeaponSpecial;
            let baseEnhancement: EnhancementType;

            if (classChoice === ClassChoice.Void_Highlord) {
                const ravenousAvailable = Adv.uRavenous();
                const animaAvailable = Adv.uAnima();
                const vaingloryAvailable = Adv.uVainglory();

                weaponEnhancement = ravenousAvailable ? WeaponSpecial.Ravenous : WeaponSpecial.Health_Vamp;
                helmEnhancement = animaAvailable ? HelmSpecial.Anima : HelmSpecial.None;
                capeEnhancement = vaingloryAvailable ? CapeSpecial.Vainglory : CapeSpecial.None;
                baseEnhancement = EnhancementType.Lucky;

                if (!ravenousAvailable) {
                    Core.logger(
                        "WARNING: Ravenous is not unlocked. Lucky Health Vamp will be used on the weapon instead.",
                    );
                }
                if (!animaAvailable) {
                    Core.logger("WARNING: Anima is not unlocked. Lucky will be used on the helm instead.");
                }
                if (!vaingloryAvailable) {
                    Core.logger("WARNING: Vainglory is not unlocked. Lucky will be used on the cape instead.");
                }
            } else if (classChoice === ClassChoice.Shaman) {
                const absolutionAvailable = Adv.uAbsolution();
                const elysiumAvailable = Adv.uElysium();
                capeEnhancement = absolutionAvailable ? CapeSpecial.Absolution : CapeSpecial.None;
                helmEnhancement = HelmSpecial.None;
                weaponEnhancement = elysiumAvailable ? WeaponSpecial.Elysium : WeaponSpecial.Mana_Vamp;
                baseEnhancement = EnhancementType.Wizard;

                if (!absolutionAvailable) {
                    Core.logger("WARNING: Absolution is not unlocked. Wizard will be used on the cape instead.");
                }
                if (!elysiumAvailable) {
                    Core.logger(
                        "WARNING: Elysium is not unlocked. Wizard Mana Vamp will be used on the weapon instead.",
                    );
                }
            } else {
                const penitenceAvailable = Adv.uPenitence();
                capeEnhancement = penitenceAvailable ? CapeSpecial.Penitence : CapeSpecial.None;
                helmEnhancement = HelmSpecial.None;
                weaponEnhancement = WeaponSpecial.Health_Vamp;
                baseEnhancement = EnhancementType.Lucky;

                if (!penitenceAvailable) {
                    Core.logger("WARNING: Penitence is not unlocked. Lucky will be used on the cape instead.");
                }
            }

            if (
                (weaponEnhancement === WeaponSpecial.Health_Vamp || weaponEnhancement === WeaponSpecial.Mana_Vamp) &&
                !Adv.uAwe()
            ) {
                const aweEnhancement = weaponEnhancement === WeaponSpecial.Mana_Vamp ? "Mana Vamp" : "Health Vamp";
                Core.logger(
                    `WARNING: ${aweEnhancement} is not unlocked. Enhancement setup will continue without stopping the script.`,
                );
            }

            const equippedItems = bot.inventory.items.filter(
                (item) =>
                    item.equipped &&
                    (item.category === "Class" ||
                        item.category === "Helm" ||
                        item.category === "Cape" ||
                        item.equipSlot === "Weapon"),
            );

            // C# finds the private AutoEnhance by reflection; TS reaches it by name.
            Adv["autoEnhance"](
                equippedItems,
                baseEnhancement,
                capeEnhancement,
                helmEnhancement,
                weaponEnhancement,
                false,
            );

            const baseApplied = bot.inventory.items
                .filter(
                    (item) =>
                        item.equipped &&
                        (item.category === "Class" ||
                            item.category === "Helm" ||
                            item.category === "Cape" ||
                            item.equipSlot === "Weapon"),
                )
                .filter((item) => item.equipSlot !== "Weapon")
                .filter((item) => capeEnhancement === CapeSpecial.None || item.category !== "Cape")
                .filter((item) => helmEnhancement === HelmSpecial.None || item.category !== "Helm")
                .every((item) => item.enhancementPatternId === baseEnhancement);

            const cape = bot.inventory.items.find((item) => item.equipped && item.category === "Cape") ?? null;
            const expectedCapeEnhancement = capeEnhancement === CapeSpecial.None ? baseEnhancement : capeEnhancement;
            const capeApplied = cape == null || cape.enhancementPatternId === expectedCapeEnhancement;

            const helm = bot.inventory.items.find((item) => item.equipped && item.category === "Helm") ?? null;
            const expectedHelmEnhancement = helmEnhancement === HelmSpecial.None ? baseEnhancement : helmEnhancement;
            const helmApplied = helm == null || helm.enhancementPatternId === expectedHelmEnhancement;

            const weapon = bot.inventory.items.find((item) => item.equipped && item.equipSlot === "Weapon") ?? null;
            const expectedWeaponEnhancement = weaponEnhancement > 0 && weaponEnhancement <= 6 ? baseEnhancement : 10;
            const weaponApplied =
                weapon != null &&
                weapon.enhancementPatternId === expectedWeaponEnhancement &&
                weapon.procId === weaponEnhancement;

            if (!baseApplied || !capeApplied || !helmApplied || !weaponApplied) {
                Core.logger(
                    "WARNING: The selected enhancements could not be applied to every equipped item. Continuing with the current enhancements.",
                );
            }
        } catch (ex) {
            rethrowIfStopped(ex);

            bot.log(`Class enhancement setup failed: ${ex}`);
            Core.logger("WARNING: Class enhancement setup failed. Continuing with the current enhancements.");
        }
    }

    private preparePotion(
        itemName: string,
        voucherName: string,
        voucherQuantity: number,
        voucherCost: number,
        purchaseQuantity: number,
        requiredAlchemyRank = 0,
    ): void {
        try {
            if (bot.inventory.contains(itemName)) {
                return;
            }

            if (bot.bank.contains(itemName)) {
                // TEMPORARY Game4000 inventory change. Remove after the client inventory fix.
                if (Core.inventoryBagFreeSlots <= 0) {
                    this.warnPotion(itemName, "no free inventory slot is available");
                    return;
                }

                bot.bank.ensureToInventory(itemName);
                bot.wait.forTrue(() => bot.inventory.contains(itemName), 20);

                if (!bot.inventory.contains(itemName)) {
                    this.warnPotion(itemName, "it could not be moved from the bank");
                }
                return;
            }

            if (requiredAlchemyRank > 0 && !bot.reputation.hasRank("Alchemy", requiredAlchemyRank)) {
                this.warnPotion(itemName, `Alchemy rank ${requiredAlchemyRank} is required`);
                return;
            }

            const voucherNeedsInventorySlot = !bot.inventory.contains(voucherName);
            const requiredSlots = voucherNeedsInventorySlot ? 2 : 1;

            // TEMPORARY Game4000 inventory change. Remove after the client inventory fix.
            if (Core.inventoryBagFreeSlots < requiredSlots) {
                this.warnPotion(itemName, `${requiredSlots} free inventory slots are required`);
                return;
            }

            if (bot.bank.contains(voucherName)) {
                bot.bank.ensureToInventory(voucherName);
                bot.wait.forTrue(() => bot.inventory.contains(voucherName), 20);
            }

            const missingVouchers = Math.max(0, voucherQuantity - bot.inventory.getQuantity(voucherName));
            const requiredGold = missingVouchers * voucherCost;

            if (bot.player.gold < requiredGold) {
                this.warnPotion(itemName, `${requiredGold} gold is required`);
                return;
            }

            Core.join("alchemyacademy");
            bot.shops.load(2036);

            if (!bot.shops.isLoaded || bot.shops.id !== 2036) {
                this.warnPotion(itemName, "the potion shop could not be loaded");
                return;
            }

            if (missingVouchers > 0) {
                bot.shops.buyItem(voucherName, missingVouchers);
                bot.wait.forTrue(() => bot.inventory.getQuantity(voucherName) >= voucherQuantity, 20);
            }

            if (bot.inventory.getQuantity(voucherName) < voucherQuantity) {
                this.warnPotion(itemName, "the required vouchers could not be purchased");
                return;
            }

            Core.buyItem("alchemyacademy", 2036, itemName, purchaseQuantity);
            bot.wait.forTrue(() => bot.inventory.contains(itemName), 20);

            if (!bot.inventory.contains(itemName)) {
                this.warnPotion(itemName, "it could not be purchased");
            }
        } catch (ex) {
            rethrowIfStopped(ex);

            bot.log(`Potion preparation failed for ${itemName}: ${ex}`);
            this.warnPotion(itemName, "preparation failed");
        }
    }

    private usePotion(itemName: string, auraName: string): void {
        try {
            if (bot.self.hasActiveAura(auraName)) {
                return;
            }

            if (!bot.inventory.contains(itemName)) {
                this.warnPotion(itemName, "it is not in the inventory");
                return;
            }

            bot.inventory.equipUsableItem(itemName);
            bot.wait.forItemEquip(itemName);

            if (!bot.inventory.isEquipped(itemName)) {
                this.warnPotion(itemName, "it could not be equipped");
                return;
            }

            bot.sleep(500);

            let applied = false;
            for (let attempt = 0; attempt < 3 && !bot.shouldExit; attempt++) {
                const quantityBefore = bot.inventory.getQuantity(itemName);
                Core.usePotion();

                const started = Date.now();
                while (!bot.shouldExit && Date.now() - started < 1500) {
                    if (bot.self.hasActiveAura(auraName) || bot.inventory.getQuantity(itemName) < quantityBefore) {
                        applied = true;
                        break;
                    }

                    bot.sleep(50);
                }

                if (applied) {
                    break;
                }

                bot.sleep(250);
            }

            if (!applied) {
                this.warnPotion(itemName, "its effect could not be verified");
            }
        } catch (ex) {
            rethrowIfStopped(ex);

            bot.log(`Potion use failed for ${itemName}: ${ex}`);
            this.warnPotion(itemName, "use failed");
        }
    }

    private warnPotion(itemName: string, reason: string): void {
        Core.logger(`WARNING: ${itemName} was skipped because ${reason}. Continuing without it.`);
    }
}

export const scriptOptions = defineScriptOptions("InfernalArenaLW", [], true, {
    Setup: InfernalArenaLW.setup,
    Farm: InfernalArenaLW.farm,
});

export default function main(): void {
    const script = new InfernalArenaLW();
    bot.config?.configure();
    Core.setOptions();

    try {
        script.run();
    } finally {
        Core.setOptions(false);
    }
}
