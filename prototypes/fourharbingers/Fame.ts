/*
name: Fame
description: null
tags: four harbingers, fourharbingers, fame, boss, farm, signet of the filled chalice, lonewolf12
*/
// Port of Scripts/Prototypes/FourHarbingers/Fame.cs.

import { bot, choices, defineScriptOptions, option } from "turu";
import { CapeSpecial, CoreAdvanced, EnhancementType, HelmSpecial, WeaponSpecial } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreFourHarbingers, FarmMode } from "./CoreFourHarbingers";

const Adv = new CoreAdvanced();
const FH = new CoreFourHarbingers();

export enum ClassChoice {
    Yami_no_Ronin = "Yami_no_Ronin",
    Verus_DoomKnight = "Verus_DoomKnight",
}

export class Fame {
    /** Set by the Do All script: skips setOptions and uses the overrides below. */
    doAllMode = false;

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
        FH.addDrops("Scroll of the Benevolent", "Scroll of the Quartet", "Signet of the Filled Chalice");
        Core.registerQuests(10852);
        FH.returnToSafeRoom();

        if (!this.validateClassRequirements()) {
            return;
        }

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
            10852,
            this.fightBoss.bind(this),
            this.restockPotions.bind(this),
            FH.getFarmMode(this.doAllMode, this.farmModeOverride),
            FH.getFarmQuantity(this.doAllMode, this.farmQuantityOverride),
            FH.getFarmItem(this.doAllMode, this.farmItemOverride),
        );
    }

    private fightBoss(): boolean {
        FH.stopSkills();
        let signetObtained = false;

        try {
            Core.join("fourharbingers-100000", "r4", "Bottom");

            while (!bot.shouldExit && !bot.tempInv.contains("Signet of the Filled Chalice")) {
                if (!bot.player.alive) {
                    bot.wait.forTrue(() => bot.player.alive, 20);
                    continue;
                }

                if (!FH.ensureBossRoom("r4", "Bottom")) {
                    continue;
                }

                if (!bot.player.hasTarget || bot.player.target == null || bot.player.target.mapId !== 3) {
                    bot.combat.attack(3);
                }

                this.useSkills();
                FH.refreshPotion("Felicitous Philtre", "Felicitous Philtre");
                bot.sleep(100);
            }

            signetObtained = bot.tempInv.contains("Signet of the Filled Chalice");
            bot.combat.cancelAutoAttack();
            if (signetObtained && !bot.shouldExit && bot.self.hasActiveAura("Starvation")) {
                Core.logger("Waiting for Starvation to expire before fighting Fame again.");
                bot.wait.forTrue(() => !bot.self.hasActiveAura("Starvation"), 20);
            }
        } finally {
            bot.combat.cancelAutoAttack();
        }

        return signetObtained;
    }

    private useSkills(): void {
        if (this.getSelectedClass() === "Yami no Ronin") {
            if (bot.skills.canUseSkill(3)) {
                bot.skills.useSkill(3);
            } else if (bot.skills.canUseSkill(2)) {
                bot.skills.useSkill(2);
            } else if (bot.skills.canUseSkill(1)) {
                bot.skills.useSkill(1);
            }
        } else {
            if (bot.skills.canUseSkill(2)) {
                bot.skills.useSkill(2);
            } else if (bot.skills.canUseSkill(1)) {
                bot.skills.useSkill(1);
            } else if (bot.skills.canUseSkill(3)) {
                bot.skills.useSkill(3);
            } else if (bot.skills.canUseSkill(4)) {
                bot.skills.useSkill(4);
            }
        }
    }

    private getSelectedClass(): string {
        if (this.doAllMode) {
            return "Yami no Ronin";
        }

        const classChoice = bot.config!.get<ClassChoice>("ClassChoice");
        if (classChoice === ClassChoice.Yami_no_Ronin) {
            return "Yami no Ronin";
        } else if (classChoice === ClassChoice.Verus_DoomKnight) {
            return "Verus DoomKnight";
        } else {
            return "Yami no Ronin";
        }
    }

    private validateClassRequirements(): boolean {
        if (this.getSelectedClass() !== "Verus DoomKnight") {
            return true;
        }

        if (Adv.uDauntless()) {
            return true;
        }

        Core.logger("WARNING: Verus DoomKnight requires Dauntless for this fight. The script will stop.", undefined, {
            messageBox: true,
        });
        return false;
    }

    private applyEnhancements(): void {
        let weaponEnhancement: WeaponSpecial;
        let helmEnhancement = HelmSpecial.None;
        let capeEnhancement = CapeSpecial.None;

        if (this.getSelectedClass() === "Yami no Ronin") {
            if (Adv.uValiance()) {
                weaponEnhancement = WeaponSpecial.Valiance;
            } else {
                FH.warnEnhancementFallback("Valiance is not unlocked. Health Vamp will be used instead.");
                weaponEnhancement = WeaponSpecial.Health_Vamp;
            }

            if (Adv.uVim()) {
                helmEnhancement = HelmSpecial.Vim;
            } else {
                FH.warnEnhancementFallback("Vim is not unlocked. Lucky will be used on the helm instead.");
            }
        } else {
            weaponEnhancement = WeaponSpecial.Dauntless;

            if (Adv.uAnima()) {
                helmEnhancement = HelmSpecial.Anima;
            } else {
                FH.warnEnhancementFallback("Anima is not unlocked. Lucky will be used on the helm instead.");
            }
        }

        if (Adv.uAvarice()) {
            capeEnhancement = CapeSpecial.Avarice;
        } else {
            FH.warnEnhancementFallback("Avarice is not unlocked. Lucky will be used on the cape instead.");
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
        FH.getPotion("Potent Battle Elixir", "Gold Voucher 500k", 4, 500000, 8);
        FH.getPotion("Felicitous Philtre", "Gold Voucher 100k", 8, 100000, 100);
    }

    private usePotions(): void {
        FH.usePotion("Fate Tonic", "Fate");
        FH.usePotion("Potent Battle Elixir", "Potent Battle Elixir");
        FH.usePotion("Felicitous Philtre", "Felicitous Philtre");
    }

    private restockPotions(): void {
        if (!FH.usePotionsEnabled()) {
            return;
        }
        FH.restockPotions(
            ["Fate Tonic", "Potent Battle Elixir", "Felicitous Philtre"],
            this.getPotions.bind(this),
            this.usePotions.bind(this),
        );
    }
}

export const scriptOptions = defineScriptOptions(
    "FourHarbingers_Fame_v2",
    [
        option.choice(
            "ClassChoice",
            "Use Class",
            "Class used to fight Fame.",
            choices(ClassChoice),
            ClassChoice.Yami_no_Ronin,
        ),
        option.bool("UsePotions", "Use Potions", "Use potions during the fight.", true),
        option.bool("DoEnhancements", "Do Enhancements", "Apply the class enhancements before fighting.", true),
        option.int(
            "FarmQuantity",
            "Farm Fame Amount of Times",
            "0 farms indefinitely. Any positive number farms that many quest completions.",
            0,
        ),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    new Fame().scriptMain();
}
