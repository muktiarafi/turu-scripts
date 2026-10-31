/*
name: Celestial Of Mysteries
description: This script will complete "Luctus in Perpetuum" [10096] quest.
tags: celestial, aranx, azalith, luctus in perpetuum, celestial realm, infernaldianoia,extra,qom,celestial of mysteries,luctus,perpetuum
*/
// Port of Scripts/Other/CelestialOfMysteries.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CapeSpecial, CoreAdvanced, EnhancementType, HelmSpecial, WeaponSpecial } from "../core/CoreAdvanced";
import { ClassType, Core } from "../core/CoreBots";
import { CoreFarms } from "../core/CoreFarms";
import { InfernalCelestialFinaleMerge } from "./mergeshops/InfernalCelestialFinaleMerge";
import { InfernalParadiseMerge } from "./mergeshops/InfernalParadiseMerge";
import { InfernalDianoia } from "../story/queenofmonsters/extra/InfernalDianoia";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();
const ID = new InfernalDianoia();
const IPM = new InfernalParadiseMerge();
const ICFM = new InfernalCelestialFinaleMerge();

export class CelestialOfMysteries {
    doQuest(): void {
        if (Core.checkInventory(Core.questRewards(10096))) {
            return;
        }

        // Prereqs
        ID.storyline();
        Farm.experience(90);
        const q = Core.initializeWithRetries(() => Core.ensureLoad(10096));
        if (q == null) {
            Core.logger("Failed to load quest 10096.");
            return;
        }
        for (const req of q.acceptRequirements) {
            if (!Core.checkInventory(req.id)) {
                IPM.buyAllMerge(req.name);
                // Archangel of Mysteries Armor, Helm and Wings
            }
            Core.unbank(req.id);
        }

        // Gold Voucher 500k
        Farm.voucher("Gold Voucher 500k", 35);
        Adv.gearStore(true);
        // Duo's Dinner
        if (!Core.checkInventory("Duo's Dinner", 35)) {
            Core.useBossClass();
            Core.huntMonster("infernalarena", "Deadly Duo", "Duo's Dinner", 35, { isTemp: false });
        }
        // Cervus Dente
        if (!Core.checkInventory("Cervus Dente", 35)) {
            Core.useBossClass();
            Core.huntMonster("infernalarena", "Cervus Malus", "Cervus Dente", 35, { isTemp: false });
        }
        // Infernal Incantation
        if (!Core.checkInventory("Infernal Incantation", 35)) {
            Core.useBossClass("Dragon of Time");
            Adv.enhanceEquipped(EnhancementType.Healer, { wSpecial: WeaponSpecial.Elysium });
            Core.huntMonster("infernalarena", "Key of Sholemoh", "Infernal Incantation", 35, { isTemp: false });
        }
        // Scythe Shard
        if (!Core.checkInventory("Scythe Shard", 35)) {
            Adv.enhanceEquipped(EnhancementType.Lucky, { wSpecial: WeaponSpecial.Health_Vamp });
            Core.useDodgeClass("Lord of Order");
            Core.huntMonster("infernalarena", "Azalith's Scythe", "Scythe Shard", 35, { isTemp: false });
        }
        // Champion's Seal
        if (!Core.checkInventory("Champion's Seal", 20)) {
            Core.useBossClass(Core.checkInventory("Void HighLord (IoDA)") ? "Void HighLord (IoDA)" : "Void Highlord");
            Adv.enhanceEquipped(EnhancementType.Lucky, {
                cSpecial: CapeSpecial.Penitence,
                hSpecial: HelmSpecial.Vim,
                wSpecial: WeaponSpecial.Valiance,
            });
            Core.huntMonster("infernalarena", "Na'al", "Champion's Seal", 20, { isTemp: false, log: false });
        }
        // Infernal Down
        ICFM.infernalDown(50);

        if (!Core.checkInventory("The Divine Will")) {
            Core.logger(
                "Farming Azalith for The Divine Will. Azalith is tough, consider using an army to speed it up.",
            );
            Core.equipClass(ClassType.Dodge);
            Core.huntMonster("celestialpast", "Azalith", "The Divine Will", 1, { isTemp: false });
        }
        Adv.gearStore(true, { enhAfter: true });

        Core.addDrop(...Core.questRewards(10096));
        Core.chainComplete(10096);
    }
}

export default function main(): void {
    const script = new CelestialOfMysteries();
    Core.setOptions();

    script.doQuest();
    Core.setOptions(false);
}
