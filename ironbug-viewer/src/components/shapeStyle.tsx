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
        if (editor) {
          loadSystem(editor, data, setSelectedData);
        }
      }
    });
  }

  function OnMountLoading(editor: Editor) {
    const wv2 = window.parent.chrome?.webview;
    if (typeof wv2 === "undefined") {
      loadSystem(editor, IB_Sys07, setSelectedData);
    } else {
      setEditor(editor);
      wv2.postMessage("IBViewer loaded!");
    }
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
        {selectedData && <PropertiesDrawer data={selectedData} />}
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
      </div>
    </div>
  );
}
