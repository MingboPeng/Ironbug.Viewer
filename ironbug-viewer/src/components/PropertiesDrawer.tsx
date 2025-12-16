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
    const attributes = data.CustomAttributes as any[];
    const children = data.Children as any[];

    if (attributes || (children && children.length > 0)) {
      return (
        <Form layout="vertical">
          <h4 style={{ marginTop: 0, marginBottom: 8 }}>{objTitle}</h4>
          {attributes?.map((attr: any, i: number) => (
            <Form.Item
              key={`attr-${i}`}
              label={attr.Field?.FullName}
              style={{ marginBottom: 12 }}
            >
              <Input value={String(attr.Value)} readOnly />
            </Form.Item>
          ))}
          {children?.map((child: any, cIndex: number) => {
            const childAttrs = child.CustomAttributes as any[];
            if (!childAttrs || childAttrs.length === 0) return null;
            return (
              <div key={`child-${cIndex}`}>
                <Divider size="small" />
                <h4 style={{ marginTop: 16, marginBottom: 8 }}>
                  {GetHvacType(child)}
                </h4>
                {childAttrs.map((attr: any, i: number) => (
                  <Form.Item
                    key={`child-${cIndex}-attr-${i}`}
                    label={attr.Field?.FullName}
                    style={{ marginBottom: 12 }}
                  >
                    <Input value={String(attr.Value)} readOnly />
                  </Form.Item>
                ))}
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
