import {
  AccountConfig, AccountingModel, GenericDeposit, GenericLedger, HasId,
  NewGenericLedger
} from "./types";
import {LedgerManager} from "./ledger"
import {Address, NewAddress, ExternalTransaction, BaseTransaction, Transaction} from "vineyard-blockchain"

export class AccountManager<Account, Deposit extends GenericDeposit, LedgerType> {
  model: AccountingModel<Account, Deposit, LedgerType>
  accountConfig: AccountConfig
  ledgerManager: LedgerManager<Account, Deposit, LedgerType>

  constructor(model: AccountingModel<Account, Deposit, LedgerType>, accountConfig: AccountConfig) {
    this.model = model
    this.accountConfig = accountConfig
    this.ledgerManager = new LedgerManager<Account, Deposit, LedgerType>(model, this.accountConfig)
  }

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

  async getAccountByTransaction(transaction: BaseTransaction, currency: string): Promise<Account | undefined> {
    if (currency = "bitcoin") {
      return await this.model.Account.first({btcDepositAddress: transaction.to})
    }
    if (currency = "ethereum") {
      return await this.model.Account.first({ethDepositAddress: transaction.to})
    }
  }

  async assignUnusedAddress(account: string, currency: string): Promise<Address | undefined> {
    const sql = `
    UPDATE addresses
    SET account = :account
    WHERE id IN (
      SELECT id FROM addresses
      WHERE account IS NULL
      AND currency = :currency
      LIMIT 1
    )
  `
    return await this.model.ground.querySingle(sql, {
      account: account,
      currency: currency
    })
  }
}