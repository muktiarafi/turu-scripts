/*
name: Greatblade of the Entwined Eclipse (Full Chain)
description: End-to-end farm for Greatblade of the Entwined Eclipse. Runs Victor Matsuri storyline, kills Masakado via the King's Echo army flow for Victor of the Festival, farms Slivers of Sunlight/Moonlight, merges Rite of Ascension, farms Ecliptic Offering in Ascension of the Eclipse, then merges the full blade chain up to the final Greatblade.
tags: greatblade, entwined, eclipse, full, chain, victor, matsuri, masakado, rite, ascension, midnight, solstice, ascend, army
*/
// Port of Scripts/Ultrasv3/Entwined Eclipse/0GreatbladeOfTheEntwinedEclipse.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreArmyLite } from "../../army/CoreArmyLite";
import { Core, rethrowIfStopped } from "../../core/CoreBots";
import { AscendEclipseTest } from "./AscensionoftheEclipse";
import { CoreUltra } from "./CoreUltra";
import { MasakadoKingsEchoArmy } from "./Masakado";
import { MidnightSunTest } from "./MidnightSun";
import { SolsticeMoonTest } from "./SolsticeMoon";
import { VictorMatsuriStory } from "./VictorMatsuriStory";

const Ultra = new CoreUltra();
const sArmy = new CoreArmyLite();

export class GreatbladeOfTheEntwinedEclipse {
    // ─────────────────────────────────────────────────────────────────────────
    // CLASS REQUIREMENTS PER ACCOUNT
    //
    // Each slot below is an AQW account name. The same account is always that
    // slot across every phase, but the class it equips changes per phase.
    // Make sure each account actually OWNS every class listed for its slot —
    // missing classes will either fall back to a weaker pick or stop the bot.
    //
    //   Slot 1 (player1) needs:  King's Echo  AND  Legion Revenant
    //                            └ King's Echo is used for Masakado.
    //                            └ Legion Revenant is used in all 3 dungeons.
    //
    //   Slot 2 (player2) needs:  StoneCrusher
    //                            └ Used for Masakado AND all 3 dungeons.
    //
    //   Slot 3 (player3) needs:  ArchPaladin
    //                            └ Used for Masakado (via fallback) AND all 3 dungeons.
    //
    //   Slot 4 (player4) needs:  Lord of Order
    //                            └ Used for Masakado AND all 3 dungeons.
    //
    // ─────────────────────────────────────────────────────────────────────────

    // ── Items / shop ─────────────────────────────────────────────────────────
    static readonly victorOfTheFestival = "Victor of the Festival";
    static readonly sliverSunlight = "Sliver of Sunlight";
    static readonly sliverMoonlight = "Sliver of Moonlight";
    static readonly eclipticOffering = "Ecliptic Offering";
    static readonly riteOfAscension = "Rite of Ascension";

    static readonly solarbrand = "Solarbrand";
    static readonly lunarbrand = "Lunarbrand";
    static readonly umbrabrand = "Umbrabrand";
    static readonly bladeBurningSun = "Blade of the Burning Sun";
    static readonly bladeGlowingMoon = "Blade of the Glowing Moon";
    static readonly bladeBoundEclipse = "Blade of the Bound Eclipse";
    static readonly greatMidnightSun = "Greatblade of the Midnight Sun";
    static readonly greatSolsticeMoon = "Greatblade of the Solstice Moon";
    static readonly greatEntwinedEclipse = "Greatblade of the Entwined Eclipse";

    static readonly mergeMap = "templeshrine";
    static readonly mergeShop = 2303;

    static readonly id_RiteOfAscension = 10741;
    static readonly id_Solarbrand = 10744;
    static readonly id_Lunarbrand = 10745;
    static readonly id_Umbrabrand = 10746;
    static readonly id_BladeBurningSun = 10747;
    static readonly id_BladeGlowingMoon = 10748;
    static readonly id_BladeBoundEclipse = 10749;
    static readonly id_GreatMidnightSun = 10750;
    static readonly id_GreatSolsticeMoon = 10751;
    static readonly id_GreatEntwinedEclipse = 10752;

    // Full-chain material totals from a clean inventory:
    // Sun/Moon: 3× basic brand (5 ea) + 2× middle blade (50 ea) + 1× greatblade (100) + 1× Rite = 216.
    // Ecliptic Offering: Umbrabrand (5) + Blade Bound Eclipse (50) + final Greatblade (100) = 155.
    // The script now calculates the remaining subset dynamically from current inventory.

