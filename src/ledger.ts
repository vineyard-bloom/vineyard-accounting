import {AccountConfig, AccountingModel, GenericDeposit, GenericLedger, NewGenericLedger} from "./types";
import {BigNumber} from "bignumber.js"

export class LedgerManager<Account, Deposit extends GenericDeposit, LedgerType> {
  model: AccountingModel<Account, Deposit, LedgerType>
  accountConfig: AccountConfig

  constructor(model: AccountingModel<Account, Deposit, LedgerType>, accountConfig: AccountConfig) {
    this.model = model;
    this.accountConfig = accountConfig;
  }

  private async addAmountToAccount(mod: BigNumber, account: string): Promise<number> {
    const sql = `
    UPDATE accounts
    SET balance = balance + :amount
    WHERE id = :account
    RETURNING *
  `

    const result = await this.model.ground.querySingle(sql, {
      amount: mod,
      account: account
    })

    return result.balance
  }

  private async removeAmountFromAccount(mod: BigNumber, account: string): Promise<number | undefined> {
    const sql = `
    UPDATE accounts
    SET balance = balance - :amount
    WHERE id = :account
    AND balance >= :amount
    RETURNING *
  `

    const result = await this.model.ground.querySingle(sql, {
      amount: -mod,
      account: account
    })

    return result
      ? result.balance
      : undefined
  }

  async modifyAccountBalance(account: string, mod: BigNumber): Promise<number | undefined> {
    if (mod.greaterThanOrEqualTo(0)) {
      return await this.addAmountToAccount(mod, account)
    }
    else {
      return await this.removeAmountFromAccount(mod, account)
    }
  }

  async createLedger(newLedger: NewGenericLedger<Account, LedgerType>): Promise<GenericLedger<Account, LedgerType>> {
    const balance = await this.modifyAccountBalance(newLedger.account, newLedger.mod);
    const seed = Object.assign({
      balance: balance
    }, newLedger)
    return await this.model.Ledger.create(seed)
  }
}