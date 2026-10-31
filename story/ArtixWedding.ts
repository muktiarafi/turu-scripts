/*
name: Artix Wedding Story
description: This will finish the Artix Wedding Story.
tags: story, quest, artix wedding, wedding
*/
// Port of Scripts/Story/ArtixWedding.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreStory } from "../core/CoreStory";

const Story = new CoreStory();

export class ArtixWedding {
    artixWeddingComplete(): void {
        this.grimskullAnnex();
        this.artixWeddingQuests();
    }

    grimskullAnnex(): void {
        if (Core.isCompletedBefore(3234)) {
            return;
        }

        Story.preLoad(this.grimskullAnnex);

        //Artix Needs a Girlfriend
        Story.chainQuest(3231);

        //Battle Through the Dungeon 3232
        Core.join("ArtixWedding");
        Story.killQuest(3232, "GrimskullAnnex", "Grim Fighter");

        //The Way is Blocked 3233
        Story.killQuest(3233, "GrimskullAnnex", "Grim Mage");

        //Just a FEW More Monsters... 3234
        Story.killQuest(3234, "GrimskullAnnex", "Grim Soldier");
    }

    artixWeddingQuests(): void {
        if (Core.isCompletedBefore(3253)) {
            return;
        }

        Story.preLoad(this.artixWeddingQuests);

        //Prove Your Worth 3235
        Story.killQuest(3235, "BattleWedding", "Silver Knight");

        //The Knight is Dark 3236
        Story.killQuest(3236, "BattleWedding", "Dark Knight");

        //The Most Brutal Battle 3237
        Story.killQuest(3237, "BattleWedding", "BrutalCorn");

        //Ebilcorp Ninja Nightmare 3238
        Story.killQuest(3238, "BattleWedding", "EbilCorp Ninja");

        //EbilCorp Drones: On! 3239
        Story.killQuest(3239, "BattleWedding", "EbilCorp Ninja");

        //EbilCorp Overshadow(scythe)d 3240
        Story.killQuest(3240, "BattleWedding", "EbilCorp Shadowscythe");

        //Ebilcorp CEOverkill 3241
        Story.killQuest(3241, "BattleWedding", "Platinum Mech Dragon");

        //Protect the Cake! 3242
        Story.killQuest(3242, "BattleWedding", "EbilCorp Ninja");

        //Bellhop and They Don't Stop 3243
        Story.killQuest(3243, "BattleWedding", "Bellhop Human");

        //Dork Knight Rising 3244
        Story.killQuest(3244, "BattleWedding", "Nightwyvern");

        //Iron Hero... RUSTED! 3245
        Story.killQuest(3245, "BattleWedding", "Nightwyvern");

        //Crush the Wedding Crasher 3246
        Story.killQuest(3246, "BattleWedding", "Iron Hero");

        //Hats Off to You 3247
        Story.killQuest(3247, "BattleWedding", "Bellhop Human");

        //This Boss is a Real Drag(on)! 3248
        Story.killQuest(3248, "BattleWedding", "Evil Hotel Manager");

        //Eye See Victory! 3249
        Story.killQuest(3249, "BattleWedding", "Flying Eye");

        //Eye Love Battle 3250
        Story.killQuest(3250, "BattleWedding", "Jimmy the Eye Heart");

        //Bonus Ending: Brutal Battles 3251
        Story.killQuest(3251, "BattleWedding", "BrutalCorn");

        //Bonus Ending: Smell of Victory 3252
        Story.killQuest(3252, "BattleWedding", "Evil Hotel Manager");

        //Bonus Ending: Don't Push the Button 3253
        Story.killQuest(3253, "BattleWedding", "Platinum Mech Dragon");
    }
}

export default function main(): void {
    const script = new ArtixWedding();
    Core.setOptions();

    script.artixWeddingComplete();

    Core.setOptions(false);
}
