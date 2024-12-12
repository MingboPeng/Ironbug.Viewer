
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
	// TLDrawShape,
	TLEventMap,
	useValue,
	useReactor
} from 'tldraw'
import 'tldraw/tldraw.css'

import reactLogo from './../assets/HVAC/Coil_Heating_Water_Baseboard_Radiant.png'
import IB_Sys07 from './../assets/HVAC/Sys07_VAV Reheat.json'
import { useState } from 'react'

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
		ostype: string

	}
>

class MyShapeUtil extends BaseBoxShapeUtil<IMyShape> {
	static override type = 'myshape' as const

	// [3]
	static override props = {
		w: T.number,
		h: T.number,
		rating: myRatingStyle,
		url: T.string,
		ostype: T.string
	}

	getDefaultProps(): IMyShape['props'] {
		return {
			w: 50,
			h: 50,
			rating: 4, // [4]
			url: '',
			ostype: ''
		}
	}

	component(shape: IMyShape) {

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

	indicator(shape: IMyShape) {
		return <rect width={shape.props.w} height={shape.props.h} />
	}
}

// [6]
function CustomStylePanel() {
	const editor = useEditor()
	const styles = useRelevantStyles()
	const [selectedShape, setSelectedShape] = useState<IMyShape | null>(null);

	useReactor(
		'change title',
		() => {
			const shape = editor.getSelectedShapes().find(shape => shape.type === 'myshape') as IMyShape;
			setSelectedShape(shape || null);

			if (shape !== null && shape !== undefined) {
				console.log("selection changed!" + shape.props.ostype);
			} else {
				console.log("selection null");
			}
		},
		[editor]
	)

	// const info = useValue(
	// 	'',
	// 	() => {
	// 		const shape = editor.getSelectedShapes().find(shape => shape.type === 'myshape') as IMyShape | undefined;
	// 		setSelectedShape(shape || null);
	// 		console.log("selection changed");

	// 	},
	// 	[editor]
	// )


	if (!styles) return null

	// const rating = styles.get(myRatingStyle)
	// const selectedShape = editor.getSelectedShapes().find(shape => shape.type === 'myshape') as IMyShape;

	return (
		<DefaultStylePanel>
			<DefaultStylePanelContent styles={styles} />
			{selectedShape && (
				<div>
					<label>OpenStudio Type:</label>
					<input
						type="text"
						value={selectedShape.props.ostype}
						onChange={(e) => { editor.updateShape({ ...selectedShape, props: { ...selectedShape.props, ostype: e.target.value, } }); }}
					/>
				</div>
			)}
		</DefaultStylePanel>
	)
}

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
	const sys07 = IB_Sys07;
	const airloop = sys07.AirLoops[0];
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
		console.log(comment);
		let trackingId = GetTrackingId(comment);

		const obj =
		{
			id: createShapeId(trackingId),
			type: 'myshape',
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


function OnMountLoading2(editor: Editor) {
	console.log(IB_Sys07);

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