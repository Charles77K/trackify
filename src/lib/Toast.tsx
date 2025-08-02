import { toast } from "sonner";

type Position =
  | "bottom-center"
  | "bottom-right"
  | "bottom-left"
  | "top-right"
  | "top-left"
  | "top-center";

class Toast {
  static success(name: string, description?: string) {
    toast.success(name, {
      description: description,
      position: "top-right",
      style: {
        color: "green",
      },
    });
  }

  static error(name: string, description?: string) {
    toast.error(name, {
      description: description,
      position: "top-right",
      style: {
        color: "red",
      },
    });
  }

  static info(name: string, description?: string, position?: Position) {
    toast.info(name, {
      description: description,
      position: position,
      style: {
        color: "blue",
      },
    });
  }

  static warning(name: string, description?: string, position?: Position) {
    toast.warning(name, {
      description: description,
      position: position,
      style: {
        color: "yellow",
      },
    });
  }
}

export default Toast;