    // ── Phase 1: Victor of the Festival ───────────────────────────────────────
    //
    //   1a. VictorMatsuriStory.Storyline() runs quests 10290–10294 only. It self-skips
    //       per account if the relevant quests are already complete.
    //   1b. Army-level needs check: every account publishes whether it owns Victor.
    //       If *any* account is missing it, ALL four run Masakado together (quest
    //       10295 is repeatable, so the haves can re-fight without breaking).
    //       If every account already has Victor, ALL four skip the fight.
    //   1c. MasakadoKingsEchoArmy.ScriptMain handles quest 10295 (accept → kill → complete).
    // The original VictorMatsuri.cs is intentionally bypassed because its built-in
    // Masakado kill is unreliable.
    phase1_VictorOfTheFestival(): void {
        if (bot.config!.get<boolean>("skipVictorMatsuri")) {
            Core.logger("[Phase 1] Skipping Victor Matsuri storyline by user option.");
            return;
        }

        Core.logger("[Phase 1a] Running Victor Matsuri storyline (quests 10290–10294)...");
        new VictorMatsuriStory().storyline();

        const anyoneNeeds = this.armyAnyoneMissing(
            GreatbladeOfTheEntwinedEclipse.victorOfTheFestival,
            "phase1_victor_needs.sync",
        );
        if (!anyoneNeeds) {
            Core.logger(
                `[Phase 1] Every account already owns ${GreatbladeOfTheEntwinedEclipse.victorOfTheFestival}; skipping Masakado for the whole army.`,
            );
            return;
        }

        Core.logger(
            `[Phase 1b] At least one account is missing ${GreatbladeOfTheEntwinedEclipse.victorOfTheFestival}; whole army fights Masakado (quest 10295 is repeatable).`,
        );
        Object.assign(new MasakadoKingsEchoArmy(), { skipSetOptions: true }).scriptMain();

        if (!Core.checkInventory(GreatbladeOfTheEntwinedEclipse.victorOfTheFestival)) {
            Core.logger("[Phase 1] Masakado did not produce Victor of the Festival; stopping.", undefined, {
                stopBot: true,
            });
        }
    }

    /**
     * Army-level "anyone missing this item?" check. Every account writes its own
     * has/needs status to a shared sync file; once all party members have written,
     * every account returns the same answer based on the aggregate.
     * Returns true if at least one account is missing the item.
     */
    armyAnyoneMissing(item: string, syncFile: string): boolean {
        const partySize = sArmy.players().length;
        if (partySize <= 1) {
            return !Core.checkInventory(item);
        }

        const path = Ultra.resolveSyncPath(`GreatbladeEntwined_${Core.privateRoomNumber}_${syncFile}`);
        const username = Core.username().toLowerCase();
        const status = Core.checkInventory(item) ? "has" : "needs";
        const writeNow = Math.floor(Date.now() / 1000);
        const pruneCutoff = writeNow - 120;

        this.updateSyncLines(path, (lines) => [
            ...lines
                .filter((l) => !l.toLowerCase().startsWith(`${username}:`.toLowerCase()))
                .filter((l) => {
                    const p = l.split(":");
                    return p.length < 3 || !/^-?\d+$/.test(p[2]) || Number(p[2]) >= pruneCutoff;
                }),
            `${username}:${status}:${writeNow}`,
        ]);

        while (!bot.shouldExit) {
            const now = Math.floor(Date.now() / 1000);
            // C#'s GroupBy(user).Select(Last): each user's latest line.
            const latest = new Map<string, string[]>();
            for (const p of this.readSyncLines(path).map((l) => l.split(":"))) {
                if (p.length >= 3 && /^-?\d+$/.test(p[2]) && now - Number(p[2]) <= 120)
                    latest.set(p[0].toLowerCase(), p);
            }
            const fresh = [...latest.values()];

            if (fresh.length >= partySize) {
                return fresh.some((p) => p[1]?.toLowerCase() === "needs"?.toLowerCase());
            }

            bot.sleep(250);
        }

        return false;
    }

    readSyncLines(path: string): string[] {
        try {
            return bot.army.readLog(path).filter((l) => !!l?.trim());
        } catch (error) {
            rethrowIfStopped(error);

            bot.sleep(100);
            return [];
        }
    }

    writeSyncLines(path: string, lines: string[]): void {
        try {
            bot.army.writeLog(path, lines);
        } catch (error) {
            rethrowIfStopped(error);

            bot.sleep(100);
        }
    }

