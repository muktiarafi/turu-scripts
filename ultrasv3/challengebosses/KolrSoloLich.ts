/*
name: Kolr Solo Lich
description: Solo Kolr with post-potion-patch Elysium Lich and required Felicitous Philtre.
tags: kolr, solo, lich, ultra
*/
// Port of Scripts/Ultrasv3/ChallengeBosses/KolrSoloLich.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.
//
// Turu: C#'s RefreshFbsMute (VibeSkua's FBS plugin mute file) is left out; Turu has no such plugin.

import { bot } from "turu";
import { CapeSpecial, CoreAdvanced, EnhancementType, HelmSpecial, WeaponSpecial } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreEnginev3 } from "../dependenciesultras/CoreEnginev3";
import { CoreUltrav3 } from "../dependenciesultras/CoreUltrav3";
import { UltraGeneral } from "../dependenciesultras/UltraGeneral";

const Engine = CoreEnginev3.instance;
const Ultra = new CoreUltrav3();

export class KolrSoloLich {
    private static get adv(): CoreAdvanced {
        return new CoreAdvanced();
    }

    private static readonly map = "flameusurper";
    private static readonly boss = "Kolr, Usurper of Flames";
    private static readonly completionItem = "Choronzonite";
    private static readonly felicitousPhiltre = "Felicitous Philtre";
    private static readonly dailyQuest = 10715;

    private _rotationStep: number = 0;
    private _finalPhaseStartedAt: number = 0;
    private _finalRecoveryUsed: boolean = false;
    private _lastPhase = "";
    private _rotationMode = "";
    private _emergencyRecovery: boolean = false;

    prepareLich(): void {
        if (!Core.checkInventory("Lich")) {
            bot.stop();
            return;
        }

        Core.equip("Lich");
        bot.sleep(1500);

        if (!(bot.player.currentClass?.toLowerCase() === "Lich"?.toLowerCase())) {
            bot.stop();
            return;
        }

        KolrSoloLich.adv.enhanceEquipped(EnhancementType.Lucky, {
            hSpecial: HelmSpecial.Examen,
            wSpecial: WeaponSpecial.Elysium,
            cSpecial: CapeSpecial.Penitence,
        });
        bot.sleep(2500);
    }

    prepareFelicitousPhiltre(): void {
        if (bot.shouldExit) {
            return;
        }

        if (!Core.checkInventory(KolrSoloLich.felicitousPhiltre, 15)) {
            const voucher = "Gold Voucher 100k";
            const shopId = 2036;
            const shopMap = "alchemyacademy";

            Core.logger("[Kolr Solo] Felicitous Philtre is required; stocking 25 from Gebo Shop.");

            if (!Core.checkInventory(voucher, 2)) {
                Core.buyItem(shopMap, shopId, voucher, 2);
            }

            if (Core.checkInventory(voucher, 2)) {
                Core.buyItem(shopMap, shopId, KolrSoloLich.felicitousPhiltre, 25);
            }
        }

        if (!Core.checkInventory(KolrSoloLich.felicitousPhiltre, 15)) {
            Core.logger("[Kolr Solo] Felicitous Philtre is required but could not be obtained. Stopping.", undefined, {
                messageBox: true,
                stopBot: true,
            });
            return;
        }

        if (!bot.inventory.isEquipped(KolrSoloLich.felicitousPhiltre)) {
            bot.inventory.equipUsableItem(KolrSoloLich.felicitousPhiltre);
            bot.wait.forTrue(() => bot.inventory.isEquipped(KolrSoloLich.felicitousPhiltre), 20);
        }

        if (!bot.inventory.isEquipped(KolrSoloLich.felicitousPhiltre)) {
            Core.logger("[Kolr Solo] Felicitous Philtre is required but could not be equipped. Stopping.", undefined, {
                messageBox: true,
                stopBot: true,
            });
            return;
        }

        Core.logger("[Kolr Solo] Felicitous Philtre equipped in slot 6.");
    }

    run(): void {
        if (bot.shouldExit) {
            return;
        }

        Core.addDrop(KolrSoloLich.completionItem);

        if (!bot.quests.isInProgress(KolrSoloLich.dailyQuest) && !bot.quests.isDailyComplete(KolrSoloLich.dailyQuest)) {
            UltraGeneral.ensureAcceptOnce(bot, KolrSoloLich.dailyQuest);
        }

        if (!bot.quests.isInProgress(KolrSoloLich.dailyQuest)) {
            Core.logger("[Kolr Solo] Dulcify is already complete for today.");
            return;
        }

        this.resetEncounterState();
        if (!this.fightOnce()) {
            return;
        }

        if (bot.quests.isInProgress(KolrSoloLich.dailyQuest) && bot.tempInv.contains(KolrSoloLich.completionItem, 1)) {
            Core.logger("[Kolr Solo] Completing the Dulcify daily.");
            Ultra.persistentJoinHouse();
            UltraGeneral.completeQuest(bot, KolrSoloLich.dailyQuest);
            bot.sleep(1500);
        }

        Core.logger("[Kolr Solo] Daily run complete.");
    }

