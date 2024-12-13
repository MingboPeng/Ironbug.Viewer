import { createShapeId, Editor, TLArrowShape } from 'tldraw';
import reactLogo from './../assets/HVAC/Coil_Heating_Water_Baseboard_Radiant.png'
import IB_Sys07 from './../assets/HVAC/Sys07_VAV Reheat.json'
import { GetImage } from './OsImages';





// Create a function to load the JSON file
const loadJsonFile = async (path: string) => {
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        return jsonData;
    } catch (error) {
        console.error('Error loading JSON file:', error);
        return null;
    }
};


function cleanTrackingId(comment: string) {
    //TrackingID:#[535f96e2]
    // const comment: string | null = obj.CustomAttributes.find(o => o.Field.FullName == 'Comment')?.Value as string;
    console.log(comment);
    let trackingId = comment;

    if (comment != null && comment != undefined) {
        const regex = / \[(.*?)\] /;
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

function GetTrackingId(obj: any) {
    //TrackingID:#[535f96e2]
    const attributes: any[] = obj.CustomAttributes;
    const comment: string | null = attributes.find(o => o.Field.FullName == 'Comment')?.Value as string;
    // console.log(comment);
    const trackingId = cleanTrackingId(comment);
    return trackingId;

}


function GetHvacType(obj: any) {

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

function GenShape(obj: any, size: number, x: number, y: number) {

    let w = size;
    let h = size;

    let trackingId = GetTrackingId(obj);
    // Ironbug.HVAC.IB_OutdoorAirSystem, Ironbug.HVAC
    const ibType = GetHvacType(obj);

    if (ibType === "AirLoopBranches") {
        const branches: any[][] = obj.Branches;
        for (let i = 0; i < branches.length; i++) {
            const branchItems = branches[i];
            const shapes = branchItems.map(_ => GenShape(_, size, x, y + i * size));

        }
    }



    if (ibType === "OutdoorAirSystem") {
        w = w * 2;
    }


    const imageUrl = GetImage(ibType);
    const shape =
    {
        id: createShapeId(trackingId),
        type: 'ibshape',
        x: x,
        y: y,
        props: {
            w: w,
            h: h,
            url: imageUrl,
            ostype: ibType

        }
    };

    return shape;
}


function DrawConnections(editor: Editor, shapes: any[]) {
    if (shapes.length === 0) return;

    const arrows: TLArrowShape[] = [];
    const arrowBindings = [];


    for (let i = 1; i < shapes.length; i++) {
        const shapePre = shapes[i - 1];
        const shapePreId = shapePre.id;
        const shape = shapes[i];
        const shapeId = shape.id;

        const arrowId = createShapeId('arrow' + i);
        const arrow: any = {
            id: arrowId,
            type: "arrow",
            x: 0,
            y: 0,
            props: {
                start: { x: 1, y: 1, },
                end: { x: 2, y: 2, },
            }
        }

        const bindingStart = {
            fromId: arrowId, // The arrow
            toId: shapePreId, // The shape being connected (start point)
            props: {
                terminal: 'start'
            }, type: "arrow"
        }
        const bindingEnd = {
            fromId: arrowId, // The arrow
            toId: shapeId, // The shape being connected (end point)
            props: {
                terminal: 'end'
            }, type: "arrow"
        }


        arrows.push(arrow);
        arrowBindings.push(bindingStart);
        arrowBindings.push(bindingEnd);

    }

    editor.createShapes(shapes);
    editor.createShapes<TLArrowShape>(arrows);
    editor.createBindings(arrowBindings);
}

export function DrawSupplyLoop(editor: Editor) {

    const sys = IB_Sys07;
    const airloop = sys.AirLoops[0];
    const supplyComs = airloop.SupplyComponents;

    const space = 80;
    const size = 100;

    let baseX = 0;
    let baseY = size;

    var shapes = supplyComs.map(_ => {
        const x = baseX;
        const y = baseY;
        const shape = GenShape(_, size, x, y);
        baseX = x + shape.props.w + space;
        return shape;
    });
    editor.createShapes(shapes);
    DrawConnections(editor, shapes);

}

export function DrawDemandLoop(editor: Editor) {

    const sys = IB_Sys07;
    const airloop = sys.AirLoops[0];
    const demandComs = airloop.DemandComponents;

    let count = 0;
    const space = 80;
    const spaceY = 40;
    const size = 100;
    const baseX = 300;
    const baseY = 300;


    demandComs.forEach(_ => {
        const x = baseX - count * (space + size);
        const y = baseY;
        const obj = _;

        const ibType = GetHvacType(obj);

        if (ibType === "AirLoopBranches") {
            const branches: any[][] = obj.Branches;
            for (let i = 0; i < branches.length; i++) {
                const branchItems = branches[i];
                const shapes = branchItems.map(_ => GenShape(_, size, x, y + i * (spaceY + size)));
                editor.createShapes(shapes);
                DrawConnections(editor, shapes);
            }
        } else {
            const shape = GenShape(_, size, x, y);
            editor.createShape(shape);

        }

        count++;
    });



    // editor.createBinding<TLArrowBinding>(
    // 	{
    // 		fromId: arrowId, // The arrow
    // 		toId: rightAngle1, // The shape being connected (start point)
    // 		props: {
    // 			terminal: 'start'
    // 		}, type: "arrow"
    // 	}
    // )


}