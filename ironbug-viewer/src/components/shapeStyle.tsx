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
  hardResetEditor,
  Box,
} from "tldraw";
import "tldraw/tldraw.css";

import { useEffect, useState } from "react";
import { IBShape, IBShapeUtil } from "./../shapes/LoopObjShape";
import IB_Sys07 from "./../assets/HVAC/Sys07_VAV Reheat.json";
import { DrawDemandLoop, DrawLoop, DrawSupplyLoop } from "../shapes/Loop";
import { IBLoopShapeUtil } from "../shapes/LoopShape";

// [6]
function CustomStylePanel() {
  const editor = useEditor();
  const styles = useRelevantStyles();
  const [selectedShape, setSelectedShape] = useState<IBShape | null>(null);

  let selectedId: TLShapeId = createShapeId("");

  useReactor(
    "change selection",
    () => {
      const shape = editor
        .getSelectedShapes()
        .find((shape) => shape.type === "ibshape") as IBShape;
      setSelectedShape(shape || null);

      // if (shape !== null && shape !== undefined) {
      // 	console.log("selection changed!" + shape.props.ostype);
      // } else {
      // 	console.log("selection null");
      // }
    },
    [editor]
  );

  if (!styles) return null;

  return (
    <DefaultStylePanel>
      {/* <DefaultStylePanelContent styles={styles} /> */}
      {selectedShape && (
        <div>
          <label>OpenStudio Type:</label>
          <input
            type="text"
            value={selectedShape.props.ostype}
            onChange={(e) => {
              editor.updateShape({
                ...selectedShape,
                props: { ...selectedShape.props, ostype: e.target.value },
              });
            }}
          />
        </div>
      )}
      {selectedShape?.props.name && (
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={selectedShape.props.name}
            onChange={(e) => {
              editor.updateShape({
                ...selectedShape,
                props: { ...selectedShape.props, name: e.target.value },
              });
            }}
          />
        </div>
      )}
    </DefaultStylePanel>
  );
}

// function webview2Setup((json) => { } ) {
// 	const wv2 = window.parent.chrome?.webview;
// 	if (typeof wv2 === "undefined") {
// 		loadSystem(editor, IB_Sys07)
// 		return;

// 	}
// 	console.log("Is Viewer");

// 	wv2.addEventListener("message", event => {
// 		let data = "data" in event && event.data;
// 		if (data === undefined)
// 			data = IB_Sys07;
// 		else {
// 			const decodedData = atob(data as string);
// 			const json = JSON.parse(decodedData);
// 			console.log("Data received:", json);

// 			loadSystem(editor, json);

// 		}

// 	})

// }

function loadSystem(editor: Editor, sys: any) {
  const currentPages = editor.getPages();
  for (let i = 0; i < currentPages.length; i++) {
    const p = currentPages[i];
    // console.log("deleting page:", p);
    editor.deletePage(p);
  }

  // const sys = IB_Sys07;
  const airLoops: any[] = sys.AirLoops;
  const plantLoops: any[] = sys.PlantLoops;

  airLoops.forEach((_) => {
    const loop = _;
    DrawLoop(editor, loop);
  });

  plantLoops.forEach((_) => {
    const loop = _;
    DrawLoop(editor, loop);
  });

  // switch to the first page
  const firstPage = editor.getPages()[0];
  if (firstPage !== undefined) {
    editor.setCurrentPage(firstPage);
  }
}

export default function ShapeWithTldrawStylesExample() {
  const [editor, setEditor] = useState<Editor>();
  // const [system, setSystem] = useState<any>(null);

  // setup addEventListener
  const wv2 = window.parent.chrome?.webview;
  if (typeof wv2 !== "undefined") {
    console.log("Is Viewer");
    wv2.addEventListener("message", (event) => {
      let data = "data" in event && event.data;
      if (data !== undefined) {
        const decodedData = atob(data as string);
        const json = JSON.parse(decodedData);
        console.log("Data received:", json);
        // setSystem(json);
        if (editor) {
          loadSystem(editor, json);
        }
      }
    });
  }

  function OnMountLoading(editor: Editor) {
    const wv2 = window.parent.chrome?.webview;
    if (typeof wv2 === "undefined") {
      loadSystem(editor, IB_Sys07);
    } else {
      setEditor(editor);
      wv2.postMessage("IBViewer loaded!");
    }
  }
  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Tldraw
        // persistenceKey="ironbug_viewer"
        shapeUtils={[IBShapeUtil, IBLoopShapeUtil]}
        components={{
          StylePanel: CustomStylePanel,
        }}
        onMount={OnMountLoading}
      />
    </div>
  );
}
