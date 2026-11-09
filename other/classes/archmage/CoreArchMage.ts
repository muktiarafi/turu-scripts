/*
name: null
description: null
tags: null
*/
// Port of Scripts/Other/Classes/ArchMage/CoreArchMage.cs.

import { bot, ClassUseMode, defineScriptOptions, type EventMap, option, SkillUseMode } from "turu";
import { CoreAdvanced, EnhancementType, WeaponSpecial } from "../../../core/CoreAdvanced";
import { ClassType, Core, randomInt } from "../../../core/CoreBots";
import { CoreFarms } from "../../../core/CoreFarms";
import { CoreNSOD } from "../../../evil/nsod/CoreNSOD";
import { BuyScrolls, Scrolls } from "../../../farm/BuyScrolls";
import { CoreBLOD, WeaponOfDestiny } from "../../../good/blod/CoreBLOD";
import { CoreSoWMats } from "../../../shadowsofwar/CoreSoWMats";
import { DarkCarnaxStory } from "../../../story/DarkCarnax";
import { CoreQOM } from "../../../story/queenofmonsters/CoreQoM";
import { CoreSoW } from "../../../story/shadowsofwar/CoreSoW";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();
const Scroll = new BuyScrolls();
const BLOD = new CoreBLOD();
const QOM = new CoreQOM();
const SoW = new CoreSoW();
const SOWM = new CoreSoWMats();
const NSOD = new CoreNSOD();
const DCS = new DarkCarnaxStory();

/** What {@link CoreArchMage.getAM} does besides getting ArchMage. */
export interface ArchMageChoices {
    /** Also get the cosmetic rewards of the books. */
    cosmetics?: boolean;
    /** Also do Lumina Elementi, for the 51% weapon "Providence". */
    lumina?: boolean;
    /** Farm the boss items with an army. */
    army?: boolean;
}

/** The choices of a script that declares {@link scriptOptions} (CoreArchMage's and 0ArchMage's). */
export function archMageChoices(): ArchMageChoices {
    // Only mains that declare these options call this.
    return {
        cosmetics: bot.config.get<boolean>("cosmetics"), // options-check: ok
        lumina: bot.config.get<boolean>("lumina_elementi"), // options-check: ok
        army: bot.config.get<boolean>("army"), // options-check: ok
    };
}

export class CoreArchMage {
    // Turu: the C# reads its options from Bot.Config here, which only the scripts declaring them
    // have; the callers pass them instead.
    getAM(rankUpClass = true, choices: ArchMageChoices = {}): void {
        const cosmetics = choices.cosmetics ?? false;
        const lumina = choices.lumina ?? false;
        this.army = choices.army ?? false;

        if (Core.checkInventory("ArchMage", undefined, { toInv: false })) {
            if (!lumina) {
                if (!cosmetics) {
                    Core.logger('You own "ArchMage", farm complete.');
                    return;
                } else if (Core.checkInventory(this.cosmetics, undefined, { toInv: false })) {
                    Core.logger('You own "ArchMage" and the extra cometics, farm complete.');
                    return;
                }
            } else if (Core.checkInventory("Providence", undefined, { toInv: false })) {
                if (!cosmetics) {
                    Core.logger('You own "ArchMage" and "Providence", farm complete.');
                    return;
                } else if (Core.checkInventory(this.cosmetics, undefined, { toInv: false })) {
                    Core.logger('You own "ArchMage", "Providence", and the extra cometics, farm complete.');
                    return;
                }
            }
        }

        if (this.army) {
            Core.logger(
                "Armying Set to True, Please have all accounts logged in and Following this Acc using the Tools > Butler.cs",
            );
        }
        bot.drops.add(...[...[...this.requiredItems, ...this.bossDrops], ...this.cosmetics]);

        Core.logger("The bot will now farm all requierments for ArchMage");
        SoW.completeCoreSoW();
        if (!Core.isCompletedBefore(9126)) {
            Core.logger(
                "Quests must be completed upto 9126 (9123 > 9126) manualy as they require a dodge class.",
                undefined,
                { stopBot: true },
            );
        }
        QOM.theReshaper();

        Farm.spellCraftingREP();
        Farm.emberseaREP();
        Farm.chaosREP();
        Farm.goodREP();
        Farm.evilREP();
        Farm.etherStormREP();
        Farm.loremasterREP();

        Farm.experience(100);

        Core.logger("Requirements complete");

        if (!Core.checkInventory("ArchMage")) {
            Core.ensureAccept(8918);
            Core.logger(`ArchMage: Cosmetics = ${cosmetics}`);

            this.bookOfMagus();
            this.bookOfFire(cosmetics);
            this.bookOfIce(cosmetics);
            this.bookOfAether(cosmetics);
            this.bookOfArcana(cosmetics);

            Core.toBank(...this.cosmetics);
            this.bossItemCheck(250, "Elemental Binding");

            Core.unbank(
                "Book of Magus",
                "Book of Fire",
                "Book of Ice",
                "Book of Aether",
                "Book of Arcana",
                "Elemental Binding",
            );
            Core.ensureComplete(8918);

            bot.wait.forPickup("ArchMage");
            Core.toBank(...this.cosmetics);

            if (rankUpClass) {
                Adv.rankUpClass("ArchMage");
            }
        }

        if (lumina) {
            this.luminaElementi(false, cosmetics);
        }
    }

