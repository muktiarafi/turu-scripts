/*
name: UltraEnhancements
description: Centralised enhancement presets for all Ultra boss scripts.
tags: ultra, enhancements
*/
// Port of Scripts/Ultrasv3/DependenciesUltras/UltraEnhancements.cs.

import { bot } from "turu";
import { CapeSpecial, CoreAdvanced, EnhancementType, HelmSpecial, WeaponSpecial } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class UltraEnhancements {
    /**
     * Applies the recommended enhancement preset for the currently equipped class.
     * Falls back to SmartEnhance if the class has no explicit preset.
     */
    apply(): void {
        const className = bot.player?.currentClass ?? "";
        if (!className) {
            return;
        }

        Core.logger(`[UltraEnhancements] Enhancing for: ${className}`);

        switch (className) {
            // ── Taunters / Support ────────────────────────────────────────────
            case "ArchPaladin":
                Adv.enhanceEquipped(EnhancementType.Fighter, {
                    hSpecial: HelmSpecial.Forge,
                    wSpecial: WeaponSpecial.Valiance,
                    cSpecial: CapeSpecial.Absolution,
                });
                break;
            case "Lord of Order":
                Adv.enhanceEquipped(EnhancementType.Fighter, {
                    wSpecial: Adv.uArcanasConcerto() ? WeaponSpecial.Arcanas_Concerto : WeaponSpecial.Awe_Blast,
                    cSpecial: CapeSpecial.Absolution,
                });
                break;
            case "StoneCrusher":
                Adv.enhanceEquipped(EnhancementType.Fighter, {
                    hSpecial: HelmSpecial.Anima,
                    wSpecial: WeaponSpecial.Valiance,
                    cSpecial: CapeSpecial.Absolution,
                });
                break;
            case "Verus DoomKnight":
                Adv.enhanceEquipped(EnhancementType.Fighter, {
                    hSpecial: HelmSpecial.Forge,
                    wSpecial: WeaponSpecial.Lacerate,
                    cSpecial: CapeSpecial.Lament,
                });
                break;
            case "King's Echo":
                Adv.enhanceEquipped(EnhancementType.Healer, {
                    hSpecial: HelmSpecial.Examen,
                    wSpecial: Adv.uElysium() ? WeaponSpecial.Elysium : WeaponSpecial.Mana_Vamp,
                    cSpecial: CapeSpecial.Lament,
                });
                break;
            case "Dragon of Time":
                Adv.enhanceEquipped(EnhancementType.Healer, {
                    wSpecial: WeaponSpecial.Elysium,
                    cSpecial: CapeSpecial.Vainglory,
                });
                break;
            case "Arachnomancer":
                Adv.enhanceEquipped(EnhancementType.Fighter, { wSpecial: WeaponSpecial.Health_Vamp });
                break;
            case "Void Highlord":
                Adv.enhanceEquipped(EnhancementType.Fighter, {
                    hSpecial: HelmSpecial.Anima,
                    wSpecial: WeaponSpecial.Ravenous,
                    cSpecial: CapeSpecial.Lament,
                });
                break;
            case "ArchFiend":
                Adv.enhanceEquipped(EnhancementType.Healer, {
                    hSpecial: HelmSpecial.Forge,
                    wSpecial: WeaponSpecial.Valiance,
                    cSpecial: CapeSpecial.Lament,
                });
                break;
            case "Scion of Flames":
                Adv.enhanceEquipped(EnhancementType.Healer, {
                    wSpecial: WeaponSpecial.Valiance,
                    cSpecial: CapeSpecial.Lament,
                });
                break;
            case "Chaos Avenger":
                Adv.enhanceEquipped(EnhancementType.Lucky, {
                    hSpecial: HelmSpecial.Anima,
                    wSpecial: WeaponSpecial.Dauntless,
                    cSpecial: CapeSpecial.Vainglory,
                });
                break;
            default:
                Core.logger(`[UltraEnhancements] No preset for '${className}', using SmartEnhance.`);
                Adv.smartEnhance(className);
                break;
        }
    }

    applyTyndarius(): void {
        const className = bot.player?.currentClass ?? "";
        if (!className) {
            return;
        }

        Core.logger(`[UltraEnhancements] Tyndarius enhancing for: ${className}`);

        switch (className) {
            case "ArchPaladin":
                Adv.enhanceEquipped(EnhancementType.Fighter, { wSpecial: WeaponSpecial.Lacerate });
                break;
            case "Lord of Order":
                Adv.enhanceEquipped(EnhancementType.Fighter, {
                    wSpecial: WeaponSpecial.Awe_Blast,
                    cSpecial: CapeSpecial.Penitence,
                });
                break;
            case "Shaman":
                Adv.enhanceEquipped(EnhancementType.Healer, {
                    wSpecial: Adv.uElysium() ? WeaponSpecial.Elysium : WeaponSpecial.Mana_Vamp,
                    cSpecial: CapeSpecial.Lament,
                });
                break;
            case "StoneCrusher":
                Adv.enhanceEquipped(EnhancementType.Fighter, {
                    hSpecial: HelmSpecial.Forge,
                    wSpecial: WeaponSpecial.Valiance,
                    cSpecial: CapeSpecial.Penitence,
                });
                break;
            case "Arachnomancer":
                Adv.enhanceEquipped(EnhancementType.Fighter, { wSpecial: WeaponSpecial.Health_Vamp });
                break;
            case "Scion of Flames":
                Adv.enhanceEquipped(EnhancementType.Healer, { wSpecial: WeaponSpecial.Valiance });
                break;
            case "Dragon of Time":
                Adv.enhanceEquipped(EnhancementType.Healer, {
                    wSpecial: Adv.uElysium() ? WeaponSpecial.Elysium : WeaponSpecial.Mana_Vamp,
                });
                break;
            case "King's Echo":
                Adv.enhanceEquipped(EnhancementType.Healer, {
                    hSpecial: HelmSpecial.Examen,
                    wSpecial: Adv.uElysium() ? WeaponSpecial.Elysium : WeaponSpecial.Mana_Vamp,
                    cSpecial: CapeSpecial.Penitence,
                });
                break;
            case "Verus DoomKnight":
                Adv.enhanceEquipped(EnhancementType.Fighter, {
                    hSpecial: HelmSpecial.Forge,
                    wSpecial: WeaponSpecial.Lacerate,
                    cSpecial: CapeSpecial.Penitence,
                });
                break;
            case "ArchFiend":
                Adv.enhanceEquipped(EnhancementType.Healer, {
                    hSpecial: HelmSpecial.Forge,
                    wSpecial: WeaponSpecial.Valiance,
                });
                break;
            default:
                Core.logger(`[UltraEnhancements] No preset for '${className}', using SmartEnhance.`);
                Adv.smartEnhance(className);
                break;
        }
    }
    applyDage(): void {
        const className = bot.player?.currentClass ?? "";
        if (!className) {
            return;
        }

        Core.logger(`[UltraEnhancements] Dage enhancing for: ${className} using fixed Lucky preset`);

        switch (className) {
            case "ArchPaladin":
                Adv.enhanceEquipped(EnhancementType.Fighter, {
                    hSpecial: HelmSpecial.Anima,
                    wSpecial: WeaponSpecial.Health_Vamp,
                    cSpecial: CapeSpecial.Vainglory,
                });
                break;
            case "Lord of Order":
                Adv.enhanceEquipped(EnhancementType.Fighter, {
                    wSpecial: WeaponSpecial.Health_Vamp,
                    cSpecial: CapeSpecial.Vainglory,
                });
                break;
            case "StoneCrusher":
                Adv.enhanceEquipped(EnhancementType.Healer, {
                    wSpecial: WeaponSpecial.Health_Vamp,
                    cSpecial: CapeSpecial.Vainglory,
                });
                break;
            case "Verus DoomKnight":
                Adv.enhanceEquipped(EnhancementType.Fighter, {
                    hSpecial: HelmSpecial.Anima,
                    wSpecial: WeaponSpecial.Health_Vamp,
                    cSpecial: CapeSpecial.Lament,
                });
                break;
            case "King's Echo":
                Adv.enhanceEquipped(EnhancementType.Healer, {
                    hSpecial: HelmSpecial.Examen,
                    wSpecial: WeaponSpecial.Health_Vamp,
                    cSpecial: CapeSpecial.Lament,
                });
                break;
            default:
                Adv.enhanceEquipped(EnhancementType.Lucky, {
                    wSpecial: WeaponSpecial.Health_Vamp,
                    cSpecial: CapeSpecial.Vainglory,
                });
                break;
        }
    }

    applyDrakath(): void {
        const className = bot.player?.currentClass ?? "";
        if (!className) {
            return;
        }

        Core.logger(`[UltraEnhancements] Dage enhancing for: ${className} using fixed Lucky preset`);

        switch (className) {
            case "Lord of Order":
                Adv.enhanceEquipped(EnhancementType.Fighter, {
                    wSpecial: WeaponSpecial.Valiance,
                    cSpecial: CapeSpecial.Absolution,
                });
                break;
            case "StoneCrusher":
                Adv.enhanceEquipped(EnhancementType.Fighter, {
                    hSpecial: HelmSpecial.Anima,
                    wSpecial: WeaponSpecial.Awe_Blast,
                    cSpecial: CapeSpecial.Absolution,
                });
                break;
            case "Shaman":
                Adv.enhanceEquipped(EnhancementType.Healer, {
                    hSpecial: HelmSpecial.Forge,
                    wSpecial: Adv.uElysium() ? WeaponSpecial.Elysium : WeaponSpecial.Mana_Vamp,
                    cSpecial: CapeSpecial.Lament,
                });
                break;
            case "ArchPaladin":
                Adv.enhanceEquipped(EnhancementType.Fighter, {
                    hSpecial: HelmSpecial.Forge,
                    wSpecial: WeaponSpecial.Praxis,
                    cSpecial: CapeSpecial.Lament,
                });
                break;
            default:
                Core.logger(`[UltraEnhancements] No preset for '${className}', using SmartEnhance.`);
                Adv.smartEnhance(className);
                break;
        }
    }
    applyDarkon(): void {
        const className = bot.player?.currentClass ?? "";
        if (!className) {
            return;
        }

        Core.logger(`[UltraEnhancements] Dage enhancing for: ${className} using fixed Lucky preset`);

        switch (className) {
            case "Lord of Order":
                Adv.enhanceEquipped(EnhancementType.Fighter, {
                    wSpecial: WeaponSpecial.Awe_Blast,
                    cSpecial: CapeSpecial.Absolution,
                });
                break;
            case "StoneCrusher":
                Adv.enhanceEquipped(EnhancementType.Fighter, {
                    hSpecial: HelmSpecial.Anima,
                    wSpecial: WeaponSpecial.Valiance,
                    cSpecial: CapeSpecial.Absolution,
                });
                break;
            case "Verus DoomKnight":
                Adv.enhanceEquipped(EnhancementType.Fighter, {
                    wSpecial: WeaponSpecial.Lacerate,
                    cSpecial: CapeSpecial.Lament,
                });
                break;
            case "King's Echo":
                Adv.enhanceEquipped(EnhancementType.Healer, {
                    hSpecial: HelmSpecial.Examen,
                    wSpecial: Adv.uElysium() ? WeaponSpecial.Elysium : WeaponSpecial.Mana_Vamp,
                    cSpecial: CapeSpecial.Lament,
                });
                break;
            case "ArchPaladin":
                Adv.enhanceEquipped(EnhancementType.Fighter, {
                    hSpecial: HelmSpecial.Forge,
                    wSpecial: WeaponSpecial.Lacerate,
                    cSpecial: CapeSpecial.Absolution,
                });
                break;
            default:
                Core.logger(`[UltraEnhancements] No preset for '${className}', using SmartEnhance.`);
                Adv.smartEnhance(className);
                break;
        }
    }
    applySpeaker(): void {
        const className = bot.player?.currentClass ?? "";
        if (!className) {
            return;
        }

        Core.logger(`[UltraEnhancements] Dage enhancing for: ${className} using fixed Lucky preset`);

        switch (className) {
            case "ArchPaladin":
                Adv.enhanceEquipped(EnhancementType.Fighter, { wSpecial: WeaponSpecial.Lacerate });
                break;
            case "Lord of Order":
                Adv.enhanceEquipped(EnhancementType.Fighter, { wSpecial: WeaponSpecial.Valiance });
                break;
            case "StoneCrusher":
                Adv.enhanceEquipped(EnhancementType.Fighter, {
                    wSpecial: WeaponSpecial.Valiance,
                    cSpecial: CapeSpecial.Absolution,
                });
                break;
            case "Verus DoomKnight":
                Adv.enhanceEquipped(EnhancementType.Fighter, {
                    wSpecial: WeaponSpecial.Praxis,
                    cSpecial: CapeSpecial.Penitence,
                });
                break;
            case "Void Highlord":
                Adv.enhanceEquipped(EnhancementType.Fighter, { wSpecial: WeaponSpecial.Health_Vamp });
                break;
            case "King's Echo":
                Adv.enhanceEquipped(EnhancementType.Healer, {
                    hSpecial: HelmSpecial.Forge,
                    wSpecial: Adv.uElysium() ? WeaponSpecial.Elysium : WeaponSpecial.Mana_Vamp,
                    cSpecial: CapeSpecial.Lament,
                });
                break;
            default:
                Core.logger(`[UltraEnhancements] No preset for '${className}', using SmartEnhance.`);
                Adv.smartEnhance(className);
                break;
        }
    }

    applyGramiel(): void {
        const className = bot.player?.currentClass ?? "";
        if (!className) {
            return;
        }

        Core.logger(`[UltraEnhancements] Dage enhancing for: ${className} using fixed Lucky preset`);

        switch (className) {
            case "ArchPaladin":
                Adv.enhanceEquipped(EnhancementType.Fighter, {
                    hSpecial: HelmSpecial.Forge,
                    wSpecial: WeaponSpecial.Awe_Blast,
                    cSpecial: CapeSpecial.Lament,
                });
                break;
            case "Lord of Order":
                Adv.enhanceEquipped(EnhancementType.Fighter, { wSpecial: WeaponSpecial.Health_Vamp });
                break;
            case "StoneCrusher":
                Adv.enhanceEquipped(EnhancementType.Fighter, {
                    hSpecial: HelmSpecial.Forge,
                    wSpecial: Adv.uValiance() ? WeaponSpecial.Valiance : WeaponSpecial.Health_Vamp,
                    cSpecial: CapeSpecial.Absolution,
                });
                break;
            case "ArchFiend":
                Adv.enhanceEquipped(EnhancementType.Healer, { wSpecial: WeaponSpecial.Health_Vamp });
                break;
            case "Shaman":
                Adv.enhanceEquipped(EnhancementType.Healer, { wSpecial: WeaponSpecial.Mana_Vamp });
                break;
            case "Verus DoomKnight":
                Adv.enhanceEquipped(EnhancementType.Healer, {
                    hSpecial: HelmSpecial.Anima,
                    wSpecial: WeaponSpecial.Health_Vamp,
                    cSpecial: CapeSpecial.Lament,
                });
                break;
            default:
                Core.logger(`[UltraEnhancements] No preset for '${className}', using SmartEnhance.`);
                Adv.smartEnhance(className);
                break;
        }
    }

    applyNulgath(): void {
        const className = bot.player?.currentClass ?? "";
        if (!className) {
            return;
        }

        Core.logger(`[UltraEnhancements] Nulgath enhancing for: ${className}`);

        switch (className) {
            case "ArchPaladin":
                Adv.enhanceEquipped(EnhancementType.Fighter, {
                    hSpecial: HelmSpecial.Forge,
                    wSpecial: WeaponSpecial.Lacerate,
                    cSpecial: CapeSpecial.Absolution,
                });
                break;
            case "Lord of Order":
                Adv.enhanceEquipped(EnhancementType.Fighter, {
                    wSpecial: Adv.uArcanasConcerto() ? WeaponSpecial.Arcanas_Concerto : WeaponSpecial.Valiance,
                    cSpecial: CapeSpecial.Absolution,
                });
                break;
            case "StoneCrusher":
                Adv.enhanceEquipped(EnhancementType.Fighter, {
                    wSpecial: WeaponSpecial.Valiance,
                    cSpecial: CapeSpecial.Absolution,
                });
                break;
            case "Dragon of Time":
                Adv.enhanceEquipped(EnhancementType.Healer, {
                    wSpecial: Adv.uArcanasConcerto() ? WeaponSpecial.Elysium : WeaponSpecial.Valiance,
                    cSpecial: CapeSpecial.Vainglory,
                });
                break;
            case "Void Highlord":
                Adv.enhanceEquipped(EnhancementType.Fighter, {
                    hSpecial: HelmSpecial.Anima,
                    wSpecial: WeaponSpecial.Valiance,
                    cSpecial: CapeSpecial.Vainglory,
                });
                break;
            case "Scion of Flames":
                Adv.enhanceEquipped(EnhancementType.Healer, {
                    wSpecial: Adv.uArcanasConcerto() ? WeaponSpecial.Arcanas_Concerto : WeaponSpecial.Valiance,
                    cSpecial: CapeSpecial.Lament,
                });
                break;
            case "Arachnomancer":
                Adv.enhanceEquipped(EnhancementType.Fighter, { wSpecial: WeaponSpecial.Health_Vamp });
                break;
            case "Verus DoomKnight":
                Adv.enhanceEquipped(EnhancementType.Fighter, {
                    hSpecial: HelmSpecial.Forge,
                    wSpecial: WeaponSpecial.Lacerate,
                    cSpecial: CapeSpecial.Lament,
                });
                break;
            case "King's Echo":
                Adv.enhanceEquipped(EnhancementType.Healer, {
                    hSpecial: HelmSpecial.Examen,
                    wSpecial: Adv.uElysium() ? WeaponSpecial.Elysium : WeaponSpecial.Mana_Vamp,
                    cSpecial: CapeSpecial.Lament,
                });
                break;
            default:
                Core.logger(`[UltraEnhancements] No preset for '${className}', using SmartEnhance.`);
                Adv.smartEnhance(className);
                break;
        }
    }

    applyAstralEmpyrean(): void {
        const className = bot.player?.currentClass ?? "";
        if (!className) {
            return;
        }

        Core.logger(`[UltraEnhancements] AstralEmpyrean enhancing for: ${className}`);

        switch (className) {
            case "King's Echo":
                Adv.enhanceEquipped(EnhancementType.Lucky, {
                    hSpecial: HelmSpecial.Pneuma,
                    wSpecial: Adv.uElysium() ? WeaponSpecial.Elysium : WeaponSpecial.Mana_Vamp,
                    cSpecial: CapeSpecial.Lament,
                });
                break;
            case "ArchPaladin":
                Adv.enhanceEquipped(EnhancementType.Lucky, {
                    hSpecial: HelmSpecial.Anima,
                    wSpecial: WeaponSpecial.Lacerate,
                    cSpecial: CapeSpecial.Absolution,
                });
                break;
            case "Lord of Order":
                Adv.enhanceEquipped(EnhancementType.Lucky, {
                    hSpecial: HelmSpecial.Anima,
                    wSpecial: WeaponSpecial.Mana_Vamp,
                    cSpecial: CapeSpecial.Absolution,
                });
                break;
            case "StoneCrusher":
                Adv.enhanceEquipped(EnhancementType.Fighter, {
                    hSpecial: HelmSpecial.Anima,
                    wSpecial: WeaponSpecial.Valiance,
                    cSpecial: CapeSpecial.Absolution,
                });
                break;
            case "Verus DoomKnight":
                Adv.enhanceEquipped(EnhancementType.Lucky, {
                    hSpecial: HelmSpecial.Anima,
                    wSpecial: WeaponSpecial.Praxis,
                    cSpecial: CapeSpecial.Lament,
                });
                break;
            case "Scion of Flames":
                Adv.enhanceEquipped(EnhancementType.Wizard, {
                    hSpecial: HelmSpecial.Pneuma,
                    wSpecial: WeaponSpecial.Elysium,
                    cSpecial: CapeSpecial.Lament,
                });
                break;
            default:
                Core.logger(`[UltraEnhancements] No preset for '${className}', using SmartEnhance.`);
                Adv.smartEnhance(className);
                break;
        }
    }

    applyKolr(): void {
        const className = bot.player?.currentClass ?? "";
        if (!className) {
            return;
        }

        Core.logger(`[UltraEnhancements] Kolr enhancing for: ${className}`);

        switch (className) {
            case "Verus DoomKnight":
                Adv.enhanceEquipped(EnhancementType.Lucky, {
                    hSpecial: HelmSpecial.Anima,
                    wSpecial: WeaponSpecial.Ravenous,
                    cSpecial: CapeSpecial.Lament,
                });
                break;
            case "Void Highlord":
                Adv.enhanceEquipped(EnhancementType.Fighter, {
                    hSpecial: HelmSpecial.Anima,
                    wSpecial: WeaponSpecial.Health_Vamp,
                });
                break;
            case "Lord of Order":
                Adv.enhanceEquipped(EnhancementType.Fighter, {
                    wSpecial: WeaponSpecial.Health_Vamp,
                    cSpecial: CapeSpecial.Penitence,
                });
                break;
            case "ArchPaladin":
                Adv.enhanceEquipped(EnhancementType.Fighter, {
                    hSpecial: HelmSpecial.Anima,
                    wSpecial: Adv.uPraxis() ? WeaponSpecial.Praxis : WeaponSpecial.Lacerate,
                    cSpecial: CapeSpecial.Lament,
                });
                break;
            case "King's Echo":
                Adv.enhanceEquipped(EnhancementType.Lucky, {
                    hSpecial: HelmSpecial.Examen,
                    wSpecial: WeaponSpecial.Mana_Vamp,
                    cSpecial: CapeSpecial.Lament,
                });
                break;
            default:
                Core.logger(`[UltraEnhancements] No preset for '${className}', using SmartEnhance.`);
                Adv.smartEnhance(className);
                break;
        }
    }

    applyNoVainglory(): void {
        this.apply();

        const className = bot.player?.currentClass ?? "";
        if (!className) {
            return;
        }

        const cape = bot.inventory.items.find((i) => i.equipped && i.category === "Cape");
        if (cape == null) {
            Core.logger(`[UltraEnhancements] No equipped cape found for Nulgath override (${className}).`);
            return;
        }

        Core.logger(`[UltraEnhancements] NoVainglory enhancing for: ${className} and forcing Forge cape`);
        Adv.enhanceItem(cape.name, EnhancementType.Lucky, { cSpecial: CapeSpecial.Absolution });
    }
}
