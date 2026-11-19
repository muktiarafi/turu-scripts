/*
name: Anethyx'o's Absolution
description: Defeat Anethyx'o's Absolution using King's Echo or Chaos Avenger
tags: four harbingers, fourharbingers, anethyxos, anethyxos absolution, boss, farm, signet of the broken bond, lonewolf12
*/
// Port of Scripts/Prototypes/FourHarbingers/AnethyxosAbsolution.cs.

import { bot, choices, defineScriptOptions, type EventMap, option, SkillUseMode } from "turu";
import { CapeSpecial, CoreAdvanced, EnhancementType, HelmSpecial, WeaponSpecial } from "../../core/CoreAdvanced";
import { Core, rethrowIfStopped } from "../../core/CoreBots";
import { CoreFourHarbingers, FarmMode } from "./CoreFourHarbingers";

const Adv = new CoreAdvanced();
const FH = new CoreFourHarbingers();

export enum ClassChoice {
    Kings_Echo = "Kings_Echo",
    Chaos_Avenger = "Chaos_Avenger",
}

export class AnethyxosAbsolution {
    /** Set by the Do All script: skips setOptions and uses the overrides below. */
    doAllMode = false;

    private _resolvedClass: string | null = null;
    private _dieNow: boolean = false;
    /** When "Die now." was seen, in Unix milliseconds. */
    private _dieNowDetectedAt = 0;
    private _lowHealthSkills: boolean = false;
    private _dieNowHandled: boolean = false;

    farmModeOverride: FarmMode = FarmMode.Once;
    farmQuantityOverride = 1;
    farmItemOverride = "";

    scriptMain(): void {
        if (!this.doAllMode) {
            Core.setOptions(undefined, { disableClassSwap: true });
        }
        bot.ultraBossHelper.disableCounterAttack();
        bot.events.off("extensionPacket", this.absolutionFlashListener);
        bot.events.on("extensionPacket", this.absolutionFlashListener);
        try {
            this.run();
        } finally {
            bot.events.off("extensionPacket", this.absolutionFlashListener);
            // C# left the counter attack handling off and the skills running after the fight,
            // which a script started after it (Do All's next boss) inherited.
            FH.stopSkills();
            bot.ultraBossHelper.enableCounterAttack();
            Core.cancelRegisteredQuests();
            if (!this.doAllMode) {
                Core.setOptions(false);
            }
        }
    }

    run(): void {
        this._resolvedClass = null;
        FH.addDrops(
            "Anethyx’o’s Absolution Orbs",
            "Manticore of Infinity",
            "Scroll of the Heretic",
            "Scroll of the Quartet",
            "Signet of the Broken Bond",
        );
        Core.registerQuests(10854);
        FH.returnToSafeRoom();

        const selectedClass = this.getSelectedClass();
        let fallbackClass: string;
        if (selectedClass === "King's Echo") {
            fallbackClass = "Chaos Avenger";
        } else {
            fallbackClass = "King's Echo";
        }

        const resolvedClass = FH.equipClassWithFallback(selectedClass, fallbackClass, !this.doAllMode);
        if (resolvedClass === null) {
            return;
        }

        this._resolvedClass = resolvedClass;

        if (FH.doEnhancementsEnabled()) {
            this.applyEnhancements();
        }

        if (FH.usePotionsEnabled()) {
            this.getPotions();
        }

        Core.join("fourharbingers-100000", "Enter", "Spawn");

        if (FH.usePotionsEnabled()) {
            this.usePotions();
        }

        FH.runQuests(
            10854,
            this.fightBoss.bind(this),
            this.restockPotions.bind(this),
            FH.getFarmMode(this.doAllMode, this.farmModeOverride),
            FH.getFarmQuantity(this.doAllMode, this.farmQuantityOverride),
            FH.getFarmItem(this.doAllMode, this.farmItemOverride),
        );
    }

    private fightBoss(): boolean {
        this._dieNow = false;
        this._dieNowDetectedAt = 0;
        this._lowHealthSkills = false;
        this._dieNowHandled = false;

        try {
            Core.join("fourharbingers-100000", "r6", "Bottom");
            this.startNormalSkills();

            while (!bot.shouldExit && !bot.tempInv.contains("Signet of the Broken Bond")) {
                if (!bot.player.alive) {
                    bot.wait.forTrue(() => bot.player.alive, 20);
                    if (bot.player.alive) {
                        this._dieNow = false;
                        this._dieNowDetectedAt = 0;
                        this._lowHealthSkills = false;
                        this._dieNowHandled = false;
                        this.startNormalSkills();
                        bot.skills.resume();
                    }
                    continue;
                }

                if (!FH.ensureBossRoom("r6", "Bottom")) {
                    continue;
                }

                if (this.handleDieNow()) {
                    bot.sleep(100);
                    continue;
                }

                this.applyLowHealthSkills();

                if (this.stopForAuras()) {
                    bot.sleep(100);
                    continue;
                }

                if (!bot.player.hasTarget || bot.player.target == null || bot.player.target.mapId !== 5) {
                    bot.combat.attack(5);
                }

                bot.skills.resume();
                FH.refreshPotion("Felicitous Philtre", "Felicitous Philtre");
                bot.sleep(100);
            }
        } finally {
            bot.combat.cancelAutoAttack();
            bot.skills.resume();
            this._dieNow = false;
            this._dieNowDetectedAt = 0;
            this._lowHealthSkills = false;
            this._dieNowHandled = false;
        }

        return bot.tempInv.contains("Signet of the Broken Bond");
    }

