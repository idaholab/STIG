import { Timestamp } from "./Core";
import { CyberObservableCore } from "./CyberObservableCore";

/**
 * The Email Message Object represents an instance of an email message.
 */
export type EmailMessage = (CyberObservableCore & {
    /**
   * The value of this property MUST be `email-message`.
   */
    type?: 'email-message';
    date?: Timestamp;
    /**
   * Specifies the value of the 'Content-Type' header of the email message.
   */
    content_type?: string;
    /**
   * Specifies the value of the 'From:' header of the email message.
   */
    from_ref?: string;
    /**
   * Specifies the value of the 'From' field of the email message
   */
    sender_ref?: string;
    /**
   * Specifies the mailboxes that are 'To:' recipients of the email message
   */
    to_refs?: string[];
    /**
   * Specifies the mailboxes that are 'CC:' recipients of the email message
   */
    cc_refs?: string[];
    /**
   * Specifies the mailboxes that are 'BCC:' recipients of the email message.
   */
    bcc_refs?: string[];
    /**
   * Specifies the subject of the email message.
   */
    subject?: string;
    /**
   * Specifies one or more Received header fields that may be included in the email headers.
   */
    received_lines?: string[];
    /**
   * Specifies any other header fields found in the email message, as a dictionary.
   */
    additional_header_fields?: Record<string, any>;
    /**
   * Specifies the raw binary contents of the email message, including both the headers and body, as a reference to an Artifact Object.
   */
    raw_email_ref?: string;
    [k: string]: any;
});