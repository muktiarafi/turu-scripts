/*
name: CLW Skills Test
description: Tests CoreLoneWolf class presets and skill-engine modes in isolation.
tags: prototype, corelonewolf, skills, test
*/
// Port of Extras/CLWSkillsTest.cs from UltrasLW by l0newolf12 (https://github.com/l0newolf12/UltrasLW, 8e48a9e).
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, choices, defineScriptOptions, option } from "turu";
import { Core } from "../../core/CoreBots";
import { type ClassPreset, CoreLoneWolf } from "../CoreLoneWolf";

export enum SkillPresetChoice {
    Legion_Revenant = "Legion_Revenant",
    LightCaster = "LightCaster",
    ArchFiend = "ArchFiend",
    Void_Highlord = "Void_Highlord",
    Hollowborn_Vindicator = "Hollowborn_Vindicator",
    Verus_DoomKnight = "Verus_DoomKnight",
    Dragon_of_Time = "Dragon_of_Time",
    Bard = "Bard",
    Kings_Echo = "Kings_Echo",
    Arcana_Invoker = "Arcana_Invoker",
    Chrono_ShadowHunter = "Chrono_ShadowHunter",
    Chaos_Slayer = "Chaos_Slayer",
    Shaman = "Shaman",
    StoneCrusher = "StoneCrusher",
    ArchPaladin = "ArchPaladin",
    Lord_Of_Order = "Lord_Of_Order",
    Oracle = "Oracle",
    Guardian = "Guardian",
    Chaos_Avenger = "Chaos_Avenger",
    Scion_of_Flames = "Scion_of_Flames",
    Arachnomancer = "Arachnomancer",
    Imperial_Chunin = "Imperial_Chunin",
    SSOT = "SSOT",
    Paladin_Chronomancer = "Paladin_Chronomancer",
    Great_Thief = "Great_Thief",
    Glaceran_Warlord = "Glaceran_Warlord",
    Archivist_of_Time = "Archivist_of_Time",
    Draco_Knight = "Draco_Knight",
    Phantom_Chronomancer = "Phantom_Chronomancer",
    Interstellar_Knight = "Interstellar_Knight",
    Martial_Artist = "Martial_Artist",
    Chaos_Shaper = "Chaos_Shaper",
    Kathool_Adept = "Kathool_Adept",
    Lich = "Lich",
}

export class CLWSkillsTest {
    loneWolf: CoreLoneWolf = new CoreLoneWolf();

    private static readonly logPrefix = "CLW Skills Test";
    private static readonly monsterMapId = 1;
    private static readonly testPollDelay = 150;

    run(): void {
        const durationSeconds = bot.config!.get<number>("TestDurationSeconds");
        if (durationSeconds <= 0) {
            Core.logger("Test duration must be greater than 0 seconds.", CLWSkillsTest.logPrefix, { stopBot: true });
            return;
        }

        const selectedPreset = bot.config.get<SkillPresetChoice>("SelectedPreset");
        const useEnhancements = bot.config.get<boolean>("UseEnhancements");
        const usePotions = bot.config.get<boolean>("UsePotions");
        const useLightCasterHealingMode = bot.config.get<boolean>("UseLightCasterHealingMode");
        const useKingsEchoSkill3 = bot.config.get<boolean>("UseKingsEchoSkill3");
        const useShamanFarmMode = bot.config.get<boolean>("UseShamanFarmMode");
        const useChronoShadowHunterGunslingerMode = bot.config.get<boolean>("UseChronoShadowHunterGunslingerMode");
        const useChaosAvengerOptimizedMode = bot.config.get<boolean>("UseChaosAvengerOptimizedMode");
        const useGlaceranWarlordHealingMode = bot.config.get<boolean>("UseGlaceranWarlordHealingMode");
        const useKathoolAdeptOptimizedMode = bot.config.get<boolean>("UseKathoolAdeptOptimizedMode");
        const preset = this.getClassPreset(
            selectedPreset,
            useLightCasterHealingMode,
            useShamanFarmMode,
            useChronoShadowHunterGunslingerMode,
            useChaosAvengerOptimizedMode,
            useGlaceranWarlordHealingMode,
            useKathoolAdeptOptimizedMode,
        );

        Core.join("classhall");
        this.loneWolf.equipClass(preset);

        if (bot.shouldExit) {
            return;
        }

        if (useEnhancements) {
            this.loneWolf.prepareEnhancements(
                preset.baseEnhancement,
                preset.capeEnhancement,
                preset.helmEnhancement,
                preset.weaponEnhancement,
                undefined,
                preset.weaponEnhancementFallbacks,
            );
        }

        if (usePotions) {
            if (preset.elixir === "Divine Elixir") {
                preset.elixir = this.loneWolf.getDivineElixir(preset, "tester", CLWSkillsTest.logPrefix);
            }

            this.loneWolf.preparePotions(preset.tonic, preset.elixir, preset.combatPotion);
        }

        if (bot.shouldExit) {
            return;
        }

        Core.join("classhall");

        if (usePotions) {
            this.loneWolf.usePotions(preset.tonic, preset.elixir, preset.combatPotion);
        }

        if (bot.shouldExit) {
            return;
        }

        Core.jump("r4", "Left");
        this.loneWolf.maintainTarget(CLWSkillsTest.monsterMapId);
        this.loneWolf.startSkillEngine(
            preset.skills,
            "tester",
            false,
            CLWSkillsTest.logPrefix,
            preset.skillMode,
            useKingsEchoSkill3,
        );

        Core.logger(
            `${CLWSkillsTest.logPrefix} started ${preset.className} with ${preset.skillMode} mode for ${durationSeconds} seconds.`,
        );

        const startedAt = Date.now();

        while (!bot.shouldExit && (Date.now() - startedAt) / 1000 < durationSeconds) {
            this.loneWolf.maintainTarget(CLWSkillsTest.monsterMapId);
            bot.sleep(CLWSkillsTest.testPollDelay);
        }

        this.loneWolf.stopSkillEngine();

        if (!bot.shouldExit) {
            Core.logger(`${CLWSkillsTest.logPrefix} completed ${preset.className} skill test.`);
        }
    }

