/*
name: Mors
description: null
tags: four harbingers, fourharbingers, mors, boss, farm, signet of the long quiet, lonewolf12
*/
// Port of Scripts/Prototypes/FourHarbingers/Mors.cs.

import { bot, choices, defineScriptOptions, type EventMap, option, SkillUseMode } from "turu";
import { CapeSpecial, CoreAdvanced, EnhancementType, HelmSpecial, WeaponSpecial } from "../../core/CoreAdvanced";
import { Core, rethrowIfStopped } from "../../core/CoreBots";
import { CoreFourHarbingers, FarmMode } from "./CoreFourHarbingers";

const Adv = new CoreAdvanced();
const FH = new CoreFourHarbingers();

export enum ClassChoice {
    Legion_Revenant = "Legion_Revenant",
    // Kings_Echo,
}

export class Mors {
    /** Set by the Do All script: skips setOptions and uses the overrides below. */
    doAllMode = false;

    private _counterCastDetected: boolean = false;
    /** When the counter cast was seen, in Unix milliseconds. */
    private _counterCastDetectedAt = 0;
    private _counterStopLogged: boolean = false;
    private _counterAttackActive: boolean = false;

    farmModeOverride: FarmMode = FarmMode.Once;
    farmQuantityOverride = 1;
    farmItemOverride = "";

    scriptMain(): void {
        if (!this.doAllMode) {
            Core.setOptions(undefined, { disableClassSwap: true });
        }
        bot.ultraBossHelper.disableCounterAttack();
        try {
            this.run();
        } finally {
            FH.stopSkills();
            bot.ultraBossHelper.enableCounterAttack();
            Core.cancelRegisteredQuests();
            if (!this.doAllMode) {
                Core.setOptions(false);
            }
        }
    }

