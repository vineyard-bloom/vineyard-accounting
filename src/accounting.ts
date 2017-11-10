import {
  AccountConfig, AccountingModel, GenericDeposit, GenericLedger, HasId, Identity,
  NewGenericLedger
} from "./types";
import {LedgerManager} from "./ledger"
import {
  Address, NewAddress, ExternalSingleTransaction as ExternalTransaction, BaseTransaction,
  SingleTransaction as Transaction, NewSingleTransaction, Currency
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

  async createAccountAddress(account: Identity<Account>, externalAddress: string, currency: string): Promise<Address> {
    const address = await this.model.Address.create({
      address: externalAddress,
      currency: currency,
    })

    await this.model.Account_Address.create({
      account: account,
      address: address.id,
    })

    return address
  }

  async getAccountAddresses(account: Identity<Account>): Promise<Address[]> {
    const sql = `
    SELECT addresses.*
    JOIN accounts_addresses 
    ON accounts_addresses.account = :account
    AND accounts_addresses.address = addresses.id
    `

    return await this.model.ground.query(sql, {
      account: account,
    })
  }

  async getAccountAddressMap(account: Identity<Account>): Promise<{ [id: string]: Address }> {
    const addresses = await this.getAccountAddresses(account)
    const result: { [id: string]: Address } = {}
    for (let address of addresses) {
      result[address.currency] = address
    }
    return result
  }

  async getAccountAddressByCurrency(account: Identity<Account>, currency: Identity<Currency>): Promise<Address[]> {
    const sql = `
    SELECT addresses.*
    JOIN accounts_addresses 
    ON accounts_addresses.account = :account
    AND accounts_addresses.address = addresses.id
    WHERE addresses.currency = :currency
    LIMIT 1
    `

    return await this.model.ground.querySingle(sql, {
      account: account,
      currency: currency
    })
  }

  async getAccountByAddressString(externalAddress: string, currency: Identity<Currency>): Promise<Account | undefined> {
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

  async get async

  getAccountByAddressId(address: Identity<Address>): Promise<Account | undefined> {
    const sql = `
    SELECT accounts.* FROM accounts
    JOIN accounts_addresses 
    ON accounts_addresses.account = accounts.id
    AND accounts_addresses.address = :address
    `
    return await
    this.model.ground.querySingle(sql, {
      address: address
    })
  }

  async assignUnusedAddress(account: string, currency: Identity<Currency>): Promise<Address | undefined> {
    const sql = `
    INSERT INTO accounts_addresses (account, address
    FROM (SELECT 
    FROM addresses
    LEFT JOIN accounts_addresses
    ON accounts_addresses.address = addresses.id
    WHERE accounts_addresses.address IS NULL
    LIMIT 1
  `
    return await this.model.ground.querySingle(sql, {
      account: account,
      currency: currency
    })
  }
}