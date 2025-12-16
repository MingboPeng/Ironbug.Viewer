import { Divider, Drawer, Form, Input } from "antd";
import { GetHvacType } from "../shapes/LoopUtil";

export interface PropertiesDrawerProps {
  open: boolean;
  onClose: () => void;
  data: any;
  title?: string;
  //   getContainer?: string | HTMLElement | (() => HTMLElement) | false;
  mask?: boolean;
}

export const PropertiesDrawer = ({
  open,
  onClose,
  data,
  title = "Properties",
  //   getContainer = false,
  mask = false,
}: PropertiesDrawerProps) => {
  const renderContent = () => {
    if (!data) return null;

    const objTitle = GetHvacType(data);
    let attributes = data.CustomAttributes as any[];
    const children = data.Children ?? ([] as any[]);
    const sizingSystem = data.SizingSystem; // loop
    const sizingZone = data.SizingZone; // zone
    if (sizingSystem) {
      children.push(sizingSystem);
    }
    if (sizingZone) {
      children.push(sizingZone);
    }

    // exclude Comment in attributes
    attributes = attributes?.filter((attr: any) => {
      return attr.Field?.FullName !== "Comment";
    });
    if (attributes || (children && children.length > 0)) {
      return (
        <Form layout="vertical">
          <h4 style={{ marginTop: 0, marginBottom: 8 }}>{objTitle}</h4>
          {attributes && attributes.length > 0 ? (
            attributes.map((attr: any, i: number) => {
              const isObject =
                typeof attr.Value === "object" && attr.Value !== null;
              return (
                <Form.Item
                  key={`attr-${i}`}
                  label={attr.Field?.FullName}
                  style={{ marginBottom: 12 }}
                >
                  <Input
                    value={
                      isObject ? GetHvacType(attr.Value) : String(attr.Value)
                    }
                    readOnly
                    disabled={isObject}
                  />
                </Form.Item>
              );
            })
          ) : (
            <div style={{ color: "#999", marginBottom: 12 }}>
              No custom properties defined, and default values apply.
            </div>
          )}
          {children?.map((child: any, cIndex: number) => {
            let childAttrs = child.CustomAttributes as any[];
            // exclude Comment in attributes
            childAttrs = childAttrs?.filter((attr: any) => {
              return attr.Field?.FullName !== "Comment";
            });
            return (
              <div key={`child-${cIndex}`}>
                <Divider size="small" />
                <h4 style={{ marginTop: 16, marginBottom: 8 }}>
                  {GetHvacType(child)}
                </h4>
                {childAttrs && childAttrs.length > 0 ? (
                  childAttrs.map((attr: any, i: number) => {
                    const isObject =
                      typeof attr.Value === "object" && attr.Value !== null;
                    return (
                      <Form.Item
                        key={`child-${cIndex}-attr-${i}`}
                        label={attr.Field?.FullName}
                        style={{ marginBottom: 12 }}
                      >
                        <Input
                          value={
                            isObject
                              ? GetHvacType(attr.Value)
                              : String(attr.Value)
                          }
                          readOnly
                          disabled={isObject}
                        />
                      </Form.Item>
                    );
                  })
                ) : (
                  <div style={{ color: "#999", marginBottom: 12 }}>
                    No custom properties defined, and default values apply.
                  </div>
                )}
              </div>
            );
          })}
        </Form>
      );
    }
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
  };

  return (
    <Drawer
      title={title}
      placement="right"
      closable={true}
      onClose={onClose}
      open={open}
      mask={mask}
    >
      {renderContent()}
    </Drawer>
  );
};