    luminaElementi(standalone = false, Extras = false): void {
        const GetCosmetics = Extras;
        if (
            standalone || GetCosmetics
                ? Core.checkInventory(
                      Core.ensureLoad(8919).rewards.map((x) => x.id),
                      undefined,
                      { toInv: false },
                  )
                : Core.checkInventory("Providence")
        ) {
            return;
        }

        if (!bot.quests.isUnlocked(8919)) {
            this.getAM(false, { cosmetics: Extras });
        }

        Core.addDrop("Providence");
        Core.ensureAccept(8919);
        Core.logger('Doing the extra quest for the 51% weapon "Providence"');

        this.unboundTome(Core.checkInventory("Book of Arcana") ? 30 : 31);
        this.bookOfArcana(Extras);

        this.bossItemCheck(2500, "Elemental Binding");

        SOWM.prismaticSeams(2000);

        this.unboundThread(100);

        for (const Enh of [
            [71629, 43050],
            [70752, 42601],
        ]) {
            if (Core.checkInventory(Enh[0])) {
                continue;
            }

            Adv.buyItem("forge", 2142, Enh[0], undefined, Enh[1]);
        }

        Core.ensureComplete(8919);
        bot.wait.forPickup("Providence");
        Core.logger('Weapon obtained: "Providence" [51% damage to all]');
    }

    //#region Books
    bookOfMagus(): void {
        //Book of Magus: Incantation
        if (Core.checkInventory("Book of Magus")) {
            return;
        }

        Core.farmingLogger("Book of Magus", 1);
        this.unboundTome(1);
        Core.ensureAccept(8913);
        BLOD.getBlindingWeapon(WeaponOfDestiny.Mace);
        BLOD.brilliantAura(200);

        Scroll.buyScroll(Scrolls.Mystify, 50);
        SOWM.prismaticSeams(250);

        Core.huntMonster("noxustower", "Lightguard Caster", "Mortal Essence", 100, { isTemp: false });
        Core.huntMonster("portalmazec", "Pactagonal Knight", "Orthogonal Energy", 150, { isTemp: false });

        Core.equipClass(ClassType.Solo);
        Core.huntMonster("timeinn", "Ezrajal", "Celestial Magia", 50, { isTemp: false });

        Core.ensureComplete(8913);
        bot.wait.forPickup("Book of Magus");
        Core.toBank(...BLOD.bLoDItems);
    }

