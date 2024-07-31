import { Identifier, Timestamp } from "@/types/Core";
import { CreatedByRelationship } from "@/types/CreatedByRelationship";
import * as uuid from 'uuid';

export function CreatedByRelationshipFactory(src_ref: Identifier, tgt_ref: Identifier, ceate_time: Timestamp, mod_time: Timestamp): CreatedByRelationship {
    const ret = {
        type: 'relationship',
        relationship_type: 'created-by',
        source_ref: src_ref,
        target_ref: tgt_ref,
        id: 'created-by--' + uuid.v4(),
        description: '',
        created: ceate_time,
        modified: mod_time
    };
    return ret as CreatedByRelationship;
}