
import {
	Editor,
	DefaultStylePanel,
	Tldraw,
	useEditor,
	useRelevantStyles,
	useReactor,
	TLArrowBindingProps,
	TLShapeId,
	createShapeId,
	PageRecordType,
	hardResetEditor
} from 'tldraw'
import 'tldraw/tldraw.css'


import { useEffect, useState } from 'react'
import { IBShape, IBShapeUtil } from "./../shapes/LoopObjShape";
import IB_Sys07 from './../assets/HVAC/Sys07_VAV Reheat.json'
import { DrawDemandLoop, DrawLoop, DrawLoops, DrawSupplyLoop } from '../shapes/Loop';
import { IBLoopShapeUtil } from '../shapes/LoopShape';

// [6]
function CustomStylePanel() {
	const editor = useEditor()
	const styles = useRelevantStyles()
	const [selectedShape, setSelectedShape] = useState<IBShape | null>(null);

	let selectedId: TLShapeId = createShapeId('');

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
			{selectedShape?.props.name && (
				<div>
					<label>Name:</label>
					<input
						type="text"
						value={selectedShape.props.name}
						onChange={(e) => { editor.updateShape({ ...selectedShape, props: { ...selectedShape.props, name: e.target.value, } }); }}
					/>
				</div>
			)}
		</DefaultStylePanel>
	)
}



export default function ShapeWithTldrawStylesExample() {

	// const [isMounted, setIsMounted] = useState(false);

	// useEffect(() => {
	// 	hardResetEditor();
	// }, []);


	function OnMountLoading(editor: Editor) {
		// console.log(IB_Sys07);

		// if (!isMounted) {
		// 	setIsMounted(true);
		// 	// editor.store.clear();
		// 	DrawLoops(editor);

		// } else {
		// 	console.log("aaaa");

		// }
		DrawLoops(editor);

	}
	return (
		<div style={{ position: 'fixed', inset: 0 }}>
			<Tldraw
				persistenceKey="ironbug_viewer"
				shapeUtils={[IBShapeUtil, IBLoopShapeUtil]}
				components={{
					StylePanel: CustomStylePanel,
				}}
				onMount={OnMountLoading}

			/>
		</div>
	)
}