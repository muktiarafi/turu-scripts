/*
name: Buy Scrolls
description: This script will buy the selected scrolls.
tags: scroll, enrage, mystic, parchment, spellcraft, decay
*/
// Port of Scripts/Farm/BuyScrolls.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, choices, defineScriptOptions, option } from "turu";
import { configEnum, Core } from "../core/CoreBots";
import { CoreFarms } from "../core/CoreFarms";

const Farm = new CoreFarms();

export enum Scrolls {
    Fireball = 2295,
    Shadowburn = 2296,
    PlasmaBolt = 2297,
    DarkEnergy = 2298,
    SsikarisBreath = 2299,
    ShadowBolt = 2300,
    DiamondCage = 2301,
    Exorcise = 2302,
    AcidRain = 2303,
    HeartBeat = 2304,
    Corrosion = 2305,
    CrushingWave = 2306,
    WindStrike = 2307,
    ArcLightning = 2308,
    SpiritRend = 2309,
    DarkArc = 2310,
    Chains = 2311,
    Eclipse = 2312,
    Purge = 2313,
    ScorchedSteel = 2314,
    FireBolt = 2315,
    HolyBolt = 2316,
    BlessedShard = 2317,
    Frostbite = 2318,
    Geyser = 2319,
    FireFlare = 2320,
    FrostFlare = 2321,
    PlagueFlare = 2322,
    ChargedFlare = 2323,
    DoomFlare = 2324,
    HolyFlare = 2325,
    BlindingLight = 2326,
    GuardianBlast = 2327,
    ShadowBlade = 2328,
    FuriousGale = 2329,
    Enrage = 2330,
    Decay = 2331,
    DeathPact = 2332,
    CantorsLament = 2333,
    PulseCompression = 2334,
    Dissonance = 2335,
    SoulCrush = 2336,
    VoidStrike = 2337,
    PsychicWave = 2338,
    ChaosFog = 2339,
    Torment = 2340,
    ShiftBurn = 2341,
    FreezingFlame = 2342,
    FireStorm = 2343,
    Mystify = 2344,
    Wither = 2345,
    Underworld = 2346,
    EtherealSlumber = 2347,
    EtherealCurse = 2348,
    DarkGrip = 2349,
    Weaken = 2350,
    TalonTwisting = 2351,
    Petrify = 2352,
    Cripple = 2353,
}

export class BuyScrolls {
    buyScroll(scroll: Scrolls, quant: number = -1, useMysticParchment = false): void {
        useMysticParchment = useMysticParchment || bot.config!.get<boolean>("UseMysticParchment");
        const QuestData = Core.initializeWithRetries(() => Core.ensureLoad(scroll));
        if (QuestData == null) {
            Core.logger(`Quest for ${Scrolls[scroll]} not found, please report this to the devs.`);
            return;
        }
        const scrollName = QuestData.rewards[0].name;
        const maxStack = QuestData.rewards[0].maxStack;
        quant = quant === -1 || quant > maxStack ? maxStack : quant;

        if (Core.checkInventory(scrollName, quant)) {
            return;
        }

        const ink = QuestData.requirements[0].name;

        Core.logger(`Getting you ${quant}x ${scrollName}`);
        Core.addDrop(scrollName);

        Farm.spellCraftingREP(5);

        const gatherMaterials = !useMysticParchment
            ? () => {
                  if (!Core.checkInventory(ink, 5)) {
                      if (!Core.checkInventory("Arcane Quill", 1)) {
                          if (!Core.checkInventory("Gold Voucher 500k", 2)) {
                              Farm.gold(1000000);
                              Core.buyItem("spellcraft", 693, "Gold Voucher 500k", 2);
                          }
                          Core.buyItem("spellcraft", 693, 17391, 10, 7686, 1);
                      }
                      Core.buyItem("spellcraft", 622, ink, 5);
                  }
              }
            : () => {
                  Core.killMonster("tercessuinotlim", "m2", "Left", "*", "Mystic Parchment", quant / 10, {
                      isTemp: false,
                  });
                  Core.buyItem("spellcraft", 549, ink, 5);
              };

        while (!bot.shouldExit && !Core.checkInventory(scrollName, quant)) {
            gatherMaterials();
            Core.ensureAccept(QuestData.id);
            Core.ensureCompleteMulti(QuestData.id);
            bot.wait.forDrop(scrollName);
            bot.wait.forPickup(scrollName);
            Core.logger(`${scrollName} x${bot.inventory.getQuantity(scrollName)}/${quant}`);
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "BuyScrolls",
    [
        option.bool(
            "UseMysticParchment",
            "Use Mystic Parchment",
            "Use Mystic Parchment instead of gold To Buy Ink",
            false,
        ),
        option.choice("scrollSelect", "Scroll of", "Select the scroll of your choise", choices(Scrolls)),
        option.int("scrollAmount", "How many", "Write -1 to buy up to max. stack", -1),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    const script = new BuyScrolls();
    Core.setOptions();

    script.buyScroll(configEnum("scrollSelect", Scrolls, Scrolls.Fireball), bot.config.get<number>("scrollAmount"));

    Core.setOptions(false);
}
