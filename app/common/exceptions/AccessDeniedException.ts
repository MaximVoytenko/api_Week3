import { CustomException } from "./custom-exception";

export class AccessDeniedException extends CustomException {
    constructor(message: string = "Access Denied") {
        super(403, "ACCESS_DENIED", { publicMessage: message });
    }
}
