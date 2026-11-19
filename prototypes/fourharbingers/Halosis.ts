/*
name: Halosis
description: null
tags: four harbingers, fourharbingers, halosis, boss, farm, signet of inner conflict, lonewolf12
*/
// Port of Scripts/Prototypes/FourHarbingers/Halosis.cs.

import { bot, choices, defineScriptOptions, type EventMap, option, SkillUseMode } from "turu";
import { CapeSpecial, CoreAdvanced, EnhancementType, HelmSpecial, WeaponSpecial } from "../../core/CoreAdvanced";
import { Core, rethrowIfStopped } from "../../core/CoreBots";
import { CoreFourHarbingers, FarmMode } from "./CoreFourHarbingers";

const Adv = new CoreAdvanced();
const FH = new CoreFourHarbingers();

export enum ClassChoice {
    Dragon_of_Time = "Dragon_of_Time",
    Chaos_Avenger = "Chaos_Avenger",
}

export class Halosis {
    /** Set by the Do All script: skips setOptions and uses the overrides below. */
    doAllMode = false;

    private _dieNowDetected: boolean = false;
    /** When "Die now" was seen, in Unix milliseconds. */
    private _dieNowDetectedAt = 0;
    private _skillOneReserved: boolean = false;
    private _autoAttackCancelled: boolean = false;

    farmModeOverride: FarmMode = FarmMode.Once;
    farmQuantityOverride = 1;
    farmItemOverride = "";

    scriptMain(): void {
        if (!this.doAllMode) {
            Core.setOptions(undefined, { disableClassSwap: true });
        }
        try {
            this.run();
        } finally {
            FH.stopSkills();
            Core.cancelRegisteredQuests();
            if (!this.doAllMode) {
                Core.setOptions(false);
            }
        }
    }