    /**
     * Reads, changes and writes the sync lines under the log's lock (Turu: C# relies on timing),
     * so another member's line written at the same time isn't lost.
     */
    updateSyncLines(path: string, change: (lines: string[]) => string[]): void {
        try {
            bot.army.withLock(path, () => this.writeSyncLines(path, change(this.readSyncLines(path))));
        } catch (error) {
            rethrowIfStopped(error);

            bot.sleep(100);
        }
    }

    // ── Phase 2: Farm Slivers (Sun + Moon) ────────────────────────────────────
    phase2_FarmSlivers(): void {
        const plan = this.buildRemainingCraftPlan();
        const sunlightNeeded = plan.sunlight;
        const moonlightNeeded = plan.moonlight;

        if (sunlightNeeded <= 0) {
            Core.logger(
                `[Phase 2] No additional ${GreatbladeOfTheEntwinedEclipse.sliverSunlight} needed for the remaining chain.`,
            );
        } else if (Core.checkInventory(GreatbladeOfTheEntwinedEclipse.sliverSunlight, sunlightNeeded)) {
            Core.logger(
                `[Phase 2] Already have ≥${sunlightNeeded} ${GreatbladeOfTheEntwinedEclipse.sliverSunlight}; skipping MidnightSun farm.`,
            );
        } else {
            Core.logger(
                `[Phase 2] Farming ${GreatbladeOfTheEntwinedEclipse.sliverSunlight} in /midnightsun until inventory ≥ ${sunlightNeeded}.`,
            );
            const ms = Object.assign(new MidnightSunTest(), {
                targetSliverCount: sunlightNeeded,
                skipSetOptions: true,
            });
            ms.scriptMain();
        }

        if (bot.shouldExit) {
            return;
        }

        if (moonlightNeeded <= 0) {
            Core.logger(
                `[Phase 2] No additional ${GreatbladeOfTheEntwinedEclipse.sliverMoonlight} needed for the remaining chain.`,
            );
        } else if (Core.checkInventory(GreatbladeOfTheEntwinedEclipse.sliverMoonlight, moonlightNeeded)) {
            Core.logger(
                `[Phase 2] Already have ≥${moonlightNeeded} ${GreatbladeOfTheEntwinedEclipse.sliverMoonlight}; skipping SolsticeMoon farm.`,
            );
        } else {
            Core.logger(
                `[Phase 2] Farming ${GreatbladeOfTheEntwinedEclipse.sliverMoonlight} in /solsticemoon until inventory ≥ ${moonlightNeeded}.`,
            );
            const sm = Object.assign(new SolsticeMoonTest(), {
                targetSliverCount: moonlightNeeded,
                skipSetOptions: true,
            });
            sm.scriptMain();
        }
    }

    // ── Phase 3: Merge Rite of Ascension ──────────────────────────────────────
    // Recipe (templeshrine #2303, item 78809): 1× Victor of the Festival + 1× Sliver of Sunlight + 1× Sliver of Moonlight
    phase3_MergeRiteOfAscension(): void {
        if (Core.checkInventory(GreatbladeOfTheEntwinedEclipse.riteOfAscension)) {
            Core.logger(`[Phase 3] ${GreatbladeOfTheEntwinedEclipse.riteOfAscension} already owned; skipping merge.`);
            return;
        }

        Core.logger(
            `[Phase 3] Merging ${GreatbladeOfTheEntwinedEclipse.riteOfAscension} at /${GreatbladeOfTheEntwinedEclipse.mergeMap} shop ${GreatbladeOfTheEntwinedEclipse.mergeShop}.`,
        );
        Core.buyItem(
            GreatbladeOfTheEntwinedEclipse.mergeMap,
            GreatbladeOfTheEntwinedEclipse.mergeShop,
            GreatbladeOfTheEntwinedEclipse.riteOfAscension,
            1,
            GreatbladeOfTheEntwinedEclipse.id_RiteOfAscension,
        );

        if (!Core.checkInventory(GreatbladeOfTheEntwinedEclipse.riteOfAscension)) {
            Core.logger(
                `[Phase 3] Failed to obtain ${GreatbladeOfTheEntwinedEclipse.riteOfAscension}; stopping.`,
                undefined,
                { stopBot: true },
            );
        }
    }