    bookOfFire(Extras = false): void {
        //Book of Fire: Immolation
        const GetCosmetics = Extras;
        if (
            GetCosmetics
                ? Core.checkInventory(
                      Core.ensureLoad(8914).rewards.map((x) => x.id),
                      undefined,
                      { toInv: false },
                  )
                : Core.checkInventory("Book of Fire")
        ) {
            return;
        }

        Core.farmingLogger("Book of Fire", 1);

        this.unboundTome(1);
        Core.ensureAccept(8914);

        Scroll.buyScroll(Scrolls.FireStorm, 50);

        Core.equipClass(ClassType.Farm);
        Core.huntMonster("fireavatar", "Shadefire Cavalry", "ShadowFire Wisps", 200, { isTemp: false });
        Core.huntMonster("fotia", "Femme Cult Worshiper", "Spark of Life", 200, { isTemp: false });
        Core.huntMonster("mafic", "Living Fire", "Emblazoned Basalt", 200, { isTemp: false });

        Core.equipClass(ClassType.Solo);
        Core.killMonster("underlair", "r6", "Left", "Void Draconian", "Dense Dragon Crystal", 200, { isTemp: false });

        Core.ensureComplete(8914);
        bot.wait.forPickup("Book of Fire");
        Core.toBank(...this.cosmetics);
    }

    bookOfIce(Extras = false): void {
        const GetCosmetics = Extras;
        if (
            GetCosmetics
                ? Core.checkInventory(
                      Core.ensureLoad(8915).rewards.map((x) => x.id),
                      undefined,
                      { toInv: false },
                  )
                : Core.checkInventory("Book of Ice")
        ) {
            return;
        }

        Core.farmingLogger("Book of Ice", 1);

        this.unboundTome(1);
        Core.ensureAccept(8915);

        Scroll.buyScroll(Scrolls.Frostbite, 50);

        Core.addDrop("Ice Diamond");
        Core.equipClass(ClassType.Farm);
        Core.farmingLogger("Ice Diamond", 100);
        while (!bot.shouldExit && !Core.checkInventory("Ice Diamond", 100)) {
            Core.ensureAccept(7279);
            Core.killMonster("kingcoal", "r1", "Left", "*", "Frozen Coal", 10, { log: false });
            Core.ensureComplete(7279);
            bot.wait.forPickup("Ice Diamond");
        }
        Core.equipClass(ClassType.Solo);
        Core.huntMonster("icepike", "Chained Kezeroth", "Rimeblossom", 100, { isTemp: false });
        Core.huntMonster("icepike", "Karok The Fallen", "Starlit Frost", 100, { isTemp: false });
        Core.huntMonster("icedungeon", "Shade of Kyanos", "Temporal Floe", 100, { isTemp: false });

        Core.ensureComplete(8915);
        bot.wait.forPickup("Book of Ice");
        Core.toBank(...this.cosmetics);
    }

    bookOfAether(Extras = false): void {
        const GetCosmetics = Extras;
        if (
            GetCosmetics
                ? Core.checkInventory(
                      Core.ensureLoad(8916).rewards.map((x) => x.id),
                      undefined,
                      { toInv: false },
                  )
                : Core.checkInventory("Book of Aether")
        ) {
            return;
        }

        Core.farmingLogger("Book of Aether", 1);

        this.bossItemCheck(1, "Void Essentia", "Vital Exanima", "Everlight Flame");

        this.unboundTome(1);
        Core.ensureAccept(8916);

        Scroll.buyScroll(Scrolls.Eclipse, 50);

        Core.equipClass(ClassType.Solo);
        Core.huntMonster("streamwar", "Second Speaker", "A Fragment of the Beginning", undefined, { isTemp: false });
        // Core.HuntMonster("fireavatar", "Avatar Tyndarius", "Everlight Flame", isTemp: false); //1% Drop Rate
        Core.ensureComplete(8916);
        bot.wait.forPickup("Book of Aether");
        Core.toBank(...this.cosmetics);
    }

