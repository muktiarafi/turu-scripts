/*
name: Masakado King's Echo
description: Solo or army helper for Victor Matsuri's final boss, Masakado, using King's Echo and Royal Resolve.
tags: masakado, victor matsuri, kings echo, king's echo, army, solo, royal resolve
*/
// Port of Scripts/Ultrasv3/Entwined Eclipse/Masakado.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option, SkillUseMode } from "turu";
import { CoreArmyLite } from "../../army/CoreArmyLite";
import { CapeSpecial, CoreAdvanced, EnhancementType, HelmSpecial, WeaponSpecial } from "../../core/CoreAdvanced";
import { Core, rethrowIfStopped } from "../../core/CoreBots";
import { CoreUltra } from "./CoreUltra";

const Adv = new CoreAdvanced();
const Ultra = new CoreUltra();
const sArmy = new CoreArmyLite();

export class MasakadoKingsEchoArmy {
    static readonly questID = 10295;
    static readonly map = "victormatsuri";
    static readonly cell = "r8";
    static readonly pad = "Left";
    static readonly monster = "Masakado";
    static readonly kingsEcho = "King's Echo";
    static readonly legionRevenant = "Legion Revenant";
    static readonly archMage = "ArchMage";
    static readonly archPaladin = "ArchPaladin";
    static readonly stoneCrusher = "StoneCrusher";
    static readonly lordOfOrder = "Lord of Order";
    static readonly lightCaster = "LightCaster";
    static readonly fallbackClasses: string[] = [
        MasakadoKingsEchoArmy.legionRevenant,
        MasakadoKingsEchoArmy.archMage,
        "Chaos Avenger",
        "Void HighLord",
        "Dragon of Time",
        "Arcana Invoker",
        MasakadoKingsEchoArmy.lightCaster,
        MasakadoKingsEchoArmy.archPaladin,
        MasakadoKingsEchoArmy.lordOfOrder,
        MasakadoKingsEchoArmy.stoneCrusher,
        "Verus DoomKnight",
        "Verus Doomknight",
        "Cavern Celestite",
        "Elemental Warrior",
        "Shaman",
    ];
    static readonly revitalize = "Potent Revitalize Elixir";
    static readonly revitalizeTarget = 20;
    static readonly revitalizeBuyClicks = 4;

    armyMode: boolean = false;
    autoEnhance: boolean = false;
    allowFallbackClass: boolean = false;
    useRevitalize: boolean = false;
    buyRevitalize: boolean = false;

    /**
     * Orchestration hook: when true, skip Core.SetOptions(true/false). Used when
     * this script is invoked from a parent orchestrator that already runs its own
     * SetOptions and shouldn't re-prompt the options panel or trigger cleanup.
     */
    skipSetOptions: boolean = false;
    activeClass: string = MasakadoKingsEchoArmy.kingsEcho;
    usingUnknownFallback: boolean = false;
    openedWithPraxis: boolean = false;
    openedWithDefense: boolean = false;
    syncCount: number = 0;
    lastPotionUse: number = 0;
    lastRoyalResolve: number = 0;

    equipFightClass(): void {
        this.activeClass = this.selectFightClass();

        if (!this.activeClass?.trim()) {
            Core.logger(
                `${Core.username()} does not have ${MasakadoKingsEchoArmy.kingsEcho} or a known fallback class, and no class is currently equipped.`,
                undefined,
                { stopBot: true },
            );
            return;
        }

        if (!(bot.player.currentClass?.toLowerCase() === this.activeClass?.toLowerCase())) {
            Core.equip(this.activeClass);
            bot.wait.forItemEquip(this.activeClass);
            bot.sleep(1000);
        }

        bot.skills.startSkills(
            this.usingUnknownFallback ? this.activeClass : this.skillRotation(this.activeClass),
            250,
            SkillUseMode.WaitForCooldown,
        );
    }

    selectFightClass(): string {
        if (this.armyMode) {
            return this.selectArmyClass();
        }

        if (Core.checkInventory(MasakadoKingsEchoArmy.kingsEcho)) {
            return MasakadoKingsEchoArmy.kingsEcho;
        }

        if (!this.allowFallbackClass) {
            Core.logger(
                `${Core.username()} does not have ${MasakadoKingsEchoArmy.kingsEcho}. Enable fallback if you want LR/ArchMage used instead.`,
                undefined,
                { stopBot: true },
            );
            return "";
        }

        for (const className of MasakadoKingsEchoArmy.fallbackClasses) {
            if (Core.checkInventory(className)) {
                return className;
            }
        }

        const equippedClass = bot.player.currentClass ?? "";
        if (!!equippedClass?.trim()) {
            this.usingUnknownFallback = true;
            Core.logger(
                `${Core.username()} has no known fallback class; using currently equipped class: ${equippedClass}.`,
            );
            return equippedClass;
        }

        return "";
    }

