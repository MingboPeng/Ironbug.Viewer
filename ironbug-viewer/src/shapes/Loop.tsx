import { ArrowShapeArrowheadStartStyle, Box, createShapeId, Editor, LineShapeUtil, PageRecordType, TLArrowBinding, TLArrowBindingProps, TLArrowShape, TLArrowShapeArrowheadStyle, TLArrowShapeProps, TLBaseBinding, TLBaseShape, TLLineShape, TLShapeId } from 'tldraw';
import reactLogo from './../assets/HVAC/Coil_Heating_Water_Baseboard_Radiant.png'
import IB_Sys07 from './../assets/HVAC/Sys07_VAV Reheat.json'
import { GetImage } from './OsImages';
import { IBShape } from './LoopObjShape';
import { IBLoopShape } from './LoopShape';
import { CalAlignedBounds, CalWidth, GetHvacType, GetName, GetTrackingId } from './LoopUtil';



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
        id: createShapeId(_currentLoopId + trackingId),
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

function GetShapeBound(shape: any): Box {
    const shapeType = shape.type;
    if (shapeType === 'ibshape') {
        const obj = (shape as IBShape);
        return new Box(obj.x, obj.y, obj.props.w, obj.props.h);
    } else if (shapeType === 'line') {
        const obj = (shape as TLLineShape);
        const pts = obj.props.points;
        const p1 = pts.a1;
        const p2 = pts.a2;
        const w = Math.abs(p2.x - p1.x);
        const h = Math.abs(p2.y - p1.y);
        return new Box(obj.x, obj.y, w, h);
    } else if (shapeType === 'arrow') {
        const obj = (shape as TLArrowShape);
        const pts = obj.props;
        const p1 = pts.start;
        const p2 = pts.end;
        const w = Math.abs(p2.x - p1.x);
        const h = Math.abs(p2.y - p1.y);
        return new Box(obj.x, obj.y, w, h);
    } else if (shapeType === 'IBLoopShape') { // middle separator
        const obj = (shape as IBLoopShape);
        const pts = obj.props;
        const w = pts.w;
        const h = pts.h
        return new Box(obj.x, obj.y, w, h);
    } else {
        return new Box();
    }

    //IBLoopShape

}

const SPACEX = 80;
const SPACEY = 40;
const OBJSIZE = 100;