    bookOfArcana(Extras = false): void {
        const GetCosmetics = Extras;
        if (
            GetCosmetics
                ? Core.checkInventory(
                      Core.ensureLoad(8917).rewards.map((x) => x.id),
                      undefined,
                      { toInv: false },
                  )
                : Core.checkInventory("Book of Arcana")
        ) {
            return;
        }

        Core.farmingLogger("Book of Arcana", 1);

        this.bossItemCheck(
            1,
            "The Mortal Coil",
            "The Divine Will",
            "Insatiable Hunger",
            "Undying Resolve",
            "Calamitous Ruin",
        );

        this.unboundTome(1);
        Core.ensureAccept(8917);

        Scroll.buyScroll(Scrolls.EtherealCurse, 50);

        Core.ensureComplete(8917);
        bot.wait.forPickup("Book of Arcana");
        Core.toBank(...this.cosmetics);
    }

    //#endregion
    //#region Materials
    mysticScribingKit(quant = 99): void {
        if (Core.checkInventory(73327, quant)) {
            Core.logger(`Mystic Scribing Kit: ${Core.dynamicQuant("Mystic Scribing Kit", false)}/${quant}`);
            return;
        }

        Core.farmingLogger("Mystic Scribing Kit", quant);
        Core.addDrop(73327);

        while (!bot.shouldExit && !Core.checkInventory(73327, quant)) {
            Core.ensureAccept(8909);

            Core.equipClass(ClassType.Farm);
            Core.farmingLogger("Mystic Quills", 49);
            Core.farmingLogger("Mystic Shards", 49);

            if (!Core.isCompletedBefore(3052)) {
                Core.ensureAccept(3052);
                Core.getMapItems(
                    [
                        [1921, 1],
                        [1922, 1],
                        [1923, 1],
                        [1924, 1],
                    ],
                    "dragonrune",
                );
                Core.ensureComplete(3052);
            }

            while (!bot.shouldExit && !Core.checkInventory(["Mystic Shards", "Mystic Quills"], 49)) {
                Core.ensureAccept(3050);
                Core.huntMonster("gilead", "Water Elemental", "Water Core", undefined, { log: false });
                Core.huntMonster("gilead", "Fire Elemental", "Fire Core", undefined, { log: false });
                Core.huntMonster("gilead", "Wind Elemental", "Air Core", undefined, { log: false });
                Core.huntMonster("gilead", "Earth Elemental", "Earth Core", undefined, { log: false });
                Core.huntMonster("gilead", "Mana Elemental", "Mana Core", undefined, { log: false });
                Core.ensureComplete(3050);
            }

            Core.equipClass(ClassType.Solo);
            if (!Core.checkInventory("Semiramis Feather")) {
                Core.addDrop("Semiramis Feather");
                Core.ensureAccept(6286);
                Core.killMonster("guardiantree", "r12", "Left", "Terrane", "Terrane Defeated");
                Core.ensureComplete(6286);
                bot.wait.forPickup("Semiramis Feather");
            }
            Core.huntMonster("deepchaos", "Kathool", "Mystic Ink", undefined, { isTemp: false });

            Core.ensureComplete(8909);
            bot.wait.forPickup("Mystic Scribing Kit");
        }
    }

    prismaticEther(quant = 99): void {
        if (Core.checkInventory(73333, quant)) {
            Core.logger(`Prismatic Ether: ${Core.dynamicQuant("Prismatic Ether", false)}/${quant}`);
            return;
        }

        if (!bot.quests.isUnlocked(8910)) {
            this.mysticScribingKit(1);
        }

        Core.farmingLogger("Prismatic Ether", quant);
        Core.addDrop(73333);
        Core.equipClass(ClassType.Solo);
        while (!bot.shouldExit && !Core.checkInventory(73333, quant)) {
            Core.ensureAccept(8910);
            Core.killMonster("fiendshard", "r9", "Left", 15, "Infernal Ether", undefined, { isTemp: false });
            Core.huntMonster("celestialarenad", "Aranx", "Celestial Ether", undefined, { isTemp: false });
            Core.huntMonster("eternalchaos", "Eternal Drakath", "Chaotic Ether", undefined, { isTemp: false });
            Core.killMonster("shadowattack", "Boss", "Left", "Death", "Mortal Ether", undefined, { isTemp: false });
            Core.huntMonster("gaiazor", "Gaiazor", "Vital Ether", undefined, { isTemp: false });
            Core.ensureComplete(8910);
            bot.wait.forPickup("Prismatic Ether");
        }
    }

