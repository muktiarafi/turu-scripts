/*
name: null
description: null
tags: null
*/
// Port of Scripts/Story/ShadowsOfChaos/CoreSoC.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";
import { CoreSoW } from "../shadowsofwar/CoreSoW";

const Story = new CoreStory();
const SoW = new CoreSoW();

export class CoreSoC {
    completeCoreSoC(): void {
        if (Core.isCompletedBefore(7768)) {
            Core.logger("Saga Complete: Shadows Of Chaos");
            return;
        }

        SoW.shadowWar();
        this.dualPlane();
        this.chaosAmulet();
        this.lagunaBeach();
        this.laguna();
        this.shadowOff();
        this.brightShadow();
        this.brightChaos();
        this.brightForest();
        this.brightForestPast();
        this.brightForestExtra();
    }

    dualPlane(): void {
        if (Core.isCompletedBefore(7571)) {
            Core.logger("StoryLine Complete:  Dualplane storyline");
            return;
        }

        Story.preLoad(this.dualPlane);

        //Check their Teeth 7561
        Story.killQuest(7561, "dualplane", "Terrarsite");

        //More Investigation Needed 7562
        Story.killQuest(7562, "dualplane", "Droognax");

        //Find Xiang 7563
        Story.mapItemQuest(7563, "dualplane", 7459);

        //Destroy her Creatures 7564
        Story.killQuest(7564, "dualplane", "Terrarsite");

        //Time to un-decorate 7565
        if (!Story.questProgression(7565)) {
            Core.ensureAccept(7565);
            Core.huntMonster("dualplane", "SpiderWing", "Batwings", 4);
            Core.huntMonster("dualplane", "Terrarsite", "Horns", 4);
            Core.ensureComplete(7565);
        }

        //Interrogation Time 7566
        Story.killQuest(7566, "dualplane", "Droognax");

        //Get rid of it! 7567
        Story.killQuest(7567, "dualplane", "Netherpit Lackey");

        //"Convince" the Bruiser 7568
        Story.killQuest(7568, "dualplane", "Netherpit Bruiser");

        //They Never Learn 7569
        if (!Story.questProgression(7569)) {
            Core.ensureAccept(7569);
            Core.huntMonster("dualplane", "Terrarsite", "Monsters Defeated", 10);
            Core.huntMonster("dualplane", "Netherpit Lackey", "Willing Lackey", 1);
            Core.ensureComplete(7569);
        }

        //Get the Mirror! 7570
        Story.mapItemQuest(7570, "dualplane", 7460);

        //Get Her! 7571
        Story.killQuest(7571, "dualplane", "Xiang");
    }

    chaosAmulet(): void {
        if (Core.isCompletedBefore(7688)) {
            Core.logger("StoryLine Complete:  Chaos Amulet storyline");
            return;
        }

        this.dualPlane();

        Story.preLoad(this.chaosAmulet);

        //Mega Shadow Medals
        if (!bot.quests.isUnlocked(7687)) {
            // Shadow Medals 7685
            if (!bot.quests.isUnlocked(7686)) {
                Core.ensureAccept(7685);
                Core.huntMonster("chaosamulet", "Shadowflame Scout", "Shadow Medal", 5);
                Core.ensureComplete(7685);
            }
            Core.ensureAccept(7686);
            Core.huntMonster("chaosamulet", "Shadowflame Scout", "Mega Shadow Medal", 3);
            Core.ensureComplete(7686);
        }

        //Defeat Goldun 7687
        if (!Story.questProgression(7687)) {
            Core.ensureAccept(7687);
            Core.huntMonster("chaosamulet", "Goldun", "Goldun Defeated");
            Core.ensureComplete(7687);
        }

        //Goldun Wants Revenge 7688
        if (!Story.questProgression(7688)) {
            Core.ensureAccept(7688);
            Core.huntMonster("chaosamulet", "Goldun", "Goldun Defeated", 1);
            Core.huntMonster("chaosamulet", "Shadowflame Berserker", "Minion Quelled", 30);
            Core.ensureComplete(7688);
        }
    }

