/*
name: null
description: null
tags: null
*/
// Port of Scripts/Story/Oasis/CoreOasis.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";
import { CoreAOR } from "../ageofruin/CoreAOR";
import { Core13LoC } from "../lordsofchaos/Core13LoC";

const Story = new CoreStory();
const LOC = new Core13LoC();
const AOR = new CoreAOR();

export class CoreOasis {
    doAll(): void {
        this.duatPalace();
        this.crocRiver();
        this.crulonWed();
        this.meresankhChambers();
        this.carcossaCabins();
        this.carcossaCourt();
        this.whitetigerpoint();
        this.vermillionCliffs();
    }

    carcossaCourt(): void {
        if (Core.isCompletedBefore(10785)) {
            return;
        }

        this.carcossaCabins();

        Story.preLoad(this.carcossaCourt);

        //#region Useable Monsters
        const UseableMonsters = [
            "Elite Lightguard", // UseableMonsters[0],
            "Luma Lifeform", // UseableMonsters[1],
            "Reawakened Priestess", // UseableMonsters[2],
            "Discordant Light", // UseableMonsters[3],
            "Rigaud the Forsaken", // UseableMonsters[4],
            "Eos Soulsworn", // UseableMonsters[5],
            "Doomknight Dryden", // UseableMonsters[6],
            "The Sunsetter", // UseableMonsters[7]
        ];
        //#endregion Useable Monsters
        // 10778 | Carcossa Medal
        if (!Story.questProgression(10778)) {
            Core.huntMonsterQuest(10778, ["carcossacourt", UseableMonsters[0], ClassType.Farm]);
        }

        // 10779 | Mega Carcossa Medal
        if (!Story.questProgression(10779)) {
            Core.huntMonsterQuest(10779, ["carcossacourt", UseableMonsters[0], ClassType.Farm]);
        }

        // 10780 | Pillar Maidens
        if (!Story.questProgression(10780)) {
            Core.huntMonsterQuest(10780, ["carcossacourt", UseableMonsters[2], ClassType.Solo]);
        }

        // 10781 | Appetite for Chaos
        if (!Story.questProgression(10781)) {
            Core.huntMonsterQuest(10781, ["carcossacourt", UseableMonsters[3], ClassType.Solo]);
        }

        // 10782 | Center Pawn
        if (!Story.questProgression(10782)) {
            Core.huntMonsterQuest(10782, ["carcossacourt", UseableMonsters[4], ClassType.Solo]);
        }

        // 10783 | Adore and Adored
        if (!Story.questProgression(10783)) {
            Core.huntMonsterQuest(10783, ["carcossacourt", UseableMonsters[5], ClassType.Solo]);
        }

        // 10784 | Heir of Light, Son of Dark
        if (!Story.questProgression(10784)) {
            Core.huntMonsterQuest(10784, ["carcossacourt", UseableMonsters[6], ClassType.Solo]);
        }

        // 10785 | Three of a Kind
        if (!Story.questProgression(10785)) {
            Core.huntMonsterQuest(10785, ["carcossacourt", UseableMonsters[7], ClassType.Solo]);
        }
    }

