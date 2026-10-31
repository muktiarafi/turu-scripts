/*
name: Art-ificial Error Badge
description: This script will get the Art-ificial Error Badge.
tags: art, artificial, error, ai no miko, ai, ebilart, badge, seasonal, april-fools
*/
// Port of Scripts/Seasonal/AprilFools/ArtIficialErrorBadge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { EbilArt } from "./EbilArt";

const EA = new EbilArt();

export class ArtificialErrorBadge {
    getBadge(): void {
        if (Core.hasWebBadge(this.badge)) {
            Core.logger(`Already have the ${this.badge} badge.`);
            return;
        }

        EA.storyLine();

        Core.ensureAccept(9666);
        Core.getMapItem(12883, 17, "ebilart");
        Core.ensureComplete(9666);
    }

    private readonly badge = "Art-ificial Error";
}

export default function main(): void {
    const script = new ArtificialErrorBadge();
    Core.setOptions();

    script.getBadge();

    Core.setOptions(false);
}
