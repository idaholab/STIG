import { StixObject } from '@/types/stixTypes/StixObject';
import { StixRelationshipObject } from '@/types/stixTypes/StixRelationshipObject';

export function isRelationship(item: StixObject): item is StixRelationshipObject {
  return typeof item.type === 'string' && item.type.toLocaleLowerCase() === 'relationship';
}