    selectArmyClass(): string {
        const username = Core.username();
        const p1 = bot.config!.get<string>("player1");
        const p2 = bot.config!.get<string>("player2");
        const p3 = bot.config!.get<string>("player3");
        const p4 = bot.config!.get<string>("player4");

        if (username.toLowerCase() === p1.toLowerCase()) {
            return this.firstOwned(
                MasakadoKingsEchoArmy.kingsEcho,
                MasakadoKingsEchoArmy.legionRevenant,
                "Arcana Invoker",
                MasakadoKingsEchoArmy.archMage,
            );
        }

        if (username.toLowerCase() === p2.toLowerCase()) {
            return this.firstOwned(
                MasakadoKingsEchoArmy.stoneCrusher,
                MasakadoKingsEchoArmy.archPaladin,
                MasakadoKingsEchoArmy.lordOfOrder,
                MasakadoKingsEchoArmy.legionRevenant,
            );
        }

        if (username.toLowerCase() === p3.toLowerCase()) {
            return this.firstOwned(
                MasakadoKingsEchoArmy.legionRevenant,
                MasakadoKingsEchoArmy.archPaladin,
                MasakadoKingsEchoArmy.lordOfOrder,
                MasakadoKingsEchoArmy.lightCaster,
            );
        }

        if (username.toLowerCase() === p4.toLowerCase()) {
            return this.firstOwned(
                MasakadoKingsEchoArmy.lightCaster,
                MasakadoKingsEchoArmy.lordOfOrder,
                MasakadoKingsEchoArmy.archPaladin,
                MasakadoKingsEchoArmy.legionRevenant,
            );
        }

        Core.logger(`${username} was not matched to an army slot; using solo fallback selection.`);
        return this.firstOwned(
            MasakadoKingsEchoArmy.kingsEcho,
            MasakadoKingsEchoArmy.legionRevenant,
            MasakadoKingsEchoArmy.archMage,
            "Arcana Invoker",
            MasakadoKingsEchoArmy.archPaladin,
            MasakadoKingsEchoArmy.lightCaster,
            MasakadoKingsEchoArmy.lordOfOrder,
        );
    }

    firstOwned(...classNames: string[]): string {
        for (const className of classNames) {
            if (Core.checkInventory(className)) {
                return className;
            }
        }

        if (!this.allowFallbackClass) {
            return "";
        }

        for (const className of MasakadoKingsEchoArmy.fallbackClasses) {
            if (Core.checkInventory(className)) {
                return className;
            }
        }

        const equippedClass = bot.player.currentClass ?? "";
        if (!!equippedClass?.trim()) {
            this.usingUnknownFallback = true;
            Core.logger(
                `${Core.username()} has none of the comp classes; using currently equipped class: ${equippedClass}.`,
            );
            return equippedClass;
        }

        return "";
    }

    skillRotation(className: string): string {
        return ((v) =>
            v === "king's echo"
                ? "3|4|2|5|4|3|2|4|5"
                : v === "legion revenant"
                  ? "4|3|2|5|4|2|3|4|2"
                  : v === "archmage"
                    ? "4|2|3|5|4|2|3|4|5"
                    : v === "chaos avenger"
                      ? "2|3|5|4|2|3|4|5"
                      : v === "void highlord"
                        ? "3|2|4|5|3|2|4"
                        : v === "dragon of time"
                          ? "3|2|4|2|1|2"
                          : v === "arcana invoker"
                            ? "4|3|5|3|5|3|5"
                            : v === "lightcaster"
                              ? "4|2|3|5|2|3|4|5"
                              : v === "archpaladin"
                                ? "4|2|3|5|2|4|3"
                                : v === "Lord of Order"
                                  ? "2|3|4|5|2|3|4"
                                  : v === "stonecrusher"
                                    ? "3|4|2|5|3|4|2"
                                    : v === "verus doomknight"
                                      ? "2|3|4|5|2|3|4"
                                      : v === "cavern celestite"
                                        ? "2|3|4|5|2|3|4"
                                        : v === "elemental warrior"
                                          ? "2|3|4|5|2|3|4"
                                          : v === "shaman"
                                            ? "2|3|4|5|2|3|4"
                                            : "4|2|3|5")(className.toLowerCase());
    }

