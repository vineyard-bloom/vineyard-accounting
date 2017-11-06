import { BigNumber } from 'bignumber.js';
import { Collection, Modeler } from 'vineyard-ground';
import { Address, Currency, NewAddress, Transaction } from "vineyard-blockchain";
export declare type Id = string;
export declare type Identity<T> = Id;
export interface HasId {
    id: string;
}
export interface AddressWithAccount {
    account: string | undefined;
}
export declare type NewAccountAddress = NewAddress & AddressWithAccount;
export declare type AccountAddress = Address & AddressWithAccount;
export interface NewGenericLedger<Account, LedgerType> {
    account: Identity<Account>;
    mod: BigNumber;
    description: string;
    type: LedgerType;
}
export interface GenericLedger<Account, LedgerType> extends NewGenericLedger<Account, LedgerType> {
    id: Id;
    balance: BigNumber;
}
export interface GenericNewDeposit {
    account: string;
    transaction: Transaction;
}
export interface GenericDeposit extends GenericNewDeposit {
    id: Id;
}
export interface AccountingModel<Account, Deposit extends GenericDeposit, LedgerType> {
    Account: Collection<Account>;
    Address: Collection<Address>;
    Deposit: Collection<Deposit>;
    Ledger: Collection<GenericLedger<Account, LedgerType>>;
    ground: Modeler;
}
export interface DepositField {
    name: string;
    currency: Identity<Currency>;
}
export interface AccountConfig {
    balanceField: string;
    depositAddresses: DepositField[];
}
