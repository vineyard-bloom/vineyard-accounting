import {BigNumber} from 'bignumber.js'
import {Collection, Modeler} from 'vineyard-ground'
import {Address, Currency, NewAddress, SingleTransaction as Transaction} from "vineyard-blockchain"

export type Id = string

export type Identity<T> = Id

export interface HasId {
  id: string
}

export interface AddressWithAccount {
  account: string | undefined
}

export type NewAccountAddress = NewAddress & AddressWithAccount

export type AccountAddress = Address & AddressWithAccount

export interface NewGenericLedger<Account, LedgerType> {
  id?: Id
  account: Identity<Account>,
  mod: BigNumber
  description: string,
  type: LedgerType
}

export interface GenericLedger<Account, LedgerType> extends NewGenericLedger<Account, LedgerType> {
  id: Id
  balance: BigNumber
}

export interface GenericNewDeposit {
  account: string
  transaction: Transaction
}

export interface GenericDeposit extends GenericNewDeposit {
  id: Id
}

export interface Account_Address {
  account: string
  address: Identity<Address>
}

export interface AccountingModel<Account, Deposit extends GenericDeposit, LedgerType> {
  Account: Collection<Account>
  Address: Collection<Address>
  Account_Address: Collection<Account_Address>
  Deposit: Collection<Deposit>
  Ledger: Collection<GenericLedger<Account, LedgerType>>
  ground: Modeler
}

export interface DepositField {
  name: string
  currency: Identity<Currency>
}

export interface AccountConfig {
  balanceField: string
}