    applyClassEnhancements(): void {
        if (this.usingUnknownFallback) {
            Core.logger(
                `${Core.username()} using unknown fallback class '${this.activeClass}' - skipping auto-enhancements.`,
            );
            return;
        }

        switch (this.activeClass.toLowerCase()) {
            case "king's echo":
                Core.logger(`${Core.username()} applying King's Echo enhancements: Ravenous, Examen, Absolution.`);
                Adv.enhanceEquipped(EnhancementType.Healer, {
                    cSpecial: CapeSpecial.Absolution,
                    hSpecial: HelmSpecial.Examen,
                    wSpecial: WeaponSpecial.Ravenous,
                });
                break;
            case "legion revenant":
                Core.logger(`${Core.username()} applying Legion Revenant Masakado enhancements: Praxis, Pneuma.`);
                Adv.enhanceEquipped(EnhancementType.Wizard, {
                    hSpecial: HelmSpecial.Pneuma,
                    wSpecial: WeaponSpecial.Praxis,
                });
                break;
            case "archmage":
                Core.logger(`${Core.username()} applying ArchMage Masakado enhancements: Praxis, Pneuma, Absolution.`);
                Adv.enhanceEquipped(EnhancementType.Wizard, {
                    cSpecial: CapeSpecial.Absolution,
                    hSpecial: HelmSpecial.Pneuma,
                    wSpecial: WeaponSpecial.Praxis,
                });
                break;
            case "arcana invoker":
                Core.logger(`${Core.username()} applying Arcana Invoker Masakado enhancements: Praxis.`);
                Adv.enhanceEquipped(EnhancementType.Wizard, { wSpecial: WeaponSpecial.Praxis });
                break;
            case "stonecrusher":
                Core.logger(`${Core.username()} applying StoneCrusher support enhancements.`);
                Adv.enhanceEquipped(EnhancementType.Fighter, {
                    cSpecial: Adv.uAbsolution() ? CapeSpecial.Absolution : CapeSpecial.None,
                    hSpecial: Adv.uAnima() ? HelmSpecial.Anima : HelmSpecial.None,
                    wSpecial: Adv.uRavenous() ? WeaponSpecial.Ravenous : WeaponSpecial.Awe_Blast,
                });
                break;
            case "archpaladin":
                Core.logger(`${Core.username()} applying ArchPaladin support enhancements.`);
                Adv.enhanceEquipped(EnhancementType.Lucky, {
                    cSpecial: Adv.uAbsolution() ? CapeSpecial.Absolution : CapeSpecial.None,
                    hSpecial: Adv.uForgeHelm() ? HelmSpecial.Forge : HelmSpecial.None,
                    wSpecial: Adv.uRavenous() ? WeaponSpecial.Ravenous : WeaponSpecial.Awe_Blast,
                });
                break;
            case "lord of order":
                Core.logger(`${Core.username()} applying Lord of Order support enhancements.`);
                Adv.enhanceEquipped(EnhancementType.Lucky, {
                    cSpecial: Adv.uPenitence() ? CapeSpecial.Penitence : CapeSpecial.None,
                    hSpecial: Adv.uForgeHelm() ? HelmSpecial.Forge : HelmSpecial.None,
                    wSpecial: Adv.uArcanasConcerto() ? WeaponSpecial.Arcanas_Concerto : WeaponSpecial.Awe_Blast,
                });
                break;
            case "lightcaster":
                Core.logger(`${Core.username()} applying LightCaster support enhancements.`);
                Adv.enhanceEquipped(EnhancementType.Wizard, {
                    cSpecial: Adv.uAbsolution() ? CapeSpecial.Absolution : CapeSpecial.None,
                    hSpecial: Adv.uPneuma() ? HelmSpecial.Pneuma : HelmSpecial.None,
                    wSpecial: Adv.uPraxis() ? WeaponSpecial.Praxis : WeaponSpecial.Awe_Blast,
                });
                break;
            default:
                Core.logger(
                    `${Core.username()} applying generic fallback enhancements for ${this.activeClass}: Lucky, Ravenous if available.`,
                );
                Adv.enhanceEquipped(EnhancementType.Lucky, {
                    wSpecial: Adv.uRavenous() ? WeaponSpecial.Ravenous : WeaponSpecial.Awe_Blast,
                });
                break;
        }
    }