    // ── Phase 4: Farm Ecliptic Offerings ──────────────────────────────────────
    phase4_FarmEclipticOfferings(): void {
        const eclipticOfferingNeeded = this.buildRemainingCraftPlan().eclipticOffering;

        if (eclipticOfferingNeeded <= 0) {
            Core.logger(
                `[Phase 4] No additional ${GreatbladeOfTheEntwinedEclipse.eclipticOffering} needed for the remaining chain.`,
            );
            return;
        }

        if (Core.checkInventory(GreatbladeOfTheEntwinedEclipse.eclipticOffering, eclipticOfferingNeeded)) {
            Core.logger(
                `[Phase 4] Already have ≥${eclipticOfferingNeeded} ${GreatbladeOfTheEntwinedEclipse.eclipticOffering}; skipping AscensionEclipse farm.`,
            );
            return;
        }

        Core.logger(
            `[Phase 4] Farming ${GreatbladeOfTheEntwinedEclipse.eclipticOffering} in /ascendeclipse until inventory ≥ ${eclipticOfferingNeeded}.`,
        );
        const ae = Object.assign(new AscendEclipseTest(), {
            targetEclipticOfferingCount: eclipticOfferingNeeded,
            skipSetOptions: true,
        });
        ae.scriptMain();
    }

    // ── Phase 5: Merge full blade chain ───────────────────────────────────────
    //
    // Chain is dependency-planned from current inventory. Existing higher-tier
    // weapons count as already-consuming their lower-tier components, so we only
    // craft the missing copies still needed by later merges.
    phase5_MergeFinalBlade(): void {
        const plan = this.buildRemainingCraftPlan();
        Core.logger(
            `[Phase 5] Merging remaining blade chain at /${GreatbladeOfTheEntwinedEclipse.mergeMap} shop ${GreatbladeOfTheEntwinedEclipse.mergeShop}.`,
        );

        this.mergeCrafts(plan, GreatbladeOfTheEntwinedEclipse.solarbrand, GreatbladeOfTheEntwinedEclipse.id_Solarbrand);
        this.mergeCrafts(plan, GreatbladeOfTheEntwinedEclipse.lunarbrand, GreatbladeOfTheEntwinedEclipse.id_Lunarbrand);
        this.mergeCrafts(
            plan,
            GreatbladeOfTheEntwinedEclipse.bladeBurningSun,
            GreatbladeOfTheEntwinedEclipse.id_BladeBurningSun,
        );
        this.mergeCrafts(
            plan,
            GreatbladeOfTheEntwinedEclipse.bladeGlowingMoon,
            GreatbladeOfTheEntwinedEclipse.id_BladeGlowingMoon,
        );
        this.mergeCrafts(
            plan,
            GreatbladeOfTheEntwinedEclipse.greatMidnightSun,
            GreatbladeOfTheEntwinedEclipse.id_GreatMidnightSun,
        );
        this.mergeCrafts(
            plan,
            GreatbladeOfTheEntwinedEclipse.greatSolsticeMoon,
            GreatbladeOfTheEntwinedEclipse.id_GreatSolsticeMoon,
        );

        this.mergeCrafts(plan, GreatbladeOfTheEntwinedEclipse.umbrabrand, GreatbladeOfTheEntwinedEclipse.id_Umbrabrand);
        this.mergeCrafts(
            plan,
            GreatbladeOfTheEntwinedEclipse.bladeBoundEclipse,
            GreatbladeOfTheEntwinedEclipse.id_BladeBoundEclipse,
        );
        this.mergeCrafts(
            plan,
            GreatbladeOfTheEntwinedEclipse.greatEntwinedEclipse,
            GreatbladeOfTheEntwinedEclipse.id_GreatEntwinedEclipse,
        );
    }

    mergeCrafts(plan: CraftPlan, itemName: string, shopItemID: number): void {
        const toCraft = plan.crafts.get(itemName) ?? 0;
        if (toCraft <= 0) {
            Core.logger(`[Phase 5] ${itemName}: no missing craft needed.`);
            return;
        }

        const before = bot.inventory.getQuantity(itemName);
        Core.logger(`[Phase 5] Merging ${toCraft}× ${itemName} (${before} currently owned)...`);

        // Merge results have a max stack of 1 in this shop, so each copy has
        // to be bought (merged) one at a time rather than in a single bulk buy.
        for (let i = 0; i < toCraft; i++) {
            Core.buyItem(
                GreatbladeOfTheEntwinedEclipse.mergeMap,
                GreatbladeOfTheEntwinedEclipse.mergeShop,
                itemName,
                1,
                shopItemID,
            );
        }

        const after = bot.inventory.getQuantity(itemName);
        if (after < before + toCraft) {
            Core.logger(
                `[Phase 5] Failed to merge ${toCraft}× ${itemName} (had ${before}, now have ${after}); stopping.`,
                undefined,
                { stopBot: true },
            );
        }
    }

