"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongodb_1 = require("mongodb");
const AmbientContext_1 = tslib_1.__importDefault(require("./AmbientContext"));
const DatabaseReturnStatus_1 = tslib_1.__importDefault(require("../utils/DatabaseReturnStatus"));
class DatabaseService {
    constructor(url, database, collection) {
        this.dbUrl = url;
        this.dbName = database;
        this.colName = collection;
    }
    connect() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.client) {
                    AmbientContext_1.default.LoggerProvider.info('[ DTBS SVC ] Connecting to database instance.');
                    this.client = yield mongodb_1.MongoClient.connect(this.dbUrl, {
                        useNewUrlParser: true
                    });
                    AmbientContext_1.default.LoggerProvider.info(`[ DTBS SVC ] Connected to mongodb server.`);
                    this.database = this.client.db(this.dbName);
                    AmbientContext_1.default.LoggerProvider.info(`[ DTBS SVC ] Got database instance.`);
                    this.collection = this.database.collection(this.colName);
                    AmbientContext_1.default.LoggerProvider.info(`[ DTBS SVC ] Got collection instance.`);
                }
            }
            catch (error) {
                AmbientContext_1.default.LoggerProvider.crit(`[ DTBS SVC ] Unable to connect to mongodb. Reason:${error}`);
            }
        });
    }
    addAccount(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.client) {
                yield this.connect();
            }
            try {
                AmbientContext_1.default.LoggerProvider.info(`[ DTBS SVC ] Add account request for ${JSON.stringify(user)}`);
                const usernameQuery = yield this.collection.findOne({ username: user.username });
                if (usernameQuery) {
                    AmbientContext_1.default.LoggerProvider.info(`[ DTBS SVC ] Found account with same username ${JSON.stringify(usernameQuery)}`);
                    return DatabaseReturnStatus_1.default.UsernameTaken;
                }
                const emailQuery = yield this.collection.findOne({ email: user.email });
                if (emailQuery) {
                    AmbientContext_1.default.LoggerProvider.info(`[ DTBS SVC ] Found account with same email ${emailQuery.email}`);
                    return DatabaseReturnStatus_1.default.EmailTaken;
                }
                const insertResult = yield this.collection.insertOne(user);
                if (insertResult.insertedCount === 1) {
                    return DatabaseReturnStatus_1.default.Success;
                }
            }
            catch (generalError) {
                AmbientContext_1.default.LoggerProvider.error(`[ DTBS SVC ] There was a general error with the insert. ${generalError.message || generalError}`);
            }
            return DatabaseReturnStatus_1.default.Failure;
        });
    }
    updateAccount(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.client) {
                yield this.connect();
            }
            try {
                const replaceResult = yield this.collection.findOneAndReplace({ email: user.email }, user);
                if (replaceResult.ok) {
                    return DatabaseReturnStatus_1.default.Success;
                }
            }
            catch (generalError) {
                AmbientContext_1.default.LoggerProvider.error(`[ DTBS SVC ] There was a general error with the insert. ${generalError.message || generalError}`);
            }
            return DatabaseReturnStatus_1.default.Failure;
        });
    }
    getAccount(humanId, isEmail) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.client) {
                yield this.connect();
            }
            try {
                const filter = {};
                if (isEmail) {
                    filter.email = humanId;
                }
                else {
                    filter.username = humanId;
                }
                return (yield this.collection.findOne(filter));
            }
            catch (generalError) {
                AmbientContext_1.default.LoggerProvider.error(`[ DTBS SVC ] There was a general error with the insert. ${generalError.message || generalError}`);
                return null;
            }
        });
    }
    getAllAccounts() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.client) {
                yield this.connect();
            }
            try {
                const raw = yield this.collection.find({}).toArray();
                const accounts = [];
                for (const account of raw) {
                    if (account) {
                        accounts.push(account);
                    }
                    else {
                        AmbientContext_1.default.LoggerProvider.warn(`[ DTBS SVC ] Found an non AccountInfo entry while getting all accounts. ${JSON.stringify(account)}`);
                    }
                }
                return accounts;
            }
            catch (generalError) {
                AmbientContext_1.default.LoggerProvider.error(`[ DTBS SVC ] There was a general error with the insert. ${generalError.message || generalError}`);
                return null;
            }
        });
    }
}
exports.default = DatabaseService;
//# sourceMappingURL=DatabaseService.js.map