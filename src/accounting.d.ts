import { AccountConfig, AccountingModel, GenericDeposit, GenericLedger, NewGenericLedger } from "./types";
import { LedgerManager } from "./ledger";
import { Transaction } from "vineyard-blockchain";
export declare class AccountManager<Account, Deposit extends GenericDeposit, LedgerType> {
    model: AccountingModel<Account, Deposit, LedgerType>;
    accountConfig: AccountConfig;
    ledgerManager: LedgerManager<Account, LedgerType>;
    createDeposit<NewDeposit>(newDeposit: NewDeposit): Promise<Deposit>;
    createDepositFromTransaction<NewDeposit>(transaction: Transaction): Promise<Deposit>;
    createLedger(newLedger: NewGenericLedger<Account, LedgerType>): Promise<GenericLedger<Account, LedgerType>>;
}
