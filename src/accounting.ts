import {
  AccountConfig, AccountingModel, GenericDeposit, GenericLedger, HasId,
  NewGenericLedger
} from "./types";
import {LedgerManager} from "./ledger"
import {
  Address, NewAddress, ExternalSingleTransaction as ExternalTransaction, BaseTransaction,
  SingleTransaction as Transaction, NewSingleTransaction
} from "vineyard-blockchain"

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

  async getAccountByAddressString(externalAddress: string, currency: string): Promise<Account | undefined> {
    const sql = `
    SELECT accounts.* FROM accounts
    JOIN accounts_addresses 
    ON accounts_addresses.account = accounts.id
    JOIN addresses ON accounts_addresses.address = address.id
    AND addresses.address = :address
    AND addresses.currency = :currency
    `
    return await this.model.ground.querySingle(sql, {
      address: externalAddress,
      currency: currency
    })
  }

  async getAccountByAddressId(address: string): Promise<Account | undefined> {
    const sql = `
    SELECT accounts.* FROM accounts
    JOIN accounts_addresses 
    ON accounts_addresses.account = accounts.id
    AND accounts_addresses.address = :address
    `
    return await this.model.ground.querySingle(sql, {
      address: address
    })
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