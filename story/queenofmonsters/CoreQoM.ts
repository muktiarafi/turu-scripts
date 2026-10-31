/*
name: null
description: null
tags: null
*/
// Port of Scripts/Story/QueenofMonsters/CoreQoM.cs.
// Not ported (FarmerJoe's DoAll doesn't reach them): CompleteEverything, aTheftofLight, DoomwoodPaladinsTrial, DarkoviaDarkDiaspora, ShadowfallDarknessRising, SwordhavenTheNewWorld, TheDestroyer, TheBook, TheQueensSecrets.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();
const Farm = new CoreFarms();

export class CoreQOM {
    theReshaper(TerraneMerge = false): void {
        //Progress Check
        if (Core.isCompletedBefore(5877)) return;

        //Preload Quests
        Story.preLoad(this.theReshaper);

        //Capture the Misshapen
        if (!Story.questProgression(5849)) {
            Core.ensureAccept(5849);
            Core.huntMonster("pilgrimage", "SpiderWing", "Spiderwing Captured", 4);
            Core.huntMonster("pilgrimage", "Urstrix", "Urstrix Captured", 4);
            Core.ensureComplete(5849);
        }

        //Defeat the Parasites
        Story.killQuest(5850, "Pilgrimage", "Ravenous Parasite");

        //The Source
        Story.killQuest(5851, "Pilgrimage", "Extrikiti");

        //Find Lucky!
        if (!Story.questProgression(5852)) {
            Core.ensureAccept(5852);
            Core.getMapItem(5289, 1, "Pilgrimage");
            Core.getMapItem(5288, 3, "Pilgrimage");
            Core.huntMonster("pilgrimage", "Extrikiti", "Tuft of Fur", 3);
            Core.huntMonster("pilgrimage", "Extrikiti", "Lucky's Collar", 1);
            Core.ensureComplete(5852);
        }

        //Gather a Scouting Party
        if (!Story.questProgression(5853)) {
            Core.ensureAccept(5853);
            Core.getMapItem(5290, 6, "pilgrimage");
            Core.getMapItem(5291, 1, "pilgrimage");
            Core.ensureComplete(5853);
        }

        //Defeat the Parasites
        if (!Story.questProgression(5854)) {
            Core.ensureAccept(5854);
            Core.getMapItem(5292, 1, "Pilgrimage");
            Core.huntMonster("pilgrimage", "Ravenous Parasite", "Monsters Slain", 10);
            Core.ensureComplete(5854);
        }

        //Bad Dog
        Story.killQuest(5855, "Pilgrimage", "Lucky");

        //Connect to the Earth
        if (!Story.questProgression(6276)) {
            Core.ensureAccept(6276);
            Core.getMapItem(5769, 5, "guardiantree");
            Core.huntMonster("guardiantree", "Blossoming Treeant", "Treeant Cuttings", 5);
            Core.ensureComplete(6276);
        }

        //Help the Hedgies
        Story.mapItemQuest(6277, "guardiantree", 5776, 5);
        Story.mapItemQuest(6277, "guardiantree", 5770, 5);

        //Cleanse the Corrupted Zards
        Story.killQuest(6278, "guardiantree", "Corrupted Zard");

        //Plant the Seed
        if (!Story.questProgression(6279)) {
            Core.ensureAccept(6279);
            Core.killMonster("guardiantree", "r2a", "Bottom", "Seed Spitter", "Perfect Seed");
            Core.getMapItem(5771, 1, "guardiantree");
            Core.ensureComplete(6279);
        }

        //Reach the Top
        Story.mapItemQuest(6280, "guardiantree", 5772);

        //Cointain the Pollen
        Story.killQuest(6281, "guardiantree", "Blossoming Treeant");

        //Pass Through the Pollen
        if (!Story.questProgression(6282)) {
            Core.ensureAccept(6282);
            Core.getMapItem(5773, 1, "guardiantree");
            Core.huntMonster("guardiantree", "Pollen Cloud", "Pollen Clouds Destroyed", 5);
            Core.ensureComplete(6282);
        }

        //Reinvigorate the Sprout
        if (!Story.questProgression(6283)) {
            Core.ensureAccept(6283);
            Core.killMonster("guardiantree", "r8", "Left", "Seed Spitter", "Life Energy", 8);
            Core.ensureComplete(6283);
        }

        //Up We Go!
        Story.mapItemQuest(6284, "guardiantree", 5774);

        //Grow a Bridge
        if (!Story.questProgression(6285)) {
            Core.ensureAccept(6285);
            Core.getMapItem(5775, 2, "guardiantree");
            Core.huntMonster("guardiantree", "Myconid", "Fungal Spores", 6);
            Core.ensureComplete(6285);
        }

        //Take Down Terrane
        if (!Story.questProgression(6286)) {
            Core.ensureAccept(6286);
            Core.killMonster("guardiantree", "r12", "Left", "Terrane");
            Core.ensureComplete(6286);
        }
        if (TerraneMerge) return;

        //Explore the Cavern
        if (!Story.questProgression(5856)) {
            Core.ensureAccept(5856);
            Core.getMapItem(5293, 1, "TwistedCavern");
            Core.huntMonster("twistedcavern", "Extrikiti", "Extrikitis Slain", 8);
            Core.ensureComplete(5856);
        }

        //Capture the Insects
        Story.killQuest(5857, "TwistedCavern", "Infesting Swarm");

        //Face the Consequences
        if (!Story.questProgression(5858)) {
            Core.ensureAccept(5858);
            Core.huntMonster("TwistedCavern", "Fungal Lord", "Fungal Lord Slain", 6);
            Core.huntMonster("TwistedCavern", "Seed Stalker", "Seed Stalker Slain", 6);
            Core.huntMonster("TwistedCavern", "Seed Stalker", "Scrap of Brown Cloth");
            Core.ensureComplete(5858);
        }

        //Stalk This
        Story.killQuest(5859, "TwistedCavern", "Seed Stalker");

        //Free the Flies
        if (!Story.questProgression(5860)) {
            Core.ensureAccept(5860);
            Core.getMapItem(5294, 1, "TwistedCavern");
            Core.huntMonster("twistedcavern", "SpiderWing", "Spiderwings Slain", 8);
            Core.ensureComplete(5860);
        }

        //Follow the Swarm
        Story.mapItemQuest(5861, "TwistedCavern", 5295, 6);

        //Leading to the Wall
        if (!Story.questProgression(5862)) {
            Core.ensureAccept(5862);
            Core.huntMonster("TwistedCavern", "Urstrix", "Urstrix Slain", 6);
            Core.huntMonster("TwistedCavern", "Fungal Lord", "Fungal Lord Slain", 4);
            Core.ensureComplete(5862);
        }

        //Get through the Wall
        Story.killQuest(5863, "TwistedCavern", "Wall of Vines");

        //Defeat the Golem
        Core.equipClass(ClassType.Solo);
        Story.killQuest(5864, "TwistedCavern", "Lore Golem");

        //Time for a Dose
        if (!Story.questProgression(5866)) {
            Core.ensureAccept(5866);
            Core.huntMonster("brokenwoods", "Urstrix", "Urstrix Dosed", 3);
            Core.huntMonster("brokenwoods", "SpiderWing", "Spiderwing Dosed", 3);
            Core.ensureComplete(5866);
        }

        //Comparing Samples
        if (!Story.questProgression(5867)) {
            Core.ensureAccept(5867);
            Core.huntMonster("brightoak", "Hootbear", "Hootbear Feathers", 2);
            Core.huntMonster("BrokenWoods", "Urstrix", "Urstrix Feathers", 2);
            Core.huntMonster("pines", "LeatherWing", "LeatherWing Claws", 2);
            Core.huntMonster("BrokenWoods", "SpiderWing", "SpiderWing Claws", 2);
            Core.ensureComplete(5867);
        }

        //Examine the Foliage
        if (!Story.questProgression(5868)) {
            Core.ensureAccept(5868);
            Core.getMapItem(5296, 4, "BrokenWoods");
            Core.getMapItem(5297, 4, "BrokenWoods");
            Core.huntMonster("brokenwoods", "Fungal Lord", "Fungal Lord Slime", 4);
            Core.ensureComplete(5868);
        }

        //Investigate the Goo
        Story.killQuest(5869, "BrokenWoods", "Extrikiti");

        //Second Dose
        if (!Story.questProgression(5870)) {
            Core.ensureAccept(5870);
            Core.huntMonster("brokenwoods", "Urstrix", "Urstrix Dosed", 3);
            Core.huntMonster("brokenwoods", "SpiderWing", "Spiderwing Dosed", 3);
            Core.ensureComplete(5870);
        }

        //Still Not Working
        if (!Story.questProgression(5871)) {
            Core.ensureAccept(5871);
            Core.huntMonster("charredpath", "Ravenous Parasite", "Captured Parasite", 3);
            Core.huntMonster("charredpath", "Plague Spreader", "Captured Plague Spreader", 3);
            Core.ensureComplete(5871);
        }

        //Get the Final Ingredients
        if (!Story.questProgression(5872)) {
            Core.ensureAccept(5872);
            Core.buyItem("embersea", 1100, 1749, 25);
            Core.huntMonster("Arcangrove", "Seed Spitter", "Uncorrupted Spitter Seeds", 3);
            Core.huntMonster("poisonforest", "Treeant", "Treeant Berries", 4);
            Core.ensureComplete(5872);
        }

        //Smash the Hive
        Story.killQuest(5873, "brokenwoods", "Hive");

        //Acolyte's Medallions
        if (!Story.questProgression(5874)) {
            Core.ensureAccept(5874);
            Core.huntMonster("Kolyaban", "Poisonous Darkblood", "Acolyte's Medallion", 4);
            Core.ensureComplete(5874);
        }

        //Let's Hope This Works
        Story.killQuest(5876, "Kolyaban", "Twisted Aria");

        //Defeat Kolyaban
        Story.killQuest(5877, "Kolyaban", "Kolyaban");
    }