    whitetigerpoint(): void {
        if (Core.isCompletedBefore(10329)) {
            return;
        }

        Story.preLoad(this.whitetigerpoint);

        //#region Useable Monsters
        const UseableMonsters = [
            "Astral Spirit", // UseableMonsters[0],
            "Byakko Cub", // UseableMonsters[1],
            "Rigel Stray", // UseableMonsters[2],
            "Lunar Haze", // UseableMonsters[3],
            "Byakko", // UseableMonsters[4]
        ];
        //#endregion Useable Monsters
        // 10320 | Stellar Dynamics
        if (!Story.questProgression(10320)) {
            Core.huntMonsterQuest(10320, ["whitetigerpoint", UseableMonsters[0], ClassType.Farm]);
        }

        // 10321 | Hokey Horoscope
        if (!Story.questProgression(10321)) {
            Story.mapItemQuest(10321, "whitetigerpoint", 14656);
            Story.mapItemQuest(10321, "whitetigerpoint", 14657, 2);
        }

        // 10322 | Tokaki
        if (!Story.questProgression(10322)) {
            Core.huntMonsterQuest(10322, ["whitetigerpoint", UseableMonsters[1], ClassType.Farm]);
        }

        // 10323 | Ekie
        if (!Story.questProgression(10323)) {
            Story.mapItemQuest(10323, "whitetigerpoint", 14658);
            Story.mapItemQuest(10323, "whitetigerpoint", 14659, 2);
        }

        // 10324 | Subaru
        if (!Story.questProgression(10324)) {
            Core.huntMonsterQuest(
                10324,
                ["whitetigerpoint", UseableMonsters[1], ClassType.Farm],
                ["whitetigerpoint", UseableMonsters[0], ClassType.Farm],
            );
        }

        // 10325 | Kagasuki
        if (!Story.questProgression(10325)) {
            Core.huntMonsterQuest(10325, ["whitetigerpoint", UseableMonsters[2], ClassType.Farm]);
        }

        // 10326 | Amefuri
        if (!Story.questProgression(10326)) {
            Core.huntMonsterQuest(10326, ["whitetigerpoint", UseableMonsters[3], ClassType.Farm]);
        }

        // 10327 | Tatara
        if (!Story.questProgression(10327)) {
            Story.mapItemQuest(10327, "whitetigerpoint", 14660);
        }

        // 10328 | Toroki
        if (!Story.questProgression(10328)) {
            Core.huntMonsterQuest(
                10328,
                ["whitetigerpoint", UseableMonsters[3], ClassType.Farm],
                ["whitetigerpoint", UseableMonsters[2], ClassType.Farm],
            );
        }

        // 10329 | Komokuten
        if (!Story.questProgression(10329)) {
            Core.huntMonsterQuest(10329, ["whitetigerpoint", UseableMonsters[4], ClassType.Solo]);
        }
    }

    duatPalace(): void {
        if (Core.isCompletedBefore(10747)) {
            return;
        }

        LOC.tibicenas();
        Story.preLoad(this.duatPalace);

        //#region Useable Monsters
        const UseableMonsters = [
            "Sphinx Guardian", // UseableMonsters[0],
            "Duat Scorpion", // UseableMonsters[1],
            "Royal Sandsea Guard", // UseableMonsters[2],
            "Guardian Hound", // UseableMonsters[3]
        ];
        //#endregion Useable Monsters
        // 10741 | Household Deathstalkers
        if (!Story.questProgression(10741)) {
            Core.huntMonsterQuest(10741, ["duatpalace", UseableMonsters[1], ClassType.Farm]);
        }

        // 10742 | Vexation of the Sphinx
        if (!Story.questProgression(10742)) {
            Core.huntMonsterQuest(10742, ["duatpalace", UseableMonsters[0], ClassType.Farm]);
        }

        // 10743 | In Search of Djehuty
        if (!Story.questProgression(10743)) {
            Core.huntMonsterQuest(10743, ["duatpalace", UseableMonsters[2], ClassType.Farm]);
        }

        // 10744 | Lord of Faiyum
        if (!Story.questProgression(10744)) {
            Core.huntMonsterQuest(10744, ["crocriver", "Sobekemsaph ", ClassType.Solo]);
        }

        // 10745 | The Closing of the Casket
        if (!Story.questProgression(10745)) {
            Core.huntMonsterQuest(10745, ["duatpalace", UseableMonsters[0], ClassType.Farm]);
        }

        // 10746 | Words Sting
        if (!Story.questProgression(10746)) {
            Core.huntMonsterQuest(10746, ["duatpalace", UseableMonsters[1], ClassType.Farm]);
        }

        // 10747 | Majestic Anubians
        if (!Story.questProgression(10747)) {
            Core.huntMonsterQuest(10747, ["duatpalace", UseableMonsters[3], ClassType.Farm]);
        }
    }