    lagunaBeach(): void {
        if (Core.isCompletedBefore(7700)) {
            Core.logger("StoryLine Complete:  Laguna Beach storyline");
            return;
        }
        Story.preLoad(this.lagunaBeach);

        this.chaosAmulet();

        //Eyes on You 7690
        Story.killQuest(7690, "lagunabeach", "Flying Fisheye");

        //Behind the Tentacles 7691
        Story.mapItemQuest(7691, "lagunabeach", 7636);

        //Overwhelming Minions 7692
        Story.killQuest(7692, "lagunabeach", "ShadowChaos Brigand");

        //Ground Kelp? 7693
        if (!Story.questProgression(7693)) {
            Core.ensureAccept(7693);
            Core.getMapItem(7637, 5, "lagunabeach");
            Core.huntMonster("lagunabeach", "Chaos Kelp", "Kelp Sample", 8);
            Core.ensureComplete(7693);
        }

        //Slug 'em! 7694
        Story.killQuest(7694, "lagunabeach", "ShadowChaos Brigand");

        //Shadows and Chaos 7695
        Story.killQuest(7695, "lagunabeach", "Flying Fisheye");

        //Follow the Trail 7696
        Story.mapItemQuest(7696, "lagunabeach", 7638, 3);
        Story.mapItemQuest(7696, "lagunabeach", 7639);

        //Clear the Tunnel 7697
        Story.killQuest(7697, "lagunabeach", "ShadowChaos Brigand");

        //Blow it up! 7698
        if (!Story.questProgression(7698)) {
            Core.ensureAccept(7698);
            Core.getMapItem(7640, 1, "lagunabeach");
            Core.huntMonster("lagunabeach", "ShadowChaos Gunner", "Grenade", 5);
            Core.ensureComplete(7698);
        }

        //The Heart of the Matter 7699
        Story.killQuest(7699, "lagunabeach", "Heart of Chaos");

        // A Closer Look 7700
        Story.killQuest(7700, "lagunabeach", "Flying Fisheye");
    }

    laguna(): void {
        if (Core.isCompletedBefore(7712)) {
            Core.logger("StoryLine Complete:  Laguna storyline");
            return;
        }

        this.lagunaBeach();

        Story.preLoad(this.laguna);

        //Fight the Crew 7702
        Story.killQuest(7702, "laguna", "ShadowChaos Brigand");

        //Reach the Ship 7703
        Story.mapItemQuest(7703, "laguna", 7675);

        //Get the Bombs 7704
        Story.killQuest(7704, "laguna", "ShadowChaos Gunner");

        //Blow 'er Up! 7705
        if (!Story.questProgression(7705)) {
            Core.ensureAccept(7705);
            Core.getMapItem(7676, 1, "laguna");
            Core.huntMonster("laguna", "ShadowChaos Gunner", "Matchstick", 4);
            Core.ensureComplete(7705);
        }

        //Defeat the Captain 7706
        Story.killQuest(7706, "laguna", "Captain Laguna");

        //More Pirates 7707
        Story.killQuest(7707, "laguna", "ShadowChaos Brigand");

        //Steal for Scouts 7708
        Story.killQuest(7708, "laguna", "Chaos Roe");

        //Make them Work 7709
        Story.killQuest(7709, "laguna", "Chaos Burrower");

        //Find the Amulet 7710
        if (!Story.questProgression(7710)) {
            Core.ensureAccept(7710);
            Core.getMapItem(7678, 1, "laguna");
            Core.huntMonster("laguna", "ShadowChaos Brigand", "Monster Slain", 9);
            Core.ensureComplete(7710);
        }

        //Retrieve the Amulet 7711
        Story.killQuest(7711, "laguna", "Writhing Chaos");

        //Snack Time 7712
        Story.killQuest(7712, "laguna", "Chaos Roe");
    }