    completeEverything(): void {
        this.aTheftofLight();
        this.doomwoodPaladinsTrial();
        this.darkoviaDarkDiaspora();
        this.shadowfallDarknessRising();
        this.swordhavenTheNewWorld();
        this.theDestroyer();
        this.theReshaper();
        this.theBook();
        this.theQueensSecrets();
    }

    theDestroyer(): void {
        if (Core.isCompletedBefore(5847)) {
            return;
        }

        //Preload Quests
        Story.preLoad(this.theDestroyer);

        //What Happened to Baldric?
        Story.mapItemQuest(5791, "therift", 5228);

        //Quests Here Bug Out So This is Needed.
        Core.acceptandCompleteTries = 3;

        //Get a Monitor
        Story.mapItemQuest(5803, "charredpath", 5248);

        //Follow the Pattern.. He Ne Ar Kr
        if (!Story.questProgression(5804)) {
            Core.ensureAccept(5804);
            Core.getMapItem(5249, 1, "crashsite");
            Core.huntMonster("crashsite", "Dwakel Warrior", "Purified Xenon", 6);
            Core.ensureComplete(5804);
        }

        //The PTM is Ready!
        if (!Story.questProgression(5805)) {
            Core.ensureAccept(5805);
            Core.getMapItem(5256, 1, "charredpath");
            Core.killMonster("charredpath", "r3", "Left", "Noxious Fumes", "Noxious Fumes Eradicated", 5);
            Core.killMonster("charredpath", "r3", "Left", "Toxic Bile", "Toxic Bile Eradicated", 5);
            Core.ensureComplete(5805);
        }

        //Save the Creatures
        if (!Story.questProgression(5806)) {
            Core.ensureAccept(5806);
            Core.getMapItem(5250, 6, "charredpath");
            Core.huntMonster("charredpath", "Ragewing", "Monster Stilled", 7);
            Core.ensureComplete(5806);
        }

        //Clear the Treeants
        if (!Story.questProgression(5807)) {
            Core.ensureAccept(5807);
            Core.getMapItem(5251, 3, "charredpath");
            Core.huntMonster("charredpath", "Toxic Treeant", "Treeant Felled", 6);
            Core.ensureComplete(5807);
        }

        //Excise the Infection
        Story.killQuest(5808, "charredpath", "Infected Hare");

        //Root out the Plague
        if (!Story.questProgression(5809)) {
            Core.ensureAccept(5809);
            Core.getMapItem(5252, 6, "charredpath");
            Core.huntMonster("charredpath", "Plague Spreader", "Plague Spreaders Slain", 7);
            Core.ensureComplete(5809);
        }

        //I Said Yes, Yes, Yes
        Story.mapItemQuest(5810, "charredpath", 5255);

        //Rally the Mages
        if (!Story.questProgression(5811)) {
            Core.ensureAccept(5811);
            Core.getMapItem(5253, 4, "therift");
            Core.huntMonster("therift", "Mana Chest", "Mana Bomb", 8);
            Core.ensureComplete(5811);
        }

        //Wisteria Hysteria
        Story.killQuest(5812, "charredpath", "Toxic Wisteria");

        //Confront Extriki
        Story.mapItemQuest(5813, "charredpath", 5254);

        //Remove the Bile
        Story.killQuest(5819, "charredpath", "Noxious Fumes");

        //Get the Plague (Crystal)
        Story.killQuest(5820, "charredpath", "Plague Spreader");

        //Grab the Growth
        Story.killQuest(5821, "charredpath", "Infected Hare");

        //Treeants for Wood
        Story.killQuest(5822, "farm", "Treeant");

        //Sand sounds better than Litter...
        if (!Story.questProgression(5823)) {
            Core.ensureAccept(5823);
            while (!bot.shouldExit && !Core.checkInventory(39194, 8)) {
                Core.killMonster("baconcat", "r8", "Left", "Litter Elemental", undefined, undefined, { log: false });
            }
            Core.ensureComplete(5823);
        }

        //Destroy the Zognax
        Core.equipClass(ClassType.Solo);
        Story.killQuest(5824, "charredpath", "Zognax");

        //Bandages Needed
        Story.killQuest(5830, "charredpath", "Ravenous Parasite");

        //Shinies!
        if (!Story.questProgression(5831)) {
            Core.ensureAccept(5831);
            Core.killMonster("skytower", "r3", "Bottom", "Sunstone", "Sunstone", 3);
            Core.killMonster("skytower", "r3", "Bottom", "Moonstone", "Moonstone", 3);
            Core.killMonster("skytower", "r3", "Bottom", "Star Sapphire", "Star Sapphire", 3);
            Core.ensureComplete(5831);
        }

        //Plushies
        Story.killQuest(5832, "sewerpink", "Cutie Grumbley");

        //Sleepies
        if (!Story.questProgression(5833)) {
            Core.ensureAccept(5833);

            if (!Core.checkInventory("Black Metal Cold Brew")) {
                Core.addDrop("Black Metal Cold Brew");
                Core.ensureAccept(5834);
                Core.huntMonster("therift", "Mana Chest", "Liquid Mana", 4);
                Core.huntMonster("therift", "Ravenous Parasite", 'Parasite "Spice"', 4);
                Core.ensureComplete(5834);
            }

            Core.ensureComplete(5833);
        }

        //What's Next?
        Story.mapItemQuest(5835, "charredpath", 5270);

        //Make a Bed
        Story.killQuest(5836, "charredpath", "Pustulisk");

        //Talk to Ravinos
        Story.mapItemQuest(5837, "underglade", 5271);

        //Into the Underglade
        if (!Story.questProgression(5838)) {
            Core.ensureAccept(5838);
            Core.huntMonster("underglade", "Tree Nymph", "Tree Nymph", 5);
            Core.huntMonster("underglade", "Forest Spirit", "Forest Spirit", 5);
            Core.ensureComplete(5838);
        }

        //Clear the Spores
        Story.killQuest(5839, "underglade", "Slime Spore");

        //Cleanse the Walls
        if (!Story.questProgression(5840)) {
            Core.ensureAccept(5840);
            Core.getMapItem(5272, 8, "underglade");
            Core.huntMonster("underglade", "Forest Spirit", "Essence of Nature", 8);
            Core.ensureComplete(5840);
        }

        //Expose the Entrance
        Story.killQuest(5841, "underglade", "Blackened Earth");

        //Gather the Glows
        Story.killQuest(5842, "underglade", "Luminous Fungus");

        //More Corruption Revealed
        if (!Story.questProgression(5843)) {
            Core.ensureAccept(5843);
            Core.getMapItem(5273, 6, "underglade");
            Core.huntMonster("underglade", "Forest Spirit", "Elemental Earth", 6);
            Core.ensureComplete(5843);
        }

        //The Goblin Threat
        Story.killQuest(5844, "underglade", "Twisted Goblin");

        //Get an Offering
        Story.killQuest(5845, "underglade", "Gemstone Elemental");

        //The Heart of the Glade
        Story.killQuest(5846, "underglade", "Lunamoss");

        //Defeat Extriki
        Story.killQuest(5847, "extriki", "Extriki");
    }