    run(): void {
        if (this.getSelectedClass() === "King's Echo") {
            Core.logger("WARNING: King's Echo is still in testing and will probably fail.", undefined, {
                messageBox: true,
            });
        }

        FH.addDrops(
            "Manticore of Darkness",
            "Scroll of the Innocent",
            "Scroll of the Quartet",
            "Signet of the Long Quiet",
        );
        Core.registerQuests(10853);
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
            10853,
            this.fightBoss.bind(this),
            this.restockPotions.bind(this),
            FH.getFarmMode(this.doAllMode, this.farmModeOverride),
            FH.getFarmQuantity(this.doAllMode, this.farmQuantityOverride),
            FH.getFarmItem(this.doAllMode, this.farmItemOverride),
        );
    }

    private fightBoss(): boolean {
        this._counterCastDetected = false;
        this._counterCastDetectedAt = 0;
        this._counterStopLogged = false;
        this._counterAttackActive = false;
        FH.stopSkills();
        bot.events.off("extensionPacket", this.morsFlashListener);
        bot.events.on("extensionPacket", this.morsFlashListener);

        try {
            Core.join("fourharbingers-100000", "r5", "Bottom");
            if (this.getSelectedClass() === "King's Echo") {
                bot.skills.startSkills("3 | 1 | 2 | 1 | 2 | 3 | 1 | 2 | 1 | 2 | 4", 250, SkillUseMode.WaitForCooldown);
            } else {
                bot.skills.startSkills("3 | 4 | 2 | 1", 250, SkillUseMode.UseIfAvailable);
            }

            while (!bot.shouldExit && !bot.tempInv.contains("Signet of the Long Quiet")) {
                if (!bot.player.alive) {
                    bot.wait.forTrue(() => bot.player.alive, 20);
                    if (bot.player.alive) {
                        this._counterCastDetected = false;
                        this._counterCastDetectedAt = 0;
                        this._counterStopLogged = false;
                        this._counterAttackActive = false;
                        if (this.getSelectedClass() === "King's Echo") {
                            bot.skills.startSkills(
                                "3 | 1 | 2 | 1 | 2 | 3 | 1 | 2 | 1 | 2 | 4",
                                250,
                                SkillUseMode.WaitForCooldown,
                            );
                        } else {
                            bot.skills.startSkills("3 | 4 | 2 | 1", 250, SkillUseMode.UseIfAvailable);
                        }
                        bot.skills.resume();
                    }
                    continue;
                }

                if (!FH.ensureBossRoom("r5", "Bottom")) {
                    continue;
                }

                if (!this.counterAttackMechanics()) {
                    bot.sleep(100);
                    continue;
                }

                if (!bot.player.hasTarget || bot.player.target == null || bot.player.target.mapId !== 4) {
                    bot.combat.attack(4);
                }

                if (this.getSelectedClass() === "Legion Revenant") {
                    FH.refreshPotion("Potent Honor Potion", "Potent Honor Malice");
                } else {
                    FH.refreshPotion("Felicitous Philtre", "Felicitous Philtre");
                }

                bot.sleep(100);
            }
        } finally {
            bot.events.off("extensionPacket", this.morsFlashListener);
            bot.combat.cancelAutoAttack();
            bot.skills.resume();
            this._counterCastDetected = false;
            this._counterCastDetectedAt = 0;
            this._counterStopLogged = false;
            this._counterAttackActive = false;
        }

        return bot.tempInv.contains("Signet of the Long Quiet");
    }

    private counterAttackMechanics(): boolean {
        if (FH.hasMonsterAura(4, "Counter Attack")) {
            this._counterCastDetected = false;
            this._counterCastDetectedAt = 0;
            this._counterAttackActive = true;
            bot.skills.pause();
            bot.combat.cancelAutoAttack();
            if (!this._counterStopLogged) {
                this._counterStopLogged = true;
                Core.logger("Counter Cast: attacks stopped.");
            }
            if (this.getSelectedClass() === "King's Echo") {
                bot.combat.cancelTarget();
            }
            return false;
        }

        if (this._counterCastDetected) {
            const elapsedMilliseconds = Date.now() - this._counterCastDetectedAt;
            if (elapsedMilliseconds < 1000) {
                return true;
            }

            if (elapsedMilliseconds < 4000) {
                bot.skills.pause();
                bot.combat.cancelAutoAttack();
                if (!this._counterStopLogged) {
                    this._counterStopLogged = true;
                    Core.logger("Counter Cast: attacks stopped.");
                }
                return false;
            }

            this._counterCastDetected = false;
            this._counterCastDetectedAt = 0;
            this._counterStopLogged = false;
            // C# paused the skills above and resumed them only after a Counter Attack aura: when
            // none came, the rest of the fight ran on auto attacks alone.
            if (!this._counterAttackActive) {
                bot.skills.resume();
            }
        }

        if (this._counterAttackActive) {
            this._counterAttackActive = false;
            if (this.getSelectedClass() === "King's Echo") {
                bot.skills.startSkills("3 | 1 | 2 | 1 | 2 | 3 | 1 | 2 | 1 | 2 | 4", 250, SkillUseMode.WaitForCooldown);
            }
            bot.skills.resume();
            Core.logger("Counter Attack ended. Attacks resumed.");
        }

        return true;
    }

    /**
     * C# listens to `Bot.Flash.FlashCall`'s "packetFromServer" and "pext" and looks for the text in
     * the raw packet; Turu's `extensionPacket` event is that packet, searched as JSON.
     */
    private morsFlashListener = (packet: EventMap["extensionPacket"]): void => {
        try {
            if (bot.shouldExit || (bot.map.name ?? "").toLowerCase() !== "fourharbingers" || packet == null) {
                return;
            }

            const rawPacket = JSON.stringify(packet["params"]?.dataObj ?? packet);
            if (rawPacket.indexOf("Mors prepares a counter attack") < 0) {
                return;
            }
            if (this._counterCastDetected || this._counterAttackActive) {
                return;
            }

            this._counterCastDetected = true;
            this._counterCastDetectedAt = Date.now();
            this._counterStopLogged = false;
            Core.logger("Counter Cast detected. Attacks will stop in 1 second.");
        } catch (error) {
            rethrowIfStopped(error);
        }
    };

    private getSelectedClass(): string {
        if (this.doAllMode) {
            return "Legion Revenant";
        }

        const classChoice = bot.config!.get<ClassChoice>("ClassChoice");
        if (classChoice === ClassChoice.Legion_Revenant) {
            return "Legion Revenant";
        } else if (String(classChoice).toLowerCase() === "Kings_Echo".toLowerCase()) {
            return "King's Echo";
        } else {
            return "Legion Revenant";
        }
    }

    private applyEnhancements(): void {
        let weaponEnhancement: WeaponSpecial;
        let helmEnhancement = HelmSpecial.None;
        let capeEnhancement = CapeSpecial.None;

        if (Adv.uElysium()) {
            weaponEnhancement = WeaponSpecial.Elysium;
        } else {
            FH.warnEnhancementFallback("Elysium is not unlocked. Health Vamp will be used instead.");
            weaponEnhancement = WeaponSpecial.Health_Vamp;
        }

        if (this.getSelectedClass() === "King's Echo") {
            if (Adv.uExamen()) {
                helmEnhancement = HelmSpecial.Examen;
            } else {
                FH.warnEnhancementFallback("Examen is not unlocked. Wizard will be used on the helm instead.");
            }
        } else {
            if (Adv.uPneuma()) {
                helmEnhancement = HelmSpecial.Pneuma;
            } else {
                FH.warnEnhancementFallback("Pneuma is not unlocked. Wizard will be used on the helm instead.");
            }
        }

        if (Adv.uAbsolution()) {
            capeEnhancement = CapeSpecial.Absolution;
        } else {
            FH.warnEnhancementFallback("Absolution is not unlocked. Wizard will be used on the cape instead.");
        }

        if (weaponEnhancement === WeaponSpecial.Health_Vamp) {
            if (!Adv.uAwe()) {
                FH.warnEnhancementFallback("Awe enhancements are not unlocked. Enhancement setup will continue.");
            }
        }

        if (this.getSelectedClass() === "Legion Revenant") {
            Adv.enhanceEquipped(EnhancementType.Wizard, {
                cSpecial: capeEnhancement,
                hSpecial: helmEnhancement,
                wSpecial: weaponEnhancement,
                bypassDisableAutoEnhance: true,
            });
        } else {
            Adv.enhanceEquipped(EnhancementType.Lucky, {
                cSpecial: capeEnhancement,
                hSpecial: helmEnhancement,
                wSpecial: weaponEnhancement,
                bypassDisableAutoEnhance: true,
            });
        }
    }

    private getPotions(): void {
        if (this.getSelectedClass() === "Legion Revenant") {
            FH.getPotion("Sage Tonic", "Gold Voucher 500k", 2, 500000, 10, 8);
        } else {
            FH.getPotion("Fate Tonic", "Gold Voucher 500k", 4, 500000, 10, 8);
        }

        FH.getPotion("Potent Revitalize Elixir", "Gold Voucher 500k", 8, 500000, 20);
        if (this.getSelectedClass() === "Legion Revenant") {
            FH.getPotion("Potent Honor Potion", "Gold Voucher 500k", 4, 500000, 20, 0, "Good", 10);
        } else {
            FH.getPotion("Felicitous Philtre", "Gold Voucher 100k", 8, 100000, 100);
        }
    }

    private usePotions(): void {
        if (this.getSelectedClass() === "Legion Revenant") {
            FH.usePotion("Sage Tonic", "Sage");
            FH.usePotion("Potent Revitalize Elixir", "Potent Revitalize Elixir");
            FH.usePotion("Potent Honor Potion", "Potent Honor Malice");
        } else {
            FH.usePotion("Fate Tonic", "Fate");
            FH.usePotion("Potent Revitalize Elixir", "Potent Revitalize Elixir");
            FH.usePotion("Felicitous Philtre", "Felicitous Philtre");
        }
    }

    private restockPotions(): void {
        if (!FH.usePotionsEnabled()) {
            return;
        }

        if (this.getSelectedClass() === "Legion Revenant") {
            FH.restockPotions(
                ["Sage Tonic", "Potent Revitalize Elixir", "Potent Honor Potion"],
                this.getPotions.bind(this),
                this.usePotions.bind(this),
            );
        } else {
            FH.restockPotions(
                ["Fate Tonic", "Potent Revitalize Elixir", "Felicitous Philtre"],
                this.getPotions.bind(this),
                this.usePotions.bind(this),
            );
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "FourHarbingers_Mors_v2",
    [
        option.choice(
            "ClassChoice",
            "Use Class",
            "Class used to fight Mors.",
            choices(ClassChoice),
            ClassChoice.Legion_Revenant,
        ),
        option.bool("UsePotions", "Use Potions", "Use potions during the fight.", true),
        option.bool("DoEnhancements", "Do Enhancements", "Apply the class enhancements before fighting.", true),
        option.int(
            "FarmQuantity",
            "Farm Mors Amount of Times",
            "0 farms indefinitely. Any positive number farms that many quest completions.",
            0,
        ),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    new Mors().scriptMain();
}
