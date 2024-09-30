import { StixRelationshipObject } from "@/types/stixTypes/StixRelationshipObject";
import * as uuid from 'uuid';

export function CreatedByRelationshipFactory(src_ref: string, tgt_ref: string, create_time: string, mod_time: string): StixRelationshipObject {
    const ret = {
        type: 'relationship',
        relationship_type: 'created-by',
        source_ref: src_ref,
        target_ref: tgt_ref,
        id: 'created-by--' + uuid.v4(),
        description: '',
        created: create_time,
        modified: mod_time,
        spec_version: "2.1"
    };
    return ret as StixRelationshipObject;
}