    theBook(): void {
        if (Core.isCompletedBefore(8080)) {
            return;
        }

        Story.preLoad(this.theBook);

        //8048 | Time to Study
        if (!Story.questProgression(8048)) {
            Core.ensureAccept(8048);
            Core.huntMonster("forestreach", "Monstrous Imp", "Monstrous Imp Captured", 8);
            Core.huntMonster("forestreach", "Eldritch Parasite", "Eldritch Parasite Captured", 8);
            Core.ensureComplete(8048);
        }

        //8049 | Calm Them Down
        Story.killQuest(8049, "forestreach", "Chaos Spitter");

        //8050 | Get the Reagents
        if (!Story.questProgression(8050)) {
            Core.ensureAccept(8050);
            Core.getMapItem(8362, 5, "forestreach");
            Core.huntMonster("forestreach", "Chaos Sp-eye", "Chaos Ichor", 6);
            Core.ensureComplete(8050);
        }

        //8051 | Samples for Comparison
        if (!Story.questProgression(8051)) {
            Core.ensureAccept(8051);
            Core.getMapItem(8363, 5, "forestreach");
            Core.huntMonster("forestreach", "Chaos Spitter", "Chaos Spitter Cutting", 7);
            Core.ensureComplete(8051);
        }

        //8052 | More Testing Required
        if (!Story.questProgression(8052)) {
            Core.ensureAccept(8052);
            Core.huntMonster("forestreach", "EldritchWing", "EldritchWing Captured", 8);
            Core.huntMonster("forestreach", "Chaos Sp-eye", "Chaos Sp-Eye Captured", 8);
            Core.ensureComplete(8052);
        }

        //8053 | Tidy Up
        if (!Story.questProgression(8053)) {
            Core.ensureAccept(8053);
            Core.huntMonster("forestreach", "Eldritch Parasite", "Eldritch Parasite Slain", 8);
            Core.huntMonster("forestreach", "Monstrous Imp", "Monstrous Imp Slain", 8);
            Core.ensureComplete(8053);
        }

        //8054 | We Need Neutralizer
        if (!Story.questProgression(8054)) {
            Core.ensureAccept(8054);
            Core.huntMonster("forestreach", "Chaos Spitter", "Acidic Pollen", 6);
            Core.huntMonster("forestreach", "Chaos Sp-eye", "Eye Gunk", 4);
            Core.ensureComplete(8054);
        }

        //8055 | Neutralize 'Em
        Story.mapItemQuest(8055, "forestreach", 8364, 5);

        //8056 | Vermin Clearing
        Story.killQuest(8056, "backroom", "Chaos Rat");

        //8057 | Find the Book
        Story.mapItemQuest(8057, "backroom", 8365);

        //8058 | Get the Key
        Story.killQuest(8058, "backroom", "Chaos Rat");

        //8059 | Get the Book
        Story.mapItemQuest(8059, "backroom", 8366);

        //8060 | It's a Book Wyrm!
        Story.killQuest(8060, "backroom", "Book Wyrm");

        //8067 | The Eye of the Beholder
        Story.killQuest(8067, "deepforest", "Creeping Gaze");

        //8068 | The Double - Edged Sword
        Story.killQuest(8068, "deepforest", "Eldritch Stalker");

        //8069 | So Ichor - y
        Story.killQuest(8069, "deepforest", "Terrarsite");

        //8070 | Reveal the Words
        Story.mapItemQuest(8070, "deepforest", 8415);

        //8071 | Shining Time
        Story.killQuest(8071, "deepforest", "Deep Truffle");

        //8072 | Light the Way
        Story.mapItemQuest(8072, "deepforest", 8416, 8);

        //8073 | Chaos Gathers
        Story.killQuest(8073, "deepforest", "Creeping Gaze");

        //8074 | Hold your Breath
        Story.killQuest(8074, "deepforest", "Terrarsite");

        //8075 | Disperse the Mist
        Story.mapItemQuest(8075, "deepforest", 8418, 8);

        //8076 | Monsters in the Mist
        Story.killQuest(8076, "deepforest", "Deep Truffle");

        //8077 | Truffle Hunting
        Story.killQuest(8077, "deepforest", "Deep Truffle");

        //8078 | Bribe 'Em All
        Story.killQuest(8078, "deepforest", "Cthulhoid");

        //8079 | Heading Back Home
        Story.mapItemQuest(8079, "deepforest", 8419, 4);
        Story.mapItemQuest(8079, "deepforest", 8420, 1);

        //8080 | The Aberration
        Story.killQuest(8080, "deepforest", "Aberrant Horror");
    }

