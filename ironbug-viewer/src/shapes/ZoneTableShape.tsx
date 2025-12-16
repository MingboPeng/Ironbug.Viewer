import { Button, Table } from "antd";
import { useMemo, useState } from "react";
import { PropertiesDrawer } from "../components/PropertiesDrawer";
import {
  BaseBoxShapeUtil,
  createShapeId,
  Editor,
  Group2d,
  HTMLContainer,
  PageRecordType,
  Polygon2d,
  Rectangle2d,
  resizeBox,
  StyleProp,
  T,
  TextLabel,
  TLBaseShape,
  TLResizeInfo,
  useDelaySvgExport,
  Vec,
} from "tldraw";
import {
  cleanTrackingId,
  GetHvacType,
  GetName,
  GetTrackingId,
} from "./LoopUtil";

interface ZoneTableData {
  key: string; //id
  name: string;
  sizing: any;
  airTerminal: any;
  zoneEquipments: any[];
  attributes: any[];
}

export type ZoneTableShape = TLBaseShape<
  "ZoneTableShape",
  {
    w: number;
    h: number;
    rowData: ZoneTableData[];
  }
>;

export class ZoneTableShapeUtil extends BaseBoxShapeUtil<ZoneTableShape> {
  static override type = "ZoneTableShape" as const;

  override canScroll(): boolean {
    return true;
  }

  override canEdit(): boolean {
    return false;
  }
  // override can

  override getDefaultProps() {
    return {
      w: 300,
      h: 200,
      rowData: [],
    };
  }
  override component(shape: ZoneTableShape) {
    const isEditing = this.editor.getEditingShapeId() === shape.id;
    const isReady = useDelaySvgExport();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<ZoneTableData | null>(
      null
    );
    const [selectedCell, setSelectedCell] = useState<any | null>(null);

    const columns = useMemo(
      () => [
        {
          title: "Name",
          dataIndex: "name",
          key: "name",
          render: (obj: any) => (
            <Button
              onClick={(e) => {
                setSelectedRecord(obj);
                setSelectedCell(obj);
                setDrawerOpen(true);
                e.stopPropagation();
              }}
            >
              {GetName(obj)}
            </Button>
          ),
        },
        {
          title: "Sizing",
          dataIndex: "sizing",
          key: "sizing",
          render: (obj: any) => (
            <Button
              onClick={(e) => {
                setSelectedRecord(obj);
                setSelectedCell(obj);
                setDrawerOpen(true);
                e.stopPropagation();
              }}
            >
              {GetHvacType(obj)}
            </Button>
          ),
        },
        {
          title: "Air Terminal",
          dataIndex: "airTerminal",
          key: "airTerminal",
          render: (obj: any) => (
            <Button
              onClick={(e) => {
                setSelectedRecord(obj);
                setSelectedCell(obj);
                setDrawerOpen(true);
                e.stopPropagation();
              }}
            >
              {GetHvacType(obj)}
            </Button>
          ),
        },
        {
          title: "Zone Equipments",
          dataIndex: "zoneEquipments",
          key: "zoneEquipments",
          render: (text: string, record: ZoneTableData) => (
            <Button
              onClick={(e) => {
                setSelectedRecord(record);
                setDrawerOpen(true);
                e.stopPropagation();
              }}
            >
              {text}
            </Button>
          ),
        },
      ],
      []
    );

    const table = useMemo(
      () => (
        <Table
          loading={!isReady}
          dataSource={shape.props.rowData}
          columns={columns}
          size="small"
        />
      ),
      [isReady, shape.props.rowData, columns]
    );

    return (
      <div
        style={{
          width: shape.props.w,
          height: shape.props.h,
          pointerEvents: "all",
          position: "relative",
          overflow: "hidden",
        }}
        // [b] This is where we stop event propagation
        onPointerDown={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => {
          setDrawerOpen(false);
          e.stopPropagation();
        }}
      >
        {table}
        <div
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <PropertiesDrawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            data={selectedCell}
            mask={false}
          />
        </div>
      </div>
    );
  }
  override indicator(shape: ZoneTableShape) {
    return <rect width={shape.props.w} height={shape.props.h} rx={8} ry={8} />;
  }
}

export function LoadZoneTablePage(editor: Editor, sys: any) {
  const zoneGridShapeId = createShapeId("ZoneTableShape");

  if (!editor.getShape(zoneGridShapeId)) {
    // update page name
    // const pageId = PageRecordType.createId("ZoneTableShape");
    // editor.createPage({ name: "Zone Table", id: pageId });
    // editor.setCurrentPage(pageId);

    const page = editor.getCurrentPage();

    // page.id = createShapeId("ZoneTablePage");
    page.name = "Zone Table";
    page.meta = { zoneTable: true };
    editor.updatePage(page);

    // Get all the airloop branches
    const airloopBranches = sys.AirLoops.flatMap((loop: any) =>
      loop.DemandComponents.flatMap((comp: any) => comp.Branches)
    ) as any[];
    const rooms = airloopBranches.flatMap((_) => _).filter((_) => IsZone(_));

    const roomData = rooms.map((_) => GetZones(_));

    editor.createShape({
      id: zoneGridShapeId,
      type: "ZoneTableShape",
      props: {
        w: 800,
        h: 600,
        rowData: roomData,
      },
    });

    // editor.select(zoneGridShapeId);
    editor.zoomToBounds({
      x: 0,
      y: 0,
      w: 800 + 400,
      h: 600,
    });
  }
}
function GetZones(room: any) {
  // console.log("GetZones", room);
  const airTerminal = room.AirTerminal;
  const sizing = room.SizingZone;
  // const attributes = room.CustomAttributes;

  const roomData = {
    name: room,
    key: GetTrackingId(room),
    // attributes: GetProperties(obj),
    airTerminal: airTerminal,
    sizing: sizing,
    // zoneEquipments: room.ZoneEquipments,
  } as ZoneTableData;
  // console.log("GetZonesData", roomData);
  return roomData;
}

function IsZone(obj: any) {
  // Ironbug.HVAC.BaseClass.IB_ThermalZone, Ironbug.HVAC
  let type = obj.$type;
  return type === "Ironbug.HVAC.BaseClass.IB_ThermalZone, Ironbug.HVAC";
}
