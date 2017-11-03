import {
  AccountConfig, AccountingModel, GenericDeposit, GenericLedger, HasId,
  NewGenericLedger
} from "./types";
import {LedgerManager} from "./ledger"
import {Transaction} from "vineyard-blockchain"

export class AccountManager<Account, Deposit extends GenericDeposit, LedgerType> {
  model: AccountingModel<Account, Deposit, LedgerType>
  accountConfig: AccountConfig
  ledgerManager: LedgerManager<Account, LedgerType>

  async createDeposit<NewDeposit>(newDeposit: NewDeposit): Promise<Deposit> {
    return this.model.Deposit.create(newDeposit)
  }

  async createDepositFromTransaction<NewDeposit>(transaction: Transaction): Promise<Deposit> {
    return this.model.Deposit.create({id: transaction.id})
  }

  async createLedger(newLedger: NewGenericLedger<Account, LedgerType>): Promise<GenericLedger<Account, LedgerType>> {
    return this.ledgerManager.createLedger(newLedger)
  }

}