    arcaneLocus(quant = 99): void {
        if (Core.checkInventory(73339, quant)) {
            Core.logger(`Arcane Locus: ${Core.dynamicQuant("Arcane Locus", false)}/${quant}`);
            return;
        }

        if (!bot.quests.isUnlocked(8911)) {
            this.prismaticEther(1);
        }

        Core.farmingLogger("Arcane Locus", quant);
        Core.addDrop(73339);

        while (!bot.shouldExit && !Core.checkInventory(73339, quant)) {
            Core.ensureAccept(8911);
            Core.equipClass(ClassType.Farm);
            Core.huntMonster("natatorium", "Anglerfish", "Sea Locus", undefined, { isTemp: false });
            Core.equipClass(ClassType.Solo);
            Core.sleep(2500);
            Core.logger("cutscene happens when joining some maps, give the bot a sec to realise its not broke :P");
            Core.sleep(2500);
            Core.killMonster("skytower", "r13", "Bottom", "*", "Sky Locus", undefined, { isTemp: false });
            Core.huntMonster("elemental", "Mana Golem", "Prime Locus Attunement", 30, { isTemp: false });
            Core.huntMonster("ectocave", "Ektorax", "Earth Locus", undefined, { isTemp: false });
            Core.huntMonster("drakonnan", "Drakonnan", "Fire Locus", undefined, { isTemp: false });

            Core.ensureComplete(8911);
            bot.wait.forPickup(73339);
        }
    }

    //you'll need 35 for everything if ive done maths correctly
    // 5 for the books, and 31 for lumina(30 + 1 for book)
    unboundTome(quant = 36): void {
        if (Core.checkInventory("Unbound Tome", quant)) {
            return;
        }

        if (!bot.quests.isUnlocked(8912)) {
            this.arcaneLocus(1);
        }

        const current = bot.inventory.getQuantity("Unbound Tome");
        const remaining = quant - current;

        Core.farmingLogger("Unbound Tome", quant);

        this.mysticScribingKit(remaining);
        this.prismaticEther(remaining);
        this.arcaneLocus(remaining);

        Core.addDrop("Unbound Tome");

        while (
            !bot.shouldExit &&
            Core.checkInventory(["Mystic Scribing Kit", "Prismatic Ether", "Arcane Locus"]) &&
            !Core.checkInventory("Unbound Tome", quant)
        ) {
            Core.ensureAccept(8912);

            Farm.dragonRunestone(30);
            Adv.buyItem("darkthronehub", 1308, "Exalted Paladin Seal");
            Adv.buyItem("shadowfall", 89, "Forsaken Doom Seal");

            Core.ensureComplete(8912);
            bot.wait.forPickup("Unbound Tome");
        }
    }