    private resetEncounterState(): void {
        this._rotationStep = 0;
        this._finalPhaseStartedAt = 0;
        this._finalRecoveryUsed = false;
        this._lastPhase = "";
        this._rotationMode = "";
        this._emergencyRecovery = false;
    }

    private fightOnce(): boolean {
        if (bot.shouldExit) {
            return false;
        }

        Core.join(KolrSoloLich.map);
        Engine.chooseBestCellOneMonster(KolrSoloLich.boss);
        bot.player.setSpawnPoint();
        Engine.disableSkills();
        // This fight uses the phase-aware rotation below.
        bot.sleep(1500);
        let bossWasEngaged = false;

        while (!bot.shouldExit) {
            if (bossWasEngaged && (!bot.player.hasTarget || (bot.player.target?.hp ?? 1) <= 0)) {
                Engine.disableSkills();
                bot.sleep(1200);
                // Allow configured drops to be picked up.
                return true;
            }

            if (!bot.player.alive) {
                bot.wait.forTrue(() => bot.player.alive, 20);
                this._rotationStep = 0;
                this._finalPhaseStartedAt = 0;
                this._finalRecoveryUsed = false;
                this._rotationMode = "";
                this._emergencyRecovery = false;
                bossWasEngaged = false;
                bot.sleep(1000);
                continue;
            }

            if (bot.player.target?.name !== KolrSoloLich.boss) {
                bot.combat.attack(KolrSoloLich.boss);
                bot.sleep(250);
                continue;
            }

            bossWasEngaged = true;

            this.maintainFelicitousPhiltre();
            this.runPhaseAwareRotation();
            bot.sleep(this.isReflectPhase() ? 225 : 100);
        }

        return false;
    }

    private maintainFelicitousPhiltre(): void {
        if (KolrSoloLich.selfHasAura(KolrSoloLich.felicitousPhiltre)) {
            return;
        }

        if (
            !Core.checkInventory(KolrSoloLich.felicitousPhiltre, 1) ||
            !bot.inventory.isEquipped(KolrSoloLich.felicitousPhiltre)
        ) {
            Core.logger("[Kolr Solo] Felicitous Philtre ran out or became unequipped. Stopping.", undefined, {
                messageBox: true,
                stopBot: true,
            });
            return;
        }

        if (!bot.skills.canUseSkill(5)) {
            return;
        }

        bot.skills.useSkill(5);
        Core.logger("[Kolr Solo] Refreshed Felicitous Philtre.");
    }

    private runPhaseAwareRotation(): void {
        const phase = this.getPhaseName();
        if (!(phase === this._lastPhase)) {
            this._lastPhase = phase;
            this._rotationStep = 0;
            this._rotationMode = "";
            this._emergencyRecovery = false;
        }

        // At 10%, Kolr becomes invulnerable and applies a lethal max-HP DoT.
        // Let the Lich passive absorb the dangerous part, then use empowered
        // Wither as soon as Kolr can take damage again.
        if (KolrSoloLich.targetHasAura("Invulnerable") || KolrSoloLich.targetHasAura("Meltdown")) {
            if (this._finalPhaseStartedAt === 0) {
                this._finalPhaseStartedAt = Date.now();
            }

            if (!KolrSoloLich.targetHasAura("Invulnerable") && !this._finalRecoveryUsed) {
                this.useEmpowered(2);
                // Skill 3: Wither (lifesteal).
                this._finalRecoveryUsed = true;
            }
            return;
        }

        if (this._finalPhaseStartedAt > 0 && !this._finalRecoveryUsed) {
            this.useEmpowered(2);
            this._finalRecoveryUsed = true;
            return;
        }

        const phaseOne = KolrSoloLich.targetHasAura("Flames of Maleno");
        const phaseFour = KolrSoloLich.targetHasAura("Flames of Rubedo");
        const putrefaction = KolrSoloLich.selfHasAura("Putrefaction");
        const hpRatio = bot.player.maxHealth > 0 ? bot.player.health / bot.player.maxHealth : 0;

        // Phase 1 is the only phase that continuously reacts to an aura. Do not
        // use Vital Sacrifice while healing is inverted or HP lacks a safe
        // margin. Outside phase 1, avoid switching on every heal tick.
        if (phaseOne && (putrefaction || hpRatio < 0.8)) {
            this.setRotationMode(
                "Recovery-P1",
                putrefaction ? "Putrefaction active" : `low HP (${bot.player.health}/${bot.player.maxHealth})`,
            );
            this.runSequence([4, 2, 4, 1, 2]);
            return;
        }

        if (phaseOne) {
            this.setRotationMode("Damage-P1", "Putrefaction absent and HP safe");
            this.runSequence([4, 3, 4, 2, 4, 1]);
            return;
        }

        // Emergency recovery uses hysteresis: enter only below 25% HP and stay
        // there until 50%. This prevents the rapid mode oscillation seen when a
        // single threshold was checked after every healing tick.
        if (!this._emergencyRecovery && hpRatio < 0.25) {
            this._emergencyRecovery = true;
        } else if (this._emergencyRecovery && hpRatio >= 0.5) {
            this._emergencyRecovery = false;
        }

        if (this._emergencyRecovery) {
            this.setRotationMode(
                phaseFour ? "Emergency-P4" : "Emergency",
                `critical HP (${bot.player.health}/${bot.player.maxHealth})`,
            );
            this.runSequence(phaseFour ? [4, 2, 4, 1, 2] : [4, 2, 4, 1]);
            return;
        }

        this.setRotationMode(phaseFour ? "Damage-P4" : "Damage", "fixed damage rotation");

        // Damage loop: 54 -> 53 -> 52. Rubedo adds another 53 for sustain.
        if (phaseFour) {
            this.runSequence([4, 3, 4, 2, 4, 1, 4, 2]);
        } else {
            this.runSequence([4, 3, 4, 2, 4, 1]);
        }
    }