    private getClassPreset(
        selectedPreset: SkillPresetChoice,
        useLightCasterHealingMode: boolean,
        useShamanFarmMode: boolean,
        useChronoShadowHunterGunslingerMode: boolean,
        useChaosAvengerOptimizedMode: boolean,
        useGlaceranWarlordHealingMode: boolean,
        useKathoolAdeptOptimizedMode: boolean,
    ): ClassPreset {
        return selectedPreset === SkillPresetChoice.LightCaster
            ? this.loneWolf.lightCaster(useLightCasterHealingMode)
            : selectedPreset === SkillPresetChoice.ArchFiend
              ? this.loneWolf.archFiend()
              : selectedPreset === SkillPresetChoice.Void_Highlord
                ? this.loneWolf.voidHighlord()
                : selectedPreset === SkillPresetChoice.Hollowborn_Vindicator
                  ? this.loneWolf.hollowbornVindicator()
                  : selectedPreset === SkillPresetChoice.Verus_DoomKnight
                    ? this.loneWolf.verusDoomKnight()
                    : selectedPreset === SkillPresetChoice.Dragon_of_Time
                      ? this.loneWolf.dragonOfTime()
                      : selectedPreset === SkillPresetChoice.Bard
                        ? this.loneWolf.bard()
                        : selectedPreset === SkillPresetChoice.Kings_Echo
                          ? this.loneWolf.kingsEcho()
                          : selectedPreset === SkillPresetChoice.Arcana_Invoker
                            ? this.loneWolf.arcanaInvoker()
                            : selectedPreset === SkillPresetChoice.Chrono_ShadowHunter
                              ? this.loneWolf.chronoShadowHunter(useChronoShadowHunterGunslingerMode)
                              : selectedPreset === SkillPresetChoice.Chaos_Slayer
                                ? this.loneWolf.chaosSlayer()
                                : selectedPreset === SkillPresetChoice.Shaman
                                  ? this.loneWolf.shaman(useShamanFarmMode)
                                  : selectedPreset === SkillPresetChoice.StoneCrusher
                                    ? this.loneWolf.stoneCrusher()
                                    : selectedPreset === SkillPresetChoice.ArchPaladin
                                      ? this.loneWolf.archPaladin()
                                      : selectedPreset === SkillPresetChoice.Lord_Of_Order
                                        ? this.loneWolf.lordOfOrder()
                                        : selectedPreset === SkillPresetChoice.Oracle
                                          ? this.loneWolf.oracle()
                                          : selectedPreset === SkillPresetChoice.Guardian
                                            ? this.loneWolf.guardian()
                                            : selectedPreset === SkillPresetChoice.Chaos_Avenger
                                              ? this.loneWolf.chaosAvenger(useChaosAvengerOptimizedMode)
                                              : selectedPreset === SkillPresetChoice.Scion_of_Flames
                                                ? this.loneWolf.scionOfFlames()
                                                : selectedPreset === SkillPresetChoice.Arachnomancer
                                                  ? this.loneWolf.arachnomancer()
                                                  : selectedPreset === SkillPresetChoice.Imperial_Chunin
                                                    ? this.loneWolf.imperialChunin()
                                                    : selectedPreset === SkillPresetChoice.SSOT
                                                      ? this.loneWolf.ssot()
                                                      : selectedPreset === SkillPresetChoice.Paladin_Chronomancer
                                                        ? this.loneWolf.paladinChronomancer()
                                                        : selectedPreset === SkillPresetChoice.Great_Thief
                                                          ? this.loneWolf.greatThief()
                                                          : selectedPreset === SkillPresetChoice.Glaceran_Warlord
                                                            ? this.loneWolf.glaceranWarlord(
                                                                  useGlaceranWarlordHealingMode,
                                                              )
                                                            : selectedPreset === SkillPresetChoice.Archivist_of_Time
                                                              ? this.loneWolf.archivistOfTime()
                                                              : selectedPreset === SkillPresetChoice.Draco_Knight
                                                                ? this.loneWolf.dracoKnight()
                                                                : selectedPreset ===
                                                                    SkillPresetChoice.Phantom_Chronomancer
                                                                  ? this.loneWolf.phantomChronomancer()
                                                                  : selectedPreset ===
                                                                      SkillPresetChoice.Interstellar_Knight
                                                                    ? this.loneWolf.interstellarKnight()
                                                                    : selectedPreset ===
                                                                        SkillPresetChoice.Martial_Artist
                                                                      ? this.loneWolf.martialArtist()
                                                                      : selectedPreset ===
                                                                          SkillPresetChoice.Chaos_Shaper
                                                                        ? this.loneWolf.chaosShaper()
                                                                        : selectedPreset ===
                                                                            SkillPresetChoice.Kathool_Adept
                                                                          ? this.loneWolf.kathoolAdept(
                                                                                useKathoolAdeptOptimizedMode,
                                                                            )
                                                                          : selectedPreset === SkillPresetChoice.Lich
                                                                            ? this.loneWolf.lich()
                                                                            : this.loneWolf.legionRevenant();
    }
}

