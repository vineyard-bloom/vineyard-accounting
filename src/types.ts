import {BigNumber} from 'bignumber.js'
import {Collection, Modeler} from 'vineyard-ground'
import {Currency, Transaction} from "vineyard-blockchain"

export type Id = string

export type Identity<T> = Id

export interface NewGenericLedger<Account, LedgerType> {
  account: Identity<Account>,
  mod: BigNumber
  name: string,
}

export interface GenericLedger<Account, LedgerType> extends NewGenericLedger<Account, LedgerType> {
  id: Id
  balance: BigNumber
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
  Ledger: Collection<GenericLedger<Account, LedgerType>>
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