    shadowOff(): void {
        if (Core.isCompletedBefore(7732)) {
            Core.logger("StoryLine Complete:  Shadowoff storyline");
            return;
        }

        this.laguna();

        Story.preLoad(this.shadowOff);

        // Invasion!
        if (!Story.questProgression(7728)) {
            Core.ensureAccept(7728);
            Core.huntMonster("shadowoff", "Shadowflame Militia", "Invader Slain", 10);
            Core.ensureComplete(7728);
        }

        //Rescue Needed
        if (!Story.questProgression(7729)) {
            Core.ensureAccept(7729);
            Core.getMapItem(7699, 6, "Shadowoff");
            Core.huntMonster("shadowoff", "Shadowflame Sorcerer", "Sorcerer Slain", 6);
            Core.ensureComplete(7729);
        }

        //Get their Intel
        Story.killQuest(7730, "Shadowoff", "Shadowflame Militia");

        //Clue me in
        if (!Story.questProgression(7731)) {
            Core.ensureAccept(7731);
            Core.huntMonster("shadowoff", "Shadowflame Militia", "Militia Clue", 2);
            Core.huntMonster("shadowoff", "Shadowflame Scout", "Scout Clue", 2);
            Core.huntMonster("shadowoff", "Shadowflame Sorcerer", "Sorcerer Clue", 2);
            Core.ensureComplete(7731);
        }

        //So Familiar
        Story.killQuest(7732, "Shadowoff", "Shadowflame Paladin");
    }

    brightShadow(): void {
        if (Core.isCompletedBefore(7738)) {
            Core.logger("StoryLine Complete:  BrightShadow storyline");
            return;
        }

        this.shadowOff();

        Story.preLoad(this.brightShadow);

        //Protect the Light 7733
        Story.killQuest(7733, "BrightShadow", "BrightFall light");

        //Fend Them Off 7734
        if (!Story.questProgression(7734)) {
            Core.ensureAccept(7734);
            Core.huntMonster("brightshadow", "Brightfall Guard", "Invader Slain", 10);
            Core.ensureComplete(7734);
        }

        //Get The Keys 7735
        Story.killQuest(7735, "BrightShadow", "BrightFall Guard");

        //Unlock The Door 7736
        Story.mapItemQuest(7736, "BrightShadow", 7701);

        //Defeat Gravelyn 7737
        Story.killQuest(7737, "BrightShadow", "Gravelyn the Good", { autoCompleteQuest: false });

        //Restoring Order 7738
        if (!Story.questProgression(7738)) {
            Core.ensureAccept(7738);
            Core.huntMonster("brightshadow", "Brightfall Guard", "BrightFall Dark", 10);
            Core.huntMonster("brightshadow", "Brightfall Light", "BrightFall Light", 5);
            Core.ensureComplete(7738);
        }
    }

    brightChaos(): void {
        if (Core.isCompletedBefore(7750)) {
            Core.logger("StoryLine Complete:  BrightChaos storyline");
            return;
        }
        this.brightShadow();
        Story.preLoad(this.brightChaos);

        //The Situation 7740
        Story.killQuest(7740, "BrightChaos", "Shadowflame Militia");

        //A Study In Shadow 7741
        Story.killQuest(7741, "BrightChaos", "Shadowflame Sorcerer");

        //Percision Strike 7742
        if (!Story.questProgression(7742)) {
            Core.ensureAccept(7742);
            Core.huntMonster("brightchaos", "Shadowflame Militia", "Captain's Tags", 5);
            Core.ensureComplete(7742);
        }

        //Pants On Fire 7743
        if (!Story.questProgression(7743)) {
            Core.ensureAccept(7743);
            Core.getMapItem(7731, 6, "BrightChaos");
            Core.huntMonster("brightchaos", "Shadow Flame", "Shadow Flame Slain", 10);
            Core.ensureComplete(7743);
        }

        //Scared of the Dark 7744
        if (!Story.questProgression(7744)) {
            Core.ensureAccept(7744);
            Core.getMapItem(7732, 5, "BrightChaos");
            Core.huntMonster("brightchaos", "Hidden Monster", "Hidden Monster Slain", 10);
            Core.ensureComplete(7744);
        }

        //Go Bye-Bye 7745
        Story.killQuest(7745, "BrightChaos", "Shadow Trap");

        //Essential Oils 7746
        Story.killQuest(7746, "BrightChaos", "ShadowBeast");

        //What A Mess 7747
        Story.mapItemQuest(7747, "BrightChaos", 7733, 6);

        //Proscuitto! 7748
        Story.killQuest(7748, "BrightChaos", "ShadowBeast");

        //A Blight On Us All 7749
        Story.killQuest(7749, "BrightChaos", "Blight");

        //Unending Blight 7750
        Story.killQuest(7750, "BrightChaos", "Blight");
    }

