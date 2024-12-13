import { BaseBoxShapeUtil, HTMLContainer, StyleProp, T, TLBaseShape } from "tldraw"

export type IBShape = TLBaseShape<
    'ibshape',
    {
        w: number
        h: number
        url: string
        ostype: string

    }
>

export class IBShapeUtil extends BaseBoxShapeUtil<IBShape> {
    static override type = 'ibshape' as const

    static override props = {
        w: T.number,
        h: T.number,
        url: T.string,
        ostype: T.string
    }

    getDefaultProps(): IBShape['props'] {
        return {
            w: 50,
            h: 50,
            url: '',
            ostype: '',
        }
    }

    component(shape: IBShape) {

        return (
            <HTMLContainer
                id={shape.id}
                style={{ backgroundColor: 'var(--color-low-border)', overflow: 'hidden' }}
            >
                <img
                    src={shape.props.url}
                    alt="Custom image"
                    style={{
                        width: `${shape.props.w}px`,
                        height: `${shape.props.h}px`,
                        objectFit: 'cover',
                        border: '1px solid #ccc',
                    }}
                />
            </HTMLContainer>
        )
    }

    indicator(shape: IBShape) {
        return <rect width={shape.props.w} height={shape.props.h} />
    }
}