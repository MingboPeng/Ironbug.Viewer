import { Box, Vec } from "tldraw";

export const SPACEX = 80;
export const SPACEY = 40;
export const OBJSIZE = 100;

export function cleanTrackingId(comment: string) {
    //TrackingID:#[535f96e2]
    // const comment: string | null = obj.CustomAttributes.find(o => o.Field.FullName == 'Comment')?.Value as string;
    // console.log(comment);
    let trackingId = comment;

    if (comment != null && comment != undefined) {
        const regex = /\[([^\]]+)\]/;
        const match = comment.match(regex);

        if (match && match[1]) {
            trackingId = match[1];
            // console.log(trackingId); // Output: 535f96e2
        } else {
            // console.error('No match found');
        }
    }
    // console.log(trackingId);
    return trackingId;
}

export function GetProperties(obj: any) {
    const attributes: any[] = obj.CustomAttributes;
    if (!attributes) return {};

    // convert to Record<string, any>;
    const props: Record<string, any> = {};
    attributes.forEach((o) => {
        const field = o.Field;
        const fieldName = field.FullName;
        const propValue = o.Value;
        props[fieldName] = propValue;
    });
    return props;
}

export function GetTrackingId(obj: any) {
    //TrackingID:#[535f96e2]
    const attributes: any[] = obj.CustomAttributes;
    const comment: string | null = attributes?.find(
        (o) => o.Field.FullName == "Comment"
    )?.Value as string;
    // console.log(comment);
    const trackingId = cleanTrackingId(comment);
    return trackingId;
}

export function GetName(obj: any): string {
    if (!obj || !obj.CustomAttributes) return "";

    //TrackingID:#[535f96e2]
    const attributes: any[] = obj.CustomAttributes;

    const value: string | null = attributes?.find(
        (o) => o.Field.FullName == "Name"
    )?.Value as string;
    return value ?? "";
}

export function GetHvacType(obj: any) {
    // Ironbug.HVAC.IB_OutdoorAirSystem, Ironbug.HVAC
    let type = obj.$type;
    const index = type.indexOf(".IB_");
    if (index !== -1) {
        // Remove all characters before ".IB_"
        type = type.substring(index + 4);
    }

    const ibType = type.replace(", Ironbug.HVAC", "");
    return ibType;
}

export function CalAlignedBounds(supplyObjs: any[], demandObjs: any[]): { sp: Box; dm: Box; separator: Box; } {

    const spS = CalSize(supplyObjs);
    const sp = new Box(0, 0, spS.w, spS.h);

    const separatorH = OBJSIZE;
    const separatorY = sp.maxY + SPACEY;

    const dmY = separatorY + separatorH + SPACEY;
    const dmS = CalSize(demandObjs);
    const dm = new Box(0, dmY, dmS.w, dmS.h);

    // align supply bound and demand bound
    const xShift = sp.midX - dm.midX;
    if (xShift > 0) {
        dm.translate(new Vec(xShift));
    } else {
        sp.translate(new Vec(xShift));
    }

    // separator
    const separatorW = Math.max(sp.w, dm.w);
    const separator = new Box(0, separatorY, separatorW, separatorH);

    return { sp, dm, separator };
}

// export function

// width : -o-o-o-
function CalSize(objs: any[]): { w: number; h: number; } {
    // calculate the total width of object for preparing the document
    const objCount = objs.length;
    let w = 0;
    let h = 0;

    // calculate each obj's width with a following space
    for (let i = 0; i < objCount; i++) {
        const obj = objs[i];
        const objType = GetHvacType(obj);
        let itemW = OBJSIZE;
        let itemH = OBJSIZE;

        if (objType === "OutdoorAirSystem") {
            itemW = OBJSIZE * 2;
        } else if (
            objType === "AirLoopBranches" ||
            objType === "PlantLoopBranches"
        ) {
            const itemSize = CalBranchesSize(obj);
            itemW = itemSize.w;
            itemH = itemSize.h;
        } else if (objType === "ThermalZone") {
            const aT = obj.AirTerminal;
            itemW = aT !== undefined ? OBJSIZE * 2 + SPACEX : OBJSIZE;
        }

        w = w + itemW + SPACEX;
        h = Math.max(h, itemH);
    }

    // add a space at the begging of the all objs
    w += SPACEX;

    return { w, h };
}

// width : [-o-o-]
function CalBranchesSize(branchesObj: any): { w: number; h: number; } {
    const objs: any[][] = branchesObj.Branches;

    let w = 0;
    let h = 0;

    for (let i = 0; i < objs.length; i++) {
        const branchItems = objs[i];
        const branchSize = CalSize(branchItems);
        w = Math.max(w, branchSize.w);
        h += branchSize.h + SPACEY;
    }

    // remove the last SPACEY from h
    // when there are more than one branch
    if (objs.length > 1) {
        h -= SPACEY;
    }

    return { w, h };
}
