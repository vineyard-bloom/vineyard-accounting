import { AccountConfig, AccountingModel, GenericDeposit, GenericLedger, NewGenericLedger } from "./types";
import { LedgerManager } from "./ledger";
import { Address, NewAddress, SingleTransaction as Transaction } from "vineyard-blockchain";
export declare class AccountManager<Account, Deposit extends GenericDeposit, LedgerType> {
    model: AccountingModel<Account, Deposit, LedgerType>;
    accountConfig: AccountConfig;
    ledgerManager: LedgerManager<Account, Deposit, LedgerType>;
    constructor(model: AccountingModel<Account, Deposit, LedgerType>, accountConfig: AccountConfig);
    createDeposit<NewDeposit>(newDeposit: NewDeposit): Promise<Deposit>;
    createDepositFromTransaction<NewDeposit>(transaction: Transaction): Promise<Deposit>;
    createLedger(newLedger: NewGenericLedger<Account, LedgerType>): Promise<GenericLedger<Account, LedgerType>>;
    createAddress(address: NewAddress): Promise<Address>;
    getAccountByAddressString(externalAddress: string, currency: string): Promise<Account | undefined>;
    getAccountByAddressId(address: string): Promise<Account | undefined>;
    assignUnusedAddress(account: string, currency: string): Promise<Address | undefined>;
}
