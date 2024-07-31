import { Core, Identifier } from "./Core";

export type BundleType = {
    type: 'bundle' | 'Bundle';
    objects: Core[];
    metadata?: Array<{ id: Identifier; position: { x: number; y: number } }>;
}