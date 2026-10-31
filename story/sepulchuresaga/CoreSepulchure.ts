/*
name: null
description: null
tags: null
*/
// Port of Scripts/Story/SepulchureSaga/CoreSepulchure.cs.
// Not ported (FarmerJoe's DoAll doesn't reach them): CompleteSS, Alden, Lynaria, SepulchuresRise.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class CoreSepulchure {
    shadowfallRise(): void {
        if (Core.isCompletedBefore(6592)) return;

        Story.preLoad(this.shadowfallRise);

        // Fluid Dynamics 6539
        Core.equipClass(ClassType.Farm);
        Story.killQuest(6539, "noxustower", "Slimeskull");

        // M-ossification 6540
        Story.killQuest(6540, "noxustower", "Doomwood Treeant");

        // A-gore-able 6541
        Story.killQuest(6541, "noxustower", "Sanguine Souleater");

        // Raw-r 6542
        Story.killQuest(6542, "noxustower", "Lightguard Caster");

        // Light 'em Up 6543
        Story.killQuest(6543, "noxustower", "Lightguard Caster");

        // Spellbound 6544
        if (!Story.questProgression(6544)) {
            Core.ensureAccept(6544);
            Core.getMapItem(6018, 4, "noxustower");
            Core.huntMonster("noxustower", "Lightguard Caster", "Lightguard Scroll", 4);
            Core.ensureComplete(6544);
        }

        // Lupine Resurrection 6545
        Story.killQuest(6545, "noxustower", "Lightguard Wolf");

        // Spying on the Light 6546
        Story.killQuest(6546, "noxustower", "Lightguard Paladin");

        // Illusory Disguise 6547
        if (!Story.questProgression(6547)) {
            Core.ensureAccept(6547);
            Core.huntMonster("noxustower", "Slimeskull", "Necrotic Ooze", 3);
            Core.huntMonster("noxustower", "Lightguard Caster", "Lightguard Armor", 4);
            Core.huntMonster("noxustower", "Doomwood Treeant", "Arcane Energy", 3);
            Core.ensureComplete(6547);
        }

        // Test the Disguise 6548
        Story.mapItemQuest(6548, "noxustower", 6019);

        // Get Alteon 6549
        Story.mapItemQuest(6549, "noxustower", 6020);

        // Hammer Time 6550
        Story.killQuest(6550, "noxustower", "General Goldhammer");

        // Lightguard Medals 6560
        Story.killQuest(6560, "lightguardwar", "Citadel Crusader");

        // Mega Lightguard Medals 6561
        Story.killQuest(6561, "lightguardwar", "Citadel Crusader");

        // Bone Marrow 6562
        Story.killQuest(6562, "lightguardwar", "Citadel Crusader");

        // Ooze it up 6563
        Story.killQuest(6563, "lightguardwar", "Slimeskull");

        // Seize the Seige (Engine) 6564
        Story.killQuest(6564, "lightguardwar", "Lightguard Engine");

        // Darken the Light 6565
        Story.killQuest(6565, "lightguardwar", "Scorching Flame");

        // Get the Powder 6566
        Story.killQuest(6566, "lightguardwar", "Citadel Crusader");

        // Destroy the Shield 6567
        Story.killQuest(6567, "lightguardwar", "Sigrid Sunshield");

        // Such a Mess 6581
        if (!Story.questProgression(6581)) {
            Core.ensureAccept(6581);
            Core.getMapItem(6098, 8, "lumafortress");
            Core.huntMonster("lumafortress", "Invasive Shadow", "Shadows Defeated", 8);
            Core.ensureComplete(6581);
        }

        // Herbs Needed 6582
        if (!Story.questProgression(6582)) {
            Core.ensureAccept(6582);
            Core.getMapItem(6099, 7, "lumafortress");
            Core.huntMonster("lumafortress", "Light Treeant", "Glowmoss", 6);
            Core.ensureComplete(6582);
        }

        // Shine a Light 6583
        Story.killQuest(6583, "lumafortress", "Light Elemental");

        // Hapless? 6584
        Story.killQuest(6584, "lumafortress", "Hapless Skeleton");

        // How 'bout them Apples 6585
        Story.killQuest(6585, "lumafortress", "Light Treeant");

        // Make an Offering 6586
        if (!Story.questProgression(6586)) {
            Core.ensureAccept(6586);
            Core.getMapItem(6100, 1, "lumafortress");
            Core.huntMonster("lumafortress", "Lightwing", "Brilliant Feather", 1);
            Core.ensureComplete(6586);
        }

        // Test the Spell Again! 6587
        Story.mapItemQuest(6587, "lumafortress", 6101);

        // Gather the Light 6588
        Story.killQuest(6588, "lumafortress", "Light Elemental");

        // Banish the Shadows 6589
        Story.killQuest(6589, "lumafortress", "Living Shadow");

        // So Many Minions 6590
        Story.killQuest(6590, "lumafortress", "Skeleton Minion");

        // Corrupted Light 6591
        if (!Story.questProgression(6591)) {
            Core.ensureAccept(6591);
            Core.equipClass(ClassType.Solo);
            Core.killMonster("lumafortress", "r4", "Left", "Corrupted Luma", "Luma Defeated");
            Core.ensureComplete(6591);
        }

        // Star Light Star Bright 6592
        Story.killQuest(6592, "lumafortress", "Light Elemental");
    }

    completeSS(): void {
        this.alden();
        this.lynaria();
        this.sepulchuresRise();
        this.shadowfallRise();
    }

    //#region Alden Quests
    alden(): void {
        if (Core.isCompletedBefore(6342)) {
            return;
        }

        Story.preLoad(this.alden);

        // Who goes there? 6332
        Core.equipClass(ClassType.Farm);
        Story.mapItemQuest(6332, "scarsgarde", 5860);

        // The Taint Spreads 6333
        if (!Story.questProgression(6333)) {
            Core.ensureAccept(6333);
            Core.getMapItem(5864, 6, "scarsgarde");
            Core.huntMonster("scarsgarde", "VenomWing", "VenomWing Slain", 6);
            Core.ensureComplete(6333);
        }

        // Beauty Twisted 6334
        Story.killQuest(6334, "scarsgarde", "Garde Grif");

        // Element of Surprise 6335
        if (!Story.questProgression(6335)) {
            Core.ensureAccept(6335);
            Core.getMapItem(5865, 5, "scarsgarde");
            Core.huntMonster("scarsgarde", "Tree", "Tree Branch Obtained", 10);
            Core.ensureComplete(6335);
        }

        // (Take the) Watch Out 6336
        if (!Story.questProgression(6336)) {
            Core.ensureAccept(6336);
            Core.huntMonster("scarsgarde", "Garde Watch", "Watch Slain", 5);
            Core.huntMonster("scarsgarde", "Garde Pikeman", "Pike Slain", 5);
            Core.ensureComplete(6336);
        }

        // False Hoods 6337
        if (!Story.questProgression(6337)) {
            const dothis = Core.initializeWithRetries(() => bot.quests.ensureLoad(6337));
            if (dothis != null) {
                Core.ensureAccept(dothis.id);
                for (const Item of dothis.requirements) {
                    Core.huntMonster("scarsgarde", "Garde Watch", Item.name, Item.quantity, { isTemp: Item.temp });
                }
                Core.ensureComplete(dothis.id);
            } else {
                Core.logger("Quest 6337 not found, try restarting the bot.");
                return;
            }
        }

        // Pass for Real 6338
        if (!Story.questProgression(6338)) {
            Core.ensureAccept(6338);
            //this cell is required for `Passcode A`, but everything can be goten here.. unlike elsewhere
            Core.killMonster("scarsgarde", "r35", "Left", "Garde Knight", "Passcode A");
            Core.killMonster("scarsgarde", "r35", "Left", "Garde Knight", "Passcode C");
            Core.killMonster("scarsgarde", "r35", "Left", "Garde Pikeman", "Passcode B");

            Story.mapItemQuest(6338, "scarsgarde", [5866, 5867]);
        }

        // Hidden in Plain Sight 6339
        Story.mapItemQuest(6339, "scarsgarde", 5868, 8);
        Story.mapItemQuest(6339, "scarsgarde", 5869);

        // Stay Strong Keep Steady 6340
        if (!Story.questProgression(6340)) {
            Core.ensureAccept(6340);
            Core.huntMonster("scarsgarde", "Garde Knight", "Knight Slain", 10);
            Core.huntMonster("scarsgarde", "Garde Pikeman", "Pike Slain", 5);
            Core.ensureComplete(6340);
        }

        // The Final Fight 6341
        Core.equipClass(ClassType.Solo);
        Story.killQuest(6341, "scarsgarde", "Garde Captain");

        // Arm the Army 6342
        if (!Story.questProgression(6342)) {
            Core.ensureAccept(6342);
            Core.huntMonster("scarsgarde", "Garde Knight", "Knight Slain", 3);
            Core.huntMonster("scarsgarde", "Garde Watch", "Watch Slain", 3);
            Core.huntMonster("scarsgarde", "Garde Pikeman", "Pike Slain", 3);
            Core.ensureComplete(6342);
        }
    }

    //#endregion
    //#region Lynaria Quests
    lynaria(): void {
        if (Core.isCompletedBefore(6353)) {
            return;
        }

        Story.preLoad(this.lynaria);

        // Who goes there? 6343
        Core.equipClass(ClassType.Farm);
        Story.mapItemQuest(6343, "scarsgarde", 5861);

        // The Taint Spreads 6344
        if (!Story.questProgression(6344)) {
            Core.ensureAccept(6344);
            Core.getMapItem(5864, 6, "scarsgarde");
            Core.huntMonster("scarsgarde", "VenomWing", "VenomWing Slain", 6);
            Core.ensureComplete(6344);
        }

        // Beauty Twisted 6345
        Story.killQuest(6345, "scarsgarde", "Garde Grif");

        // Element of Surprise 6346
        if (!Story.questProgression(6346)) {
            Core.ensureAccept(6346);
            Core.getMapItem(5865, 5, "scarsgarde");
            Core.huntMonster("scarsgarde", "Tree", "Tree Branch Obtained", 10);
            Core.ensureComplete(6346);
        }

        // (Take the) Watch Out 6347
        if (!Story.questProgression(6347)) {
            Core.ensureAccept(6347);
            Core.huntMonster("scarsgarde", "Garde Watch", "Watch Slain", 5);
            Core.huntMonster("scarsgarde", "Garde Pikeman", "Pike Slain", 5);
            Core.ensureComplete(6347);
        }

        // False Hoods 6348
        if (!Story.questProgression(6348)) {
            Core.ensureAccept(6348);
            Core.huntMonster("scarsgarde", "Garde Watch", "Watch Hood", 1);
            Core.huntMonster("scarsgarde", "Garde Watch", "Watch Scarf", 1);
            Core.huntMonster("scarsgarde", "Garde Watch", "Watch Tunic", 1);
            Core.huntMonster("scarsgarde", "Garde Watch", "Watch Leggings", 1);
            Core.huntMonster("scarsgarde", "Garde Watch", "Watch Boots", 1);
            Core.huntMonster("scarsgarde", "Garde Watch", "Watch Dagger", 1);
            Core.huntMonster("scarsgarde", "Garde Watch", "Watch Badge", 1);
            Core.ensureComplete(6348);
        }

        // Pass for Real 6349
        if (!Story.questProgression(6349)) {
            Core.ensureAccept(6349);
            //this cell is required for `Passcode A`, but everything can be goten here.. unlike elsewhere
            Core.killMonster("scarsgarde", "r35", "Left", "Garde Knight", "Passcode A");
            Core.killMonster("scarsgarde", "r35", "Left", "Garde Knight", "Passcode C");
            Core.killMonster("scarsgarde", "r35", "Left", "Garde Pikeman", "Passcode B");

            Story.mapItemQuest(6349, "scarsgarde", [5866, 5867]);
        }

        // Hidden in Plain Sight 6350
        Story.mapItemQuest(6350, "scarsgarde", 5868, 8);
        Story.mapItemQuest(6350, "scarsgarde", 5869);

        // Stay Strong Keep Steady 6351
        if (!Story.questProgression(6351)) {
            Core.ensureAccept(6351);
            Core.huntMonster("scarsgarde", "Garde Knight", "Knight Slain", 10);
            Core.huntMonster("scarsgarde", "Garde Pikeman", "Pike Slain", 5);
            Core.ensureComplete(6351);
        }

        // The Final Fight 6352
        Core.equipClass(ClassType.Solo);
        Story.killQuest(6352, "scarsgarde", "Garde Captain");

        // Arm the Army 6353
        if (!Story.questProgression(6353)) {
            Core.ensureAccept(6353);
            Core.huntMonster("scarsgarde", "Garde Knight", "Knight Slain", 3);
            Core.huntMonster("scarsgarde", "Garde Watch", "Watch Slain", 3);
            Core.huntMonster("scarsgarde", "Garde Pikeman", "Pike Slain", 3);
            Core.ensureComplete(6353);
        }
    }

    //#endregion
    //#region Sepulchure's Rise
    sepulchuresRise(): void {
        if (Core.isCompletedBefore(6408)) {
            return;
        }

        Story.preLoad(this.sepulchuresRise);

        // Come On Get Ready! 6356
        Core.equipClass(ClassType.Farm);
        Story.buyQuest(6356, "valleyofdoom", 1599, "Valen Gear", 1);

        // Scout the Valley 6357
        Story.killQuest(6357, "valleyofdoom", "Shadow Imp");

        // Gather Energy 6358
        Story.killQuest(6358, "valleyofdoom", "Shadow Imp");

        // Do I Have To Spell It Out? 6359
        Story.mapItemQuest(6359, "valleyofdoom", 5873, 8);

        // Get Through the Shadows 6360
        if (!Story.questProgression(6360)) {
            Core.ensureAccept(6360);
            Core.huntMonster("valleyofdoom", "Shadow Beast", "Shadow Beasts Slain", 8);
            Core.huntMonster("valleyofdoom", "Shadow Person", "Shadow People Slain", 8);
            Core.ensureComplete(6360);
        }

        // Get the Key 6361
        Story.killQuest(6361, "valleyofdoom", "Doom Guardian");

        // Confront the Champion of Darkness 6362
        Story.mapItemQuest(6362, "valleyofdoom", 5872);

        // Destroy the Arsenal 6363
        if (!Story.questProgression(6363)) {
            Core.ensureAccept(6363);
            Core.killMonster("valleyofdoom", "r7", "Left", "Doom Star", "Doomstar Destroyed");
            Core.killMonster("valleyofdoom", "r7", "Left", "Doom Scythe", "Doomscythe Destroyed");
            Core.killMonster("valleyofdoom", "r7", "Left", "Doom Axe", "Doomaxe Destroyed");
            Core.killMonster("valleyofdoom", "r8", "Left", "Doom Blade", "Doom Blade Destroyed");
            Core.killMonster("valleyofdoom", "r8", "Left", "Doom Knight Armor", "Doom Knight Armor Destroyed");
            Core.ensureComplete(6363);
        }

        // Defeat the Armor 6364
        Core.equipClass(ClassType.Solo);
        if (!Story.questProgression(6364)) {
            Core.ensureAccept(6364);
            Core.huntMonsterMapID("valleyofdoom", 25, "Doomknight Armor Defeated");
            Core.ensureComplete(6364);
        }

        // Secure the Chest 6365
        Story.mapItemQuest(6365, "guardiantower", 5871);

        // Get Some Goo 6366
        Story.killQuest(6366, "guardiantower", "Slime");

        // Retrieve the Wand 6367
        Core.equipClass(ClassType.Solo);
        Story.killQuest(6367, "guardiantower", "Yargol Magebane");

        // The Wedding 6368
        Core.logger("Autocompleted");

        // Gather the Shadows 6369
        Core.equipClass(ClassType.Farm);
        Story.killQuest(6369, "valleyofdoom", "Shadow Imp");

        // Choose Your Path 6370
        Story.mapItemQuest(6370, "ebonslate", 5895);

        // Mind Control 6371
        Story.killQuest(6371, "ebonslate", "Mind Con-Troll");

        // Sp-Eye on You 6372
        Story.killQuest(6372, "ebonslate", "Sp-Eye");

        // Lower the Drawbridge 6373
        Story.mapItemQuest(6373, "ebonslate", 5896);
        Story.killQuest(6373, "ebonslate", "Ebonslate Guard");

        // Get the Key 6374
        Story.mapItemQuest(6374, "ebonslate", 5897);
        Story.killQuest(6374, "ebonslate", ["Lycan Brute", "Lycan Brute"]);

        // Break Down the Door 6375
        Story.mapItemQuest(6375, "ebonslate", 5898);

        // Question the Knights 6376
        Story.killQuest(6376, "ebonslate", "Ebonslate Knight");

        // Troll the Trolls 6377
        Story.killQuest(6377, "ebonslate", "Mind Con-Troll");

        // Get Through the Barrier 6378
        Story.mapItemQuest(6378, "ebonslate", 5899);

        // Disarm the Knights 6379
        Story.killQuest(6379, "ebonslate", "Ebonslate Knight");

        // Bruise the Bruiser 6380
        Core.equipClass(ClassType.Solo);
        Story.killQuest(6380, "ebonslate", "Ebonslate Bruiser");

        // Take Down Dethrix 6381
        if (Story.questProgression(6381)) {
            Core.ensureAccept(6381);
            Core.join("ebonslate", "r11", "Left");
            bot.kill.monster("Dethrix");
            Core.sleep(10000);
        }

        // Please Fix Me 6382
        Story.killQuest(6382, "guardiantowerb", "Slime");

        // Get the Slime 6383
        Story.killQuest(6383, "guardiantowerb", "Slime");

        // Reach for the Heart 6384
        Core.equipClass(ClassType.Solo);
        Story.killQuest(6384, "guardiantowerb", "Yargol Magebane");

        // Get More Shadows 6385
        Core.equipClass(ClassType.Farm);
        Story.killQuest(6385, "guardiantowerb", "Slime");

        // Garen's Key 6386
        if (!Story.questProgression(6386)) {
            Core.ensureAccept(6386);
            Core.huntMonster("guardiantowerb", "Guardian Selby", "Guardians Slain", 3);
            Core.huntMonster("guardiantowerb", "Guardian Garen", "Guardian Garen's Key", 1);
            Core.ensureComplete(6386);
        }

        // Selby's Key 6387
        if (!Story.questProgression(6387)) {
            Core.ensureAccept(6387);
            Core.huntMonster("guardiantowerb", "Guardian Garen", "Guardians Slain", 3);
            Core.huntMonster("guardiantowerb", "Guardian Selby", "Guardian Selby's Key", 1);
            Core.ensureComplete(6387);
        }

        // Get Rid of Bolton 6388
        if (!Story.questProgression(6388)) {
            Core.ensureAccept(6388);
            Core.getMapItem(5901, 1, "guardiantowerb");
            Core.huntMonster("guardiantowerb", "Guardian Bolton", "Guardian Bolton Slain", 1);
            Core.ensureComplete(6388);
        }

        // Get Rid of the Imps 6389
        Story.killQuest(6389, "ebondungeon", "Ebonslate Imp");

        // Get Into the Dungeon 6390
        Story.mapItemQuest(6390, "ebondungeon", 5902);

        // Destroy the Guards 6391
        Story.killQuest(6391, "ebondungeon", "Ebon Dungeon Guard");

        // Get the Key 6392
        Story.killQuest(6392, "ebondungeon", "Elite Dungeon Guard");

        // Find Lynaria 6393
        Story.mapItemQuest(6393, "ebondungeon", [5903, 5904]);

        // Destroy Dethrix 6394
        Core.equipClass(ClassType.Solo);
        Story.killQuest(6394, "ebondungeon", "Dethrix");

        // Siphon the Power (Farming) 6395
        Story.killQuest(6395, "ebondungeon", "Ebon Dungeon Guard");

        // He's Not Your Friend 6399
        Story.killQuest(6399, "alteonfight", "King Alteon");

        // Defeat the Dragon 6400
        Story.mapItemQuest(6400, "alteonfight", 5910);

        // Power Boost 6401
        Core.equipClass(ClassType.Farm);
        Story.killQuest(6401, "darkplane", "Shadow Beast");

        // Take His Knights 6402
        Story.killQuest(6402, "darkplane", "Guardian Knight");

        // Destroy the Light 6403
        Story.killQuest(6403, "darkplane", "Light Spirit");

        // More Power! 6404
        Story.killQuest(6404, "darkplane", "Shadow Beast");

        // Destroy the Force Field 6405
        Story.mapItemQuest(6405, "darkplane", 5911);

        // Defeat the Battalion 6406
        Story.killQuest(6406, "darkplane", "Guardian Knight");

        // Destroy the Beast 6407
        Core.equipClass(ClassType.Solo);
        Story.killQuest(6407, "darkplane", "Victorious");

        // Learn from the Past 6408
        Story.killQuest(6408, "darkplane", "Shadow Beast");
    }
}
