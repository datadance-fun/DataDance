import { createRoot } from "react-dom/client";
import { Alert, AlertType } from ".";

export interface AlertShowProps {
  title?: React.ReactNode;
  message?: React.ReactNode;
  type?: AlertType;
  onClose?: () => void;
}

export const AlertAPI = {
  show({ title, type, message, onClose }: AlertShowProps) {
    const div = document.createElement("div");
    document.body.appendChild(div);
    const root = createRoot(div);

    const handleOpenChange = (open: boolean) => {
      if (!open) {
        root.unmount();
        div.remove();
        onClose?.();
      }
    };

    root.render(
      <Alert onOpenChange={handleOpenChange} open title={title} type={type}>
        {message}
      </Alert>
    );
  },

  error(props: AlertShowProps) {
    this.show({
      type: "error",
      ...props,
    });
  },
};