    theQueensSecrets(DeepTunnelMerge = false): void {
        if (Core.isCompletedBefore(8107)) {
            return;
        }

        Story.preLoad(this.theQueensSecrets);

        //8083 | Crystal Tears
        Story.killQuest(8083, "transformation", "Monstrite");

        //8084 | That Which Grows
        Story.killQuest(8084, "transformation", "Chaos Spitter");

        //8085 | That Which Flies
        Story.killQuest(8085, "transformation", "Tentastrike");

        //8086 | That Which Flames
        Story.killQuest(8086, "transformation", "Tentaflame");

        //8087 | A Caustic Oil
        Story.killQuest(8087, "transformation", "Chaos Spitter");

        //8088 | Tools of the Trade
        if (!Story.questProgression(8088)) {
            Core.ensureAccept(8088);
            Core.huntMonster("transformation", "Monstrite", "Mortar Stone");
            Core.huntMonster("transformation", "Monstrite", "Pestle Stone");
            Core.ensureComplete(8088);
        }

        //8089 | Burn it!
        Story.mapItemQuest(8089, "transformation", 8435);
        Story.mapItemQuest(8089, "transformation", 8436);
        Story.mapItemQuest(8089, "transformation", 8437);

        //8090 | Find the Tributes
        Story.killQuest(8090, "transformation", "Deep Tunneler");

        //8091 | Compare the Crystal
        Story.killQuest(8091, "transformation", "Monstrite");

        //8092 | Acid and Scratch Test
        if (!Story.questProgression(8092)) {
            Core.ensureAccept(8092);
            Core.huntMonster("transformation", "Tentastrike", "Acid Venom", 5);
            Core.huntMonster("transformation", "Deep Tunneler", "Sharpest Fang", 1);
            Core.ensureComplete(8092);
        }

        //8093 | The Largest Monstrite
        Story.killQuest(8093, "transformation", "Eldritch Abomination");

        //8094 | Tame the Queen
        Story.killQuest(8094, "transformation", "Queen of Monsters");
        if (DeepTunnelMerge) {
            return;
        }

        //8096 | Worms of Earth
        Story.killQuest(8096, "downbelow", "Earthwyrm");

        //8097 | Find the Trail
        Story.killQuest(8097, "downbelow", "Rumbling Rubble");

        //8098 | Open the Way
        if (!Story.questProgression(8098)) {
            Core.ensureAccept(8098);
            Core.getMapItem(8491, 1, "downbelow");
            Core.huntMonster("downbelow", "Monstrous Flame", "Monstrous Flame", 5);
            Core.ensureComplete(8098);
        }

        //8099 | Follow the Trail
        if (!Story.questProgression(8099)) {
            Core.ensureAccept(8099);
            Core.getMapItem(8492, 1, "downbelow");
            Core.huntMonster("downbelow", "Earthwyrm", "Monster Slain", 8);
            Core.ensureComplete(8099);
        }

        //8100 | Tentarachnid Horde
        Story.killQuest(8100, "downbelow", "Tentarachnid");

        //8101 | The Shadows
        Story.killQuest(8101, "downbelow", "Creeping Shadow");

        //8102 | Keep up the Search
        if (!Story.questProgression(8102)) {
            Core.ensureAccept(8102);
            Core.getMapItem(8493, 1, "downbelow");
            Core.huntMonster("downbelow", "Creeping Shadow", "Monster Slain", 6);
            Core.ensureComplete(8102);
        }

        //8103 | Defeat the Guardian
        Story.killQuest(8103, "downbelow", "Guardian Golem");

        //8104 | Wall of Rage
        if (!Story.questProgression(8104)) {
            Core.ensureAccept(8104);
            Core.getMapItem(8494, 1, "downbelow");
            Core.huntMonster("downbelow", "Living Rage", "Hidden Hope", 5);
            Core.ensureComplete(8104);
        }

        //8105 | Through the Fire
        if (!Story.questProgression(8105)) {
            Core.ensureAccept(8105);
            Core.getMapItem(8495, 1, "downbelow");
            Core.huntMonster("downbelow", "Living Rage", "Monsters Slain", 9);
            Core.ensureComplete(8105);
        }

        //8106 | Heart of the Power
        Core.equipClass(ClassType.Solo);
        Story.killQuest(8106, "downbelow", "Anka");

        //8107 | Undying Rage
        if (!Story.questProgression(8107)) {
            Core.ensureAccept(8107);
            Core.equipClass(ClassType.Farm);
            Core.killMonster("downbelow", "Enter", "Spawn", "Earthwyrm", "Anka's Followers Slain", 1000, {
                isTemp: false,
            });
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("downbelow", "Anka", "Soul of Vengeance", 25, { isTemp: false });
            Core.ensureComplete(8107);
        }
    }

