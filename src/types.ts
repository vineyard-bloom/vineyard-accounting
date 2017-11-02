import {BigNumber} from 'bignumber.js'
import {Collection, Modeler} from 'vineyard-ground'
import {Currency, Transaction} from "vineyard-blockchain"

export type Id = string

export type Identity<T> = Id

export interface NewLedger<Account, LedgerType> {
  account: Identity<Account>,
  mod: BigNumber
  name: string,
}

export interface Ledger<Account, LedgerType> extends NewLedger<Account, LedgerType> {
  id: Id
}

export interface NewDeposit {
  account: string
  transaction: Transaction
}

export interface Deposit extends NewDeposit {
  id: Id
}

export interface AccountingModel<Account, LedgerType> {
  Account: Collection<Account>
  Ledger: Collection<Ledger<Account, LedgerType>>
  ground: Modeler
}

export interface DepositField {
  name: string
  currency: Identity<Currency>
}

export interface AccountConfig {
  balanceField: string
  depositAddresses: DepositField[]
}

export interface DepositRate {
  from:string
  to:string
  deposit: Identity<Deposit>
}