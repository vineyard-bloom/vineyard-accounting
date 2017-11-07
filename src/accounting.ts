import {
  AccountConfig, AccountingModel, GenericDeposit, GenericLedger, HasId,
  NewGenericLedger
} from "./types";
import {LedgerManager} from "./ledger"
import {Address, NewAddress, ExternalTransaction, Transaction} from "vineyard-blockchain"

export class AccountManager<Account, Deposit extends GenericDeposit, LedgerType> {
  model: AccountingModel<Account, Deposit, LedgerType>
  accountConfig: AccountConfig
  ledgerManager: LedgerManager<Account, Deposit, LedgerType>

  async createDeposit<NewDeposit>(newDeposit: NewDeposit): Promise<Deposit> {
    return this.model.Deposit.create(newDeposit)
  }

  async createDepositFromTransaction<NewDeposit>(transaction: Transaction): Promise<Deposit> {
    return this.model.Deposit.create({id: transaction.id})
  }

  async createLedger(newLedger: NewGenericLedger<Account, LedgerType>): Promise<GenericLedger<Account, LedgerType>> {
    return this.ledgerManager.createLedger(newLedger)
  }

  async createAddress(address: NewAddress): Promise<Address> {
    return this.model.Address.create(address)
  }

  async getAccountByTransaction(transaction: ExternalTransaction): Promise<Account | undefined> {
    return await this.model.Account.first({depositAddress: transaction.to}) 
  }

  async getUnusedAddress(currency: string): Promise<Address | undefined> {
    const sql = `SELECT * FROM addresses WHERE account IS NULL AND currency = :currency`
    return this.model.ground.querySingle(sql, {currency: currency})
  }
}