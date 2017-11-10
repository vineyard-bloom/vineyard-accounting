import {getFullAccountingSchema} from "../../src/schema";

require('source-map-support').install()
import {assert, expect} from 'chai'
import {DevModeler, SequelizeClient, DatabaseClient} from "vineyard-ground"
import {Address, getFullBlockchainSchema} from "vineyard-blockchain";
import {AccountManager} from "../../src/accounting";
import {AccountingModel, GenericDeposit} from "../../src/types";
import {BigNumber} from "bignumber.js"

const config = require('../config/config.json')

const databaseClient = new SequelizeClient(config.database)

const additionalSchema = {
  "Account": {
    "properties": {
      "balance": {
        "type": "colossal"
      }
    }
  }
}

async function createGeneralModel(client: DatabaseClient) {
  const modeler = new DevModeler(Object.assign({}, getFullAccountingSchema(), getFullBlockchainSchema(), additionalSchema), client)
  const model: any = modeler.collections
  model.ground = modeler

  await modeler.regenerate()

  return model
}

enum CurrencyType {
  btc = 'BTC00000-0000-0000-0000-000000000000',
  eth = 'ETH00000-0000-0000-0000-000000000000',
  usd = 'USD00000-0000-0000-0000-000000000000',
}

interface Account {
  id: string
  balance: BigNumber
}

enum LedgerType {
  deposit,
  bonus,
  taxes,
}

describe('accounting-test', function () {
  let server: any
  this.timeout(5000)

  after(function () {
  });

  it('assignUnusedAddress', async function () {
    const generalModel = await createGeneralModel(databaseClient) as AccountingModel<Account, GenericDeposit, LedgerType>
    const accountManager = new AccountManager(generalModel)
    const address = await accountManager.createAddress({
      address: "fake-address",
      currency: CurrencyType.btc,
    })

    const account = await generalModel.Account.create({})

    {
      const result: any = await accountManager.assignUnusedAddress(account.id, CurrencyType.eth)
      assert.isUndefined(result)
    }

    {
      const result: any = await accountManager.assignUnusedAddress(account.id, CurrencyType.btc)
      assert(result)
      assert.equal(result.id, address.id)
    }

    {
      const result: any = await accountManager.assignUnusedAddress(account.id, CurrencyType.btc)
      assert.isUndefined(result)
    }

  })

  it('createLedger', async function () {
    const generalModel = await createGeneralModel(databaseClient) as AccountingModel<Account, GenericDeposit, LedgerType>
    const accountManager = new AccountManager(generalModel)

    const account = await generalModel.Account.create({})

    const ledger: any = await accountManager.createLedger({
      account: account.id,
      mod: new BigNumber(15),
      description: "You got a bonus out of nowhere!",
      type: LedgerType.bonus
    })

    const mod: any = ledger.mod
    const balance: any = ledger.balance
    assert(mod.isBigNumber)
    assert(balance.isBigNumber)
    assert.equal(ledger.balance.toNumber(), 15)

    const tax = await accountManager.createLedger({
      account: account.id,
      mod: new BigNumber(-19),
      description: "The government is taking all of your money!",
      type: LedgerType.taxes
    })
    assert.isUndefined(tax)

  })
})
