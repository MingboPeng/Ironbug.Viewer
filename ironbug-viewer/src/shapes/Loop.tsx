import { ArrowShapeArrowheadStartStyle, createShapeId, Editor, TLArrowBinding, TLArrowBindingProps, TLArrowShape, TLArrowShapeArrowheadStyle, TLArrowShapeProps, TLBaseBinding, TLLineShape, TLShapeId } from 'tldraw';
import reactLogo from './../assets/HVAC/Coil_Heating_Water_Baseboard_Radiant.png'
import IB_Sys07 from './../assets/HVAC/Sys07_VAV Reheat.json'
import { GetImage } from './OsImages';
import { IBShape } from './LoopObjShape';



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

function GetName(obj: any): string {
    //TrackingID:#[535f96e2]
    const attributes: any[] = obj.CustomAttributes;
    const value: string | null = attributes.find(o => o.Field.FullName == 'Name')?.Value as string;
    return value ?? '';

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

    const trackingId = GetTrackingId(obj);
    // Ironbug.HVAC.IB_OutdoorAirSystem, Ironbug.HVAC
    const ibType = GetHvacType(obj);
    const name = GetName(obj);


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
            ostype: ibType,
            name: name

        }
    };

    return shape;
}

const SPACEX = 80;
const SPACEY = 40;
const OBJSIZE = 100;

function DrawBranchConnections({ editor, preArrows, aftArrows }: { editor: Editor; preArrows: TLArrowShape[]; aftArrows: TLArrowShape[]; }): TLArrowShape[] {
    // const shapeId = shape.id;
    const firstPre = preArrows[0];
    const lastPre = preArrows[preArrows.length - 1];
    const firstAft = aftArrows[0];
    // const length = SPACEX;
    const baseX = firstPre?.x ?? 0;
    const baseY = firstPre?.y ?? 0;
    const h = (lastPre?.y ?? 0) - (firstPre?.y ?? 0);
    const w = (firstAft?.x ?? 0) - (firstPre?.x ?? 0) + (SPACEX);


    // --|
    const linePre = {
        id: createShapeId('branch_s' + firstPre.id),
        type: 'line',
        x: baseX,
        y: baseY,
        props: {
            spline: "line",
            points: {
                a1: {
                    id: 'a1',
                    index: 'a1',
                    x: 0,
                    y: 0,
                },
                a2: {
                    id: 'a2',
                    index: 'a2',
                    x: 0,
                    y: h,
                }
            }
        }

    }
    editor.createShape(linePre);
    // bind all arrows to the line
    preArrows.forEach(_ => {
        const anchorPtX = 0;
        const anchorPtY = (_.y - baseY) / h; // relative ratio based on the y

        const binding = {
            fromId: _.id, // The arrow
            toId: linePre.id, // The shape being connected (end point)
            props: {
                terminal: 'start',
                normalizedAnchor: { x: anchorPtX, y: anchorPtY },
                isExact: false,
                isPrecise: true

            }, type: "arrow"
        } as TLArrowBinding;
        editor.createBinding<TLArrowBinding>(binding);
    })

    // o--
    const lineAfter = {
        id: createShapeId('branch_e' + firstAft.id),
        type: 'line',
        x: baseX + w,
        y: baseY,
        props: {
            spline: "line",
            points: {
                a1: {
                    id: 'a1',
                    index: 'a1',
                    x: 0,
                    y: 0,
                },
                a2: {
                    id: 'a2',
                    index: 'a2',
                    x: 0,
                    y: h,
                }
            }
        }

    }
    editor.createShape(lineAfter);
    // bind all arrows to the line
    aftArrows.forEach(_ => {
        const anchorPtX = 0;
        const anchorPtY = (_.y - baseY) / h; // relative ratio based on the y

        const binding = {
            fromId: _.id, // The arrow
            toId: lineAfter.id, // The shape being connected (end point)
            props: {
                terminal: 'end',
                normalizedAnchor: { x: anchorPtX, y: anchorPtY },
                isExact: false,
                isPrecise: true

            }, type: "arrow"
        } as TLArrowBinding;
        editor.createBinding<TLArrowBinding>(binding);
    })

    const arrowLength = SPACEX / 2;
    // draw arrow before -|
    const firstArrow = {
        id: createShapeId('arrow_s' + linePre.id),
        type: "arrow",
        x: linePre.x - arrowLength,
        y: linePre.y + h / 2,
        props: {
            start: { x: 0, y: 0, },
            end: { x: arrowLength, y: 0, },
            arrowheadStart: 'none',
            arrowheadEnd: 'none',
        }
    } as TLArrowShape;
    editor.createShape(firstArrow);
    const preBinding = {
        fromId: firstArrow.id, // The arrow
        toId: linePre.id, // The shape being connected (end point)
        props: {
            terminal: 'end'
        }, type: "arrow"
    } as TLArrowBinding;
    editor.createBinding<TLArrowBinding>(preBinding);

    // draw arrow after |-
    const lastArrow = {
        id: createShapeId('arrow_e' + lineAfter.id),
        type: "arrow",
        x: lineAfter.x,
        y: lineAfter.y + h / 2,
        props: {
            start: { x: 0, y: 0, },
            end: { x: arrowLength, y: 0, },
            arrowheadStart: 'none',
            arrowheadEnd: 'none',
        }
    } as TLArrowShape;
    editor.createShape(lastArrow);
    const aftBinding = {
        fromId: lastArrow.id, // The arrow
        toId: lineAfter.id, // The shape being connected (end point)
        props: {
            terminal: 'start'
        }, type: "arrow"
    } as TLArrowBinding;
    editor.createBinding<TLArrowBinding>(aftBinding);

    return [lastArrow, firstArrow]; //[right, left], follow the flow direction
}

