import {AccountConfig, AccountingModel, Ledger, NewLedger} from "./types";
import {BigNumber} from "bignumber.js"

class LedgerManager<Account, LedgerType> {
  model: AccountingModel<Account, LedgerType>
  accountConfig: AccountConfig

  constructor(model: AccountingModel<Account, LedgerType>, accountConfig: AccountConfig) {
    this.model = model;
    this.accountConfig = accountConfig;
  }

  private async addAmountToAccount(mod: BigNumber, account: string): Promise<void> {
    const sql = `
    UPDATE accounts
    SET balance = balance + :amount
    WHERE id = :account
  `

    await this.model.ground.querySingle(sql, {
      amount: mod,
      account: account
    })
  }

  private async removeAmountFromAccount(mod: BigNumber, account: string): Promise<boolean> {
    const sql = `
    UPDATE accounts
    SET balance = balance - :amount
    WHERE id = :account
    AND balance >= :amount
  `

    const res = await this.model.ground.getLegacyDatabaseInterface().querySingle(sql, {
      replacements: {
        amount: -mod,
        account: account
      }
    })

    return res[1].rowCount === 1
  }

  async modifyAccountBalance(account: string, mod: BigNumber): Promise<boolean> {
    if (mod.greaterThanOrEqualTo(0)) {
      await this.addAmountToAccount(mod, account)
      return true
    }
    else {
      return await this.removeAmountFromAccount(mod, account)
    }
  }

  async createLedger(newLedger: NewLedger<Account, LedgerType>): Promise<Ledger<Account, LedgerType>> {
    await this.modifyAccountBalance(newLedger.account, newLedger.mod);
    return await this.model.Ledger.create(newLedger)
  }
}