    aTheftofLight(): void {
        //Progress Check
        if (Core.isCompletedBefore(5387)) {
            return;
        }

        //Preload Quests
        Story.preLoad(this.aTheftofLight);

        Core.addDrop(31052);

        //Summon Help
        if (!Story.questProgression(4495)) {
            Core.ensureAccept(4495);
            Core.getMapItem(3698, 1, "celestialrealm");
            Core.huntMonster("celestialrealm", "Celestial Bird of Paradise", "Golden Grain", 1);
            Core.huntMonster("celestialrealm", "Fallen Knight", "Bright Flower Seed", 10);
            Core.ensureComplete(4495);
        }

        //Power Up!
        if (!Story.questProgression(4496)) {
            Core.buyItem("embersea", 1100, "Basic Guard Potion", 10);
        }
        Story.killQuest(4496, "celestialrealm", ["Celestial Bird of Paradise", "Fallen Knight"]);

        //The Final Spell Fragment
        Story.mapItemQuest(4497, "celestialrealm", 3696);

        //Find the Map
        if (!Story.questProgression(4498)) {
            Core.addDrop("Dwakel Decoder");
            Core.getMapItem(106, 1, "crashsite");
            Core.ensureAccept(4498);
            Core.huntMonster("celestialrealm", "Infernal Knight", "Map of Lore", 1);
            Core.ensureComplete(4498);
        }

        //Reveal the Portal!
        Story.mapItemQuest(4499, "celestialrealm", 3693);

        //Investigate the Ruins
        if (!Story.questProgression(4500)) {
            Core.ensureAccept(4500);
            Core.getMapItem(3694, 3, "lostruins");
            Core.huntMonster("lostruins", "Underworld Hound", "Underworld Hound Defeated", 5);
            Core.ensureComplete(4500);
        }

        //Take out the Knights
        Story.killQuest(4501, "lostruins", "Fallen Knight");

        //Find the Clues
        if (!Story.questProgression(4502)) {
            Core.ensureAccept(4502);
            Core.huntMonster("lostruins", "Underworld Hound", "Clue 1");
            Core.huntMonster("lostruins", "Infernal Imp", "Clue 2");
            Core.huntMonster("lostruins", "Fallen Knight", "Clue 3");
            Core.killMonster("lostruins", "r5", "Left", "Infernal Knight", "Clue 4");
            Core.ensureComplete(4502);
        }

        //Recover the Cage Key!
        if (!Story.questProgression(4503)) {
            Core.ensureAccept(4503);
            Farm.fishingREP(2);
            if (!Core.checkInventory("Holy Oil")) {
                Core.buyItem("fishing", 356, "Holy Oil");
            }
            Core.huntMonsterMapID("lostruins", 8, "Cage Key");
            Core.ensureComplete(4503);
            bot.wait.forPickup(31052);
        }

        //Protect Them
        if (!Story.questProgression(4504)) {
            Core.ensureAccept(4504);
            if (!Core.checkInventory("Potent Guard Potion", 10)) {
                Core.buyItem("embersea", 1100, "Potent Guard Potion", 10);
            }
            Core.huntMonster("lostruins", "Fallen Knight", "Infernal Enemy Defeated", 15);
            Core.ensureComplete(4504);
        }

        //Break the Spell
        if (!Story.questProgression(4505)) {
            Core.ensureAccept(4505);
            Core.huntMonster("lostruins", "Fallen Knight", "Brimstone-Stained Gauntlet", 5);
            Core.huntMonster("lostruins", "Underworld Hound", "Onyx Spike", 3);
            Core.getMapItem(3697, 5, "lostruins");
            Core.ensureComplete(4505);
        }

        //Open the Cage
        if (!Core.checkInventory(31052)) {
            Core.ensureAccept(4503);
            Farm.fishingREP(2);
            if (!Core.checkInventory("Holy Oil")) {
                Core.buyItem("fishing", 356, "Holy Oil");
            }
            Core.huntMonsterMapID("lostruins", 8, "Cage Key");
            Core.ensureComplete(4503);
            bot.wait.forPickup(31052);
        }
        Story.mapItemQuest(4506, "lostruins", 3695);

        //Defeat the Infernal Warlord
        Core.equipClass(ClassType.Solo);
        Story.killQuest(4507, "lostruins", "Infernal Warlord");

        //Celestial Realm at War
        Story.killQuest(4509, "lostruinswar", "Infernal Imp");

        //Defeat the Diabolical Warlord!
        Core.equipClass(ClassType.Solo);
        Story.killQuest(4508, "lostruinswar", "Diabolical Warlord");

        //Infernal Destruction
        if (!Story.questProgression(5374)) {
            Core.ensureAccept(5374);
            Core.huntMonster("infernalspire", "Fallen Knight", "Fallen Knight Slain", 8);
            Core.huntMonster("infernalspire", "Underworld Hound", "Underworld Hound Slain", 8);
            Core.ensureComplete(5374);
        }

        //Gone Without A Trace
        if (!Story.questProgression(5375)) {
            Core.ensureAccept(5375);
            Core.getMapItem(4729, 1, "infernalspire");
            Core.getMapItem(4730, 1, "infernalspire");
            Core.killMonster("infernalspire", "r2", "Left", "Fallen Knight", "Celestial Silk", 1);
            Core.huntMonster("infernalspire", "Underworld Hound", "Torn Feathers", 1);
            Core.ensureComplete(5375);
        }

        //Helzekiel
        Core.equipClass(ClassType.Solo);
        Story.killQuest(5376, "infernalspire", "Helzekiel");

        //Get the Keys
        if (!Story.questProgression(5377)) {
            Core.ensureAccept(5377);
            Core.killMonster("infernalspire", "r7", "Left", "Dungeon Fiend", "Infernal Key", 6);
            Core.killMonster("infernalspire", "r7", "Left", "Dungeon Fiend", "Dungeon Fiend Slain", 6);
            Core.killMonster("infernalspire", "r7", "Left", "Infernal Hound", "Infernal Hound Slain", 6);
            Core.ensureComplete(5377);
        }

        //Free the Captives
        Story.mapItemQuest(5378, "infernalspire", 4731, 6);

        //Energy Needed
        if (!Story.questProgression(5379)) {
            Core.ensureAccept(5379);
            Core.getMapItem(4732, 6, "infernalspire");
            Core.huntMonster("infernalspire", "Dungeon Fiend", "Celestial Energy", 6);
            Core.ensureComplete(5379);
        }

        //Interrogate the Jailer
        Story.killQuest(5380, "infernalspire", "Garvodeus");

        //Get the Code
        if (!Story.questProgression(5381)) {
            Core.ensureAccept(5381);
            Core.killMonster("infernalspire", "r13", "Left", "Fallen Knight", "Override Code");
            Core.killMonster("infernalspire", "r13", "Left", "Fallen Knight", "Fallen Knight Slain", 6);
            Core.huntMonster("infernalspire", "Infernal Imp", "Infernal Imp Slain", 6);
            Core.ensureComplete(5381);
        }

        //Enter the Code
        Story.mapItemQuest(5382, "infernalspire", 4733);

        //Smash it Up
        Story.mapItemQuest(5383, "infernalspire", 4734, 4);

        //Take out the Overseer
        Story.killQuest(5384, "infernalspire", "Azkorath");

        //Clear the Invaders
        if (!Story.questProgression(5385)) {
            Core.ensureAccept(5385);
            Core.huntMonster("infernalspire", "Infernal Knight", "Infernal Knight Slain", 8);
            Core.huntMonster("infernalspire", "Grievous Fiend", "Grievous Fiend Slain", 8);
            Core.ensureComplete(5385);
        }

        //Find the Weapon
        Story.mapItemQuest(5386, "infernalspire", 4735);

        //What is THAT?
        Story.killQuest(5387, "infernalspire", "Malxas");
    }

