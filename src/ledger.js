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
class LedgerManager {
    constructor(model, accountConfig) {
        this.model = model;
        this.accountConfig = accountConfig;
    }
    addAmountToAccount(mod, account) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `
    UPDATE accounts
    SET balance = balance + :amount
    WHERE id = :account
  `;
            yield this.model.ground.querySingle(sql, {
                amount: mod,
                account: account
            });
        });
    }
    removeAmountFromAccount(mod, account) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `
    UPDATE accounts
    SET balance = balance - :amount
    WHERE id = :account
    AND balance >= :amount
  `;
            const res = yield this.model.ground.getLegacyDatabaseInterface().querySingle(sql, {
                replacements: {
                    amount: -mod,
                    account: account
                }
            });
            return res[1].rowCount === 1;
        });
    }
    modifyAccountBalance(account, mod) {
        return __awaiter(this, void 0, void 0, function* () {
            if (mod.greaterThanOrEqualTo(0)) {
                yield this.addAmountToAccount(mod, account);
                return true;
            }
            else {
                return yield this.removeAmountFromAccount(mod, account);
            }
        });
    }
    createLedger(newLedger) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.modifyAccountBalance(newLedger.account, newLedger.mod);
            return yield this.model.Ledger.create(newLedger);
        });
    }
}
//# sourceMappingURL=ledger.js.map