    private startNormalSkills(): void {
        if (this.getSelectedClass() === "King's Echo") {
            this.replaceSkillProvider("3 | 1 | 2 | 1 | 2 | 3 | 1 | 2 | 1 | 2 | 4", 250, SkillUseMode.WaitForCooldown);
        } else {
            this.replaceSkillProvider("3 | 4 | 2 | 1", 250, SkillUseMode.UseIfAvailable);
        }
    }

    /**
     * Switches the running rotation to `skills`. C# loads it into the running timer
     * (`LoadAdvanced` and the override provider); Turu restarts the rotation.
     */
    private replaceSkillProvider(skills: string, skillTimeout: number, skillMode: SkillUseMode): void {
        bot.skills.startSkills(skills, skillTimeout, skillMode);
    }

    private applyLowHealthSkills(): void {
        if (this._lowHealthSkills || this._dieNowHandled) {
            return;
        }

        const boss = bot.monsters.mapMonsters.find((m) => m.mapId === 5) ?? null;
        if (boss == null || boss.maxHp <= 0 || boss.hp <= 0 || boss.hp > boss.maxHp * 0.25) {
            return;
        }

        this._lowHealthSkills = true;
        if (this.getSelectedClass() === "King's Echo") {
            this.replaceSkillProvider("1 | 2", 250, SkillUseMode.WaitForCooldown);
        } else {
            this.replaceSkillProvider("3 | 4 | 2", 250, SkillUseMode.UseIfAvailable);
        }
    }

    private stopForAuras(): boolean {
        if (!FH.hasMonsterAura(5, "Counter Attack") && !bot.self.hasActiveAura("Crits Inverted")) {
            return false;
        }

        bot.skills.pause();
        bot.combat.cancelAutoAttack();
        bot.combat.cancelTarget();
        return true;
    }

    private handleDieNow(): boolean {
        if (!this._dieNow || this._dieNowHandled) {
            return false;
        }

        bot.skills.pause();

        if (
            this.getSelectedClass() === "King's Echo" &&
            (bot.self.hasActiveAura("Waiting For Corvak") || bot.player.mana <= bot.player.maxMana / 2)
        ) {
            if (!bot.player.hasTarget || bot.player.target == null || bot.player.target.mapId !== 5) {
                bot.combat.attack(5);
                return true;
            }

            if (bot.skills.canUseSkill(4)) {
                bot.skills.useSkill(4);
                bot.sleep(100);
            }
            bot.combat.cancelAutoAttack();
            return true;
        }

        if (Date.now() - this._dieNowDetectedAt < 2 * 1000) {
            if (this.getSelectedClass() === "King's Echo") {
                bot.combat.cancelAutoAttack();
            }

            return true;
        }

        if (!bot.player.hasTarget || bot.player.target == null || bot.player.target.mapId !== 5) {
            bot.combat.attack(5);
            return true;
        }

        if (this.getSelectedClass() === "King's Echo") {
            if (!bot.skills.canUseSkill(3)) {
                bot.combat.cancelAutoAttack();
                return true;
            }

            // C# also returns when UseSkill reports failure; Turu's useSkill reports nothing, and
            // canUseSkill was just checked.
            bot.skills.useSkill(3);
        } else {
            if (!bot.skills.canUseSkill(1)) {
                return true;
            }

            bot.skills.useSkill(1);
        }

        this._dieNow = false;
        this._dieNowDetectedAt = 0;
        this._lowHealthSkills = false;
        this._dieNowHandled = true;
        this.startNormalSkills();
        bot.skills.resume();
        return true;
    }

    /**
     * C# listens to `Bot.Flash.FlashCall`'s "packetFromServer" and reads the packet's `b.o`; Turu's
     * `extensionPacket` event gives that object as `params.dataObj` of a JSON packet.
     */
    private absolutionFlashListener = (packet: EventMap["extensionPacket"]): void => {
        try {
            if (
                bot.shouldExit ||
                (bot.map.name ?? "").toLowerCase() !== "fourharbingers" ||
                packet?.["params"]?.type !== "json"
            ) {
                return;
            }

            const data: any = packet["params"].dataObj;
            if (data?.cmd?.toString() !== "ct" || data?.anims == null) {
                return;
            }

            for (const animation of data.anims) {
                if (animation?.msg?.toString() !== "Die now.") {
                    continue;
                }

                // Ignore duplicate/late Die now packets once this mechanic is active or handled.
                if (this._dieNow || this._dieNowHandled) {
                    return;
                }

                this._dieNow = true;
                this._dieNowDetectedAt = Date.now();
                bot.skills.pause();
                Core.logger("Die now detected. Preparing the defensive skill.");
                return;
            }
        } catch (error) {
            rethrowIfStopped(error);
        }
    };

