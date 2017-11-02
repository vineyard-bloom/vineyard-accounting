import { AccountConfig, AccountingModel, GenericDeposit, GenericLedger, NewGenericLedger } from "./types";
import { LedgerManager } from "./ledger";
export declare class AccountManager<Account, Deposit extends GenericDeposit, LedgerType> {
    model: AccountingModel<Account, Deposit, LedgerType>;
    accountConfig: AccountConfig;
    ledgerManager: LedgerManager<Account, LedgerType>;
    createDeposit<Deposit extends GenericDeposit>(newDeposit: Deposit): Promise<Deposit>;
    createLedger(newLedger: NewGenericLedger<Account, LedgerType>): Promise<GenericLedger<Account, LedgerType>>;
}