    doomwoodPaladinsTrial(): void {
        //Progress Check
        if (Core.isCompletedBefore(5416)) {
            return;
        }

        //Preload Quests
        Story.preLoad(this.doomwoodPaladinsTrial);

        //A New Recruit
        if (!Story.questProgression(5404)) {
            Core.ensureAccept(5404);
            if (!Core.checkInventory("Blessed Coffee of the Lightguard")) {
                Core.addDrop("Blessed Coffee of the Lightguard");
                Core.ensureAccept(5405);
                Core.huntMonster("sandsea", "Oasis Monkey", "Pally Luwak Beans");
                Core.ensureComplete(5405);
            }
            Core.ensureComplete(5404);
        }

        //SLAY some UNDEAD
        Story.killQuest(5406, "doompally", "Doomwood Ectomancer");

        //SLAY some MORE UNDEAD!!
        Story.killQuest(5407, "doompally", "Doomwood Soldier");

        //Slay BIGGER!!
        Story.killQuest(5408, "doompally", "Doomwood Ectomancer");

        //Babe in the Woods
        Story.mapItemQuest(5409, "doompally", 4758);

        //The Dark Thicket
        if (!Story.questProgression(5410)) {
            Core.ensureAccept(5410);
            Core.getMapItem(4759, 5, "doompally");
            Core.huntMonster("doompally", "Doomwood Bonemuncher", "Thicket Monsters Slain", 8);
            Core.ensureComplete(5410);
        }

        //Emily
        Story.mapItemQuest(5411, "doompally", 4761);
        Story.mapItemQuest(5411, "doompally", 4760, 6);

        //Sage Advice
        Story.killQuest(5412, "doompally", "Doomwood Treeant");

        //Abra-Cadaver
        Story.killQuest(5413, "doompally", "Doomwood Ectomancer");

        //A (Skele)TON of skulls
        Story.killQuest(5414, "doompally", "Doomwood Bonemuncher");

        //Summoning the Subjugator
        Story.mapItemQuest(5415, "doompally", 4762);

        //Subjugator Wraithbone
        Story.killQuest(5416, "doompally", "Skeletal Subjugator");
    }

