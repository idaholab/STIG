import { Core, Identifier } from "./Core";

export type Asset = (Core & {
    type: 'asset';
    id: Identifier;
    name: string;
    description?: string;
    category?: string;
    kind_of_asset?: string;
    category_ext: string[];
    compromised?: boolean;
    owner_aware?: boolean;
    technical_characteristics?: Array<{ field: string; data: string }>;
});