    equipRevitalize(): void {
        if (this.buyRevitalize) {
            this.stockRevitalize();
        }

        if (!Core.checkInventory(MasakadoKingsEchoArmy.revitalize)) {
            Core.logger(`${Core.username()} does not have ${MasakadoKingsEchoArmy.revitalize}; continuing without it.`);
            return;
        }

        if (!bot.inventory.isEquipped(MasakadoKingsEchoArmy.revitalize)) {
            bot.inventory.equipUsableItem(MasakadoKingsEchoArmy.revitalize);
        }
    }

    useRevitalizeIfReady(): void {
        if (!this.useRevitalize || !Core.checkInventory(MasakadoKingsEchoArmy.revitalize)) {
            return;
        }

        if (!bot.inventory.isEquipped(MasakadoKingsEchoArmy.revitalize)) {
            bot.inventory.equipUsableItem(MasakadoKingsEchoArmy.revitalize);
        }

        if ((Date.now() - this.lastPotionUse) / 1000 < 30) {
            return;
        }

        Core.usePotion();
        this.lastPotionUse = Date.now();
    }

    stockRevitalize(): void {
        const voucher = "Gold Voucher 500k";
        const map = "alchemyacademy";
        const shop = 2036;

        if (bot.inventory.getQuantity(MasakadoKingsEchoArmy.revitalize) >= MasakadoKingsEchoArmy.revitalizeTarget) {
            return;
        }

        const neededVouchers = MasakadoKingsEchoArmy.revitalizeBuyClicks * 2;
        const missingVouchers = Math.max(0, neededVouchers - bot.inventory.getQuantity(voucher));
        if (missingVouchers > 0) {
            Core.logger(`Buying ${missingVouchers}x ${voucher} for ${MasakadoKingsEchoArmy.revitalize}...`);
            Core.buyItem(map, shop, voucher, missingVouchers);
        }

        Core.logger(
            `Stocking ${MasakadoKingsEchoArmy.revitalize}: buying ${MasakadoKingsEchoArmy.revitalizeBuyClicks} times from Gebo's merge shop.`,
        );
        Core.buyItem(map, shop, MasakadoKingsEchoArmy.revitalize, MasakadoKingsEchoArmy.revitalizeTarget);
    }

    keepRoyalResolveUp(): void {
        if (!(this.activeClass?.toLowerCase() === MasakadoKingsEchoArmy.kingsEcho?.toLowerCase())) {
            return;
        }

        if ((Date.now() - this.lastRoyalResolve) / 1000 < 5) {
            return;
        }

        bot.skills.useSkill(4);
        this.lastRoyalResolve = Date.now();
    }

    openWithPraxis(): void {
        if (this.openedWithPraxis || !this.isPlayer1()) {
            return;
        }

        Core.logger(
            `${Core.username()} opening Masakado with Praxis on AQW button 2 / Skua skill 1 using ${this.activeClass}.`,
        );
        bot.skills.useSkill(1);
        this.openedWithPraxis = true;
        bot.sleep(1000);
    }

    openWithDefense(): void {
        if (this.openedWithDefense || !bot.player.hasTarget) {
            return;
        }

        // Masakado uses Unsheathe once at the start, then Yokai Slayer 3s later.
        // This gives support classes a moment to establish defensive buffs before that hit.
        bot.sleep(1800);

        const className = this.activeClass.toLowerCase();
        const skill =
            className === "king's echo"
                ? 4
                : className === "archpaladin"
                  ? 4
                  : className === "Lord of Order"
                    ? 4
                    : className === "lightcaster"
                      ? 4
                      : className === "stonecrusher"
                        ? 3
                        : 0;

        if (skill > 0) {
            bot.skills.useSkill(skill);
        }

        this.openedWithDefense = true;
        bot.sleep(800);
    }

    avoidCounterAttack(): boolean {
        if (!bot.player.hasTarget || bot.target?.auras == null) {
            return false;
        }

        const countering = bot.target.auras.some(
            (a) => a != null && a.name?.toLowerCase() === "Counter Attack"?.toLowerCase(),
        );

        if (!countering) {
            return false;
        }

        Core.logger(`${Core.username()} detected Counter Attack - pausing damage.`);
        bot.combat.cancelAutoAttack();

        const end = Date.now() + 4500;
        while (!bot.shouldExit && bot.player.alive && Date.now() < end) {
            this.useSupportDuringCounter();
            bot.sleep(600);
        }

        return true;
    }