    buildRemainingCraftPlan(): CraftPlan {
        const plan = new CraftPlan();

        this.requireItem(GreatbladeOfTheEntwinedEclipse.greatEntwinedEclipse, 1, plan);

        if (!Core.checkInventory(GreatbladeOfTheEntwinedEclipse.riteOfAscension)) {
            plan.sunlight += 1;
            plan.moonlight += 1;
        }

        Core.logger(
            `[Planner] Remaining materials: ${plan.sunlight} ${GreatbladeOfTheEntwinedEclipse.sliverSunlight}, ` +
                `${plan.moonlight} ${GreatbladeOfTheEntwinedEclipse.sliverMoonlight}, ${plan.eclipticOffering} ${GreatbladeOfTheEntwinedEclipse.eclipticOffering}.`,
        );

        return plan;
    }

    requireItem(itemName: string, quantityNeeded: number, plan: CraftPlan): void {
        if (quantityNeeded <= 0) {
            return;
        }

        // C#'s `Available` ignores case; the item names here are this file's constants.
        const available = plan.available.get(itemName) ?? bot.inventory.getQuantity(itemName);

        const usedFromInventory = Math.min(available, quantityNeeded);
        plan.available.set(itemName, available - usedFromInventory);

        const toCraft = quantityNeeded - usedFromInventory;
        if (toCraft <= 0) {
            return;
        }

        this.addCraft(plan, itemName, toCraft);
        this.addRecipeRequirements(itemName, toCraft, plan);
    }

    addCraft(plan: CraftPlan, itemName: string, count: number): void {
        if (!plan.crafts.has(itemName)) {
            plan.crafts.set(itemName, 0);
        }

        plan.crafts.set(itemName, plan.crafts.get(itemName)! + count);
    }

    addRecipeRequirements(itemName: string, count: number, plan: CraftPlan): void {
        switch (itemName) {
            case GreatbladeOfTheEntwinedEclipse.solarbrand:
                plan.sunlight += 5 * count;
                break;
            case GreatbladeOfTheEntwinedEclipse.lunarbrand:
                plan.moonlight += 5 * count;
                break;
            case GreatbladeOfTheEntwinedEclipse.bladeBurningSun:
                this.requireItem(GreatbladeOfTheEntwinedEclipse.solarbrand, count, plan);
                plan.sunlight += 50 * count;
                break;
            case GreatbladeOfTheEntwinedEclipse.bladeGlowingMoon:
                this.requireItem(GreatbladeOfTheEntwinedEclipse.lunarbrand, count, plan);
                plan.moonlight += 50 * count;
                break;
            case GreatbladeOfTheEntwinedEclipse.greatMidnightSun:
                this.requireItem(GreatbladeOfTheEntwinedEclipse.bladeBurningSun, count, plan);
                plan.sunlight += 100 * count;
                break;
            case GreatbladeOfTheEntwinedEclipse.greatSolsticeMoon:
                this.requireItem(GreatbladeOfTheEntwinedEclipse.bladeGlowingMoon, count, plan);
                plan.moonlight += 100 * count;
                break;
            case GreatbladeOfTheEntwinedEclipse.umbrabrand:
                this.requireItem(GreatbladeOfTheEntwinedEclipse.solarbrand, count, plan);
                this.requireItem(GreatbladeOfTheEntwinedEclipse.lunarbrand, count, plan);
                plan.eclipticOffering += 5 * count;
                break;
            case GreatbladeOfTheEntwinedEclipse.bladeBoundEclipse:
                this.requireItem(GreatbladeOfTheEntwinedEclipse.bladeBurningSun, count, plan);
                this.requireItem(GreatbladeOfTheEntwinedEclipse.bladeGlowingMoon, count, plan);
                this.requireItem(GreatbladeOfTheEntwinedEclipse.umbrabrand, count, plan);
                plan.eclipticOffering += 50 * count;
                break;
            case GreatbladeOfTheEntwinedEclipse.greatEntwinedEclipse:
                this.requireItem(GreatbladeOfTheEntwinedEclipse.greatMidnightSun, count, plan);
                this.requireItem(GreatbladeOfTheEntwinedEclipse.greatSolsticeMoon, count, plan);
                this.requireItem(GreatbladeOfTheEntwinedEclipse.bladeBoundEclipse, count, plan);
                plan.eclipticOffering += 100 * count;
                break;
        }
    }
}

