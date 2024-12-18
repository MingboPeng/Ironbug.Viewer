export const SPACEX = 80;
export const SPACEY = 40;
export const OBJSIZE = 100;

function cleanTrackingId(comment: string) {
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


export function GetTrackingId(obj: any) {
    //TrackingID:#[535f96e2]
    const attributes: any[] = obj.CustomAttributes;
    const comment: string | null = attributes.find(o => o.Field.FullName == 'Comment')?.Value as string;
    // console.log(comment);
    const trackingId = cleanTrackingId(comment);
    return trackingId;

}

export function GetName(obj: any): string {
    //TrackingID:#[535f96e2]
    const attributes: any[] = obj.CustomAttributes;
    const value: string | null = attributes.find(o => o.Field.FullName == 'Name')?.Value as string;
    return value ?? '';

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


// width : -o-o-o-
export function CalWidth(objs:any[]): number  {
    // calculate the total width of object for preparing the document
    const objCount = objs.length;
    let w = 0;

    // calculate each obj's width with a following space
    for (let i = 0; i < objs.length; i++) {
        const obj = objs[i];
        const objType = GetHvacType(obj);
        let itemW = OBJSIZE;

        if (objType === "OutdoorAirSystem") {
            itemW = OBJSIZE * 2;
        }else  if (objType === "AirLoopBranches" || objType === 'PlantLoopBranches'){
            itemW = CalBranchesWidth(obj);
        }

        w = w+itemW + SPACEX;

    }

 
    // add a space at the begging of the all objs
    w += SPACEX

    return w;

}

// width : -[-o-o-]-
export function CalBranchesWidth(branchesObj:any): number {
    const objs :any[][] = branchesObj.Branches;

    let w = 0;

    for (let i = 0; i < objs.length; i++) {
        const branchItems = objs[i];
        const branchW = CalWidth(branchItems);
        w = Math.max(w, branchW);

    }

    return w;




}