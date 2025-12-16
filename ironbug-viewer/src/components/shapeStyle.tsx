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
  TLUiEventHandler,
} from "tldraw";
import "tldraw/tldraw.css";

import { useCallback, useEffect, useState } from "react";
import { IBShape, IBShapeUtil } from "./../shapes/LoopObjShape";
import IB_Sys07 from "./../assets/HVAC/Sys07_VAV Reheat.json";
import { DrawDemandLoop, DrawLoop, DrawSupplyLoop } from "../shapes/Loop";
import { IBLoopShapeUtil } from "../shapes/LoopShape";
import {
  LoadZoneTablePage,
  ZoneTableShapeUtil,
} from "../shapes/ZoneTableShape";
import { PropertiesDrawer } from "./PropertiesDrawer";

// function OsPropertyPanel() {
//   const editor = useEditor();
//   const styles = useRelevantStyles();
//   const [selectedShape, setSelectedShape] = useState<IBShape | null>(null);

//   let selectedId: TLShapeId = createShapeId("");

//   useReactor(
//     "change selection",
//     () => {
//       const shape = editor
//         .getSelectedShapes()
//         .find((shape) => shape.type === "ibshape") as IBShape;
//       setSelectedShape(shape || null);
//     },
//     [editor]
//   );

//   if (!styles) return null;

//   return (
//     <div style={{ width: "300px" }}>
//       {/* <DefaultStylePanel> */}
//       {/* <DefaultStylePanelContent styles={styles} /> */}
//       {selectedShape && (
//         <div>
//           <label>OpenStudio Type:</label>
//           <input
//             type="text"
//             value={selectedShape.props.ostype}
//             onChange={(e) => {
//               editor.updateShape({
//                 ...selectedShape,
//                 props: { ...selectedShape.props, ostype: e.target.value },
//               });
//             }}
//           />
//         </div>
//       )}
//       {selectedShape?.props.osProperties &&
//         Object.entries(selectedShape.props.osProperties).map(([key, value]) => (
//           <div key={key}>
//             <label>{key}:</label>
//             <input
//               type="text"
//               value={value}
//               onChange={(e) => {
//                 editor.updateShape({
//                   ...selectedShape,
//                   props: {
//                     ...selectedShape.props,
//                     osProperties: {
//                       ...selectedShape.props.osProperties,
//                       [key]: e.target.value,
//                     },
//                   },
//                 });
//               }}
//             />
//           </div>
//         ))}
//       {/* </DefaultStylePanel> */}
//     </div>
//   );
// }

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
  // delete all default pages
  const currentPages = editor.getPages();
  for (let i = 0; i < currentPages.length; i++) {
    const p = currentPages[i];
    // console.log("deleting page:", p);
    editor.deletePage(p);
  }

  // create new pages for zone table
  LoadZoneTablePage(editor, sys);

  // const sys = IB_Sys07;
  const airLoops: any[] = sys.AirLoops;
  const plantLoops: any[] = sys.PlantLoops;

  airLoops.forEach((_) => {
    const loop = _;
    DrawLoop(editor, loop);
  });

  // const testPlant = [plantLoops[1]];
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);

  // setup addEventListener
  const wv2 = window.parent.chrome?.webview;
  if (typeof wv2 !== "undefined") {
    // console.log("Is Viewer");
    wv2.addEventListener("message", (event) => {
      let data = "data" in event && event.data;
      if (data !== undefined) {
        const decodedData = atob(data as string);
        const json = JSON.parse(decodedData);
        // console.log("Data received:", json);
        // setSystem(json);
        if (editor) {
          loadSystem(editor, json);
        }
      }
    });
  }

  // const handleUiEvent = useCallback<TLUiEventHandler>((name, data: any) => {
  //   // console.log("UI Event:", name, data);
  //   if (name === "click-shape") {
  //     const shape = data.shape;
  //     if (shape.type === "ibshape") {
  //       setSelectedData(shape.props);
  //       setDrawerOpen(true);
  //     }
  //   } else if (name === "click-canvas") {
  //     setDrawerOpen(false);
  //   }
  // }, []);

  function OnMountLoading(editor: Editor) {
    const wv2 = window.parent.chrome?.webview;
    if (typeof wv2 === "undefined") {
      loadSystem(editor, IB_Sys07);
    } else {
      setEditor(editor);
      wv2.postMessage("IBViewer loaded!");
    }

    // editor.sideEffects.registerBeforeChangeHandler(
    //   "shape",
    //   (_prev, next, source) => {
    //     console.log("shape change", next);
    //     if (source !== "user") return next;
    //     return {
    //       ...next,
    //     };
    //   }
    // );
  }

  function OsPropertyPanel() {
    const editor = useEditor();
    useReactor(
      "change selection",
      () => {
        const shape = editor
          .getSelectedShapes()
          .find((shape) => shape.type === "ibshape") as IBShape;
        if (shape?.props?.ibObj) {
          setSelectedData(shape.props.ibObj || null);
          setDrawerOpen(true);
        } else {
          setSelectedData(null);
          setDrawerOpen(false);
        }
      },
      [editor]
    );

    // if (!styles) return null;

    return null;
  }

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Tldraw
        // persistenceKey="ironbug_viewer"
        shapeUtils={[IBShapeUtil, IBLoopShapeUtil, ZoneTableShapeUtil]}
        components={{
          StylePanel: OsPropertyPanel,
        }}
        onMount={OnMountLoading}
        // onUiEvent={handleUiEvent}
      />
      <PropertiesDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        data={selectedData}
        mask={false}
      />
    </div>
  );
}
