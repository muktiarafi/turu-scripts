/*
name: AQW 20th Anniversary Story
description: This will finish the storyline of 20th anniversary.
tags: 20th-anniv, free-acs, seasonal
*/
// Port of Scripts/Seasonal/AqwBirthday/20thAnniversary.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class AnniversaryofDoom {
    anniversary(): void {
        if (Core.isCompletedBefore(8898) && !Core.isSeasonalMapActive("yulgarparty")) {
            return;
        }

        Story.preLoad(this.anniversary);

        this.yulgarparty();
        this.zombae();
        this.mermaidsushi();
        this.free500ACSPLEASE();
        this.spacepwny();
        this.deathofgames();
    }

    yulgarparty(): void {
        if (Core.isCompletedBefore(8876)) {
            return;
        }

        // 8874 Friends by the Fireplace
        Story.mapItemQuest(8874, "yulgarparty", [10675, 10676, 10677, 10678, 10679, 10680, 10681, 10682, 10683]);

        // 8875 Allies at the Entrance,
        Story.mapItemQuest(8875, "yulgarparty", [10684, 10685, 10686, 10687, 10688, 10689, 10690]);

        // 8876 Mates near the Music,
        Story.mapItemQuest(8876, "yulgarparty", [10691, 10692, 10693, 10694, 10695, 10696, 10697, 10698, 10699]);
    }

    zombae(): void {
        if (Core.isCompletedBefore(8883)) {
            return;
        }

        Core.equipClass(ClassType.Farm);

        // 8877 O-(De)kay Cupid,
        Story.killQuest(8877, "zombae", "Bachelor");

        // 8878 Ghosting my Ex-Goulfiends,
        Story.killQuest(8878, "zombae", "Bachelorette");

        // 8879 You're Dead to Me,
        if (!Story.questProgression(8879)) {
            Core.ensureAccept(8879);
            Core.getMapItem(10700, 1, "zombae");
            Core.huntMonster("zombae", "Zombette", "Girl With Brains", 1);
            Core.ensureComplete(8879);
        }

        // 8880 Swipe 4 Rich lich
        if (!Story.questProgression(8880)) {
            Core.ensureAccept(8880);
            Core.getMapItem(10701, 1, "zombae");
            Core.huntMonster("zombae", "Zombro", "Richest Zombie", 1);
            Core.ensureComplete(8880);
        }

        // 8881 A Real Grave Digger
        if (!Story.questProgression(8881)) {
            Core.ensureAccept(8881);
            Core.getMapItem(10702, 1, "zombae");
            Core.huntMonster("zombae", "Zombroski", "GRAAAAAINS", 1);
            Core.ensureComplete(8881);
        }

        // 8882 The Love of your Unlife
        if (!Story.questProgression(8882)) {
            Core.ensureAccept(8882);
            Core.getMapItem(10703, 1, "zombae");
            Core.huntMonster("zombae", "Zombetter", "Fiend With Benefits", 1);
            Core.ensureComplete(8882);
        }

        Core.equipClass(ClassType.Solo);
        // 8883 The Ultimate Ghoul Fiend
        Story.killQuest(8883, "zombae", "Ghoul Fiend");
    }

    mermaidsushi(): void {
        if (Core.isCompletedBefore(8892)) {
            return;
        }

        Core.equipClass(ClassType.Farm);
        // 8884 S'KARIN WANT MOGLIN POPPERS,
        Story.killQuest(8884, "mermaidsushi", "Undead Moglin");

        // 8885 S'KARIN WANT HAMSTEAK,
        Story.killQuest(8885, "mermaidsushi", "Haunted Hamster");

        // 8886 S'KARIN WANT A SKELLO MOLD,
        Story.killQuest(8886, "mermaidsushi", "SkeleKitten");

        // 8887 S'KARIN WANT OFFAL BIRD FOOD,
        Story.killQuest(8887, "mermaidsushi", "Undead Turkey");

        Core.equipClass(ClassType.Solo);
        // 8888 S'KARIN WANT WINGS,
        Story.killQuest(8888, "mermaidsushi", "Dedbull");

        // 8889 S'KARIN WANT MERMAID SUSHI
        Story.mapItemQuest(8889, "mermaidsushi", 10719);

        // 8890 Mer-Angel Fish Food?!
        Story.killQuest(8890, "mermaidsushi", "Necro Minion");

        // 8891 S'KARIN NO WANT GO VIRAL
        Story.killQuest(8891, "mermaidsushi", "Customer S'karin");

        // 8892 Gore-Made for This
        Story.killQuest(8892, "mermaidsushi", "Die Fieri");
    }

    free500ACSPLEASE(): void {
        if (Core.isCompletedBefore(8893)) {
            return;
        }

        bot.handlers.remove("AFK Handler");

        // 8893 AFK Quest
        if (!Story.questProgression(8893)) {
            Core.join("afkquest");
            bot.send.packet("%xt%zm%afk%0%false%");
            Core.logger(`**DO NOT CLICK THE GAME SCREEN** this Will Take ~5minutes, Go touch some grass 👍`);
            Core.sleep(360000);
            Core.logger("Game Complete. You're Welcome for the Acs");
        }
    }

    spacepwny(): void {
        if (Core.isCompletedBefore(8898)) {
            return;
        }

        bot.options.restPackets = true;

        Core.equipClass(ClassType.Farm);
        // 8894 Plague of Zom-Bays
        if (!Story.questProgression(8894)) {
            Core.ensureAccept(8894);
            Core.killMonster("spacepwny", "Enter", "Spawn", "Zom-Bay", "Zom-Bay Defeated", 10);
            Core.ensureComplete(8894);
        }

        // 8895 Foal of (Thorough) Dread
        if (!Story.questProgression(8895)) {
            Core.ensureAccept(8895);
            Core.killMonster("spacepwny", "r2", "Left", "Thoroughdred", "Thoroughdred Defeated", 10);
            Core.ensureComplete(8895);
        }

        // 8896 Create a Stable Base
        if (!Story.questProgression(8896)) {
            Core.ensureAccept(8896);
            Core.killMonster("spacepwny", "r2", "Left", "NecroPrancer", "NecroPrancer Defeated", 10);
            Core.ensureComplete(8896);
        }

        // 8897 Bonies & Bonies & Bonies
        if (!Story.questProgression(8897)) {
            Core.ensureAccept(8897);
            Core.killMonster("spacepwny", "r3", "Left", "*", "Mare Carnage", 100);
            Core.ensureComplete(8897);
        }

        Core.equipClass(ClassType.Solo);
        // 8898 Defeat Mr DED
        Story.killQuest(8898, "spacepwny", "Mr DED");
    }

    deathofgames(): void {
        if (Core.isCompletedBefore(8924)) {
            return;
        }

        Story.preLoad(this.deathofgames);

        //Dungeons & DOOMFights 8899
        if (!Story.questProgression(8899)) {
            Core.ensureAccept(8899);
            Core.huntMonster("deathofgames", "8-Bit Skelly", "8-Bit Skeletons Destroyed", 8);
            Core.huntMonster("deathofgames", "8-Bit Sepulchure", "8-bit Sepulchure Deboned", 1);
            Core.ensureComplete(8899);
        }

        //AQ3Destruction 8900
        if (!Story.questProgression(8900)) {
            Core.ensureAccept(8900);
            Core.huntMonster("deathofgames", "3D Flying Eye", "Flying Eye De-Sighted", 5);
            Core.huntMonster("deathofgames", "Trolluk", "Trolluk Destroyed", 1);
            Core.huntMonster("deathofgames", "Clawg", "Clawg De-clawed", 3);
            Core.ensureComplete(8900);
        }

        //OverSoul Under Attack 8901
        if (!Story.questProgression(8901)) {
            Core.ensureAccept(8901);
            Core.huntMonster("deathofgames", "Vampire Knight", "Vampire Knight Defeated", 6);
            Core.huntMonster("deathofgames", "Black Dragon", "Black Dragon Defeated", 1);
            Core.ensureComplete(8901);
        }

        //HeroSmashed 8902
        if (!Story.questProgression(8902)) {
            Core.ensureAccept(8902);
            Core.huntMonster("deathofgames", "Rider", "Riders Run Off", 5);
            Core.huntMonster("deathofgames", "Blaster Master", "Blaster Master Blasted", 1);
            Core.huntMonster("deathofgames", "Super Death", "Super Death... Deaded", 1);
            Core.ensureComplete(8902);
        }

        //EpicDuel vs DoG 8907
        if (!Story.questProgression(8907)) {
            Core.ensureAccept(8907);
            Core.huntMonster("deathofgames", "God of War", "God of War Defeated", 1);
            Core.huntMonster("deathofgames", "Cyber Hunter", "Cyber Hunters Defeated", 6);
            Core.ensureComplete(8907);
        }

        //AQWorlds At Risk 8920
        if (!Story.questProgression(8920)) {
            Core.ensureAccept(8920);
            Core.huntMonster("deathofgames", "Skeletal Fire Mage", "Skeletal Enemies Defeated", 8);
            Core.huntMonster("deathofgames", "Drakath", "Drakath Defeated", 1);
            Core.ensureComplete(8920);
        }

        //MechQuest For Glory 8921
        if (!Story.questProgression(8921)) {
            Core.ensureAccept(8921);
            Core.huntMonster("deathofgames", "Newbatron Prime", "Newbatron Primes Defeated", 5);
            Core.huntMonster("deathofgames", "ShadowScythe Mecha", "ShadowScythe Mecha Defeated", 3);
            Core.huntMonster("deathofgames", "SkullCrusher Mecha", "Skull Crusher Mecha Defeated", 1);
            Core.ensureComplete(8921);
        }

        //DragonFables &amp; Lore 8922
        if (!Story.questProgression(8922)) {
            Core.ensureAccept(8922);
            Core.huntMonster("deathofgames", "Titan Fluffy", "Titan Fluffy Defeated", 1);
            Core.huntMonster("deathofgames", "Fire Elemental", "Fire Elementals Snuffed", 5);
            Core.huntMonster("deathofgames", "Xan", "Xan Defeated", 1);
            Core.ensureComplete(8922);
        }

        //AdventureQuest for Victory 8923
        if (!Story.questProgression(8923)) {
            Core.ensureAccept(8923);
            Core.huntMonster("deathofgames", "Halenro the Paladin", "Halenro Run Off", 1);
            Core.huntMonster("deathofgames", "Moglin Ghost", "Moglin Ghosts Banished", 5);
            Core.huntMonster("deathofgames", "Mysterious Stranger", "Mysterious Stranger Defeated", 1);
            Core.ensureComplete(8923);
        }

        //Battle On... FOREVER! 8924
        Story.killQuest(8924, "deathofgames", "Death of Games");
    }
}

export default function main(): void {
    const script = new AnniversaryofDoom();
    Core.setOptions();

    script.anniversary();

    Core.setOptions(false);
}
