/*
Copyright 2018 Southern California Edison Company

ALL RIGHTS RESERVED
*/

import { SDO, SRO } from '../stix';

export type Rid = string;

export interface HTTPCommandQuery {
  command: string
  mode?: string
  parameters: string[]
}

export interface QueryResultRecord {
  '@type'?: string
  '@rid'?: string
  '@version'?: number
  '@class'?: string
  '@fieldTypes'?: string
}

export interface GraphQueryResult {
  graph: {
    vertices: SDO[]
    edges: SRO[]
  }
}
export interface OrientErrorMessage {
  errors: OrientError[]
}
export interface OrientError {
  code: number
  reason: number
  content: string
}
