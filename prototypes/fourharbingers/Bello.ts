/*
name: Bello
description: null
tags: four harbingers, fourharbingers, bello, boss, farm, signet of the endless journey, lonewolf12
*/
// Port of Scripts/Prototypes/FourHarbingers/Bello.cs.

import { bot, choices, defineScriptOptions, option, SkillUseMode } from "turu";
import { CapeSpecial, CoreAdvanced, EnhancementType, HelmSpecial, WeaponSpecial } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreFourHarbingers, FarmMode } from "./CoreFourHarbingers";

const Adv = new CoreAdvanced();
const FH = new CoreFourHarbingers();

export enum ClassChoice {
    ArchPaladin = "ArchPaladin",
    Chaos_Avenger = "Chaos_Avenger",
}

export class Bello {
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
        FH.addDrops(
            "Infernal Winged Manticore",
            "Manticore of Malice",
            "Scroll of the Preacher",
            "Scroll of the Quartet",
            "Signet of the Endless Journey",
        );
        Core.registerQuests(10851);
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
            10851,
            this.fightBoss.bind(this),
            this.restockPotions.bind(this),
            FH.getFarmMode(this.doAllMode, this.farmModeOverride),
            FH.getFarmQuantity(this.doAllMode, this.farmQuantityOverride),
            FH.getFarmItem(this.doAllMode, this.farmItemOverride),
        );
    }

    private fightBoss(): boolean {
        try {
            Core.join("fourharbingers-100000", "r3", "Bottom");
            bot.skills.resume();

            if (this.getSelectedClass() === "ArchPaladin") {
                bot.skills.startSkills("3 | 2 | 1", 250, SkillUseMode.UseIfAvailable);
            } else {
                bot.skills.startSkills("3 | 4 | 2 | 1", 250, SkillUseMode.UseIfAvailable);
            }

            while (!bot.shouldExit && !bot.tempInv.contains("Signet of the Endless Journey")) {
                if (!bot.player.alive) {
                    bot.wait.forTrue(() => bot.player.alive, 20);
                    continue;
                }

                if (!FH.ensureBossRoom("r3", "Bottom")) {
                    continue;
                }

                if (!bot.player.hasTarget || bot.player.target == null || bot.player.target.mapId !== 2) {
                    bot.combat.attack(2);
                }

                if (this.getSelectedClass() === "ArchPaladin") {
                    this.archPaladinMechanics();
                }

                FH.refreshPotion("Felicitous Philtre", "Felicitous Philtre");
                bot.sleep(100);
            }
        } finally {
            bot.combat.cancelAutoAttack();
            bot.skills.resume();
        }

        return bot.tempInv.contains("Signet of the Endless Journey");
    }

    private archPaladinMechanics(): void {
        const righteousSeal = bot.target.getAuraSnapshot("Righteous Seal");
        if (righteousSeal != null && righteousSeal.remainingTime < 1 && bot.skills.canUseSkill(4)) {
            bot.skills.useSkill(4);
        }
    }

    private getSelectedClass(): string {
        if (this.doAllMode) {
            return "ArchPaladin";
        }

        const classChoice = bot.config!.get<ClassChoice>("ClassChoice");
        if (classChoice === ClassChoice.ArchPaladin) {
            return "ArchPaladin";
        } else if (classChoice === ClassChoice.Chaos_Avenger) {
            return "Chaos Avenger";
        } else {
            return "ArchPaladin";
        }
    }

    private applyEnhancements(): void {
        let weaponEnhancement: WeaponSpecial;
        let helmEnhancement = HelmSpecial.None;
        let capeEnhancement = CapeSpecial.None;

        if (Adv.uValiance()) {
            weaponEnhancement = WeaponSpecial.Valiance;
        } else {
            FH.warnEnhancementFallback("Valiance is not unlocked. Health Vamp will be used instead.");
            weaponEnhancement = WeaponSpecial.Health_Vamp;
        }

        if (Adv.uForgeHelm()) {
            helmEnhancement = HelmSpecial.Forge;
        } else {
            FH.warnEnhancementFallback("Forge helm is not unlocked. Lucky will be used on the helm instead.");
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
        if (this.getSelectedClass() === "ArchPaladin") {
            FH.getPotion("Fate Tonic", "Gold Voucher 500k", 4, 500000, 10, 8);
        } else {
            FH.getPotion("Might Tonic", "Gold Voucher 500k", 2, 500000, 10, 8);
        }

        FH.getPotion("Potent Battle Elixir", "Gold Voucher 500k", 4, 500000, 8);
        FH.getPotion("Felicitous Philtre", "Gold Voucher 100k", 8, 100000, 100);
    }

    private usePotions(): void {
        if (this.getSelectedClass() === "ArchPaladin") {
            FH.usePotion("Fate Tonic", "Fate");
        } else {
            FH.usePotion("Might Tonic", "Might");
        }

        FH.usePotion("Potent Battle Elixir", "Potent Battle Elixir");
        FH.usePotion("Felicitous Philtre", "Felicitous Philtre");
    }

    private restockPotions(): void {
        if (!FH.usePotionsEnabled()) {
            return;
        }
        if (this.getSelectedClass() === "ArchPaladin") {
            FH.restockPotions(
                ["Fate Tonic", "Potent Battle Elixir", "Felicitous Philtre"],
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
    "FourHarbingers_Bello_v2",
    [
        option.choice(
            "ClassChoice",
            "Use Class",
            "Class used to fight Bello.",
            choices(ClassChoice),
            ClassChoice.ArchPaladin,
        ),
        option.bool("UsePotions", "Use Potions", "Use potions during the fight.", true),
        option.bool("DoEnhancements", "Do Enhancements", "Apply the class enhancements before fighting.", true),
        option.int(
            "FarmQuantity",
            "Farm Bello Amount of Times",
            "0 farms indefinitely. Any positive number farms that many quest completions.",
            0,
        ),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    new Bello().scriptMain();
}