function DrawBranchConnections({ editor, preArrows, aftArrows }: { editor: Editor; preArrows: TLArrowShape[]; aftArrows: TLArrowShape[]; }): any[] {
    // const shapeId = shape.id;
    const firstPre = preArrows[0];
    const lastPre = preArrows[preArrows.length - 1];
    const firstAft = aftArrows[0];
    // const length = SPACEX;
    const baseX = firstPre?.x ?? 0;
    const baseY = firstPre?.y ?? 0;
    let h = Math.abs((lastPre?.y ?? 0) - (firstPre?.y ?? 0));
    h = h === 0 ? OBJSIZE : h;
    const w = Math.abs((firstAft?.x ?? 0) - (firstPre?.x ?? 0)) + SPACEX;


    // --|
    const lineLeft = {
        id: createShapeId('bll' + firstPre.id),
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
    };


    editor.createShape(lineLeft);
    // bind all arrows to the line
    preArrows.forEach(_ => {
        const anchorPtX = 0;
        const anchorPtY = (_.y - baseY) / h; // relative ratio based on the y

        const binding = {
            fromId: _.id, // The arrow
            toId: lineLeft.id, // The shape being connected (end point)
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
    const lineRight = {
        id: createShapeId('blr' + firstAft.id),
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
    editor.createShape(lineRight);
    // bind all arrows to the line
    aftArrows.forEach(_ => {
        const anchorPtX = 0;
        const anchorPtY = (_.y - baseY) / h; // relative ratio based on the y

        const binding = {
            fromId: _.id, // The arrow
            toId: lineRight.id, // The shape being connected (end point)
            props: {
                terminal: 'end',
                normalizedAnchor: { x: anchorPtX, y: anchorPtY },
                isExact: false,
                isPrecise: true

            }, type: "arrow"
        } as TLArrowBinding;
        editor.createBinding<TLArrowBinding>(binding);
    })

    // const arrowLength = SPACEX / 2;
    // // draw arrow before -|
    // const firstArrow = {
    //     id: createShapeId('arrow_s' + linePre.id),
    //     type: "arrow",
    //     x: linePre.x - arrowLength,
    //     y: linePre.y + h / 2,
    //     props: {
    //         start: { x: 0, y: 0, },
    //         end: { x: arrowLength, y: 0, },
    //         arrowheadStart: 'none',
    //         arrowheadEnd: 'none',
    //     }
    // } as TLArrowShape;
    // editor.createShape(firstArrow);
    // const preBinding = {
    //     fromId: firstArrow.id, // The arrow
    //     toId: linePre.id, // The shape being connected (end point)
    //     props: {
    //         terminal: 'end'
    //     }, type: "arrow"
    // } as TLArrowBinding;
    // editor.createBinding<TLArrowBinding>(preBinding);

    // // draw arrow after |-
    // const lastArrow = {
    //     id: createShapeId('arrow_e' + lineAfter.id),
    //     type: "arrow",
    //     x: lineAfter.x,
    //     y: lineAfter.y + h / 2,
    //     props: {
    //         start: { x: 0, y: 0, },
    //         end: { x: arrowLength, y: 0, },
    //         arrowheadStart: 'none',
    //         arrowheadEnd: 'none',
    //     }
    // } as TLArrowShape;
    // editor.createShape(lastArrow);
    // const aftBinding = {
    //     fromId: lastArrow.id, // The arrow
    //     toId: lineAfter.id, // The shape being connected (end point)
    //     props: {
    //         terminal: 'start'
    //     }, type: "arrow"
    // } as TLArrowBinding;
    // editor.createBinding<TLArrowBinding>(aftBinding);

    return [lineLeft, lineRight];
}

function DrawPreConnection(editor: Editor, shape: any): TLArrowShape {
    const shapeId = shape.id;
    const length = SPACEX;
    const bound = GetShapeBound(shape);

    // --o
    const arrowPre = {
        id: createShapeId(_currentLoopId + '_-' + shapeId),
        type: "arrow",
        x: bound.minX - length,
        y: bound.midY,
        props: {
            start: { x: 0, y: 0, },
            end: { x: length, y: 0, },
            arrowheadStart: 'none',
            arrowheadEnd: shape.type === 'line' ? 'none' : 'dot',
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
    const bound = GetShapeBound(shape);


    // o--
    const arrowAfter = {
        id: createShapeId(_currentLoopId + '-_' + shapeId),
        type: "arrow",
        x: bound.maxX,
        y: bound.midY,
        props: {
            start: { x: 0, y: 0, },
            end: { x: length, y: 0, },
            arrowheadStart: shape.type === 'line' ? 'none' : 'dot',
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

        const arrowHS = shapePre.type === 'line' ? 'none' : 'dot'
        const arrowHE = shape.type === 'line' ? 'none' : 'dot'
        if (shapePre.type === 'line' && shape.type === 'line') {
            //skip adding a new connection line between loop branches
            continue;
        }

        const arrowId = createShapeId('-' + shapeId);
        const arrow: any = {
            id: arrowId,
            type: "arrow",
            x: 0,
            y: 0,
            props: {
                start: { x: 1, y: 1, },
                end: { x: 2, y: 2, },
                arrowheadStart: arrowHS,
                arrowheadEnd: arrowHE
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

function DrawLoopBranches(editor: Editor, branchesComponent: any, baseX: number, baseY: number): any[] {

    const space = SPACEX;
    const spaceY = SPACEY;
    const size = OBJSIZE;
    const x = baseX;
    const y = baseY;

    const branches: any[][] = branchesComponent.Branches;
    const leftArrows: TLArrowShape[] = [];
    const rightArrows: TLArrowShape[] = [];
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
        leftArrows.push(arrows[0]);
        rightArrows.push(arrows[arrows.length - 1]);
    }

    // add a bypass connection in branch
    if (branches.length === 1) {
        const byY = y + (spaceY + size);
        // use the first branch connection arrow 's id for the reference
        const arrowId = createShapeId('bypass' + leftArrows[0].id);
        const bypass: any = {
            id: arrowId,
            type: "arrow",
            x: 0,
            y: byY,
            props: {
                start: { x: 1, y: 1, },
                end: { x: 2, y: 2, },
                arrowheadStart: 'none',
                arrowheadEnd: 'none'
            }
        }
        editor.createShape(bypass);
        leftArrows.push(bypass);
        rightArrows.push(bypass);
    }

    const leftRightLines = DrawBranchConnections({ editor, preArrows: leftArrows, aftArrows: rightArrows });
    return leftRightLines;

}

export function DrawSupplyLoop(editor: Editor, components: any[], bound: Box): TLArrowShape[] {

    const supplyComs = components;

    const space = SPACEX;
    const size = OBJSIZE;

    let baseX = bound.x; // add one space for leading connection
    let baseY = size;
    const shapes: any[] = [];
    // let count = 0;
    // const leftRightArrows: TLArrowShape[] = [];

    supplyComs.forEach(_ => {
        const x = baseX;
        const y = baseY;
        const obj = _;

        const ibType = GetHvacType(obj);

        if (ibType === 'PlantLoopBranches') {
            const branchX = x + space;
            const leftRightLines = DrawLoopBranches(editor, obj, branchX, y);
            const leftLine = leftRightLines[0];
            const rightLine = leftRightLines[leftRightLines.length - 1];

            baseX = rightLine.x + space;
            shapes.push(leftLine);
            shapes.push(rightLine);

        } else {
            const shape = GenShape(_, size, x, y);
            editor.createShape(shape);

            baseX = x + shape.props.w + space;
            shapes.push(shape);
        }

    });

    const arrows = DrawConnections({ editor, shapes });
    return arrows;

}

export function DrawDemandLoop(editor: Editor, components: any[], bound: Box): TLArrowShape[] {

    const demandComs = components;

    const space = SPACEX;
    const spaceY = SPACEY;
    const size = OBJSIZE;
    let baseX = bound.x; // add one space for leading connection
    let baseY = 500;

    const shapes: any[] = [];
    // let firstLastArrows: TLArrowShape[] = [];

    demandComs.forEach(_ => {
        const x = baseX;
        const y = baseY;
        const obj = _;

        const ibType = GetHvacType(obj);

        if (ibType === "AirLoopBranches" || ibType === 'PlantLoopBranches') {
            const branchX = x + space;
            const leftRightLines = DrawLoopBranches(editor, obj, branchX, y);
            const leftLine = leftRightLines[0];
            const rightLine = leftRightLines[leftRightLines.length - 1];

            baseX = rightLine.x + space;
            shapes.push(leftLine);
            shapes.push(rightLine);


        } else {
            const shape = GenShape(_, size, x, y);
            editor.createShape(shape);

            baseX = x + shape.props.w + space;
            shapes.push(shape);

        }

    });

    const arrows = DrawConnections({ editor, shapes });
    return arrows;


}

function CheckCreatePage(editor: Editor) {
    const currentIds = editor.getCurrentPageShapeIds();
    const count = currentIds.size;
    if (count > 0) {
        // add a new page for the new loop
        const pageId = PageRecordType.createId(_currentLoopId)
        editor.createPage({ name: 'tempPageName', id: pageId });
        editor.setCurrentPage(pageId)

    } else {
        // current page is empty
    }



}

let _currentLoopId: string = '';

export function DrawLoop(editor: Editor, loop: any) {

    _currentLoopId = GetTrackingId(loop);

    // check if the current page has any existing shapes, if yes, create a new page
    CheckCreatePage(editor);

    //update page name
    const page = editor.getCurrentPage();
    const pageName = GetHvacType(loop) + " " + _currentLoopId;
    editor.renamePage(page, pageName);

    const { sp: spBound, dm: dmBound } = CalAlignedBounds(loop.SupplyComponents, loop.DemandComponents);

    const loopBound = spBound.union(dmBound);

    const spArrs = DrawSupplyLoop(editor, loop.SupplyComponents, spBound);
    const dmArrs = DrawDemandLoop(editor, loop.DemandComponents, dmBound);
    const spLeft = spArrs[0];
    const spRight = spArrs[spArrs.length - 1];
    // const spLeftBound = GetShapeBound(spLeft);
    // const spRightBound = GetShapeBound(spRight);
    // const spBound = spLeftBound.union(spRightBound);

    const dmRight = dmArrs[0];
    const dmLeft = dmArrs[dmArrs.length - 1];
    // const dmLeftBound = GetShapeBound(dmLeft);
    // const dmRightBound = GetShapeBound(dmRight);
    // const dmBound = dmLeftBound.union(dmRightBound);


    const w = Math.max(spBound.width, dmBound.width);

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
    const seperatorBound = GetShapeBound(separatorShape);

    editor.createShape(separatorShape);


    const arrowSpLeft = {
        id: createShapeId('sL' + spLeft.id),
        type: "arrow",
        x: spLeft.x,
        y: seperatorBound.midY,
        props: {
            start: { x: 0, y: 0, },
            end: { x: 0, y: spBound.midY - seperatorBound.midY, },
            arrowheadStart: 'none',
            arrowheadEnd: 'none',
        }
    } as TLArrowShape;

    const arrowSpRight = {
        id: createShapeId('sR' + spRight.id),
        type: "arrow",
        x: spLeft.x + w,
        y: spLeft.y,
        props: {
            start: { x: 0, y: 0, },
            end: { x: 0, y: seperatorBound.midY - spBound.midY, },
            arrowheadStart: 'none',
        }
    } as TLArrowShape;

    editor.createShape(arrowSpLeft);
    editor.createShape(arrowSpRight);


    const arrowDmRight = {
        id: createShapeId('dR' + dmRight.id),
        type: "arrow",
        x: seperatorBound.maxX,
        y: seperatorBound.midY,
        props: {
            start: { x: 0, y: 0, },
            end: { x: 0, y: dmBound.midY - seperatorBound.midY, },
            arrowheadStart: 'none',
            arrowheadEnd: 'none',
        }
    } as TLArrowShape;

    const arrowDmLeft = {
        id: createShapeId('dL' + dmLeft.id),
        type: "arrow",
        x: seperatorBound.minX,
        y: dmBound.midY,
        props: {
            start: { x: 0, y: 0, },
            end: { x: 0, y: -(dmBound.midY - seperatorBound.midY), },
            arrowheadStart: 'none',
        }
    } as TLArrowShape;

    editor.createShape(arrowDmLeft);
    editor.createShape(arrowDmRight);

}

