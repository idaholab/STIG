import { AlertType } from "@/components/elements/AlertComponent";

export type Notification = {
    id: string;
    text: string;
    type: AlertType;
}