    unboundThread(quant = 100): void {
        if (Core.checkInventory("Unbound Thread", quant)) {
            return;
        }

        Core.registerQuests(8869);
        Core.addDrop("Unbound Thread");
        while (!bot.shouldExit && !Core.checkInventory("Unbound Thread", quant)) {
            Core.equipClass(ClassType.Farm);
            Core.huntMonster("DeadLines", "Frenzied Mana", "Captured Mana", 8);
            Core.huntMonster("DeadLines", "Shadowfall Warrior", "Armor Scrap", 8);
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("DeadLines", "Eternal Dragon", "Eternal Dragon Scale");
        }
        bot.wait.forPickup("Unbound Thread");
        Core.cancelRegisteredQuests();
    }
    //#endregion
    private bossItemCheck(quant = 1, ...Items: string[]): void {
        const Item = (map: string, monster: string, item: string, quant: number, EquipBestClassType = true): void => {
            if (this.army) {
                Core.huntMonster(map, monster, item, quant, { isTemp: false, log: EquipBestClassType });
            } else {
                Core.logger(
                    `${item} x${quant} not found, it can be farmed (with an army) from "${monster}" in /${map.toLowerCase()}`,
                    undefined,
                    { stopBot: true },
                );
            }
        };
        for (const item of Items) {
            if (Core.checkInventory(item, quant)) {
                continue;
            }

            switch (item) {
                case "Void Essentia":
                    NSOD.voidAuras(75);
                    Core.equipClass(ClassType.Solo);
                    if (!Core.checkInventory("Void Essence", 25)) {
                        Core.logger('This has been changed you need 25x `Void Essence` from "Flibbitiestgibbet"');
                        return;
                    }
                    // Purchase required items.
                    Adv.buyItem("thevoid", 1406, item);
                    break;
                case "Vital Exanima":
                    Adv.gearStore(undefined, { enhAfter: true });
                    Core.useBossClass();
                    Core.killMonster("dage", "Boss", "Right", "Dage the Evil", item, undefined, { isTemp: false });
                    Adv.gearStore(true, { enhAfter: true });
                    break;
                case "Everlight Flame":
                    Adv.gearStore(undefined, { enhAfter: true });
                    Core.useBossClass();
                    Core.killMonster("fireavatar", "r9", "Left", "Avatar Tyndarius", item, undefined, {
                        isTemp: false,
                    });
                    Adv.gearStore(true, { enhAfter: true });
                    Adv.gearStore(true, { enhAfter: true });
                    break;
                case "Calamitous Ruin":
                    if (Core.checkInventory("Calamitous Ruin")) {
                        return;
                    }
                    this.farmDarkCarnax(!this.army);
                    break;
                case "The Mortal Coil":
                    Adv.gearStore(undefined, { enhAfter: true });
                    Core.equipClass(ClassType.Dodge);
                    Core.killMonster("tercessuinotlim", "Boss2", "Right", "Nulgath", item, undefined, {
                        isTemp: false,
                    });
                    Adv.gearStore(true, { enhAfter: true });
                    Adv.gearStore(true, { enhAfter: true });
                    break;
                case "The Divine Will":
                    Core.equipClass(ClassType.Dodge);
                    Item("celestialpast", "Azalith", item, quant);
                    break;
                case "Insatiable Hunger":
                    Item("voidnightbane", "Nightbane", item, quant);
                    break;
                case "Undying Resolve":
                    bot.quests.updateQuest(8732);
                    Item("theworld", "Encore Darkon", item, quant);
                    break;
                case "Elemental Binding":
                    Item("archmage", "Prismata", item, quant);
                    break;
            }
        }
    }

    private lastMove: number = 0;
    private readonly moveCooldown: number = 2 * 1000;
    private currentZone = "";
    /** Until when the last move runs (C#'s `moveTask` is not completed: 300 ms, the walk, 2.5 s). */
    private moveTaskUntil = 0;

    private moveNightmareCarnax = ({ zone }: EventMap["runToArea"]): void => {
        const zoneLower = zone?.toLowerCase() ?? "";
        if (
            zoneLower === this.currentZone ||
            Date.now() - this.lastMove < this.moveCooldown ||
            Date.now() < this.moveTaskUntil
        ) {
            return;
        }

        this.currentZone = zoneLower;
        this.lastMove = Date.now();

        // C# walks on a Task.Run after 300 ms and keeps it busy 2.5 s more; scripts are
        // single-threaded here, so a handler walks after the delay.
        this.moveTaskUntil = Date.now() + 300 + 2500;
        bot.handlers.once("ArchMageCarnaxMove", 300, () => {
            const y = randomInt(380, 475);
            const x =
                zoneLower === "a" ? randomInt(600, 931) : zoneLower === "b" ? randomInt(25, 326) : randomInt(325, 601);

            bot.player.walkTo(x, y);
        });
    };