    run(): void {
        FH.addDrops(
            "Celestial Winged Manticore",
            "Manticore of Light",
            "Scroll of the Quartet",
            "Scroll of the Wanderer",
            "Signet of Inner Conflict",
        );
        Core.registerQuests(10850);
        FH.returnToSafeRoom();

        if (!FH.equipClass(this.getSelectedClass())) {
            return;
        }

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
            10850,
            this.fightBoss.bind(this),
            this.restockPotions.bind(this),
            FH.getFarmMode(this.doAllMode, this.farmModeOverride),
            FH.getFarmQuantity(this.doAllMode, this.farmQuantityOverride),
            FH.getFarmItem(this.doAllMode, this.farmItemOverride),
        );
    }

    private fightBoss(): boolean {
        this._dieNowDetected = false;
        this._dieNowDetectedAt = 0;
        this._skillOneReserved = false;
        this._autoAttackCancelled = false;
        bot.events.off("extensionPacket", this.halosisFlashListener);
        bot.events.on("extensionPacket", this.halosisFlashListener);

        try {
            Core.join("fourharbingers-100000", "r2", "Bottom");
            bot.skills.resume();

            if (this.getSelectedClass() === "Dragon of Time") {
                bot.skills.startSkills("3 | 2 | 1 | 2 | 4 | 2", 250, SkillUseMode.WaitForCooldown);
            } else {
                bot.skills.startSkills("3 | 4 | 2 | 1", -1, SkillUseMode.UseIfAvailable);
            }

            while (!bot.shouldExit && !bot.tempInv.contains("Signet of Inner Conflict")) {
                if (!bot.player.alive) {
                    bot.wait.forTrue(() => bot.player.alive, 20);
                    if (bot.player.alive) {
                        this._dieNowDetected = false;
                        this._dieNowDetectedAt = 0;
                        this._skillOneReserved = false;
                        this._autoAttackCancelled = false;
                        if (this.getSelectedClass() === "Dragon of Time") {
                            bot.skills.startSkills("3 | 2 | 1 | 2 | 4 | 2", 250, SkillUseMode.WaitForCooldown);
                        } else {
                            bot.skills.startSkills("3 | 4 | 2 | 1", -1, SkillUseMode.UseIfAvailable);
                        }
                        bot.skills.resume();
                    }
                    continue;
                }

                if (!FH.ensureBossRoom("r2", "Bottom")) {
                    continue;
                }

                if (!bot.player.hasTarget || bot.player.target == null || bot.player.target.mapId !== 1) {
                    bot.combat.attack(1);
                }

                if (this.getSelectedClass() === "Chaos Avenger") {
                    if (this.chaosAvengerMechanics()) {
                        FH.refreshPotion("Felicitous Philtre", "Felicitous Philtre");
                    }
                } else {
                    FH.refreshPotion("Potent Honor Potion", "Potent Honor Malice");
                }

                bot.sleep(100);
            }
        } finally {
            bot.events.off("extensionPacket", this.halosisFlashListener);
            bot.combat.cancelAutoAttack();
            bot.skills.resume();
            this._dieNowDetected = false;
            this._dieNowDetectedAt = 0;
            this._skillOneReserved = false;
            this._autoAttackCancelled = false;
        }

        return bot.tempInv.contains("Signet of Inner Conflict");
    }

    private chaosAvengerMechanics(): boolean {
        if (bot.self.hasActiveAura("Crits Inverted")) {
            bot.skills.pause();
            this._autoAttackCancelled = true;
            bot.combat.cancelAutoAttack();
            return false;
        }

        if (this._dieNowDetected) {
            const elapsedMilliseconds = Date.now() - this._dieNowDetectedAt;

            bot.skills.pause();
            if (this._autoAttackCancelled) {
                this._autoAttackCancelled = false;
                bot.combat.attack(1);
            }

            if (elapsedMilliseconds >= 2000 && bot.skills.canUseSkill(1)) {
                bot.skills.useSkill(1);
                this._dieNowDetected = false;
                this._dieNowDetectedAt = 0;
                bot.skills.resume();
            }

            return false;
        }

        if (this._autoAttackCancelled) {
            this._autoAttackCancelled = false;
            bot.combat.attack(1);
        }

        bot.skills.resume();

        if (!this._skillOneReserved && bot.player.target != null) {
            if (bot.player.target.maxHp > 0 && bot.player.target.hp * 100 <= bot.player.target.maxHp * 40) {
                this._skillOneReserved = true;
                FH.stopSkills();
                bot.skills.startSkills("3 | 4 | 2", -1, SkillUseMode.UseIfAvailable);
                Core.logger("Halosis reached 40% HP. Skill 1 is now reserved for Die now.");
            }
        }

        return true;
    }

    /**
     * C# listens to `Bot.Flash.FlashCall`'s "packetFromServer" and reads the packet's `b.o`; Turu's
     * `extensionPacket` event gives that object as `params.dataObj` of a JSON packet.
     */
    private halosisFlashListener = (packet: EventMap["extensionPacket"]): void => {
        try {
            if (bot.shouldExit) {
                return;
            }
            if ((bot.map.name ?? "").toLowerCase() !== "fourharbingers") {
                return;
            }
            if (packet?.["params"]?.type !== "json") {
                return;
            }
            if (this.getSelectedClass() !== "Chaos Avenger") {
                return;
            }

            const data: any = packet["params"].dataObj;
            if (data?.["cmd"]?.toString() !== "ct") {
                return;
            }

            const animations = data["anims"];
            if (animations == null) {
                return;
            }

            for (const animation of animations) {
                const messageValue = animation["msg"];
                if (messageValue == null) {
                    continue;
                }

                const message = String(messageValue);
                if (message === "Die now." || message === "Die now") {
                    this._dieNowDetected = true;
                    this._dieNowDetectedAt = Date.now();
                    Core.logger("Die now detected. Skill 1 will be used after 2 seconds.");
                }
            }
        } catch (error) {
            rethrowIfStopped(error);
        }
    };

    private getSelectedClass(): string {
        if (this.doAllMode) {
            return "Dragon of Time";
        }

        const classChoice = bot.config!.get<ClassChoice>("ClassChoice");
        if (classChoice === ClassChoice.Dragon_of_Time) {
            return "Dragon of Time";
        } else if (classChoice === ClassChoice.Chaos_Avenger) {
            return "Chaos Avenger";
        } else {
            return "Dragon of Time";
        }
    }

    private applyEnhancements(): void {
        let weaponEnhancement: WeaponSpecial;
        let helmEnhancement = HelmSpecial.None;
        let capeEnhancement = CapeSpecial.None;

        if (this.getSelectedClass() === "Dragon of Time") {
            if (Adv.uElysium()) {
                weaponEnhancement = WeaponSpecial.Elysium;
            } else if (Adv.uValiance()) {
                FH.warnEnhancementFallback("Elysium is not unlocked. Valiance will be used instead.");
                weaponEnhancement = WeaponSpecial.Valiance;
            } else {
                FH.warnEnhancementFallback("Elysium and Valiance are not unlocked. Awe Blast will be used instead.");
                weaponEnhancement = WeaponSpecial.Awe_Blast;
            }

            if (Adv.uPneuma()) {
                helmEnhancement = HelmSpecial.Pneuma;
            } else {
                FH.warnEnhancementFallback("Pneuma is not unlocked. Wizard will be used on the helm instead.");
            }

            if (Adv.uVainglory()) {
                capeEnhancement = CapeSpecial.Vainglory;
            } else {
                FH.warnEnhancementFallback("Vainglory is not unlocked. Wizard will be used on the cape instead.");
            }

            if (weaponEnhancement === WeaponSpecial.Awe_Blast) {
                if (!Adv.uAwe()) {
                    FH.warnEnhancementFallback("Awe enhancements are not unlocked. Enhancement setup will continue.");
                }
            }

            Adv.enhanceEquipped(EnhancementType.Wizard, {
                cSpecial: capeEnhancement,
                hSpecial: helmEnhancement,
                wSpecial: weaponEnhancement,
                bypassDisableAutoEnhance: true,
            });
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
    }

    private getPotions(): void {
        if (this.getSelectedClass() === "Dragon of Time") {
            FH.getPotion("Sage Tonic", "Gold Voucher 500k", 2, 500000, 10, 8);
            FH.getPotion("Potent Malevolence Elixir", "Gold Voucher 500k", 4, 500000, 8);
            FH.getPotion("Potent Honor Potion", "Gold Voucher 500k", 4, 500000, 20, 0, "Good", 10);
        } else {
            FH.getPotion("Might Tonic", "Gold Voucher 500k", 2, 500000, 10, 8);
            FH.getPotion("Potent Battle Elixir", "Gold Voucher 500k", 4, 500000, 8);
            FH.getPotion("Felicitous Philtre", "Gold Voucher 100k", 8, 100000, 100);
        }
    }

    private usePotions(): void {
        if (this.getSelectedClass() === "Dragon of Time") {
            FH.usePotion("Sage Tonic", "Sage");
            FH.usePotion("Potent Malevolence Elixir", "Potent Malevolence Elixir");
            FH.usePotion("Potent Honor Potion", "Potent Honor Malice");
        } else {
            FH.usePotion("Might Tonic", "Might");
            FH.usePotion("Potent Battle Elixir", "Potent Battle Elixir");
            FH.usePotion("Felicitous Philtre", "Felicitous Philtre");
        }
    }

    private restockPotions(): void {
        if (!FH.usePotionsEnabled()) {
            return;
        }

        if (this.getSelectedClass() === "Dragon of Time") {
            FH.restockPotions(
                ["Sage Tonic", "Potent Malevolence Elixir", "Potent Honor Potion"],
                this.getPotions.bind(this),
                this.usePotions.bind(this),
            );
        } else {
            FH.restockPotions(
                ["Might Tonic", "Potent Battle Elixir", "Felicitous Philtre"],
                this.getPotions.bind(this),
                this.usePotions.bind(this),
            );
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "FourHarbingers_Halosis_v2",
    [
        option.choice(
            "ClassChoice",
            "Use Class",
            "Class used to fight Halosis.",
            choices(ClassChoice),
            ClassChoice.Dragon_of_Time,
        ),
        option.bool("UsePotions", "Use Potions", "Use potions during the fight.", true),
        option.bool("DoEnhancements", "Do Enhancements", "Apply the class enhancements before fighting.", true),
        option.int(
            "FarmQuantity",
            "Farm Halosis Amount of Times",
            "0 farms indefinitely. Any positive number farms that many quest completions.",
            0,
        ),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    new Halosis().scriptMain();
}
