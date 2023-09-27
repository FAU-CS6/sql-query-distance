// ====================
//  Node Module Export
// ====================

// Databse Schema, Meta-Info, and Query AST
export * from "./sql";
// Atomic, Horizontal, and Shortcut Edits
export * from "./config";
// Custom Shortest Path Algorithm
export * from "./sqlQueryDistance";
// Input & Output utilities
export * from "./parser";

/* Example Usage:
const SQLQueryDistance = require('./dist/index');

SQLQueryDistance.parseAndCalculateDistance(
    "SELECT * FROM students"
).then((res) => {
    console.log(SQLQueryDistance.stringifyDistance(...res));
});
*/



// ================
//  Browser Export
// ================

// Databse Schema, Meta-Info, and Query AST
import * as SQL from "./sql";
// Atomic, Horizontal, and Shortcut Edits
import * as Config from "./config";
// Custom Shortest Path Algorithm
import * as Distance from "./sqlQueryDistance";
// Input & Output utilities
import * as Parser from "./parser";

if (global && global.window) {
    global.window.SQLQueryDistance =
        Object.assign({}, SQL, Config, Distance, Parser);
}

/* Example Usage:
SQLQueryDistance.parseAndCalculateDistance(
    "SELECT * FROM students"
).then((res) => {
    console.log(SQLQueryDistance.stringifyDistance(...res));
});
*/
