/*
name: Verus DoomKnight Class
description: This script will farm Verus DoomKnight Class.
tags: versus, verus, doomknight, vdk, class
*/
// Port of Scripts/Other/Classes/VerusDoomKnight.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreStory } from "../../core/CoreStory";
import { ArchDoomKnight } from "../../evil/ADK";
import { SepulchuresOriginalHelm } from "../../evil/SepulchuresOriginalHelm";
import { TerminaTempleMerge } from "../mergeshops/TerminaTempleMerge";
import { SRoD } from "../weapons/ShadowReaperOfDoom";
import { InfernalArenaLW } from "../../prototypes/InfernalArenaLW";
import { DoomPirateHaulMerge } from "../../seasonal/talklikeapirateday/mergeshops/DoomPirateHaulMerge";
import { CoreAOR } from "../../story/ageofruin/CoreAOR";

const AOR = new CoreAOR();
const Farm = new CoreFarms();
const Adv = new CoreAdvanced();
const SOH = new SepulchuresOriginalHelm();
const ADK = new ArchDoomKnight();
const sRoD = new SRoD();
const TTMerge = new TerminaTempleMerge();
const DPHM = new DoomPirateHaulMerge();
const Story = new CoreStory();

export class VerusDoomKnightClass {
    private static get infernal(): InfernalArenaLW {
        return (VerusDoomKnightClass._Infernal ??= new InfernalArenaLW());
    }
    private static set infernal(value: InfernalArenaLW) {
        VerusDoomKnightClass._Infernal = value;
    }
    private static _Infernal: InfernalArenaLW = null!;