    useSupportDuringCounter(): void {
        switch (this.activeClass.toLowerCase()) {
            case "archpaladin":
                bot.skills.useSkill(2);
                break;
            case "lord of order":
                bot.skills.useSkill(1);
                bot.sleep(250);
                bot.skills.useSkill(2);
                bot.sleep(250);
                bot.skills.useSkill(3);
                break;
            case "lightcaster":
                bot.skills.useSkill(3);
                break;
            case "stonecrusher":
                bot.skills.useSkill(3);
                bot.sleep(250);
                bot.skills.useSkill(4);
                break;
            case "king's echo":
                bot.skills.useSkill(4);
                break;
        }
    }

    isPlayer1(): boolean {
        const p1 = bot.config!.get<string>("player1");
        return !!p1?.trim() && Core.username().toLowerCase() === p1.toLowerCase();
    }

    ensureAtMasakado(): void {
        const target = this.armyMode
            ? `${MasakadoKingsEchoArmy.map}-${Core.privateRoomNumber}`
            : MasakadoKingsEchoArmy.map;

        if (!(bot.map.name.toLowerCase() === MasakadoKingsEchoArmy.map.toLowerCase())) {
            Core.join(target, MasakadoKingsEchoArmy.cell, MasakadoKingsEchoArmy.pad);
            bot.wait.forMapLoad(MasakadoKingsEchoArmy.map);
            bot.sleep(1000);
        }

        if (!(bot.player.cell.toLowerCase() === MasakadoKingsEchoArmy.cell.toLowerCase())) {
            bot.map.jump(MasakadoKingsEchoArmy.cell, MasakadoKingsEchoArmy.pad, false);
            bot.wait.forCellChange(MasakadoKingsEchoArmy.cell);
            bot.sleep(500);
        }

        bot.player.setSpawnPoint();
    }

    hasRequirement(item: string, isTemp: boolean, quant: number): boolean {
        return isTemp
            ? bot.tempInv.contains(item, quant)
            : bot.inventory.contains(item, quant) || bot.bank.contains(item, quant);
    }

    syncArmy(syncFile: string): void {
        const partySize = sArmy.players().length;
        if (!this.armyMode || partySize <= 1) {
            return;
        }

        const path = Ultra.resolveSyncPath(`Masakado_${Core.privateRoomNumber}_${++this.syncCount}_${syncFile}`);
        const username = Core.username().toLowerCase();

        while (!bot.shouldExit) {
            let lines = this.readSyncLines(path);
            lines = lines.filter((line) => !line.toLowerCase().startsWith(`${username}:`.toLowerCase()));
            this.writeSyncLines(path, [...lines, `${username}:ready:${Math.floor(Date.now() / 1000)}`]);

            const now = Math.floor(Date.now() / 1000);
            const ready = [
                ...new Set(
                    this.readSyncLines(path)
                        .map((line) => line.split(":"))
                        .filter(
                            (parts) => parts.length >= 3 && /^-?\d+$/.test(parts[2]) && now - Number(parts[2]) <= 120,
                        )
                        .map((parts) => parts[0]),
                ),
            ].length;

            if (ready >= partySize) {
                return;
            }

            bot.sleep(250);
        }
    }

