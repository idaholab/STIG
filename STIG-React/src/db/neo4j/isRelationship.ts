import { StixObject } from "@/types/stixTypes/StixObject";
import { StixRelationshipObject } from "@/types/stixTypes/StixRelationshipObject";

export function isRelationship(item: StixObject): item is StixRelationshipObject {
    return item.type.toLocaleLowerCase() === 'relationship';
}