    crocRiver(): void {
        if (Core.isCompletedBefore(9539)) {
            return;
        }

        Story.preLoad(this.crocRiver);

        //#region Useable Monsters
        const UseableMonsters = [
            "Sobekemsaph", // UseableMonsters[0]
            "Loamy Lamia", // UseableMonsters[1]
            "Fluvial Lamia", // UseableMonsters[2]
            "Golmoth", // UseableMonsters[3]
            "Flaming Harpy", // UseableMonsters[4
        ];
        //#endregion Useable Monsters
        // 9537 | Remnants of Apophis
        if (!Story.questProgression(9537)) {
            Core.huntMonsterQuest(
                9537,
                ["djinnguard", UseableMonsters[1], ClassType.Solo],
                ["djinnguard", UseableMonsters[2], ClassType.Solo],
            );
        }

        // 9538 | Follower of Faiyum
        if (!Story.questProgression(9538)) {
            Core.huntMonsterQuest(
                9538,
                ["djinnguard", UseableMonsters[3], ClassType.Solo],
                ["djinnguard", UseableMonsters[4], ClassType.Solo],
            );
        }

        // 9539 | Lord of the Oasis
        if (!Story.questProgression(9539)) {
            Core.huntMonsterQuest(9539, ["crocriver", UseableMonsters[0], ClassType.Solo]);
        }
    }

    crulonWed(): void {
        if (Core.isCompletedBefore(9850)) {
            return;
        }

        Story.preLoad(this.crulonWed);

        //#region Useable Monsters
        const UseableMonsters = [
            "King Almoravid", // UseableMonsters[0]
            "Jaan al Nair", // UseableMonsters[1]
            "Silver Elemental", // UseableMonsters[2]
        ];
        //#endregion Useable Monsters
        // 9848 | The Red Rival
        if (!Story.questProgression(9848)) {
            Core.huntMonsterQuest(9848, ["djinnguard", UseableMonsters[1], ClassType.Solo]);
        }

        // 9849 | Pale Invocation
        if (!Story.questProgression(9849)) {
            Core.huntMonsterQuest(9849, ["towerofmirrors", UseableMonsters[2], ClassType.Solo]);
        }

        // 9850 | Moon's Self-Reflection
        if (!Story.questProgression(9850)) {
            Core.huntMonsterQuest(9850, ["crulonwed", UseableMonsters[0], ClassType.Solo]);
        }
    }

    meresankhChambers(): void {
        if (Core.isCompletedBefore(10544) || Core.isCompletedBefore(10545)) {
            return;
        }

        Story.preLoad(this.meresankhChambers);

        //#region Useable Monsters
        const UseableMonsters = [
            "Queen Meresankh", // UseableMonsters[0]
        ];
        //#endregion Useable Monsters
        if (!Core.isMember) {
            // 10544 | The Ninth Queen's Curse
            if (!Story.questProgression(10544)) {
                Core.huntMonsterQuest(10544, ["MeresankhChambers", UseableMonsters[0], ClassType.Solo]);
            }
        } else {
            // 10545 | The Ninth Queen's Curse (Legend)
            if (!Story.questProgression(10545)) {
                Core.huntMonsterQuest(10545, ["MeresankhChambers", UseableMonsters[0], ClassType.Solo]);
            }
        }
    }

