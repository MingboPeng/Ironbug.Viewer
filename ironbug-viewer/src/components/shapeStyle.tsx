
import {
	Editor,
	BaseBoxShapeUtil,
	DefaultStylePanel,
	DefaultStylePanelContent,
	HTMLContainer,
	StyleProp,
	T,
	TLBaseShape,
	Tldraw,
	useEditor,
	useRelevantStyles,
	createShapeId,
	TLArrowShape,
	// TLArrowShape,
	TLArrowBinding,
	// TLDrawShape
} from 'tldraw'
import 'tldraw/tldraw.css'

import reactLogo from './../assets/HVAC/Coil_Heating_Water_Baseboard_Radiant.png'

// [1]
const myRatingStyle = StyleProp.defineEnum('example:rating', {
	defaultValue: 1,
	values: [1, 2, 3, 4, 5],
})

// [2]
type MyRatingStyle = T.TypeOf<typeof myRatingStyle>

type IMyShape = TLBaseShape<
	'myshape',
	{
		w: number
		h: number
		rating: MyRatingStyle
		url: string
	}
>

class MyShapeUtil extends BaseBoxShapeUtil<IMyShape> {
	static override type = 'myshape' as const

	// [3]
	static override props = {
		w: T.number,
		h: T.number,
		rating: myRatingStyle,
		url: T.string
	}

	getDefaultProps(): IMyShape['props'] {
		return {
			w: 300,
			h: 300,
			rating: 4, // [4]
			url: ''
		}
	}

	component(shape: IMyShape) {
		// [5]
		const stars = ['☆', '☆', '☆', '☆', '☆']
		for (let i = 0; i < shape.props.rating; i++) {
			stars[i] = '★'
		}

		return (
			<HTMLContainer
				id={shape.id}
				style={{ backgroundColor: 'var(--color-low-border)', overflow: 'hidden' }}
			>
				{stars}
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

	indicator(shape: IMyShape) {
		return <rect width={shape.props.w} height={shape.props.h} />
	}
}

// [6]
function CustomStylePanel() {
	const editor = useEditor()
	const styles = useRelevantStyles()
	if (!styles) return null

	const rating = styles.get(myRatingStyle)

	return (
		<DefaultStylePanel>
			<DefaultStylePanelContent styles={styles} />
			{rating !== undefined && (
				<div>
					<select
						style={{ width: '100%', padding: 4 }}
						value={rating.type === 'mixed' ? '' : rating.value}
						onChange={(e) => {
							editor.markHistoryStoppingPoint()
							const value = myRatingStyle.validate(+e.currentTarget.value)
							editor.setStyleForSelectedShapes(myRatingStyle, value)
						}}
					>
						{rating.type === 'mixed' ? <option value="">Mixed</option> : null}
						<option value={1}>1</option>
						<option value={2}>2</option>
						<option value={3}>3</option>
						<option value={4}>4</option>
						<option value={5}>5</option>
					</select>
				</div>
			)}
		</DefaultStylePanel>
	)
}


function OnMountLoading2(editor: Editor) {

	const rightAngle1 = createShapeId('geo1');
	const rightAngle2 = createShapeId('geo2');
	const arrowId = createShapeId('arrow1');
	// editor.createShapes([
	// 	{
	// 		id: rightAngle1,
	// 		type: "geo",
	// 		x: 100,
	// 		y: 100,
	// 		props: {
	// 			geo: "ellipse", // Defines the shape as a circle/ellipse
	// 			w: 50, // Width
	// 			h: 50, // Height

	// 		}
	// 	},
	// 	{
	// 		id: rightAngle2,
	// 		type: "geo",
	// 		props: {
	// 			geo: "ellipse",
	// 			w: 50,
	// 			h: 50,
	// 		},
	// 		x: 300,
	// 		y: 100,
	// 	},
	// ]);

	editor.createShapes([
		{
			id: rightAngle1,
			type: 'myshape',
			x: 100,
			y: 100,
			props: { url: { reactLogo }.reactLogo }
		},
		{
			id: rightAngle2,
			type: 'myshape',
			x: 450,
			y: 250,
			props: { rating: 5, url: 'https://raw.githubusercontent.com/BuildingPerformanceSimulation/openstudio-measures/refs/heads/master/lib/measures/detailed_hvac_viewer/resources/images/Coil_Heating_Water_Baseboard_Radiant.png' }
		}])

	// Create an arrow connecting the circles
	editor.createShapes<TLArrowShape>([
		{
			id: arrowId,
			type: "arrow",
			x: 0,
			y: 0,
			props: {
				start: {
					x: 1, // Initial x-coordinate for start (center of circle1)
					y: 1, // Initial y-coordinate for start (center of circle1)
				}, // Point near circle1's center
				end: {
					x: 22, // Initial x-coordinate for end (center of circle2)
					y: 22, // Initial y-coordinate for end (center of circle2)
				}, // Point near circle2's center
			}
		},
	]);

	// editor.createBinding<TLArrowBinding>(
	// 	{
	// 		fromId: arrowId, // The arrow
	// 		toId: rightAngle1, // The shape being connected (start point)
	// 		props: {
	// 			terminal: 'start'
	// 		}, type: "arrow"
	// 	}
	// )

	editor.createBindings([
		{
			fromId: arrowId, // The arrow
			toId: rightAngle1, // The shape being connected (start point)
			props: {
				terminal: 'start'
			}, type: "arrow"
		},
		{
			fromId: arrowId, // The arrow
			toId: rightAngle2, // The shape being connected (end point)
			props: {
				terminal: 'end'
			}, type: "arrow"
		},
	]);




}

export default function ShapeWithTldrawStylesExample() {
	return (
		<div style={{ position: 'fixed', inset: 0 }}>
			<Tldraw
				// [7]
				shapeUtils={[MyShapeUtil]}
				components={{
					StylePanel: CustomStylePanel,
				}}
				onMount={OnMountLoading2}
			/>
		</div>
	)
}