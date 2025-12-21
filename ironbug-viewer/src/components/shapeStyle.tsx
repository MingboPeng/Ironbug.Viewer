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
  TLComponents,
  TldrawUiMenuItem,
  DefaultMainMenu,
  TldrawUiMenuGroup,
  DefaultMainMenuContent,
  TldrawUiMenuSubmenu,
  useValue,
} from "tldraw";
import "tldraw/tldraw.css";

import { useCallback, useEffect, useMemo, useState } from "react";
import { IBShape, IBShapeUtil } from "./../shapes/LoopObjShape";
import IB_Sys07 from "./../assets/HVAC/Sys07_VAV Reheat.json";
import zoneEquipments from "./../assets/HVAC/ZoneEquipments.json";
import { DrawDemandLoop, DrawLoop, DrawSupplyLoop } from "../shapes/Loop";
import { IBLoopShape, IBLoopShapeUtil } from "../shapes/LoopShape";
import {
  LoadZoneTablePage,
  ZoneTableShapeUtil,
} from "../shapes/ZoneTableShape";
import { PropertiesDrawer } from "./PropertiesDrawer";
import { EditorProvider } from "./PropertyPanel";

function InspectorPanel() {
  const editor = useEditor();

  // Get the currently selected shapes, updates reactively
  const selectedShapes = useValue(
    "selected shapes",
    () => editor.getSelectedShapes(),
    [editor]
  );

  // Get shared styles when multiple shapes are selected
  const sharedStyles = useValue(
    "shared styles",
    () => {
      if (selectedShapes.length <= 1) return null;
      return editor.getSharedStyles();
    },
    [editor, selectedShapes]
  );

  // Get bindings involving the selected shape (only for single selection)
  const bindings = useValue(
    "bindings",
    () => {
      if (selectedShapes.length !== 1) return [];
      return editor.getBindingsInvolvingShape(selectedShapes[0].id);
    },
    [editor, selectedShapes]
  );

  const selectedShape = selectedShapes.length === 1 ? selectedShapes[0] : null;

  if (selectedShapes.length === 0) {
    return (
      <div>
        <h3>Inspector</h3>
        <p>No shape selected</p>
      </div>
    );
  }

  // Single shape selected
  return (
    <div style={{ width: 300 }}>
      <h3>Inspector</h3>
      <div className="inspector-section">
        {Object.entries(selectedShape!).map(([key, value]) => {
          if (key === "props") return null; // Skip props, we'll show them separately
          return <p>shape selected</p>;
        })}
      </div>

      {/* {selectedShape!.props && Object.keys(selectedShape!.props).length > 0 && (
				<div className="inspector-section">
					<h4>Shape Props</h4>
					{Object.entries(selectedShape!.props).map(([key, value]) => (
						<PropertyRow key={key} name={key} value={value} path={`props.${key}`} />
					))}
				</div>
			)} */}

      {/* {bindings.length > 0 && (
				<div className="inspector-section">
					<h4>Bindings ({bindings.length})</h4>
					{bindings.map((binding) => (
						<BindingRow key={binding.id} binding={binding} selectedShapeId={selectedShape!.id} />
					))}
				</div>
			)} */}
    </div>
  );
}

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

function loadSystem(
  editor: Editor,
  sys: any,
  setSelectedData?: ((data: any) => void) | null
) {
  // delete all default pages
  const currentPages = editor.getPages();

  // create a dummy page and delete the rest
  const dummyPageId = PageRecordType.createId("dummyPage");
  editor.createPage({
    name: "dummyPage",
    id: dummyPageId,
  });
  editor.setCurrentPage(dummyPageId);

  for (let i = 0; i < currentPages.length; i++) {
    const p = currentPages[i];
    // console.log("deleting page:", p);
    editor.deletePage(p);
  }

  // create new pages for zone table
  LoadZoneTablePage(editor, sys, setSelectedData);

  // const sys = IB_Sys07;
  const airLoops: any[] = sys.AirLoops ?? [];
  const plantLoops: any[] = sys.PlantLoops ?? [];

  airLoops.forEach((_) => {
    DrawLoop(editor, _);
  });

  // const testPlant = [plantLoops[1]];
  plantLoops.forEach((_) => {
    DrawLoop(editor, _);
  });

  // delete dummy page
  editor.deletePage(dummyPageId);

  // switch to the first page
  const firstPage = editor.getPages()[0];
  if (firstPage) {
    editor.setCurrentPage(firstPage);
  }
}