    darkoviaDarkDiaspora(): void {
        //Progress Check
        if (Core.isCompletedBefore(5503)) {
            return;
        }

        //Preload Quests
        Story.preLoad(this.darkoviaDarkDiaspora);

        //Hounds and Infernals and Imp, Oh my!
        if (!Story.questProgression(5487)) {
            Core.ensureAccept(5487);
            Core.huntMonster("darkoviainvasion", "Underworld Hound", "Underworld Hound Slain", 5);
            Core.huntMonster("darkoviainvasion", "Infernal Imp", "Infernal Imp Slain", 5);
            Core.ensureComplete(5487);
        }

        //Like Imps in A Pod
        Story.mapItemQuest(5488, "DarkoviaInvasion", 4905, 6);

        //A Grievous Threat
        Story.killQuest(5489, "DarkoviaInvasion", "Grievous Fiend");

        //Undead Investigation
        Story.mapItemQuest(5490, "SafiriaInvasion", 4904);

        //What We Need Is A Big Can Of Raid
        if (!Story.questProgression(5491)) {
            Core.ensureAccept(5491);
            Core.huntMonster("safiriainvasion", "Fallen Knight", "Fallen Knights Slain", 5);
            Core.huntMonster("safiriainvasion", "Infernal Knight", "Infernal Knights Slain", 5);
            Core.ensureComplete(5491);
        }

        //Trapped!
        Story.mapItemQuest(5492, "SafiriaInvasion", 4895, 6);
        Story.mapItemQuest(5492, "SafiriaInvasion", 4896);

        //Won't Someone Think Of The Minions?
        Story.mapItemQuest(5493, "SafiriaInvasion", 4897, 9);

        //Here, Doggy Doggy
        if (!Story.questProgression(5494)) {
            Core.ensureAccept(5494);
            Core.getMapItems(
                [
                    [4898, 1],
                    [4899, 1],
                ],
                "SafiriaInvasion",
            );
            Core.huntMonster("safiriainvasion", "Blood Maggot", "Maggot Blood", 6);
            Core.ensureComplete(5494);
        }

        //Ma'alech
        Story.killQuest(5495, "SafiriaInvasion", "Ma'alech");

        //I'm Not Lycan This Situation
        Story.mapItemQuest(5496, "LycanInvasion", 4900);

        //The Best Way To Slay An Infernal
        if (!Story.questProgression(5497)) {
            Core.ensureAccept(5497);
            Core.huntMonster("lycaninvasion", "Infernal Knight", "Celestial Spear", 6);
            Core.huntMonster("lycaninvasion", "Fallen Knight", "Celestial Lightblade", 6);
            Core.ensureComplete(5497);
        }

        //A Dire Situation
        Story.killQuest(5498, "LycanInvasion", "Dire Wolf");

        //I'd Lycan To Go Now
        Story.mapItemQuest(5499, "LycanInvasion", 4901);
        Story.mapItemQuest(5499, "LycanInvasion", 4903, 6);

        //Lord Balax'el
        Story.killQuest(5500, "LycanInvasion", "Lord Balax'el");

        //Follow Lady Solani
        if (!Story.questProgression(5501)) {
            Core.ensureAccept(5501);
            Core.getMapItem(4902, 1, "SafiriaInvasion");
            Core.huntMonster("safiriainvasion", "Fallen Knight", "Infernals Slain", 5);
            Core.ensureComplete(5501);
        }

        //Revenant Slayer
        if (!Story.questProgression(5502)) {
            Core.ensureAccept(5502);
            Core.huntMonster("safiriainvasion", "Shadow Imp", "Shadow Imp Slain", 8);
            Core.huntMonster("safiriainvasion", "Revenant", "Revenant Slain", 8);
            Core.ensureComplete(5502);
        }

        //Noddharath
        Story.killQuest(5503, "SafiriaInvasion", "Noddharath");
    }

