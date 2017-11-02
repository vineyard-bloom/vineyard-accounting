import { AccountConfig, AccountingModel, GenericLedger, NewGenericLedger } from "./types";
import { BigNumber } from "bignumber.js";
export declare class LedgerManager<Account, LedgerType> {
    model: AccountingModel<Account, LedgerType>;
    accountConfig: AccountConfig;
    constructor(model: AccountingModel<Account, LedgerType>, accountConfig: AccountConfig);
    private addAmountToAccount(mod, account);
    private removeAmountFromAccount(mod, account);
    modifyAccountBalance(account: string, mod: BigNumber): Promise<boolean>;
    createLedger(newLedger: NewGenericLedger<Account, LedgerType>): Promise<GenericLedger<Account, LedgerType>>;
}
