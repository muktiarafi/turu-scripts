/*
name: Kolr Solo Lich Farm
description: Repeatedly solo Kolr with post-potion-patch Elysium Lich and required Felicitous Philtre until stopped.
tags: kolr, solo, lich, ultra, farm
*/
// Port of Scripts/Ultrasv3/ChallengeBosses/KolrSoloLichFarm.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.
//
// Turu: C#'s RefreshFbsMute (VibeSkua's FBS plugin mute file) is left out; Turu has no such plugin.

import { bot } from "turu";
import { CapeSpecial, CoreAdvanced, EnhancementType, HelmSpecial, WeaponSpecial } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreEnginev3 } from "../dependenciesultras/CoreEnginev3";

const Engine = CoreEnginev3.instance;

export class KolrSoloLichFarm {
    private static get adv(): CoreAdvanced {
        return new CoreAdvanced();
    }
    private static readonly map = "flameusurper";
    private static readonly boss = "Kolr, Usurper of Flames";
    private static readonly farmDrop = "Great Flame of Yew";
    private static readonly felicitousPhiltre = "Felicitous Philtre";

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

        KolrSoloLichFarm.adv.enhanceEquipped(EnhancementType.Lucky, {
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

        if (!Core.checkInventory(KolrSoloLichFarm.felicitousPhiltre, 15)) {
            const voucher = "Gold Voucher 100k";
            const shopId = 2036;
            const shopMap = "alchemyacademy";

            if (!Core.checkInventory(voucher, 2)) {
                Core.buyItem(shopMap, shopId, voucher, 2);
            }

            if (Core.checkInventory(voucher, 2)) {
                Core.buyItem(shopMap, shopId, KolrSoloLichFarm.felicitousPhiltre, 25);
            }
        }

        if (!Core.checkInventory(KolrSoloLichFarm.felicitousPhiltre, 15)) {
            bot.stop();
            return;
        }

        if (!bot.inventory.isEquipped(KolrSoloLichFarm.felicitousPhiltre)) {
            bot.inventory.equipUsableItem(KolrSoloLichFarm.felicitousPhiltre);
            bot.wait.forTrue(() => bot.inventory.isEquipped(KolrSoloLichFarm.felicitousPhiltre), 20);
        }

        if (!bot.inventory.isEquipped(KolrSoloLichFarm.felicitousPhiltre)) {
            bot.stop();
            return;
        }
    }

    run(): void {
        if (bot.shouldExit) {
            return;
        }

        Core.addDrop(KolrSoloLichFarm.farmDrop);
        let successfulKills = 0;

        while (!bot.shouldExit) {
            this.prepareFelicitousPhiltre();
            if (bot.shouldExit) {
                return;
            }

            this.resetEncounterState();
            if (!this.fightOnce()) {
                return;
            }

            successfulKills++;
            Core.logger(
                `[Kolr Farm] Kolr kills: ${successfulKills}. ` +
                    `${KolrSoloLichFarm.farmDrop}: ${bot.inventory.getQuantity(KolrSoloLichFarm.farmDrop)}.`,
            );

            // Leave the encounter so the next join creates a fresh fight.
            Core.join("Whitemap");
            bot.sleep(1000);
        }
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

        Core.join(KolrSoloLichFarm.map);
        Engine.chooseBestCellOneMonster(KolrSoloLichFarm.boss);
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

            if (bot.player.target?.name !== KolrSoloLichFarm.boss) {
                bot.combat.attack(KolrSoloLichFarm.boss);
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
        if (KolrSoloLichFarm.selfHasAura(KolrSoloLichFarm.felicitousPhiltre)) {
            return;
        }

        if (
            !Core.checkInventory(KolrSoloLichFarm.felicitousPhiltre, 1) ||
            !bot.inventory.isEquipped(KolrSoloLichFarm.felicitousPhiltre)
        ) {
            bot.stop();
            return;
        }

        if (!bot.skills.canUseSkill(5)) {
            return;
        }

        bot.skills.useSkill(5);
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
        if (KolrSoloLichFarm.targetHasAura("Invulnerable") || KolrSoloLichFarm.targetHasAura("Meltdown")) {
            if (this._finalPhaseStartedAt === 0) {
                this._finalPhaseStartedAt = Date.now();
            }

            if (!KolrSoloLichFarm.targetHasAura("Invulnerable") && !this._finalRecoveryUsed) {
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

        const phaseOne = KolrSoloLichFarm.targetHasAura("Flames of Maleno");
        const phaseFour = KolrSoloLichFarm.targetHasAura("Flames of Rubedo");
        const putrefaction = KolrSoloLichFarm.selfHasAura("Putrefaction");
        const hpRatio = bot.player.maxHealth > 0 ? bot.player.health / bot.player.maxHealth : 0;

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

        const enteringSafetyMode = mode.startsWith("Recovery") || mode.startsWith("Emergency");
        const leavingSafetyMode = previousMode.startsWith("Recovery") || previousMode.startsWith("Emergency");

        if (enteringSafetyMode && previousMode.startsWith("Damage")) {
            if (previousStep === 5) {
                this._rotationStep = 3;
            } else if (previousStep === 1 || previousStep === 3 || previousStep === 7) {
                this._rotationStep = 1;
            }
        } else if (mode.startsWith("Damage") && leavingSafetyMode) {
            if (previousStep === 3) {
                this._rotationStep = 5;
            } else if (previousStep === 1 || previousStep === 4) {
                this._rotationStep = 3;
            }
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
        return KolrSoloLichFarm.targetHasAura("Flames of Citrinitas") || KolrSoloLichFarm.targetHasAura("Burning Ward");
    }

    private getPhaseName(): string {
        if (KolrSoloLichFarm.targetHasAura("Invulnerable") || KolrSoloLichFarm.targetHasAura("Meltdown")) {
            return "Phase 5 (Forges)";
        }
        if (KolrSoloLichFarm.targetHasAura("Flames of Rubedo")) {
            return "Phase 4 (Rubedo)";
        }
        if (KolrSoloLichFarm.targetHasAura("Flames of Citrinitas")) {
            return "Phase 3 (Citrinitas/reflect)";
        }
        if (KolrSoloLichFarm.targetHasAura("Flames of Albedo")) {
            return "Phase 2 (Albedo/purge)";
        }
        if (KolrSoloLichFarm.targetHasAura("Flames of Maleno")) {
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
    const script = new KolrSoloLichFarm();
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
