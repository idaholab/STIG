import { CyberObservableCore } from "./CyberObservableCore";

/**
 * The Email Address Object represents a single email address.
 */
export type EmailAddr = (CyberObservableCore & {
    /**
   * The value of this property MUST be `email-addr`.
   */
    type?: 'email-addr';
    /**
   * Specifies a single email address. This MUST not include the display name.
   */
    value: string;
    /**
   * Specifies a single email display name, i.e., the name that is displayed to the human user of a mail application.
   */
    display_name?: string;
    /**
   * Specifies the user account that the email address belongs to, as a reference to a User Account Object.
   */
    belongs_to_ref?: string;
    [k: string]: any;
});