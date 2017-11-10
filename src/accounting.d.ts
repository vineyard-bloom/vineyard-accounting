import { AccountConfig, AccountingModel, GenericDeposit, GenericLedger, Identity, NewGenericLedger } from "./types";
import { LedgerManager } from "./ledger";
import { Address, NewAddress, SingleTransaction as Transaction, Currency } from "vineyard-blockchain";
export declare class AccountManager<Account, Deposit extends GenericDeposit, LedgerType> {
    model: AccountingModel<Account, Deposit, LedgerType>;
    accountConfig: AccountConfig;
    ledgerManager: LedgerManager<Account, Deposit, LedgerType>;
    constructor(model: AccountingModel<Account, Deposit, LedgerType>, accountConfig: AccountConfig);
    createDeposit<NewDeposit>(newDeposit: NewDeposit): Promise<Deposit>;
    createDepositFromTransaction<NewDeposit>(transaction: Transaction): Promise<Deposit>;
    createLedger(newLedger: NewGenericLedger<Account, LedgerType>): Promise<GenericLedger<Account, LedgerType>>;
    createAddress(address: NewAddress): Promise<Address>;
    createAccountAddress(account: Identity<Account>, externalAddress: string, currency: string): Promise<Address>;
    getAccountAddresses(account: Identity<Account>): Promise<Address[]>;
    getAccountAddressMap(account: Identity<Account>): Promise<{
        [id: string]: Address;
    }>;
    getAccountAddressByCurrency(account: Identity<Account>, currency: Identity<Currency>): Promise<Address[]>;
    getAccountByAddressString(externalAddress: string, currency: Identity<Currency>): Promise<Account | undefined>;
    readonly async: any;
    getAccountByAddressId(address: Identity<Address>): Promise<Account | undefined>;
    assignUnusedAddress(account: string, currency: Identity<Currency>): Promise<Address | undefined>;
}
