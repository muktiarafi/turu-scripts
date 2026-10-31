/*
name: null
description: null
tags: null
*/
// Port of Scripts/Story/Fireisland/CoreFireisland.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class CoreFireIsland {
    completeFireIsland(): void {
        if (Core.isCompletedBefore(Core.isMember ? 4157 : 4235)) {
            return;
        }

        this.embersea();
        this.pyrewatch();
        this.feverfew();
        this.phoenixrise();
        this.fireforge();
        this.lavarun();
        this.brimstone();
        this.nightmare();
    }

    embersea(): void {
        if (Core.isCompletedBefore(4055)) {
            return;
        }

        Story.preLoad(this.embersea);

        //Heat of Battle 4054
        if (!Story.questProgression(4054)) {
            Core.ensureAccept(4054);
            Core.huntMonster("embersea", "Flame Soldier", "Flame Soldier slain", 3);
            Core.huntMonster("embersea", "Storm Scout", "Storm Scout slain", 3);
            Core.ensureComplete(4054);
        }

        //Light the Flame 4055
        if (!Story.questProgression(4055)) {
            Core.ensureAccept(4055);
            Core.getMapItem(3153, 22, "Embersea");
            Core.huntMonster("embersea", "Living Lava", "Living Lava slain", 4);
            Core.ensureComplete(4055);
        }

        //Kill It With Fire [Member] 4056
        if (Core.isMember) {
            if (!Story.questProgression(4056)) {
                Core.ensureAccept(4056);
                Core.huntMonster("embersea", "Coal Creeper", "Coal Creeper slain", 5);
                Core.huntMonster("embersea", "Pyradon", "Pyradon slain", 2);
                Core.huntMonster("embersea", "Fyresyn", "Fyresyn slain", 1);
                Core.ensureComplete(4056);
            }
        }
    }

    pyrewatch(): void {
        if (Core.isCompletedBefore(4081)) {
            return;
        }

        this.embersea();

        Story.preLoad(this.pyrewatch);

        //Flee the Flames
        if (!Story.questProgression(4070)) {
            Core.ensureAccept(4070);
            Core.huntMonster("pyrewatch", "Lavazard", "Lavazard Slain", 3);
            Core.huntMonster("pyrewatch", "Fyreborn Tiger", "Tiger Slain", 5);
            Core.huntMonster("pyrewatch", "Caustocrush", "Caustocrush Slain", 3);
            Core.ensureComplete(4070);
        }

        //Taste of their own Medicine
        Story.killQuest(4071, "pyrewatch", "Fire Pikeman");

        //A Jarring Discovery
        Story.mapItemQuest(4072, "pyrewatch", 3159, 12);

        //Push on to Pyrewatch
        if (!Story.questProgression(4073)) {
            Core.ensureAccept(4073);
            Core.huntMonster("pyrewatch", "Firestorm Knight", "Battle Plans", 1);
            Core.huntMonster("pyrewatch", "Firestorm Knight", "Peak Defended", 10);
            Core.ensureComplete(4073);
        }

        //Friends of Pyrewatch Peak
        if (!Story.questProgression(4074)) {
            Core.ensureAccept(4074);
            Core.huntMonster("Pyrewatch", "Fire Pikeman", "Pikeman Slain", 3);
            Core.huntMonster("Pyrewatch", "Fire Pikeman", "Firestorm Helm", 6);
            Core.huntMonster("Pyrewatch", "Flame Soldier", "Flame Soldier Slain", 3);
            Core.huntMonster("Pyrewatch", "Caustocrush", "Caustocrush Slain", 3);
            Core.ensureComplete(4074);
        }

        //A Salve to Soothe
        if (!Story.questProgression(4075)) {
            Core.ensureAccept(4075);
            Core.getMapItem(3160, 5, "pyrewatch");
            Core.huntMonster("pyrewatch", "Lavazard", "Glowing Embers", 5);
            Core.ensureComplete(4075);
        }

        //Protect the Plague Sufferers 4076
        if (!Story.questProgression(4076)) {
            Core.ensureAccept(4076);
            Core.huntMonster("Pyrewatch", "Lavazard", "Kindling", 3);
            Core.huntMonster("Pyrewatch", "Caustocrush", "Flint and Steel");

            //multiple items with name "coal" will wig out otherwise
            while (!bot.shouldExit && !Core.checkInventory(28565, 6)) {
                Core.huntMonster("Pyrewatch", "Coal Creeper", "Coal", 6);
            }

            Core.ensureComplete(4076);
        }

        //Ease the Ill 4077
        if (!Story.questProgression(4077)) {
            Core.ensureAccept(4077);
            Core.huntMonster("Pyrewatch", "Lavazard", "Wickskin Root", 3);
            Core.huntMonster("Pyrewatch", "Lavazard", "Zard Marrow", 3);
            Core.huntMonster("Pyrewatch", "Living Lava", "Living Lava Blood", 2);
            Story.mapItemQuest(4077, "Pyrewatch", 3161, 5);
        }

        //Defend Pyrewatch Peak 4078
        Story.killQuest(4078, "Pyrewatch", "Storm Scout");

        //Signal Fire 4079
        if (!Story.questProgression(4079)) {
            Core.ensureAccept(4079);
            Core.huntMonster("Pyrewatch", "Storm Scout", "Polish");
            Core.huntMonster("Pyrewatch", "Flame Soldier", "Cloth");
            Core.huntMonster("Pyrewatch", "Flame Soldier", "Stand Legs", 8);
            Core.huntMonster("Pyrewatch", "Fyreborn Tiger", "Reflectors", 4);
            Core.ensureComplete(4079);
        }

        //Spreading Like Wildfire 4080
        Story.mapItemQuest(4080, "Pyrewatch", 3162, 4);

        //Pyrewatch Defender Badge 4081
        Story.killQuest(4081, "Pyrewatch", "Storm Scout");
    }

    feverfew(): void {
        if (Core.isCompletedBefore(4142)) {
            return;
        }

        this.pyrewatch();

        Story.preLoad(this.feverfew);

        //map aggro from pyrewatch
        while (!bot.shouldExit && bot.player.inCombat) {
            Core.jumpWait();
            Core.sleep();
            if (!bot.player.inCombat) {
                break;
            }
        }

        //Quench the Flames
        Story.killQuest(4128, "feverfew", "Firestorm Knight");

        //Through the Fog and Flame
        Story.killQuest(4129, "feverfew", "Locked Chest");

        //Restore the Lady of Waters
        if (!Story.questProgression(4130)) {
            Story.mapItemQuest(4130, "feverfew", [3246, 3247]);
            Core.huntMonster("feverfew", "Coral Creeper", "Statue Torso");
            Core.huntMonster("feverfew", "Twisted Undine", "Statue Base");
            Core.huntMonster("feverfew", "Salamander", "Statue Core");
            Core.huntMonster("feverfew", "Firestorm Knight", "Statue Plaque");
            Core.ensureComplete(4130);
        }

        //Rumors and Smoke
        if (!Story.questProgression(4131)) {
            Core.ensureAccept(4131);
            Core.getMapItem(3245, 1, "feverfew");
            Core.huntMonster("feverfew", "Firestorm Knight", "Intent Rumor", 3);
            Core.huntMonster("feverfew", "Firestorm Major", "Location Rumor", 2);
            Core.huntMonster("feverfew", "Firestorm Knight", "Fate Rumor", 2);
            Core.huntMonster("feverfew", "Firestorm Major", "Identity Rumor", 1);
            Core.ensureComplete(4131);
        }

        //Dam the Flood
        Story.mapItemQuest(4132, "feverfew", 3244, 5);

        //Salvage Mission
        if (!Story.questProgression(4133)) {
            Core.ensureAccept(4133);
            Core.getMapItem(3243, 5, "feverfew");
            Core.huntMonster("feverfew", "Twisted Undine", "Locatrix Animus Found", 1);
            Core.ensureComplete(4133);
        }

        //Fear the Fog
        if (!Story.questProgression(4134)) {
            Core.ensureAccept(4134);

            Core.huntMonster("feverfew", "Salamander", "Salamander Tongue", 3);
            Core.huntMonster("feverfew", "Feverfew Vase", "Adderoot Powder", 2);
            Core.huntMonster("feverfew", "Twisted Undine", "Shadowbane Brine", 4);
            Core.huntMonster("feverfew", "Coral Creeper", "Charred Claw", 2);
            Core.huntMonster("feverfew", "Firestorm Knight", "Whispered Regret");

            Core.ensureComplete(4134);
        }

        //When There's Smoke...
        Story.mapItemQuest(4135, "feverfew", 3248);

        //Firin' This Guy
        Story.killQuest(4136, "feverfew", "Blazebinder");

        //Blessings of the Lady
        Story.mapItemQuest(4137, "feverfew", 3242, 10);

        //Parting the Waters
        if (!Story.questProgression(4138)) {
            Core.logger("Quest needs to be abandoned before it can be completed and reaccepted.");
            Core.ensureAccept(4138);
            Core.abandonQuest(4138);

            Core.ensureAccept(4138);

            Core.huntMonster("feverfew", "Salamander", "Burning Ember", 3);
            Core.huntMonster("feverfew", "Coral Creeper", "Stoneskin Shard", 3);
            Core.huntMonster("feverfew", "Firestorm Knight", "Last Breath", 3);
            Core.huntMonster("feverfew", "Twisted Undine", "Undine's Tear", 3);

            Core.jump("Cut2", "Left");
            Core.ensureComplete(4138);
        }

        //The Power to Heal
        if (!Story.questProgression(4139)) {
            Core.ensureAccept(4139);
            Core.huntMonster("feverfew", "Feverfew Vase", "Saltwater Powder", 3);
            Core.huntMonster("feverfew", "Twisted Undine", "Undine Effluvia", 2);
            Core.huntMonster("feverfew", "Locked Chest", "Herbalist Manual", 1);
            Core.ensureComplete(4139);
        }

        //The Deadsea Caverns
        if (!Story.questProgression(4140)) {
            Core.ensureAccept(4140);
            Core.huntMonster("feverfew", "Coral Creeper", "Coral Creeper Slain", 3);
            Core.huntMonster("feverfew", "Twisted Undine", "Twisted Undine Slain", 3);
            Core.huntMonster("feverfew", "Salamander", "Salamander Slain", 3);
            Core.ensureComplete(4140);
        }

        //Open the Floodgates
        Story.mapItemQuest(4141, "feverfew", 3241);

        //Tiger, Tiger Burning Bright
        Story.killQuest(4142, "feverfew", "Major Thermas");
    }

    phoenixrise(): void {
        if (Core.isCompletedBefore(4213)) {
            return;
        }

        this.feverfew();

        Story.preLoad(this.phoenixrise);

        //Stonecold Defense
        if (!Story.questProgression(4201)) {
            Core.ensureAccept(4201);
            Core.huntMonster("phoenixrise", "Lava Troll", "Lava Tonic", 5);
            Core.huntMonster("phoenixrise", "Infernal Goblin ", "Leather Wing", 3);
            Core.ensureComplete(4201);
        }

        //Preying for a Good Offense
        if (!Story.questProgression(4202)) {
            Core.ensureAccept(4202);
            Core.huntMonster("phoenixrise", "Infernal Goblin ", "Infernal Goblin Slain", 3);
            Core.huntMonster("phoenixrise", "Lava Troll", "Lava Troll Slain", 3);
            Core.huntMonster("phoenixrise", "Gargrowl", "Gargrowl Slain", 3);
            Core.ensureComplete(4202);
        }

        //Red Alert
        Story.mapItemQuest(4203, "phoenixrise", 3283, 4);

        //Disguise Fur a Good Cause
        if (!Story.questProgression(4204)) {
            Core.ensureAccept(4204);
            Core.huntMonster("phoenixrise", "Lava Troll", "MeltRite Glue", 1);
            Core.huntMonster("phoenixrise", "Firestorm Tiger", "Whole Tigerskin", 2);
            Core.huntMonster("phoenixrise", "Infernal Goblin ", "Binding Leather", 3);
            Core.ensureComplete(4204);
        }

        //Hunt for the Stolen
        Story.mapItemQuest(4205, "phoenixrise", 3285);

        //Rescue Run
        Story.mapItemQuest(4206, "phoenixrise", 3282, 6);

        //Recover the Remainder
        Story.killQuest(4207, "phoenixrise", "Pyrric Ursus");

        //Rune Chances of a Backstab
        if (!Story.questProgression(4208)) {
            Core.ensureAccept(4208);
            Core.getMapItem(3284, 7, "phoenixrise");
            Core.huntMonster("phoenixrise", "Infernal Goblin ", "Infernal Goblin Slain", 6);
            Core.ensureComplete(4208);
        }

        //Clear out the Caverns
        if (!Story.questProgression(4209)) {
            Core.ensureAccept(4209);
            Core.huntMonster("phoenixrise", "Lava Troll", "Lava Troll Disarmed", 3);
            Core.huntMonster("phoenixrise", "Infernal Goblin", "Goblin Claws", 5);
            Core.huntMonster("phoenixrise", "Firestorm Tiger", "Tiger Fang", 4);
            Core.huntMonster("phoenixrise", "Pyrric Ursus", "Ursus Shard", 2);
            Core.ensureComplete(4209);
        }

        //Strengthen the Survivors
        if (!Story.questProgression(4210)) {
            Core.ensureAccept(4210);
            Core.huntMonster("phoenixrise", "Lava Troll", "Sacred Flame");
            Core.huntMonster("phoenixrise", "Infernal Goblin", "Lava Rune", 3);
            Core.huntMonster("phoenixrise", "Firestorm Tiger", "Tiger Claw", 4);
            Core.huntMonster("phoenixrise", "Pyrric Ursus", "Pyrric Gem");
            Core.ensureComplete(4210);
        }

        //Bridge to Salvation
        Story.killQuest(4211, "phoenixrise", "Lava Troll");

        //Growling Pains
        Story.killQuest(4212, "phoenixrise", "Gargrowl");

        //Defeat Cinderclaw
        Story.killQuest(4213, "phoenixrise", "Cinderclaw");
    }

    fireforge(): void {
        if (Core.isCompletedBefore(4226)) {
            return;
        }

        this.phoenixrise();

        Story.preLoad(this.fireforge);

        //Round 1: Firestorm Scouts 4216
        Story.killQuest(4216, "Fireforge", "Firestorm Scout");

        //Round 2: Firestorm Soldiers 4217
        Story.killQuest(4217, "Fireforge", "Firestorm Soldier");

        //Round 3: Firestorm Pikemen 4218
        Story.killQuest(4218, "Fireforge", "Fire Pikeman");

        //Round 4: Firestorm Knights 4219
        Story.killQuest(4219, "Fireforge", "Firestorm Knight");

        //Round 5: Firestorm Corporals 4220
        Story.killQuest(4220, "Fireforge", "Firestorm Corporal");

        //Round 6: Firestorm Tigers 4221
        Story.killQuest(4221, "Fireforge", "Firestorm Tiger");

        //Round 7: Firestorm Cavalry 4222
        Story.killQuest(4222, "Fireforge", "Tiger Cavalry");

        //Round 8: Firestorm Majors 4223
        Story.killQuest(4223, "Fireforge", "Firestorm Major");

        //Round 9: Firestorm Blazebinders 4224
        Story.killQuest(4224, "Fireforge", "Blazebinder");

        //Round 10: Firestorm General 4225
        Story.killQuest(4225, "Fireforge", "Firestorm General");

        //Bonus Round: Flamewing the Bright 4226
        Story.killQuest(4226, "Fireforge", "Flamewing");

        //Final Round: Tyndarius Tigermaster 4230
        if (!Story.questProgression(4230)) {
            Core.ensureAccept(4230);
            Core.huntMonsterMapID("Fireforge", 24, "Tyndarius Defeated?");
            Core.ensureComplete(4230);
        }
    }

    lavarun(): void {
        if (Core.isCompletedBefore(4235)) {
            return;
        }

        this.fireforge();

        Story.preLoad(this.lavarun);

        //Defeat Phedra 4231
        Story.killQuest(4231, "Lavarun", "Phedra");

        //Defeat Mega Tyndarius 4232
        Story.killQuest(4232, "Lavarun", "Mega Tyndarius");

        //The Onslaught Fights On 4235
        Story.killQuest(4235, "Lavarun", "Firestorm Soldier");
    }

    brimstone(): void {
        if (Core.isCompletedBefore(4115) || !Core.isMember) {
            Core.logger(
                !Core.isMember
                    ? "You need to be a member to complete /brimestone questline."
                    : "Brimstone Story Complete",
            );
            return;
        }

        // The Hard Way 4107
        if (!Story.questProgression(4107)) {
            Core.ensureAccept(4107);
            Core.huntMonster("Brimstone", "Brimstone Marauder", "Pieces of Gossip", 3);
            Core.huntMonster("Brimstone", "Brimstone Looter", "Bits of Hearsay", 3);
            Core.huntMonster("Brimstone", "Brimstone Bandit", "Overheard Conversations", 3);
            Core.ensureComplete(4107);
        }

        //Encrypt Keepers 4108
        if (!Story.questProgression(4108)) {
            Core.ensureAccept(4108);
            Core.huntMonster("Brimstone", "Brimstone Marauder", "Cryptic Key", 4);
            Core.huntMonster("Brimstone", "Brimstone Looter", "Partial Cipher", 2);
            Core.huntMonster("Brimstone", "Brimstone Bandit", "Reliable(?) Translation", 2);
            Core.ensureComplete(4108);
        }

        //Catching Couriers  4109
        if (!Story.questProgression(4109)) {
            Core.ensureAccept(4109);
            Core.huntMonster("Brimstone", "Brimstone Marauder", "Burned Letter");
            Core.huntMonster("Brimstone", "Brimstone Looter", "Smudged Letter");
            Core.huntMonster("Brimstone", "Brimstone Bandit", "Barely Legible Letter");
            Core.ensureComplete(4109);
        }

        //Steppe Quickly 4110
        if (!Story.questProgression(4110)) {
            Core.ensureAccept(4110);
            Core.huntMonster("Brimstone", "Brimstone Marauder", "Marauders slain", 3);
            Core.huntMonster("Brimstone", "Fyreborn Tiger", "Fyreborn Tigers slain", 5);
            Core.huntMonster("Brimstone", "Fyresyn", "Fyresyn slain", 5);
            Core.huntMonster("Brimstone", "Brimstone Looter", "Looters slain", 3);
            Core.huntMonster("Brimstone", "Brimstone Bandit", "Bandits slain", 3);
            Core.ensureComplete(4110);
        }

        //Reclamation 4111
        if (!Story.questProgression(4111)) {
            Core.ensureAccept(4111);
            Core.huntMonster("Brimstone", "Brimstone Bandit", "Bags of Mercantile Goods", 3);
            Core.huntMonster("Brimstone", "Brimstone Bandit", "Boxes of Raw Materials", 3);
            Core.ensureComplete(4111);
        }

        //Bad Press 4112
        if (!Story.questProgression(4112)) {
            Core.ensureAccept(4112);
            Core.huntMonster("Brimstone", "Brimstone Bandit", "Talmin's Propoganda", 6);
            Core.huntMonster("Brimstone", "Brimstone Bandit", "Talmin's Doctrine", 3);
            Core.ensureComplete(4112);
        }

        //Good Hunting 4113
        if (!Story.questProgression(4113)) {
            Core.ensureAccept(4113);
            Core.huntMonster("Brimstone", "Fyresyn", "Fyresyns Put Down", 5);
            Core.huntMonster("Brimstone", "Fyreborn Tiger", "Fyreborn Tigers Put Down", 6);
            Core.huntMonster("Brimstone", "Pyradon", "Pyradons Put Down", 5);
            Core.ensureComplete(4113);
        }

        //One Last Push 4114
        if (!Story.questProgression(4114)) {
            Core.ensureAccept(4114);
            Core.huntMonster("Brimstone", "Brimstone Bandit", "Bandit's Ear", 3);
            Core.huntMonster("Brimstone", "Brimstone Marauder", "Marauder's Finger", 3);
            Core.huntMonster("Brimstone", "Brimstone Looter", "Looter's Tooth", 3);
            Core.ensureComplete(4114);
        }

        //Redemption 4115
        Story.killQuest(4115, "Brimstone", "Chief Talmin");
    }

    nightmare(): void {
        if (Core.isCompletedBefore(4157)) {
            return;
        }

        if (!Core.isMember) {
            Core.logger("You need to be a member for complete the /nightmare questline.");
            return;
        }

        Story.preLoad(this.nightmare);

        //Fear of Clowns? 4143
        Story.killQuest(4143, "Nightmare", "Bobble Clown");

        //FEAR OF CLOWNS!!! 4144
        Story.killQuest(4144, "Nightmare", "Crazy Clown");

        //Fear of Spiders 4145
        Story.killQuest(4145, "Nightmare", "Castle Spider");

        //Fear of Snakes? 4146
        if (!Story.questProgression(4146)) {
            Core.ensureAccept(4146);
            Core.huntMonster("Nightmare", "Wrasp", "Grappling Hook");
            Core.huntMonster("Nightmare", "Wrasp", "Rope");
            Core.ensureComplete(4146);
        }

        //Fear of Falling? 4147
        Story.mapItemQuest(4147, "Nightmare", 3262);

        //Fear of Germs? 4148
        Story.killQuest(4148, "Nightmare", "Germs");

        //Fear of Needles? 4149
        Story.killQuest(4149, "Nightmare", "Needle");

        //Fear of Dolls? 4150
        Story.killQuest(4150, "Nightmare", "Broken Toy");

        //Fear of Being Buried Alive? 4151
        if (!Story.questProgression(4151)) {
            Core.ensureAccept(4151);
            Core.huntMonster("Nightmare", "Unearthed Skeleton", "Skeleton Deboned", 8);
            Core.huntMonster("Nightmare", "Rotfeeder Worm", "Rotfeeder squished", 4);
            Core.ensureComplete(4151);
        }

        //Fear of Burning? 4152
        Story.killQuest(4152, "Nightmare", "Fire Imp");

        //FEAR OF BURNING!!! 4153
        Story.killQuest(4153, "Nightmare", "Flame Elemental");

        //Fear of Drowning? 4154
        if (!Story.questProgression(4154)) {
            Core.ensureAccept(4154);
            Core.huntMonster("Nightmare", "Anglerfish", "Anglerfish Defeated", 6);
            Core.huntMonster("Nightmare", "Merdraconian", "Merdraconian Defeated", 6);
            Core.huntMonster("Nightmare", "Deep Dweller", "Deep Dweller defeated");
            Core.ensureComplete(4154);
        }

        //Fear of Inadequacy? 4155
        Story.killQuest(4155, "Nightmare", "Unearthed Skeleton");

        //Fear of Loneliness? 4156
        Story.killQuest(4156, "Nightmare", "Nothing");

        //Fear of Failure? 4157
        Story.killQuest(4157, "Nightmare", "Devourax");
    }
}