    private getSelectedClass(): string {
        if (!!this._resolvedClass) {
            return this._resolvedClass;
        }

        if (this.doAllMode) {
            return "King's Echo";
        }

        const classChoice = bot.config!.get<ClassChoice>("ClassChoice");
        if (classChoice === ClassChoice.Kings_Echo) {
            return "King's Echo";
        } else if (classChoice === ClassChoice.Chaos_Avenger) {
            return "Chaos Avenger";
        } else {
            return "King's Echo";
        }
    }

    private applyEnhancements(): void {
        let weaponEnhancement: WeaponSpecial;
        let helmEnhancement = HelmSpecial.None;
        let capeEnhancement = CapeSpecial.None;

        if (this.getSelectedClass() === "King's Echo") {
            if (Adv.uElysium()) {
                weaponEnhancement = WeaponSpecial.Elysium;
            } else {
                FH.warnEnhancementFallback("Elysium is not unlocked. Health Vamp will be used instead.");
                weaponEnhancement = WeaponSpecial.Health_Vamp;
            }

            if (Adv.uExamen()) {
                helmEnhancement = HelmSpecial.Examen;
            } else {
                FH.warnEnhancementFallback("Examen is not unlocked. Lucky will be used on the helm instead.");
            }
        } else {
            if (Adv.uPraxis()) {
                weaponEnhancement = WeaponSpecial.Praxis;
            } else {
                FH.warnEnhancementFallback("Praxis is not unlocked. Health Vamp will be used instead.");
                weaponEnhancement = WeaponSpecial.Health_Vamp;
            }

            if (Adv.uAnima()) {
                helmEnhancement = HelmSpecial.Anima;
            } else {
                FH.warnEnhancementFallback("Anima is not unlocked. Lucky will be used on the helm instead.");
            }
        }

        if (Adv.uPenitence()) {
            capeEnhancement = CapeSpecial.Penitence;
        } else {
            FH.warnEnhancementFallback("Penitence is not unlocked. Lucky will be used on the cape instead.");
        }

        if (weaponEnhancement === WeaponSpecial.Health_Vamp) {
            if (!Adv.uAwe()) {
                FH.warnEnhancementFallback("Awe enhancements are not unlocked. Enhancement setup will continue.");
            }
        }

        Adv.enhanceEquipped(EnhancementType.Lucky, {
            cSpecial: capeEnhancement,
            hSpecial: helmEnhancement,
            wSpecial: weaponEnhancement,
            bypassDisableAutoEnhance: true,
        });
    }

    private getPotions(): void {
        FH.getPotion("Fate Tonic", "Gold Voucher 500k", 4, 500000, 10, 8);
        if (this.getSelectedClass() === "King's Echo") {
            FH.getPotion("Potent Revitalize Elixir", "Gold Voucher 500k", 8, 500000, 20);
        } else {
            FH.getPotion("Potent Battle Elixir", "Gold Voucher 500k", 4, 500000, 20);
        }
        FH.getPotion("Felicitous Philtre", "Gold Voucher 100k", 8, 100000, 100);
    }

    private usePotions(): void {
        FH.usePotion("Fate Tonic", "Fate");
        if (this.getSelectedClass() === "King's Echo") {
            FH.usePotion("Potent Revitalize Elixir", "Potent Revitalize Elixir");
        } else {
            FH.usePotion("Potent Battle Elixir", "Potent Battle Elixir");
        }
        FH.usePotion("Felicitous Philtre", "Felicitous Philtre");
    }

    private restockPotions(): void {
        if (!FH.usePotionsEnabled()) {
            return;
        }

        if (this.getSelectedClass() === "King's Echo") {
            FH.restockPotions(
                ["Fate Tonic", "Potent Revitalize Elixir", "Felicitous Philtre"],
                this.getPotions.bind(this),
                this.usePotions.bind(this),
            );
        } else {
            FH.restockPotions(
                ["Fate Tonic", "Potent Battle Elixir", "Felicitous Philtre"],
                this.getPotions.bind(this),
                this.usePotions.bind(this),
            );
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "FourHarbingers_AnethyxosAbsolution_v2",
    [
        option.choice(
            "ClassChoice",
            "Use Class",
            "Class used to fight Anethyx'o's Absolution.",
            choices(ClassChoice),
            ClassChoice.Kings_Echo,
        ),
        option.bool("UsePotions", "Use Potions", "Use potions during the fight.", true),
        option.bool("DoEnhancements", "Do Enhancements", "Apply the class enhancements before fighting.", true),
        option.int(
            "FarmQuantity",
            "Farm Anethyx'o's Absolution Amount of Times",
            "0 farms indefinitely. Any positive number farms that many quest completions.",
            0,
        ),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    new AnethyxosAbsolution().scriptMain();
}
