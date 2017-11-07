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
    getAccountByTransaction(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.Account.first({ depositAddress: transaction.to });
        });
    }
    getUnusedAddress(currency) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT * FROM addresses WHERE account IS NULL AND currency = :currency`;
            return this.model.ground.querySingle(sql, { currency: currency });
        });
    }
}
exports.AccountManager = AccountManager;
//# sourceMappingURL=accounting.js.map