function DrawPreConnection(editor: Editor, shape: any): TLArrowShape {
    const shapeId = shape.id;
    const length = SPACEX;
    // --o
    const arrowPre = {
        id: createShapeId('arrow_pre' + shapeId),
        type: "arrow",
        x: shape.x - length,
        y: shape.y + shape.props.h / 2,
        props: {
            start: { x: 0, y: 0, },
            end: { x: length, y: 0, },
            arrowheadStart: 'none',
            arrowheadEnd: 'dot',
        }
    } as TLArrowShape;

    editor.createShape(arrowPre);

    const bindingEnd = {
        fromId: arrowPre.id, // The arrow
        toId: shapeId, // The shape being connected (end point)
        props: {
            terminal: 'end'
        }, type: "arrow"
    }
    editor.createBinding(bindingEnd);

    return arrowPre;
}

function DrawAfterConnection(editor: Editor, shape: any): TLArrowShape {
    const shapeId = shape.id;
    const length = SPACEX;

    // o--
    const arrowAfter = {
        id: createShapeId('arrow_aft' + shapeId),
        type: "arrow",
        x: shape.x + shape.props.w,
        y: shape.y + shape.props.h / 2,
        props: {
            start: { x: 0, y: 0, },
            end: { x: length, y: 0, },
            arrowheadStart: 'dot',
            arrowheadEnd: 'none',

        }
    } as TLArrowShape;
    editor.createShape(arrowAfter);


    const bindingStart = {
        fromId: arrowAfter.id, // The arrow
        toId: shapeId, // The shape being connected (start point)
        props: {
            terminal: 'start'
        }, type: "arrow"
    }
    editor.createBinding(bindingStart);

    return arrowAfter;
}

