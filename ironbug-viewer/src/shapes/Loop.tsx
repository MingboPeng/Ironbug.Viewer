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


function GetTrackingId(comment: string) {
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


function GenShapes() {
    const sys = IB_Sys07;
    const airloop = sys.AirLoops[0];
    const supplyComs = airloop.SupplyComponents;



    // const items = [{
    // 	id: createShapeId('geo1'),
    // 	url: { reactLogo }.reactLogo
    // }, {
    // 	id: createShapeId('geo2'),
    // 	url: 'https://raw.githubusercontent.com/BuildingPerformanceSimulation/openstudio-measures/refs/heads/master/lib/measures/detailed_hvac_viewer/resources/images/Coil_Heating_Water_Baseboard_Radiant.png'
    // }]



    let count = 0;
    const space = 80;
    const size = 100;


    var shapes = supplyComs.map(_ => {
        //TrackingID:#[535f96e2]
        const comment: string | null = _.CustomAttributes.find(o => o.Field.FullName == 'Comment')?.Value as string;
        // console.log(comment);
        let trackingId = GetTrackingId(comment);
        // Ironbug.HVAC.IB_OutdoorAirSystem, Ironbug.HVAC
        const ibType = _.$type.replace("Ironbug.HVAC.IB_", "").replace(", Ironbug.HVAC", "");
        const imageUrl = GetImage(ibType);
        const obj =
        {
            id: createShapeId(trackingId),
            type: 'ibshape',
            x: count * (space + size),
            y: size,
            props: {
                w: size,
                h: size,
                url: imageUrl,
                ostype: ibType

            }
        };
        count++;
        return obj;
    });

    return shapes;


}

function GenDemandShapes() {
    const sys = IB_Sys07;
    const airloop = sys.AirLoops[0];
    const supplyComs = airloop.DemandComponents;



    let count = 0;
    const space = 80;
    const size = 100;


    var shapes = supplyComs.map(_ => {
        //TrackingID:#[535f96e2]
        const comment: string | null = _.CustomAttributes.find(o => o.Field.FullName == 'Comment')?.Value as string;
        // console.log(comment);
        let trackingId = GetTrackingId(comment);
        const ibType = _.$type;

        const obj =
        {
            id: createShapeId(trackingId),
            type: 'ibshape',
            x: count * (space + size),
            y: size,
            props: {
                w: size,
                h: size,
                url: { reactLogo }.reactLogo,
                ostype: _.$type

            }
        };
        count++;
        return obj;
    });

    return shapes;


}


export function DrawSupplyLoop(editor: Editor) {

    const shapes = GenShapes();
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

export function DrawDemandLoop(editor: Editor) {

    const shapes = GenShapes();
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