import {
  BaseBoxShapeUtil,
  HTMLContainer,
  JsonValue,
  StyleProp,
  T,
  TLBaseShape,
} from "tldraw";

export type IBShape = TLBaseShape<
  "ibshape",
  {
    w: number;
    h: number;
    url: string;
    ibObj: any;
  }
>;

export class IBShapeUtil extends BaseBoxShapeUtil<IBShape> {
  static override type = "ibshape" as const;

  static override props = {
    w: T.number,
    h: T.number,
    url: T.string,
    ibObj: T.any,
  };

  getDefaultProps(): IBShape["props"] {
    return {
      w: 50,
      h: 50,
      url: "",
      ibObj: null,
    };
  }

  component(shape: IBShape) {
    return (
      <HTMLContainer
        id={shape.id}
        style={{
          backgroundColor: "var(--color-low-border)",
          overflow: "hidden",
        }}
        onPointerDown={(e) => {
          console.log("pointer down", shape);
          e.stopPropagation();
        }}
      >
        <img
          src={shape.props.url}
          alt="Custom image"
          style={{
            width: `${shape.props.w}px`,
            height: `${shape.props.h}px`,
            objectFit: "cover",
            border: "1px solid #ccc",
          }}
        />
      </HTMLContainer>
    );
  }

  indicator(shape: IBShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}
