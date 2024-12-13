
import {
	Editor,
	DefaultStylePanel,
	Tldraw,
	useEditor,
	useRelevantStyles,
	useReactor
} from 'tldraw'
import 'tldraw/tldraw.css'


import { useState } from 'react'
import { IBShape, IBShapeUtil } from "./../shapes/LoopObjShape";
import IB_Sys07 from './../assets/HVAC/Sys07_VAV Reheat.json'
import { DrawSupplyLoop } from '../shapes/Loop';

// [6]
function CustomStylePanel() {
	const editor = useEditor()
	const styles = useRelevantStyles()
	const [selectedShape, setSelectedShape] = useState<IBShape | null>(null);

	useReactor(
		'change selection',
		() => {
			const shape = editor.getSelectedShapes().find(shape => shape.type === 'ibshape') as IBShape;
			setSelectedShape(shape || null);
			// if (shape !== null && shape !== undefined) {
			// 	console.log("selection changed!" + shape.props.ostype);
			// } else {
			// 	console.log("selection null");
			// }
		},
		[editor]
	)

	if (!styles) return null


	return (
		<DefaultStylePanel>
			{/* <DefaultStylePanelContent styles={styles} /> */}
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



function OnMountLoading(editor: Editor) {
	console.log(IB_Sys07);
	DrawSupplyLoop(editor);
}

export default function ShapeWithTldrawStylesExample() {
	return (
		<div style={{ position: 'fixed', inset: 0 }}>
			<Tldraw
				shapeUtils={[IBShapeUtil]}
				components={{
					StylePanel: CustomStylePanel,
				}}
				onMount={OnMountLoading}
			/>
		</div>
	)
}