export class CraftPlan {
    crafts: Map<string, number> = new Map();
    available: Map<string, number> = new Map();
    sunlight: number = 0;
    moonlight: number = 0;
    eclipticOffering: number = 0;
}

export const scriptOptions = defineScriptOptions(
    "GreatbladeEntwinedEclipse",
    [
        option.text(
            "player1",
            "King's Echo + Legion Revenant",
            "AQW account name for the King's Echo + Legion Revenant slot. This account MUST own BOTH classes: King's Echo is used for Masakado, Legion Revenant is used for the dungeons.",
            "",
        ),
        option.text(
            "player2",
            "StoneCrusher",
            "AQW account name for the StoneCrusher slot. This account MUST own StoneCrusher for Masakado and all dungeon phases.",
            "",
        ),
        option.text(
            "player3",
            "ArchPaladin",
            "AQW account name for the ArchPaladin slot. This account MUST own ArchPaladin for the dungeon phases; Masakado can also fall back to it.",
            "",
        ),
        option.text(
            "player4",
            "Lord of Order",
            "AQW account name for the Lord of Order slot. This account MUST own Lord of Order for Masakado and all dungeon phases.",
            "",
        ),
        sArmy.packetDelay,
        Core.skipOptions,
        option.bool(
            "autoEnhance",
            "Auto-Apply Enhancements",
            "ON: each sub-script auto-applies the correct enhancements for its assigned class.",
            true,
        ),
        option.bool(
            "autoGetEnrage",
            "Auto-Craft Scroll of Enrage",
            "ON: each sub-script auto-crafts Scroll of Enrage before farming. Requires SpellCrafting rank 5.",
            true,
        ),
        option.bool(
            "tauntSanityCheck",
            "Check Usable Slot Before Boss Rooms",
            "Forwarded to AscensionoftheEclipse. ON: tests usable/potion slot before r3.",
            true,
        ),
        option.bool(
            "armyMode",
            "Army Mode (4 accounts)",
            "Forwarded to Masakado. ON: run Masakado as a 4-account army.",
            true,
        ),
        option.bool("allowFallbackClass", "Masakado: Fallback If No King's Echo", "Forwarded to Masakado.", true),
        option.bool("useRevitalize", "Masakado: Use Potent Revitalize Elixir", "Forwarded to Masakado.", true),
        option.bool("buyRevitalize", "Masakado: Buy Revitalize Elixir", "Forwarded to Masakado.", true),
        option.bool(
            "skipVictorMatsuri",
            "Skip Victor Matsuri Storyline",
            "ON: skip the Victor Matsuri storyline (use this if all 4 accounts already have Victor of the Festival).",
            false,
        ),
    ],
    true,
);

export default function main(): void {
    const script = new GreatbladeOfTheEntwinedEclipse();
    Core.setOptions();

    try {
        if (Core.checkInventory(GreatbladeOfTheEntwinedEclipse.greatEntwinedEclipse)) {
            Core.logger(
                `${Core.username()} already owns ${GreatbladeOfTheEntwinedEclipse.greatEntwinedEclipse} — nothing to do.`,
            );
            return;
        }

        Core.addDrop(
            GreatbladeOfTheEntwinedEclipse.victorOfTheFestival,
            GreatbladeOfTheEntwinedEclipse.sliverSunlight,
            GreatbladeOfTheEntwinedEclipse.sliverMoonlight,
            GreatbladeOfTheEntwinedEclipse.eclipticOffering,
        );

        script.phase1_VictorOfTheFestival();
        if (bot.shouldExit) {
            return;
        }

        script.phase2_FarmSlivers();
        if (bot.shouldExit) {
            return;
        }

        script.phase3_MergeRiteOfAscension();
        if (bot.shouldExit) {
            return;
        }

        script.phase4_FarmEclipticOfferings();
        if (bot.shouldExit) {
            return;
        }

        script.phase5_MergeFinalBlade();

        Core.logger(`Done — ${Core.username()} now owns ${GreatbladeOfTheEntwinedEclipse.greatEntwinedEclipse}.`);
    } finally {
        Core.setOptions(false);
    }
}