    shadowfallDarknessRising(): void {
        //Progress Check
        if (Core.isCompletedBefore(5557)) {
            return;
        }

        this.darkoviaDarkDiaspora();

        //Preload Quests
        Story.preLoad(this.shadowfallDarknessRising);

        //Commander Tibias
        Story.mapItemQuest(5543, "shadowfallinvasion", 5024);

        //Clear the Walls
        if (!Story.questProgression(5544)) {
            Core.ensureAccept(5544);
            Core.huntMonster("shadowfallinvasion", "Infernal Imp", "Infernal Imp Slain", 6);
            Core.huntMonster("shadowfallinvasion", "Infernal Knight", "Infernal Knight Slain", 6);
            Core.ensureComplete(5544);
        }

        //Load the Ballistas
        Story.mapItemQuest(5545, "shadowfallinvasion", 5025, 4);
        Story.mapItemQuest(5545, "shadowfallinvasion", 5026, 4);

        //Arm the Archers
        Story.killQuest(5546, "shadowfallinvasion", "Infernal Imp");

        //Reinforce the Walls
        Story.mapItemQuest(5547, "shadowfallinvasion", 5027, 5);

        //Work Done!
        Story.mapItemQuest(5548, "shadowfallinvasion", 5028);

        //Clear the Tower
        Story.killQuest(5549, "shadowfallinvasion", "Bone Creeper");

        //Find the Passage
        Story.mapItemQuest(5550, "shadowfallinvasion", 5029);

        //Go Through That Door
        if (!Story.questProgression(5551)) {
            Core.ensureAccept(5551);
            Core.huntMonster("shadowfallinvasion", "Bone Guardian", "Bone Guardian Slain");
            Core.huntMonster("shadowfallinvasion", "Bone Guardian", "Soul Fragment Retrievement");
            Core.ensureComplete(5551);
        }

        //Infernal Attack
        if (!Story.questProgression(5552)) {
            Core.ensureAccept(5552);
            Core.huntMonster("shadowfallinvasion", "Nethermage", "Nethermage Slain", 4);
            Core.huntMonster("shadowfallinvasion", "Diabolical Scryer", "Diabolical Scryer Slain", 4);
            Core.huntMonster("shadowfallinvasion", "Fallen Knight", "Fallen Knight Slain", 4);
            Core.ensureComplete(5552);
        }

        //Here's A Hammer, Get To Work
        Story.mapItemQuest(5553, "shadowfallinvasion", 5030, 9);

        //The Next Step
        Story.mapItemQuest(5554, "shadowfallinvasion", 5031);

        //Soul Fuel
        if (!Story.questProgression(5555)) {
            Core.ensureAccept(5555);
            Core.getMapItem(5032, 1, "shadowfallinvasion");
            Core.huntMonster("shadowfallinvasion", "Diabolical Scryer", "Infernal Soul", 12);
            Core.ensureComplete(5555);
        }

        //Time to Fly
        Story.mapItemQuest(5556, "shadowfallinvasion", 5033);

        //YOU again!
        Story.killQuest(5557, "shadowfallinvasion", "Lord Balax'el");
    }

    swordhavenTheNewWorld(): void {
        //Progress Check
        if (Core.isCompletedBefore(5586)) {
            return;
        }

        //Preload Quests
        Story.preLoad(this.swordhavenTheNewWorld);

        //Stand for Swordhaven
        if (!Story.questProgression(5575)) {
            Core.ensureAccept(5575);
            Core.killMonster("safiriainvasion", "r4", "Left", "Fallen Knight", "Fallen Knight's Armor", 5);
            Core.killMonster("safiriainvasion", "r4", "Left", "Infernal Knight", "Infernal Knight's Armor", 5);
            Core.ensureComplete(5575);
        }

        //Use Their Energy Against Them
        Story.killQuest(5576, "shadowfallinvasion", "Nethermage");

        //Scry this!
        Story.killQuest(5577, "shadowfallinvasion", "Diabolical Scryer");

        //Recalibration
        if (!Story.questProgression(5578)) {
            Core.ensureAccept(5578);
            Core.killMonster("DoomPally", "r3", "Right", "*", "Doomwood Invaders Fought", 4);
            Core.killMonster("DarkoviaInvasion", "Enter", "Spawn", "*", "Darkovia Invaders Fought", 4);
            Core.killMonster("shadowfallinvasion", "r4", "Left", "*", "Shadowfall Invaders Fought", 4);
            Core.ensureComplete(5578);
        }

        //Arm the Armored!
        Story.mapItemQuest(5579, "castleinvasion", 5055, 5);
        Story.mapItemQuest(5579, "castleinvasion", 5056);

        //Save the Citizens
        Story.mapItemQuest(5580, "castleinvasion", 5058, 5);

        //Destroy the Infernals
        if (!Story.questProgression(5581)) {
            Core.ensureAccept(5581);
            Core.huntMonster("castleinvasion", "Infernal Knight", "Infernal Knights Slain", 3);
            Core.huntMonster("castleinvasion", "Fallen Knight", "Fallen Knights Slain", 3);
            Core.huntMonster("castleinvasion", "Nethermage", "Nethermages Slain", 3);
            Core.ensureComplete(5581);
        }

        //What is THAT??
        if (!Story.questProgression(5582)) {
            Core.ensureAccept(5582);
            // Drop is 100%, and will get stuck  otherwise as its auto-turnin
            Core.killMonster("castleinvasion", "r2a", "Left", "*");
            bot.wait.forPickup("Giant Worm of Teeth Defeated");
            Core.ensureComplete(5582);
        }

        //Arm the Civilians
        Story.mapItemQuest(5583, "castleinvasion", 5057, 4);

        //Get Those Beasts
        if (!Story.questProgression(5584)) {
            Core.ensureAccept(5584);
            Core.huntMonster("castleinvasion", "Infernal Imp", "Infernal Imps Slain", 4);
            Core.huntMonster("castleinvasion", "Underworld Hound", "Underworld Hounds Slain", 4);
            Core.ensureComplete(5584);
        }

        Core.logger("Relaoding the map for the worm");
        bot.map.reload();
        bot.sleep(2500);
        bot.wait.forMapLoad("castleinvasion");

        //It's Baaaaack!
        if (!Story.questProgression(5585)) {
            Core.ensureAccept(5585);
            // Drop is 100%, and will get stuck  otherwise as its auto-turnin
            Core.killMonster("castleinvasion", "r6a", "Left", "*");
            bot.wait.forPickup("Giant Worm of Teeth Defeated... Again!");
            Core.ensureComplete(5585);
        }

        //Him Again???
        Story.killQuest(5586, "castleinvasion", "Lord Balax'el");
    }
}