export default function ShapeWithTldrawStylesExample() {
  // const [editor, setEditor] = useState<Editor | null>(null);
  const [editor, setEditor] = useState<Editor>();
  // const [system, setSystem] = useState<any>(null);
  // const [drawerOpen, setDrawerOpen] = useState(false);
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
          loadSystem(editor, json, setSelectedData);
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
      loadSystem(editor, IB_Sys07, setSelectedData);
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

  const OsPropertyPanel = useCallback(() => {
    const editor = useEditor();
    useReactor(
      "change selection",
      () => {
        try {
          const slectedShapes = editor.getSelectedShapes();
          if (slectedShapes.length === 0) return;
          const selectedShape = slectedShapes[0];
          if (selectedShape.type === "ibshape") {
            const shape = selectedShape as IBShape;
            setSelectedData(shape.props.ibObj || null);
            // setDrawerOpen(true);
          } else if (selectedShape.type === "IBLoopShape") {
            const shape = selectedShape as IBLoopShape;
            setSelectedData(shape.props.ibObj || null);
            // setDrawerOpen(true);
          } else if (selectedShape.type === "ZoneTableShape") {
            // console.log("ZoneTableShape selected");
            // do nothing
          } else {
            setSelectedData(null);
            // setDrawerOpen(false);
          }
        } catch (error) {
          setSelectedData(null);
          // setDrawerOpen(false);
        }
      },
      [editor]
    );

    // if (!styles) return null;

    return null;
  }, []);

  const CustomMainMenu = useCallback(() => {
    const editor = useEditor();

    return (
      <DefaultMainMenu>
        <TldrawUiMenuGroup id="ibMenu">
          <TldrawUiMenuItem
            id="openIb"
            label="Open Ironbug HVAC JSON"
            readonlyOk
            onSelect={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = ".json";
              input.onchange = (e: any) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (e) => {
                  const content = e.target?.result;
                  if (typeof content === "string") {
                    try {
                      const json = JSON.parse(content);
                      loadSystem(editor, json, setSelectedData);
                    } catch (error) {
                      console.error("Error parsing JSON:", error);
                    }
                  }
                };
                reader.readAsText(file);
              };
              input.click();
            }}
          />
          <TldrawUiMenuSubmenu id="ibSamples" label="HVAC Samples">
            <TldrawUiMenuItem
              id="sys07"
              label="Sys07 VAV Reheat"
              readonlyOk
              onSelect={() => {
                if (editor) {
                  loadSystem(editor, IB_Sys07, setSelectedData);
                }
              }}
            />
            <TldrawUiMenuItem
              id="zoneEquipments"
              label="zoneEquipments"
              readonlyOk
              onSelect={() => {
                if (editor) {
                  loadSystem(editor, zoneEquipments, setSelectedData);
                }
              }}
            />
          </TldrawUiMenuSubmenu>
        </TldrawUiMenuGroup>
        <DefaultMainMenuContent />
      </DefaultMainMenu>
    );
  }, []);

  const getPropertyPanel = useCallback(() => {
    // const editor = useEditor();
    return (
      <div style={{ margin: 10 }}>
        <h4>Properties</h4>
        {/* <div>JSON.stringify(selectedData)</div> */}
        {/* <div>{JSON.stringify(selectedData, null, 2)}</div> */}
        {selectedData && (
          <PropertiesDrawer
            // open={drawerOpen}
            // onClose={() => setDrawerOpen(false)}
            data={selectedData}
            // mask={false}
          />
        )}
      </div>
    );
  }, [selectedData]);

  const components: TLComponents = useMemo(
    () => ({
      MainMenu: CustomMainMenu,
      StylePanel: OsPropertyPanel,
    }),
    [CustomMainMenu, OsPropertyPanel]
  );

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100%",
      }}
    >
      <div
        style={{
          flex: 1,
          height: "100vh",
          position: "absolute",
          inset: "0 300px 0 0",
        }}
      >
        <Tldraw
          // persistenceKey="ironbug_viewer"
          shapeUtils={[IBShapeUtil, IBLoopShapeUtil, ZoneTableShapeUtil]}
          components={components}
          onMount={OnMountLoading}
          // onUiEvent={handleUiEvent}
        />
      </div>

      <div
        style={{
          position: "absolute",
          width: 300,
          height: "100vh",
          right: 0,
          overflowY: "auto",
        }}
      >
        {getPropertyPanel()}
        {/* {editor && (
          <>
            <div>test29</div>
            <EditorProvider editor={editor}>
              <InspectorPanel />
            </EditorProvider>
          </>
        )} */}
      </div>
      {/* </div> */}

      {/* <PropertiesDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        data={selectedData}
        mask={false}
      /> */}
    </div>
  );
}