    private setRotationMode(mode: string, reason: string): void {
        if (mode === this._rotationMode) {
            return;
        }

        const previousMode = this._rotationMode;
        const previousStep = this._rotationStep;
        this._rotationMode = mode;
        this._rotationStep = 0;

        // Preserve an already-empowered follow-up when safety changes between
        // skill 5 and its paired skill. Resetting to another 5 here would delay
        // the heal until its cooldown ended.
        const enteringSafetyMode = mode.startsWith("Recovery") || mode.startsWith("Emergency");
        const leavingSafetyMode = previousMode.startsWith("Recovery") || previousMode.startsWith("Emergency");

        if (enteringSafetyMode && previousMode.startsWith("Damage")) {
            if (previousStep === 5) {
                this._rotationStep = 3;
            } else if (previousStep === 1 || previousStep === 3 || previousStep === 7) {
                this._rotationStep = 1;
            }
            // Continue to skill 3.
        } else if (mode.startsWith("Damage") && leavingSafetyMode) {
            if (previousStep === 3) {
                this._rotationStep = 5;
            } else if (previousStep === 1 || previousStep === 4) {
                this._rotationStep = 3;
            }
            // Continue to skill 3.
        }
    }

    private runSequence(sequence: number[]): void {
        if (this._rotationStep >= sequence.length) {
            this._rotationStep = 0;
        }

        const skill = sequence[this._rotationStep];
        if (!bot.skills.canUseSkill(skill)) {
            return;
        }

        bot.skills.useSkill(skill);
        this._rotationStep = (this._rotationStep + 1) % sequence.length;
    }

    private useEmpowered(skill: number): void {
        if (bot.skills.canUseSkill(4)) {
            bot.skills.useSkill(4);
            bot.sleep(150);
        }

        if (bot.skills.canUseSkill(skill)) {
            bot.skills.useSkill(skill);
        }
    }

    private isReflectPhase(): boolean {
        return KolrSoloLich.targetHasAura("Flames of Citrinitas") || KolrSoloLich.targetHasAura("Burning Ward");
    }

    private getPhaseName(): string {
        if (KolrSoloLich.targetHasAura("Invulnerable") || KolrSoloLich.targetHasAura("Meltdown")) {
            return "Phase 5 (Forges)";
        }
        if (KolrSoloLich.targetHasAura("Flames of Rubedo")) {
            return "Phase 4 (Rubedo)";
        }
        if (KolrSoloLich.targetHasAura("Flames of Citrinitas")) {
            return "Phase 3 (Citrinitas/reflect)";
        }
        if (KolrSoloLich.targetHasAura("Flames of Albedo")) {
            return "Phase 2 (Albedo/purge)";
        }
        if (KolrSoloLich.targetHasAura("Flames of Maleno")) {
            return "Phase 1 (Maleno/Putrefaction)";
        }
        return "transition/unknown phase";
    }

    private static targetHasAura(name: string): boolean {
        return bot.target?.auras?.some((a) => a != null && a.name.toLowerCase() === name.toLowerCase()) === true;
    }

    private static selfHasAura(name: string): boolean {
        return bot.self.auras?.some((a) => a != null && a.name.toLowerCase() === name.toLowerCase()) === true;
    }
}

export default function main(): void {
    const script = new KolrSoloLich();
    Core.setOptions(true);

    try {
        Engine.boot();
        script.prepareLich();
        script.prepareFelicitousPhiltre();
        script.run();
    } finally {
        Engine.disableSkills();

        Core.setOptions(false);
    }
}