export const scriptOptions = defineScriptOptions(
    "CLWSkillsTest",
    [
        option.choice(
            "SelectedPreset",
            "Class Preset",
            "Select the CoreLoneWolf class preset to test.",
            choices(SkillPresetChoice),
            SkillPresetChoice.Legion_Revenant,
        ),
        option.bool(
            "UseEnhancements",
            "Use Enhancements",
            "Prepare the selected class preset enhancement loadout.",
            true,
        ),
        option.bool("UsePotions", "Use Potions", "Prepare and use the selected class preset potion loadout.", true),
        option.bool(
            "UseLightCasterHealingMode",
            "Use LightCaster Healing Mode",
            "Prioritize LightCaster skill 3 and rotate skills 2, 1, and 4 otherwise.",
            false,
        ),
        option.bool(
            "UseKingsEchoSkill3",
            "Use Kings Echo Skill 3",
            "Enable the automatic low-HP survival and taunt skill for King's Echo.",
            true,
        ),
        option.bool("UseShamanFarmMode", "Use Shaman Farm Mode", "Use only Shaman skills 1 and 2.", false),
        option.bool(
            "UseChronoShadowHunterGunslingerMode",
            "Use Chrono ShadowHunter Gunslinger Mode",
            "Use the Gunslinger Stance and skill 0 cycle.",
            false,
        ),
        option.bool(
            "UseChaosAvengerOptimizedMode",
            "Use Chaos Avenger Optimized Mode",
            "Wait for Branded to be consumed before using the next array skill.",
            false,
        ),
        option.bool(
            "UseKathoolAdeptOptimizedMode",
            "Use Kathool Adept Optimized Mode",
            "Use skill 3 at zero or at least ten Feeding stacks, followed by skills 1, 2 and 4.",
            false,
        ),
        option.bool(
            "UseGlaceranWarlordHealingMode",
            "Use Glaceran Warlord Healing Mode",
            "Use the healing Strict combo and Penitence cape for Glaceran Warlord.",
            false,
        ),
        option.int(
            "TestDurationSeconds",
            "Test Duration Seconds",
            "Number of seconds to run the selected skill engine.",
            60,
        ),
    ],
    true,
);

export default function main(): void {
    const script = new CLWSkillsTest();
    bot.skills.stop();
    bot.options.infiniteRange = true;
    bot.config?.configure();

    try {
        script.run();
    } finally {
        script.loneWolf.stopSkillEngine();
    }
}
