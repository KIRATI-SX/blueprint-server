"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const connectionPool = new pg_1.Pool({
    connectionString: process.env.CONNECTION_STRING,
});
exports.default = connectionPool;
//# sourceMappingURL=supabase.js.map