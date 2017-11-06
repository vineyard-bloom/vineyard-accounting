export interface Trellis {
  primary_keys?: string[]
  properties: any
}

export interface FullSchema {
  Transaction: Trellis
}

export function getFullAccountingSchema(): FullSchema {
  return require('./schema.json')
}