    carcossaCabins(): void {
        if (Core.isCompletedBefore(10759)) {
            return;
        }

        AOR.forgeCitrinitas();
        Story.preLoad(this.carcossaCabins);

        //#region Useable Monsters
        const UseableMonsters = [
            "Citrinitas Elemental", // UseableMonsters[0],
            "Citrinitas Match", // UseableMonsters[1],
            "Evolved Lifeform", // UseableMonsters[2],
            "Doom Leech", // UseableMonsters[3],
            "Clementine", // UseableMonsters[4]
        ];
        //#endregion Useable Monsters
        // 10750 | Flickering Hyades
        if (!Story.questProgression(10750)) {
            Story.mapItemQuest(10750, "carcossacabins", 15859);
            Core.huntMonsterQuest(10750, ["carcossacabins", UseableMonsters[0], ClassType.Farm]);
        }

        // 10751 | Red Dawn, Blue Starlight
        if (!Story.questProgression(10751)) {
            Story.mapItemQuest(10751, "carcossacabins", [15860, 15861]);
            Core.huntMonsterQuest(10751, ["carcossacabins", UseableMonsters[1], ClassType.Farm]);
        }

        // 10752 | Shadow of Paradise
        if (!Story.questProgression(10752)) {
            Story.mapItemQuest(10752, "carcossacabins", [15862, 15863]);
        }

        // 10753 | Bed of the Rhine
        if (!Story.questProgression(10753)) {
            Core.huntMonsterQuest(10753, ["carcossacabins", UseableMonsters[1], ClassType.Farm]);
        }

        // 10754 | Liederkreis Lorelei
        if (!Story.questProgression(10754)) {
            Story.mapItemQuest(10754, [
                [15864, 1, "carcossacabins"],
                [15865, 3, "carcossacabins"],
            ]);
        }

        // 10755 | Lacking in Blessings
        if (!Story.questProgression(10755)) {
            Core.huntMonsterQuest(10755, ["carcossacabins", UseableMonsters[2], ClassType.Solo]);
        }

        // 10756 | Hate and Yearning
        if (!Story.questProgression(10756)) {
            Story.mapItemQuest(10756, "carcossacabins", [15866, 15867]);
        }

        // 10757 | Dark Matter Radiation
        if (!Story.questProgression(10757)) {
            Core.huntMonsterQuest(10757, ["carcossacabins", UseableMonsters[3], ClassType.Solo]);
        }

        // 10758 | Amnion Alchemy
        if (!Story.questProgression(10758)) {
            Core.huntMonsterQuest(
                10758,
                ["carcossacabins", UseableMonsters[2], ClassType.Solo],
                ["carcossacabins", UseableMonsters[3], ClassType.Solo],
            );
        }

        // 10759 | Self-Infested
        if (!Story.questProgression(10759)) {
            Core.huntMonsterQuest(10759, ["carcossacabins", UseableMonsters[4], ClassType.Solo]);
        }
    }

    vermillionCliffs(): void {
        if (Core.isCompletedBefore(10772)) {
            return;
        }

        this.whitetigerpoint();

        Story.preLoad(this.vermillionCliffs);

        //#region Useable Monsters
        const UseableMonsters = [
            "Star Sweet", // UseableMonsters[0],
            "Tejat Muse Moth", // UseableMonsters[1],
            "Dawn Knight", // UseableMonsters[2],
            "Vermillion Phoenix", // UseableMonsters[3],
            "Suzaku", // UseableMonsters[4]
        ];
        //#endregion Useable Monsters
        // 10765 | Tamahome
        if (!Story.questProgression(10765)) {
            Core.ensureAccept(10765);
            Core.getMapItem(15885, 6, "vermillioncliffs");
            Core.killMonster("vermillioncliffs", "r4", "Left", "*", "Sweet Konpeito", 8);
            Core.ensureComplete(10765);
        }

        // 10766 | Tasuki
        if (!Story.questProgression(10766)) {
            Story.mapItemQuest(10766, "vermillioncliffs", 15886, 6);
            Core.huntMonsterQuest(10766, ["vermillioncliffs", UseableMonsters[1], ClassType.Farm]);
        }

        // 10767 | Mitsutake
        if (!Story.questProgression(10767)) {
            Core.huntMonsterQuest(
                10767,
                ["vermillioncliffs", UseableMonsters[0], ClassType.Farm],
                ["vermillioncliffs", UseableMonsters[1], ClassType.Farm],
            );
        }

        // 10768 | Nuriko
        if (!Story.questProgression(10768)) {
            Story.mapItemQuest(10768, "vermillioncliffs", [15887, 15888]);
        }

        // 10769 | Chiriko
        if (!Story.questProgression(10769)) {
            Core.huntMonsterQuest(10769, ["vermillioncliffs", UseableMonsters[2], ClassType.Farm]);
        }

        // 10770 | Chichiri
        if (!Story.questProgression(10770)) {
            Core.huntMonsterQuest(10770, ["vermillioncliffs", UseableMonsters[3], ClassType.Farm]);
        }

        // 10771 | Hotohori
        if (!Story.questProgression(10771)) {
            Core.huntMonsterQuest(
                10771,
                ["vermillioncliffs", UseableMonsters[2], ClassType.Solo],
                ["vermillioncliffs", UseableMonsters[3], ClassType.Solo],
            );
        }

        // 10772 | Zochoten
        if (!Story.questProgression(10772)) {
            Core.huntMonsterQuest(10772, ["vermillioncliffs", UseableMonsters[4], ClassType.Solo]);
        }
    }
}
