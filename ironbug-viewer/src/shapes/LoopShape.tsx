import { BaseBoxShapeUtil, Group2d, HTMLContainer, Polygon2d, Rectangle2d, resizeBox, StyleProp, T, TextLabel, TLBaseShape, TLResizeInfo, Vec } from "tldraw"

export type IBLoopShape = TLBaseShape<
    'IBLoopShape',
    {
        w: number
        h: number
        ostype: string
        name: string

    }
>

export class IBLoopShapeUtil extends BaseBoxShapeUtil<IBLoopShape> {
    static override type = 'IBLoopShape' as const

    static override props = {
        w: T.number,
        h: T.number,
        ostype: T.string,
        name: T.string
    }

    getDefaultProps(): IBLoopShape['props'] {
        return {
            w: 200,
            h: 50,
            ostype: '',
            name: ''
        }
    }

    //[1]
    // override getGeometry(shape: IBLoopShape) {
    //     const { house: houseGeometry } = getHouseVertices(shape)
    //     const house = new Polygon2d({
    //         points: houseGeometry,
    //         isFilled: true,
    //     })
    //     // const door = new Rectangle2d({
    //     //     x: shape.props.w / 2 - shape.props.w / 10,
    //     //     y: shape.props.h - shape.props.h / 4,
    //     //     width: shape.props.w / 5,
    //     //     height: shape.props.h / 4,
    //     //     isFilled: true,
    //     // })
    //     // const geometry = new Group2d({
    //     //     children: [house],
    //     // })
    //     return house
    // }
    // [2]
    override component(shape: IBLoopShape) {
        const { separator, arrowLeft, arrowRight } = getHouseVertices(shape)
        const separatorPathData = 'M' + separator[0] + 'L' + separator.slice(1) + 'Z'
        // const arrowLeftPathData = 'M' + arrowLeft[0] + 'L' + arrowLeft.slice(1) + 'Z'
        // const arrowRightPathData = 'M' + arrowRight[0] + 'L' + arrowRight.slice(1) + 'Z'
        return (
            <HTMLContainer
                id={shape.id}
                style={{ backgroundColor: 'var(--color-low-border)', overflow: 'hidden' }}
            >
                <p style={{ display: 'flex', alignItems: 'flex-end', height: '50%', margin: '0 0 0 10pt' }}>Supply Equipment</p>
                <svg className="tl-svg-container">
                    <path strokeWidth={1} stroke="black" d={separatorPathData} fill="none" />
                    {/* <path strokeWidth={7} stroke="black" d={arrowLeftPathData} fill="none" /> */}
                    {/* <path strokeWidth={7} stroke="black" d={arrowRightPathData} fill="none" /> */}
                </svg>
                <p style={{ display: 'flex', alignItems: 'flex-start', height: '50%', margin: '0 0 0 10pt' }}>Demand Equipment</p>
            </HTMLContainer>
        )
    }
    // [3]
    override indicator(shape: IBLoopShape) {
        const { separator, arrowLeft, arrowRight } = getHouseVertices(shape)
        const housePathData = 'M' + separator[0] + 'L' + separator.slice(1) + 'Z'
        // const doorPathData = 'M' + doorVertices[0] + 'L' + doorVertices.slice(1) + 'Z'
        return <path d={housePathData} />
    }
    override onResize(shape: IBLoopShape, info: TLResizeInfo<IBLoopShape>) {
        const resized = resizeBox(shape, info)
        const next = structuredClone(info.initialShape)
        next.x = resized.x
        next.y = resized.y
        next.props.w = resized.props.w
        next.props.h = resized.props.h
        return next
    }


}

function getHouseVertices(shape: IBLoopShape): { separator: Vec[]; arrowLeft: Vec[]; arrowRight: Vec[] } {
    const { w, h } = shape.props
    const halfH = h / 2
    const separator = [
        new Vec(0, halfH),
        new Vec(w, halfH),
    ]
    const arrowLeft = [
        new Vec(0, h),
        new Vec(0, 0),
    ]
    const arrowRight = [
        new Vec(w, 0),
        new Vec(w, h),
    ]
    return { separator, arrowLeft, arrowRight }
}