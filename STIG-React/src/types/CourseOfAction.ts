import { Core, Identifier } from "./Core";

/**
 * A Course of Action is an action taken either to prevent an attack or to respond to an attack that is in progress.
 */
export type CourseOfAction = (Core & {
    /**
   * The type of this object, which MUST be the literal `course-of-action`.
   */
    type?: 'course-of-action';
    id?: Identifier;
    /**
   * The name used to identify the Course of Action.
   */
    name?: string;
    /**
   * A description that provides more details and context about this object, potentially including its purpose and its key characteristics.
   */
    description?: string;
    [k: string]: any;
});