    brightForest(): void {
        if (Core.isCompletedBefore(7758)) {
            Core.logger("StoryLine Complete:  BrightForest storyline");
            return;
        }
        this.brightChaos();
        Story.preLoad(this.brightForest);
        //Blood And Ashes 7756
        if (!Story.questProgression(7756)) {
            Core.ensureAccept(7756);
            Core.huntMonster("brightforest", "Shadow Flame", "Ashes of Death", 5);
            Core.huntMonster("brightforest", "Shadowflame Scout", "Blood of Life", 5);
            Core.ensureComplete(7756);
        }

        //Drink and Fight 7757
        if (!Story.questProgression(7757)) {
            Core.ensureAccept(7757);
            Core.huntMonster("brightforest", "Shadowflame Scout", "Essence of Time", 10);
            Core.ensureComplete(7757);
        }

        //Oooommm 7758
        Story.mapItemQuest(7758, "BrightForest", 7754, 2);
        Story.mapItemQuest(7758, "BrightForest", 7755, 1);
    }

    brightForestPast(): void {
        if (Core.isCompletedBefore(7766)) {
            Core.logger("StoryLine Complete:  BrightForestPast storyline");
            return;
        }
        this.brightForest();
        Story.preLoad(this.brightForestPast);

        //Slay the Wraiths 7759
        Story.killQuest(7759, "BrightForestPast", "Time Wraith");

        //Spacetime 7760
        if (!Story.questProgression(7760)) {
            Core.ensureAccept(7760);
            Core.getMapItem(7753, 1, "BrightForestPast");
            Core.huntMonster("brightforestpast", "Spacetime Energy", "Spacetime Gathered", 6);
            Core.ensureComplete(7760);
        }

        //Find Khasaanda 7761
        Story.mapItemQuest(7761, "BrightForestPast", 7756);

        //Find the Heart 7762
        Story.killQuest(7762, "BrightForestPast", "Undead Minion");

        //Ooh, That Smell 7763
        if (!Story.questProgression(7763)) {
            Core.ensureAccept(7763);
            Core.huntMonster("brightforestpast", "Undead Minion", "Elemental Evil", 8);
            Core.ensureComplete(7763);
        }

        //So Twisted 7764
        if (!Story.questProgression(7764)) {
            Core.ensureAccept(7764);
            Core.killMonster("BrightForestPast", "r8", "Left", "Twisted Treeant", "Twisted Treeant Slain", 10);
            Core.ensureComplete(7764);
        }

        //Purifying Flames 7765
        if (!Story.questProgression(7765)) {
            Core.ensureAccept(7765);
            Core.getMapItem(7757, 1, "BrightForestPast");
            Core.killMonster("BrightForestPast", "r8", "Left", "Treeant", "Purified Oil", 8);
            Core.ensureComplete(7765);
        }

        //Return to Iadoa 7766
        Story.mapItemQuest(7766, "BrightForestPast", 7758);
    }

    brightForestExtra(): void {
        if (Core.isCompletedBefore(7768)) {
            Core.logger("StoryLine Complete:  BrightForest Extra storyline");
            return;
        }

        this.brightForestPast();

        Story.preLoad(this.brightForestExtra);

        //The Dragon 7767
        Story.killQuest(7767, "BrightForest", "ShadowFlame Dragon");

        //The Shadows Recede 7768
        Story.killQuest(7768, "BrightForest", "ShadowFlame Dragon");
        Story.killQuest(7768, "BrightForest", ["Shadowflame Scout", "Shadowflame Warrior"]);
    }
}
