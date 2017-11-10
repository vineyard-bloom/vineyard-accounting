import {getFullAccountingSchema} from "../../src/schema";

require('source-map-support').install()
import {assert, expect} from 'chai'
import {DevModeler, SequelizeClient, DatabaseClient} from "vineyard-ground"
import {getFullBlockchainSchema} from "vineyard-blockchain";
const config = require('../config/config.json')

const databaseClient = new SequelizeClient(config.database)

function createGeneralModel(client: DatabaseClient) {
  const modeler = new DevModeler(Object.assign({}, getFullAccountingSchema(), getFullBlockchainSchema()), client)
  const model: any = modeler.collections
  model.ground = modeler

  return model
}

describe('accounting-test', function () {
  let server: any
  this.timeout(5000)

  after(function () {
    // return server.stop()
  });

  it('login_success', async function () {
    // return local_request('get', 'ping')
    const generalModel = await createGeneralModel(databaseClient)

  })
})
