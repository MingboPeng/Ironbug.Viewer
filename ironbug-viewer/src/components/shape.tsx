import {
    Editor,
	Geometry2d,
	HTMLContainer,
	RecordProps,
	Rectangle2d,
	ShapeUtil,
	T,
	TLBaseShape,
	TLResizeInfo,
	Tldraw,
	resizeBox,
} from 'tldraw'
import 'tldraw/tldraw.css'

// [1]
type ICustomShape = TLBaseShape<
	'my-custom-shape',
	{
		w: number
		h: number
		text: string
	}
>

// [2]
export class MyShapeUtil extends ShapeUtil<ICustomShape> {
	// [a]
	static override type = 'my-custom-shape' as const
	static override props: RecordProps<ICustomShape> = {
		w: T.number,
		h: T.number,
		text: T.string,
	}

	// [b]
	getDefaultProps(): ICustomShape['props'] {
		return {
			w: 100,
			h: 200,
			text: "I'm a shape2!",
		}
	}

	// [c]
	override canEdit() {
		return false
	}
	override canResize() {
		return false
	}
	override isAspectRatioLocked() {
		return false
	}

	// [d]
	getGeometry(shape: ICustomShape): Geometry2d {
		return new Rectangle2d({
			width: shape.props.w,
			height: shape.props.h,
			isFilled: true,
		})
	}

	// [e]
	override onResize(shape: any, info: TLResizeInfo<any>) {
		return resizeBox(shape, info)
	}

	// [f]
	component(shape: ICustomShape) {
		return <HTMLContainer style={{ backgroundColor: '#efefef' }}>{shape.props.text}</HTMLContainer>
	}

	// [g]
	indicator(shape: ICustomShape) {
		return <rect width={shape.props.w} height={shape.props.h} />
	}
}

// [3]
const customShape = [MyShapeUtil]


function OnMountLoading(editor: Editor){
    
    editor.createShape({ type: 'my-custom-shape', x: 100, y: 100 })
    editor.createShape({ type: 'my-custom-shape', x: 220, y: 100 })
}

export default function CustomShapeExample() {
	return (
        <div style={{ position: 'fixed', inset: 0 }}>
			<Tldraw
				shapeUtils={customShape}
				onMount={OnMountLoading}
			/>
		</div>
	)
}