    readSyncLines(path: string): string[] {
        try {
            return bot.army.readLog(path).filter((line) => !!line?.trim());
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
     * C#'s `ScriptMain`, a method so that GreatbladeOfTheEntwinedEclipse can run this script with
     * its own options (`skipSetOptions`).
     */
    scriptMain(): void {
        const script = this;
        if (!script.skipSetOptions) {
            Core.setOptions(undefined, { disableClassSwap: true });
        }

        try {
            script.armyMode = bot.config!.get<boolean>("armyMode");
            script.autoEnhance = bot.config!.get<boolean>("autoEnhance");
            script.allowFallbackClass = bot.config!.get<boolean>("allowFallbackClass");
            script.useRevitalize = bot.config!.get<boolean>("useRevitalize");
            script.buyRevitalize = bot.config!.get<boolean>("buyRevitalize");

            if (script.armyMode) {
                if (sArmy.players().length < 4) {
                    Core.logger("Add 4 account names in the script options before starting Army Mode.");
                    return;
                }

                Core.privateRooms = true;
                if (Core.privateRoomNumber < 1000 || Core.privateRoomNumber > 99999) {
                    Core.privateRoomNumber = sArmy.getRoomNr();
                }

                Core.logger(
                    `Masakado army mode enabled: ${sArmy.players().length} accounts, private room #${Core.privateRoomNumber}.`,
                );
            } else {
                Core.privateRooms = false;
                Core.logger("Masakado solo mode enabled.");
            }

            script.equipFightClass();
            if (script.autoEnhance) {
                script.applyClassEnhancements();
            }
            if (script.useRevitalize) {
                script.equipRevitalize();
            }

            Core.ensureAccept(MasakadoKingsEchoArmy.questID);
            const quest = Core.ensureLoad(MasakadoKingsEchoArmy.questID);
            // C#: `quest.Requirements[0].ToString()`, which is "[ID] (Item) Name xN"; the drop and the farm
            // need the name, so the name it is.
            const item = quest.requirements[0].name;
            const isTemp = quest.requirements[0].temp;
            const quant = 1;

            if (!isTemp) {
                Core.addDrop(item);
            }

            script.syncArmy("masakado_ready.sync");
            Core.logger(
                `Fighting ${MasakadoKingsEchoArmy.monster} for quest ${MasakadoKingsEchoArmy.questID}: ${item}.`,
            );

            while (!bot.shouldExit && !script.hasRequirement(item, isTemp, quant)) {
                script.ensureAtMasakado();

                if (!bot.player.alive) {
                    bot.wait.forTrue(() => bot.player.alive, 20);
                    bot.sleep(500);
                    script.ensureAtMasakado();
                    continue;
                }

                if (
                    bot.player.target == null ||
                    !(bot.player.target.name?.toLowerCase() === MasakadoKingsEchoArmy.monster?.toLowerCase())
                ) {
                    bot.combat.attack(MasakadoKingsEchoArmy.monster);
                }

                script.openWithPraxis();
                script.openWithDefense();
                if (script.avoidCounterAttack()) {
                    bot.sleep(500);
                    continue;
                }

                script.useRevitalizeIfReady();
                script.keepRoyalResolveUp();
                bot.sleep(500);
            }

            script.syncArmy("masakado_done.sync");

            if (script.hasRequirement(item, isTemp, quant)) {
                Core.ensureComplete(MasakadoKingsEchoArmy.questID);
            }
        } finally {
            if (!script.skipSetOptions) {
                Core.setOptions(false);
            }
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "MasakadoKingsEchoArmy",
    [
        option.text(
            "player1",
            "King's Echo",
            "AQW account name for the King's Echo slot. Falls back to LR → Arcana Invoker → ArchMage if KE is missing.",
            "",
        ),
        option.text(
            "player2",
            "StoneCrusher",
            "AQW account name for the StoneCrusher slot. Falls back to ArchPaladin → LoO → LR.",
            "",
        ),
        option.text(
            "player3",
            "Legion Revenant",
            "AQW account name for the Legion Revenant slot. Falls back to ArchPaladin → LoO → LightCaster.",
            "",
        ),
        option.text(
            "player4",
            "Lord of Order",
            "AQW account name for the Lord of Order slot. Falls back to ArchPaladin → LightCaster → LR.",
            "",
        ),
        sArmy.packetDelay,
        Core.skipOptions,
        option.bool(
            "armyMode",
            "Army Mode",
            "OFF: run as a solo helper. ON: wait for and sync 4 configured accounts.",
            false,
        ),
        option.bool(
            "autoEnhance",
            "Auto-Apply Enhancements",
            "Applies recommended enhancements for the selected/fallback class.",
            true,
        ),
        option.bool(
            "allowFallbackClass",
            "Fallback If No King's Echo",
            "ON: use the best available fallback class if King's Echo is missing. OFF: stop if King's Echo is missing.",
            true,
        ),
        option.bool(
            "useRevitalize",
            "Use Potent Revitalize Elixir",
            "Equips and periodically uses Potent Revitalize Elixir if the item is present.",
            true,
        ),
        option.bool(
            "buyRevitalize",
            "Buy Revitalize Elixir",
            "Buys Potent Revitalize Elixir from Gebo's /alchemyacademy merge shop when missing.",
            true,
        ),
    ],
    true,
);

export default function main(): void {
    new MasakadoKingsEchoArmy().scriptMain();
}