    getClass(rankup = true): void {
        if (Core.checkInventory("Verus DoomKnight")) {
            return;
        }

        Story.preLoad(this.getClass);

        Farm.experience(80);

        Core.equipClass(ClassType.Solo);
        // Body, Soul and, Domination (9411)
        if (!Story.questProgression(9411)) {
            Core.ensureAccept(9411);
            Core.huntMonster("underrealm", "Fear", "Fear's Bones", 13, { isTemp: false });
            Core.huntMonster("brainmeat", "Brain Matter", "Gray Matter", 13, { isTemp: false });
            bot.quests.updateQuest(8777);
            Core.huntMonster("titanattack", "Titanic DoomKnight", "Titanic Spine", 13, { isTemp: false });
            Core.huntMonsterMapID("valleyofdoom", 25, "Doom Knight Plating", 13, { isTemp: false });
            Core.ensureComplete(9411);
        }

        // Of the Same Cloak (9412)
        if (!Story.questProgression(9412)) {
            Farm.experience(50);
            Core.ensureAccept(9412);
            Core.huntMonsterMapID("necrodungeon", 47, "The Mask of the Skulls", undefined, { isTemp: false });
            Core.huntMonster("lumafortress", "Corrupted Luma", "Doom Worshipper's Blade Of Doom", undefined, {
                isTemp: false,
            });
            Core.logger(
                ' "Empress\' ShadowCloak" \'s Droprate is fairly low... so dont complain if it takes "hours" according to reddit... ',
            );
            Core.huntMonster("innershadows", "Krahen", "Empress' ShadowCloak", undefined, { isTemp: false });
            bot.quests.updateQuest(7646);
            Core.huntMonster("techfortress", "MechaVortrix", "Cybernetic Doom Blade", undefined, { isTemp: false });
            Core.ghostItem(55823, "Kyger", 1, false, "Pet", "Time for training!", 1);
            bot.quests.updateQuest(7650);
            Core.huntMonsterMapID("stonewooddeep", 16, "Asherion Armor", undefined, { isTemp: false });
            Core.ensureComplete(9412);
        }

        // Refracted Light (9413)
        if (!Story.questProgression(9413)) {
            Farm.experience(60);
            Core.ensureAccept(9413);
            Core.equipClass(ClassType.Farm);
            Core.huntMonster("brightshadow", "Shadowflame Paladin", "Shadowflame Spike", 150, { isTemp: false });
            Core.huntMonster("fiendshard", "Paladin Fiend", "Light Fiend Horn", 150, { isTemp: false });
            Core.huntMonster("legionarena", "Dark Legion Paladin", "Underworld Soul Glow", 50, { isTemp: false });
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("noxustower", "General Goldhammer", "Gold Hammer Chip", undefined, { isTemp: false });
            Core.huntMonster("chaoslab", "Chaos Artix", "Shimmering Tentacle", 20, { isTemp: false });
            Core.ensureComplete(9413);
        }

        // Life Carve (9417)
        if (!Story.questProgression(9417)) {
            Farm.experience(70);
            Farm.evilREP();
            bot.quests.updateQuest(3773);
            Core.ensureAccept(9417);
            Core.logger('The map "Wanders", is a bit broke,\n' + "it will take a minute to hunt the mosnter");
            Core.huntMonsterMapID("wanders", 46, "Trace of Light", 8, { isTemp: false });
            //i hate this map
            Core.huntMonster("lightguardwar", "Extreme Noxus", "Trace of Dark", 8, { isTemp: false });
            Core.huntMonster("eternalchaos", "Bandit Drakath", "Trace of Wind", 8, { isTemp: false });
            Core.huntMonster("quibblehunt", "Entropy Dragon", "Trace of Earth", 8, { isTemp: false });
            Core.huntMonster("crashsite", "ProtoSartorium", "Trace of Energy", 8, { isTemp: false });
            Core.huntMonster("northlands", "Aisha's Drake", "Trace of Ice", 8, { isTemp: false });
            Core.huntMonster("deepchaos", "Kathool", "Trace of Water", 8, { isTemp: false });
            Core.huntMonster("drakonnan", "Ultra Drakonnan", "Trace of Fire", 8, { isTemp: false });
            Core.huntMonster("battlefowl", "Zeuster Projection", "Trace of Bacon", undefined, { isTemp: false });
            Core.ensureComplete(9417);
        }

        // Soul Fracture (9416)
        if (!Story.questProgression(9416)) {
            Core.ensureAccept(9416);

            Core.huntMonster("ultraalteon", "Ultra Chaos Alteon", "Soul of Alteon", 40, { isTemp: false });
            Core.huntMonster("ebondungeon", "Dethrix", "Soul of Dethrix", 40, { isTemp: false });
            Core.huntMonster("shadowstrike", "Sepulchuroth", "Soul of Sepulchuroth", 40, { isTemp: false });
            Core.huntMonster("ultradrakath", "Champion of Chaos", "Soul of Drakath", 40, { isTemp: false });
            Core.huntMonster("ebilcorphq", "Gravelyn", "Soul of Gravelyn", 40, { isTemp: false });
            Core.huntMonster("shadowvoid", "Fragment of Doom", "Soul of Doom", 40, { isTemp: false });

            Core.ensureComplete(9416);
        }

        // Doom Spikes (9418)
        if (!Story.questProgression(9418)) {
            Farm.experience(80);
            Core.ensureAccept(9418);
            Adv.gearStore(undefined, { enhAfter: true });
            Core.killDoomKitten("Doomkitten's Molar", 20, { isTemp: false });
            Adv.gearStore(true, { enhAfter: true });
            VerusDoomKnightClass.infernal.farmDeadlyDuo("Deadly Duo's Decayed Denture", 10);
            AOR.fightVoiceInTheSea("Maw of the Sea", 10);
            let energyNeeded = 0;

            // Calculate energy based on missing items
            if (!Core.checkInventory("Xyfrag's Slimy Tooth", 5)) {
                energyNeeded += 250;
            }

            if (!Core.checkInventory("Nerfkitten's Fang", 3)) {
                energyNeeded += 150;
            }

            // Hunt for Void Energy if required
            if (energyNeeded > 0) {
                Core.huntMonster("thevoid", "Ninja", "Void Energy", energyNeeded, { isTemp: false });
            }

            // Purchase required items.
            Adv.buyItem("thevoid", 1406, "Xyfrag's Slimy Tooth", 5);
            Adv.buyItem("thevoid", 1406, "Nerfkitten's Fang", 3);

            Core.ensureComplete(9418);
        }

        // Necrotic Blade (9414)
        // FIX: previously checked 9419 which caused this to rerun whenever Unleash Doom wasn't done.
        if (!Story.questProgression(9414)) {
            Core.ensureAccept(9414);
            sRoD.shadowReaperOfDoom();
            SOH.doAll();
            ADK.aMeansToAnEnd(undefined, true);
            TTMerge.buyAllMerge("Dragonlord of Evil");
            DPHM.buyAllMerge("DoomTech DoomKnight");

            //Ensure Everything is unbanked.
            Core.unbank(
                "Dragonlord of Evil",
                "DoomTech DoomKnight",
                "Arch DoomKnight Helm",
                "Sepulchure's Original Helm",
                "ShadowReaper Of Doom",
            );
            Core.ensureComplete(9414);
        }

        // Unleash Doom (9419)
        if (!Story.questProgression(9419)) {
            Core.equipClass(ClassType.Farm);
            Core.ensureAccept(9419);
            Core.huntMonster("citadelruins", "Inquisitor Hobo", "Inquisitor Bones", 1000000, { isTemp: false });

            // FIX: deltavlab -> deltavcore (Refined Metal)
            Core.huntMonster("deltavcore", "Pistol Guard", "Refined Metal", 1000000, { isTemp: false });

            Core.huntMonster("etherwardes", "Earth Dragon Warrior", "Dragon Skin", 1000000, { isTemp: false });
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("necrocavern", "Chaos Vordred", "PaladinSlayer's Skull", 100000, { isTemp: false });
            Core.ensureComplete(9419);
        }

        Core.buyItem("terminatemple", 2343, "Verus DoomKnight");

        if (rankup) {
            Adv.rankUpClass("Verus DoomKnight");
        }
    }
}

export default function main(): void {
    const script = new VerusDoomKnightClass();
    Core.setOptions();

    script.getClass();
    Core.setOptions(false);
}