    private farmDarkCarnax(attemptSolo = true): void {
        if (Core.checkInventory("Calamitous Ruin")) {
            return;
        }

        DCS.storyline();

        Core.addDrop("Synthetic Viscera");
        Core.jump("Boss", "Left");
        bot.player.setSpawnPoint();
        Core.registerQuests(8872);
        bot.options.attackWithoutTarget = true;

        bot.events.on("runToArea", this.moveNightmareCarnax);

        if (attemptSolo) {
            if (Core.checkInventory("Dragon of Time")) {
                Core.equip("Dragon of Time");
                bot.skills.startSkills("3|2|4|2|1|2", 250, SkillUseMode.WaitForCooldown);
            } else if (Core.checkInventory("Healer (Rare)")) {
                bot.skills.startAdvanced("Healer (Rare)", true, ClassUseMode.Base);
            } else if (Core.checkInventory("Healer")) {
                bot.skills.startAdvanced("Healer", true, ClassUseMode.Base);
            } else {
                Core.equipClass(ClassType.Solo);
            }

            Adv.gearStore(undefined, { enhAfter: true });
            Adv.enhanceEquipped(EnhancementType.Healer, { wSpecial: WeaponSpecial.Elysium });
        }

        while (!bot.shouldExit && !Core.checkInventory("Calamitous Ruin")) {
            while (!bot.shouldExit && !bot.player.alive) {
                bot.sleep(1000);
            }

            if (bot.map.name !== "DarkCarnax") {
                Core.join("DarkCarnax", "Boss", "Right");
            }
            if (bot.player.cell !== "Boss") {
                Core.jump("Boss", "Right");
            }

            if (!bot.player.hasTarget) {
                bot.combat.attack("*");
            } else {
                bot.wait.forMonsterDeath();
                bot.combat.cancelTarget();
            }
        }

        Core.cancelRegisteredQuests();
        bot.options.attackWithoutTarget = false;
        Adv.gearStore(true, { enhAfter: true });

        bot.events.off("runToArea", this.moveNightmareCarnax);

        // Cancel any pending movement
        bot.handlers.remove("ArchMageCarnaxMove");
        this.moveTaskUntil = 0;
    }

    readonly requiredItems: string[] = [
        "ArchMage",
        "Providence",
        "Mystic Scribing Kit",
        "Prismatic Ether",
        "Arcane Locus",
        "Unbound Tome",
        "Book of Magus",
        "Book of Fire",
        "Book of Ice",
        "Book of Aether",
        "Book of Arcana",
        "Arcane Sigil",
        "Archmage",
    ];
    readonly bossDrops: string[] = [
        "Void Essentia",
        "Vital Exanima",
        "Everlight Flame",
        "Calamitous Ruin",
        "The Mortal Coil",
        "The Divine Will",
        "Insatiable Hunger",
        "Undying Resolve",
        "Elemental Binding",
    ];
    private readonly cosmetics: string[] = [
        "Arcane Sigil",
        "Arcane Floating Sigil",
        "Sheathed Archmage's Staff",
        "Archmage's Cowl",
        "Archmage's Cowl and Locks",
        "Archmage's Staff",
        "Archmage's Robes",
        "Divine Mantle",
        "Divine Veil",
        "Divine Veil and Locks",
        "Prismatic Floating Sigil",
        "Sheathed Providence",
        "Prismatic Sigil",
        "Astral Mantle",
    ];
    private army = false;
}

export const scriptOptions = defineScriptOptions(
    "ArchMage",
    [
        option.bool(
            "lumina_elementi",
            "Lumina Elementi",
            "Todo the last quest or not, for the 51% wep(takes awhileand will require aditional boss items.) [On by default]",
            true,
        ),
        option.bool(
            "cosmetics",
            "Get Cosmetics",
            "Gets the cosmetic rewards (redoes quests if you don't have them, disable to just get ArchMage and the weapon) [On by default]",
            false,
        ),
        option.bool(
            "army",
            "Armying?",
            "use when running on 4 accounts at once only, will probably get out of sync.) [Off by default]",
            false,
        ),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    const script = new CoreArchMage();
    Core.bankingBlackList.push(...script.requiredItems, ...script.bossDrops);
    Core.setOptions();

    script.getAM(true, archMageChoices());

    Core.setOptions(false);
}
