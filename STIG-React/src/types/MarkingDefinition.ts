import { Identifier, Timestamp } from "./Core";

export interface MarkingDefinition {
    type: 'marking definition';
    id: Identifier;
    created_by_ref?: Identifier;
    created: Timestamp;
    definition_type: 'statement';
    definition: {
        statement: string;
    };
}