// draw connections in between shapes and before/after the first/last shape
function DrawConnections({ editor, shapes }: { editor: Editor; shapes: any[]; }): TLArrowShape[] {

    if (shapes.length === 0) return [];

    // --o arrow before the first shape
    const firstShape = shapes[0];
    const firstArrow = DrawPreConnection(editor, firstShape);
    // o-- arrow after the last shape
    const lastShape = shapes[shapes.length - 1];
    const lastArrow = DrawAfterConnection(editor, lastShape);


    // draw connection in between
    const arrows: TLArrowShape[] = [];
    arrows.push(firstArrow);
    for (let i = 1; i < shapes.length; i++) {
        const shapePre = shapes[i - 1];
        const shapePreId = shapePre.id;
        const shape = shapes[i];
        const shapeId = shape.id;

        const arrowId = createShapeId('arrow' + shapeId);
        const arrow: any = {
            id: arrowId,
            type: "arrow",
            x: 0,
            y: 0,
            props: {
                start: { x: 1, y: 1, },
                end: { x: 2, y: 2, },
                arrowheadStart: 'dot',
                arrowheadEnd: 'dot'
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


        editor.createShape<TLArrowShape>(arrow);
        editor.createBinding(bindingStart);
        editor.createBinding(bindingEnd);

        arrows.push(arrow);

    }
    arrows.push(lastArrow);
    return arrows;
}

export function DrawSupplyLoop(editor: Editor): TLArrowShape[] {

    const sys = IB_Sys07;
    const airloop = sys.AirLoops[0];
    const supplyComs = airloop.SupplyComponents;

    const space = SPACEX;
    const size = OBJSIZE;

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
    const arrows = DrawConnections({ editor, shapes });
    return arrows;

}

export function DrawDemandLoop(editor: Editor): TLArrowShape[] {

    const sys = IB_Sys07;
    const airloop = sys.AirLoops[0];
    const demandComs = airloop.DemandComponents;

    let count = 0;
    const space = SPACEX;
    const spaceY = SPACEY;
    const size = OBJSIZE;
    const baseX = 300;
    const baseY = 500;

    let firstLastArrows: TLArrowShape[] = [];

    demandComs.forEach(_ => {
        const x = baseX - count * (space + size);
        const y = baseY;
        const obj = _;

        const ibType = GetHvacType(obj);

        if (ibType === "AirLoopBranches") {
            const branches: any[][] = obj.Branches;
            const firstArrows: TLArrowShape[] = [];
            const lastArrows: TLArrowShape[] = [];
            for (let i = 0; i < branches.length; i++) {
                const branchItems = branches[i];
                const shapes = branchItems.flatMap(_ => {
                    const itemShapes = [];
                    const itemX = x;
                    const itemY = y + i * (spaceY + size);
                    const shape = GenShape(_, size, itemX, itemY);
                    itemShapes.push(shape);

                    const itemType = GetHvacType(_);
                    if (itemType === "ThermalZone") {
                        const aT = _.AirTerminal;
                        if (aT !== undefined) {
                            const aTx = itemX + size + space;
                            const airTerminalShape = GenShape(_.AirTerminal ?? {}, size, aTx, itemY);
                            itemShapes.push(airTerminalShape);
                        }
                    }

                    return itemShapes;

                });

                editor.createShapes(shapes);
                const arrows = DrawConnections({ editor, shapes });
                firstArrows.push(arrows[0]);
                lastArrows.push(arrows[arrows.length - 1]);
            }
            const arrows = DrawBranchConnections({ editor, preArrows: firstArrows, aftArrows: lastArrows });
            firstLastArrows = arrows;

        } else {
            // const shape = GenShape(_, size, x, y);
            // editor.createShape(shape);

        }

        count++;
    });

    return firstLastArrows;


}



export function DrawLoop(editor: Editor) {
    const spArrs = DrawSupplyLoop(editor);
    const dmArrs = DrawDemandLoop(editor);
    const spLeft = spArrs[0];
    const spRight = spArrs[spArrs.length - 1];
    const dmRight = dmArrs[0];
    const dmLeft = dmArrs[dmArrs.length - 1];

    const w = spRight.x + spRight.props.end.x - spLeft.x;

    const separatorY = OBJSIZE + SPACEY;
    const separatorShape = {
        type: 'IBLoopShape',
        x: spLeft.x,
        y: spLeft.y + separatorY,
        props: {
            w: w,
            h: OBJSIZE,
        },
    }

    editor.createShape(separatorShape);


    const arrowSpLeft = {
        id: createShapeId('arrow_sL' + spLeft.id),
        type: "arrow",
        x: spLeft.x,
        y: spLeft.y,
        props: {
            start: { x: 0, y: 0, },
            end: { x: 0, y: separatorShape.y - spLeft.y + OBJSIZE / 2, },
            arrowheadStart: 'none',
            arrowheadEnd: 'none',
        }
    } as TLArrowShape;

    const arrowSpRight = {
        id: createShapeId('arrow_sR' + spRight.id),
        type: "arrow",
        x: spLeft.x + w,
        y: spLeft.y,
        props: {
            start: { x: 0, y: 0, },
            end: { x: 0, y: separatorShape.y - spRight.y + OBJSIZE / 2, },
            arrowheadStart: 'none',
        }
    } as TLArrowShape;

    editor.createShape(arrowSpLeft);
    editor.createShape(arrowSpRight);

    const arrowDmRight = {
        id: createShapeId('arrow_dL' + dmRight.id),
        type: "arrow",
        x: arrowSpRight.x,
        y: arrowSpRight.y + arrowSpRight.props.end.y,
        props: {
            start: { x: 0, y: 0, },
            end: { x: 0, y: dmRight.y - separatorShape.y - OBJSIZE / 2, },
            arrowheadStart: 'none',
            arrowheadEnd: 'none',
        }
    } as TLArrowShape;

    const arrowDmLeft = {
        id: createShapeId('arrow_dR' + dmLeft.id),
        type: "arrow",
        x: spLeft.x,
        y: dmRight.y,
        props: {
            start: { x: 0, y: 0, },
            end: { x: 0, y: -(dmLeft.y - separatorShape.y - OBJSIZE / 2), },
            arrowheadStart: 'none',
        }
    } as TLArrowShape;

    editor.createShape(arrowDmLeft);
    editor.createShape(arrowDmRight);

    // demand arrow-lines
    // --|
    const dmLineLeft = {
        id: createShapeId('dmL' + dmLeft.id),
        type: 'line',
        x: dmLeft.x,
        y: dmLeft.y,
        props: {
            spline: "line",
            points: {
                a1: {
                    id: 'a1',
                    index: 'a1',
                    x: 0,
                    y: 0,
                },
                a2: {
                    id: 'a2',
                    index: 'a2',
                    x: -(dmLeft.x - spLeft.x),
                    y: 0,
                }
            }
        }

    }
    editor.createShape(dmLineLeft);

    const dmLineRight = {
        id: createShapeId('dmR' + dmRight.id),
        type: 'line',
        x: arrowDmRight.x,
        y: dmRight.y,
        props: {
            spline: "line",
            points: {
                a1: {
                    id: 'a1',
                    index: 'a1',
                    x: 0,
                    y: 0,
                },
                a2: {
                    id: 'a2',
                    index: 'a2',
                    x: dmRight.x + dmRight.props.end.x - arrowDmRight.x,
                    y: 0,
                }
            }
        }

    }
    editor.createShape(dmLineRight);

}