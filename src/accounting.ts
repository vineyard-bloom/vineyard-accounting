import {
  AccountConfig, AccountingModel, GenericDeposit, GenericLedger, HasId,
  NewGenericLedger
} from "./types";
import {LedgerManager} from "./ledger";

export class AccountManager<Account, Deposit extends GenericDeposit, LedgerType> {
  model: AccountingModel<Account, Deposit, LedgerType>
  accountConfig: AccountConfig
  ledgerManager: LedgerManager<Account, LedgerType>

  async createDeposit<Deposit extends GenericDeposit>(newDeposit: Deposit): Promise<Deposit> {
    return this.model.Deposit.create(newDeposit)
  }

  async createLedger(newLedger: NewGenericLedger<Account, LedgerType>): Promise<GenericLedger<Account, LedgerType>> {
    return this.ledgerManager.createLedger(newLedger)
  }

}