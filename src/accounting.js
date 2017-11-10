"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ledger_1 = require("./ledger");
class AccountManager {
    constructor(model, accountConfig) {
        this.model = model;
        this.accountConfig = accountConfig;
        this.ledgerManager = new ledger_1.LedgerManager(model, this.accountConfig);
    }
    createDeposit(newDeposit) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.Deposit.create(newDeposit);
        });
    }
    createDepositFromTransaction(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.Deposit.create({ id: transaction.id });
        });
    }
    createLedger(newLedger) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.ledgerManager.createLedger(newLedger);
        });
    }
    createAddress(address) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.Address.create(address);
        });
    }
    createAccountAddress(account, externalAddress, currency) {
        return __awaiter(this, void 0, void 0, function* () {
            const address = yield this.model.Address.create({
                address: externalAddress,
                currency: currency,
            });
            yield this.model.Account_Address.create({
                account: account,
                address: address.id,
            });
            return address;
        });
    }
    getAccountByAddressString(externalAddress, currency) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `
    SELECT accounts.* FROM accounts
    JOIN accounts_addresses 
    ON accounts_addresses.account = accounts.id
    JOIN addresses ON accounts_addresses.address = address.id
    AND addresses.address = :address
    AND addresses.currency = :currency
    `;
            return yield this.model.ground.querySingle(sql, {
                address: externalAddress,
                currency: currency
            });
        });
    }
    getAccountByAddressId(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `
    SELECT accounts.* FROM accounts
    JOIN accounts_addresses 
    ON accounts_addresses.account = accounts.id
    AND accounts_addresses.address = :address
    `;
            return yield this.model.ground.querySingle(sql, {
                address: address
            });
        });
    }
    assignUnusedAddress(account, currency) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `
    INSERT INTO accounts_addresses (account, address
    FROM (SELECT 
    FROM addresses
    LEFT JOIN accounts_addresses
    ON accounts_addresses.address = addresses.id
    WHERE accounts_addresses.address IS NULL
    LIMIT 1
  `;
            return yield this.model.ground.querySingle(sql, {
                account: account,
                currency: currency
            });
        });
    }
}
exports.AccountManager = AccountManager;
//# sourceMappingURL=accounting.js.map