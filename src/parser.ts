import * as NodeSQLParser from "node-sql-parser"
import { createDefaultConfig, Edit, EditSet } from "./config";
import * as SQL from "./sql";








// ========
//  SCHEMA
// ========

/**
 * Removes whitespace from a string.
 *
 * @param x the string to remove whitespace from.
 * @returns the string without whitespace
 */
export let clean = (x: string) => x.replace(/\s+/g, '');

/**
 * Parses the description of a schema.
 *
 * @param description the description of the schema
 * @returns the parsed schema
 * @throws an error if the description cannot be parsed into a schema
 */
export function parseSchema(description: string): SQL.Schema {
    function parseColumn(description: string): SQL.Column {
        // let primaryKey = false;
        // let foreignKey = false;
        // let foreignTable: string = null;
        let firstBracket = description.indexOf('[');
        if (firstBracket >= 0) {
            let lastBracket = description.lastIndexOf(']');
            if (lastBracket < 0)
                throw Error(`Missing closing bracket for opening bracket:\n${description}`);
            // foreignKey = true;
            // foreignTable = description.substring(firstBracket + 1, lastBracket);
            description = description.substring(0, firstBracket) +
                description.substring(lastBracket + 1, description.length);
        }
        if (description.charAt(0) == '_' && description.charAt(description.length - 1) == '_') {
            // primaryKey = true;
            description = description.substring(1, description.length - 1);
        }
        return {
            name: description,
            // datatype: SQL.DataType.VARCHAR,
            // not_null: primaryKey,
            // unique: primaryKey,
            // primary_key: primaryKey,
            // foreign_key: foreignKey,
            // foreign_table: foreignTable,
        };
    }

    function parseTable(description: string): SQL.Table {
        let firstBracket = description.indexOf('(');
        if (firstBracket < 0) throw Error(`Missing opening bracket in line:\n${description}`);
        else if (firstBracket < 1) throw Error(`Missing table name in line:\n${description}`);
        let lastBracket = description.lastIndexOf(')');
        if (lastBracket < 0) throw Error(`Missing closing bracket in line:\n${description}`);

        let name = description.substring(0, firstBracket);
        let columns = description.substring(firstBracket + 1, lastBracket)
                        .split(',').map(parseColumn);
        // if(columns.filter((x: SQL.Column) => x.primary_key).length == 0)
        //     throw Error(`Missing primaryKey for table ${name}`);
        return Object.assign(new Map(columns.map(x => [x.name, x])), {name: name});
    }

    let schema: SQL.Schema = new SQL.Schema();
    description.split('\n').map(clean).filter(x => x.length > 0).map(parseTable).forEach(
        (x: SQL.Table) => {
            if(schema.has(x.name))
                throw new Error(`Duplicate table name ${x.name} in schema.`);
            schema.set(x.name, x);
        }
    );
    // schema.forEach((table: SQL.Table) => table.forEach((column: SQL.Column) => {
    //     if(column.foreign_key && !schema.has(column.foreign_table))
    //         throw Error(`Table ${column.foreign_table} referenced by `+
    //             '${table.name}.${column.name} not found.');
    // }));
    return schema;
}








// =======
//  QUERY
// =======

const parser = new NodeSQLParser.Parser();

function isSelectAST(ast: NodeSQLParser.AST): ast is NodeSQLParser.Select {
    return ast.type === "select";
}

function isColumn(column: any | NodeSQLParser.Column): column is NodeSQLParser.Column {
    if(!("as" in column)) return false;
    if(!("expr" in column)) return false;
    return true;
}

function isFrom(from: NodeSQLParser.From | NodeSQLParser.Dual | any): from is NodeSQLParser.From {
    if(!("db" in from)) return false;
    if(!("table" in from)) return false;
    if(!("as" in from)) return false;
    return true;
}

function isJoin(from: NodeSQLParser.From | NodeSQLParser.Dual | any)
        : from is NodeSQLParser.From & {join: string, on: any} {
    if(!isFrom(from)) return false;
    if(!("join" in from)) return false;
    if(!("on" in from)) return false;
    return true;
}

function isColumnRef(expression: any | NodeSQLParser.ColumnRef)
        : expression is NodeSQLParser.ColumnRef {
    if(!("type" in expression)) return false;
    if(expression.type != "column_ref") return false;
    if(!("table" in expression)) return false;
    if(!("column" in expression)) return false;
    return true;
}




function parseJoinType(description: string): SQL.JoinType {
    switch (description) {
        case "INNER JOIN":
            return SQL.JoinType.INNER;
        case "LEFT JOIN":
            return SQL.JoinType.LEFT_OUTER;
        case "RIGHT JOIN":
            return SQL.JoinType.RIGHT_OUTER;
        case "FULL JOIN":
            return SQL.JoinType.FULL_OUTER;
        default:
            throw new Error(`Join type "${description}" cannot be parsed (yet).`);
    }
}

function stringifyJoinType(join: SQL.JoinType): string {
    switch (join) {
        case SQL.JoinType.INNER:
            return "INNER JOIN";
        case SQL.JoinType.LEFT_OUTER:
            return "LEFT JOIN";
        case SQL.JoinType.RIGHT_OUTER:
            return "RIGHT JOIN";
        case SQL.JoinType.FULL_OUTER:
            return "FULL JOIN";
        case null:
            return null;
        default:
            throw new Error(`Join type "${join}" could not be stringified.`);
    }
}

function parseAggregationType(description: string): SQL.AggregationType {
    switch (description) {
        case "COUNT":
            return SQL.AggregationType.COUNT;
        case "SUM":
            return SQL.AggregationType.SUM;
        case "AVG":
            return SQL.AggregationType.AVG;
        case "MIN":
            return SQL.AggregationType.MIN;
        case "MAX":
            return SQL.AggregationType.MAX;
        default:
            throw new Error(`Aggregation type "${description}" cannot be parsed (yet).`);
    }
}

function stringifyAggregationType(type: SQL.AggregationType): string {
    switch (type) {
        case SQL.AggregationType.COUNT:
            return "COUNT";
        case SQL.AggregationType.SUM:
            return "SUM";
        case SQL.AggregationType.AVG:
            return "AVG";
        case SQL.AggregationType.MIN:
            return "MIN";
        case SQL.AggregationType.MAX:
            return "MAX";
        default:
            throw new Error(`Aggregation type "${type}" could not be stringified.`);
    }
}

function parseOperatorType(description: string): SQL.OperatorType {
    switch (description) {
        case "=":
            return SQL.OperatorType.EQUALS;
        case "AND":
            return SQL.OperatorType.AND;
        case "OR":
            return SQL.OperatorType.OR;
        case "<":
            return SQL.OperatorType.LESS;
        case ">":
            return SQL.OperatorType.GREATER;
        default:
            throw new Error(`Operator type "${description}" cannot be parsed (yet).`);
    }
}

function stringifyOperatorType(type: SQL.OperatorType): string {
    switch (type) {
        case SQL.OperatorType.EQUALS:
            return "=";
        case SQL.OperatorType.AND:
            return "AND";
        case SQL.OperatorType.OR:
            return "OR";
        case SQL.OperatorType.LESS:
            return "<";
        case SQL.OperatorType.GREATER:
            return ">";
        default:
            throw new Error(`Operator type "${type}" could not be stringified.`);
    }
}

function parseExpression(expr: any): SQL.Expression {
    if(!expr) return null;
    if((!("type" in expr)) || !expr.type)
        throw new Error(`Expression ${JSON.stringify(expr)} cannot be parsed (yet).`);
    if(expr.type == "star") {
        return SQL.Asterisk.baseAsterisk;
    } else if(expr.type == "column_ref") {
        if(expr.column == "*")
            return new SQL.Asterisk(expr.table);
        return new SQL.ColumnReference(
            expr.column, expr.table
        );
    } else if(expr.type == "number" || expr.type == "string" || expr.type == "single_quote_string") {
        return new SQL.Literal(expr.value);
    } else if(expr.type == "aggr_func") {
        const aggregation: SQL.AggregationType = parseAggregationType(expr.name);
        return new SQL.AggregationFunction(
            aggregation,
            "distinct" in expr.args && expr.args.distinct != null,
            (expr.args.expr!=null && expr.args.expr.type=="star"
             && aggregation==SQL.AggregationType.COUNT) ?
                null : parseExpression(expr.args.expr)
        );
    } else if(expr.type == "binary_expr") {
        return new SQL.BinaryExpression(
            parseOperatorType(expr.operator),
            parseExpression(expr.left),
            parseExpression(expr.right)
        );
    } else if(expr.type == "unary_expr") {
        if(expr.operator == "NOT")
            return new SQL.Not(parseExpression(expr.expr));
        else throw new Error(`Operator type "${expr.operator}" cannot be parsed (yet).`);
    } else {
        throw new Error(`Expression type ${expr.type} cannot be parsed (yet).`);
    }
}

const emptyExpression: NodeSQLParser.ColumnRef = {type: "column_ref", table: null, column: "   "};
function stringifyExpression(e: SQL.Expression, avoidNull: boolean = true): any {
    if(!e) return avoidNull ? emptyExpression : null;
    if(SQL.Asterisk.isAsterisk(e)) {
        return {type: "column_ref", table: e.table, column: "*"};
    } else if(SQL.ColumnReference.isColumnReference(e)) {
        return {type: "column_ref", table: e.table, column: e.column};
    } else if(SQL.Literal.isLiteral(e)) {
        return {type: (typeof e.value == "number") ? "number" : "string", value: e.value}
    } else if(SQL.Not.isNot(e)) {
        return {type: "unary_expr", operator: "NOT", parentheses: true,
            expr: stringifyExpression(e.argument)};
    } else if(SQL.AggregationFunction.isAggregationFunction(e)) {
        return {type: "aggr_func", name: stringifyAggregationType(e.aggregation), args: {
            distinct: e.distinct?"DISTINCT":null,
            expr: (e.aggregation==SQL.AggregationType.COUNT && e.argument==null) ?
                {type: "star", value: "*"} : stringifyExpression(e.argument)}};
    } else if(SQL.BinaryExpression.isBinaryExpression(e)) {
        return {type: "binary_expr", operator: stringifyOperatorType(e.operator), parentheses:true,
            left: stringifyExpression(e.left), right: stringifyExpression(e.right)};
    } else {
        throw new Error(`Expression ${e} could not be stringified.`);
    }
}


/**
 * Parses the description of a query.
 *
 * @param description the description of the query
 * @returns the parsed query
 * @throws an error if the description cannot be parsed into a query
 */
export function parseQuery(description: string): SQL.Query {
    let ast = parser.astify(description);

    if(!ast) return null;

    if(Array.isArray(ast)) {
        if(ast.length > 1) {
            throw new Error(`Only one Query is allowed here, but ${ast.length} have been found.`);
        }
        ast = ast[0];
    }
    if(!isSelectAST(ast))
        throw new Error(`Query is not of type "select" but of type "${ast.type}",` +
            ` which cannot be processed (yet).`);

    if(ast.with != null)
        throw new Error(`Query has a "with"-clause, which cannot be processed (yet).`);

    if(ast.options != null)
        throw new Error(`Query has "options", which cannot be processed (yet).`);

    let selectElements: SQL.SelectElement[];
    if(ast.columns == '*') {
        selectElements = [new SQL.SelectElement(SQL.Asterisk.baseAsterisk)];
    } else {
        selectElements = new Array(ast.columns.length);
        for(let i=0; i<ast.columns.length; ++i) {
            let column = ast.columns[i];
            if(!isColumn(column)) throw new Error(`Column ${i+1} of query cannot be processed.`);
            selectElements[i] = new SQL.SelectElement(parseExpression(column.expr), column.as);
        }
    }

    const fromElements: SQL.FromElement[] = new Array(ast.from ? ast.from.length : 0);
    if(ast.from != null) {
        for(let i=0; i<ast.from.length; ++i) {
            let from = ast.from[i];
            if(!isFrom(from))
                throw new Error(`Element ${i+1} of the query's from clause is not a simple`
                    + ` table-reference (but probably a sub-query)`
                    + ` and therefore cannot be processed (yet).`);
            if("using" in from)
                throw new Error(`Element ${i+1} of the query's from clause contains "USING", ` +
                    `which cannot be processed (yet).`);
            fromElements[i] = new SQL.FromElement(
                from.table,
                isJoin(from) ? parseJoinType(from.join) : null,
                isJoin(from) ? parseExpression(from.on) : null,
                from.as
            );
        }
    }

    const groupbyElements: SQL.Expression[] = new Array(ast.groupby ? ast.groupby.length : 0);
    if(ast.groupby != null) {
        for(let i=0; i<ast.groupby.length; ++i) {
            groupbyElements[i] = isColumnRef(ast.groupby[i])
                ? new SQL.ColumnReference(ast.groupby[i].column, ast.groupby[i].table)
                : parseExpression(ast.groupby[i]);
        }
    }

    const orderbyElements: SQL.OrderBy[] = new Array(ast.orderby ? ast.orderby.length : 0);
    if(ast.orderby != null) {
        for(let i=0; i<ast.orderby.length; ++i) {
            orderbyElements[i] = new SQL.OrderBy(
                ast.orderby[i].type == "DESC",
                parseExpression(ast.orderby[i].expr)
            );
        }
    }
    if(ast.limit != null)
        throw new Error(`Query has a "limit"-clause, which cannot be processed (yet).`);

    if("union" in ast)
        throw new Error(`Query is in union with another query, which cannot be processed (yet).`);

    return new SQL.Query(
        ast.distinct == "DISTINCT",
        selectElements,
        fromElements,
        parseExpression(ast.where),
        groupbyElements,
        parseExpression(ast.having),
        orderbyElements
    );
}


/**
 * Stringifies a given query.
 *
 * @param query the query to stringify
 * @returns the stringified query
 */
export function stringifyQuery(query: SQL.Query): string {
    const ast: NodeSQLParser.Select = {
        with: null,
        type: "select",
        options: null,
        distinct: query.distinct ? "DISTINCT" : null,
        columns: query.selectLength==0 ? null
            : query.copySelect().map((x: SQL.SelectElement): NodeSQLParser.Column =>
            ({expr: stringifyExpression(x.expression) as NodeSQLParser.ColumnRef, as: x.as})),
        from: query.fromLength==0 ? null
            : query.copyFrom().map((x:SQL.FromElement): NodeSQLParser.From&{join:string, on:any} =>
            ({db: null, table: x.table, as: x.as, join: stringifyJoinType(x.join),
                on: stringifyExpression(x.on, false)})),
        where: stringifyExpression(query.where, false),
        groupby: query.groupbyLength==0 ? null
            : query.copyGroupby().map((x: SQL.Expression): NodeSQLParser.ColumnRef =>
            stringifyExpression(x)),
        having: stringifyExpression(query.having, false),
        orderby: query.orderbyLength==0 ? null
            : query.copyOrderby().map((x: SQL.OrderBy): NodeSQLParser.OrderBy =>
            ({type: x.descending?"DESC":"ASC", expr: stringifyExpression(x.expression)})),
        limit: null,
    }
    return parser.sqlify(ast).split('`').join('');
}


/**
 * Validates the syntax of a query description by trying to parse it.
 *
 * @param description the description to validate
 * @returns true if the description is syntactically correct
 * @throws an error if the description is not syntactically correct
 */
export function validateQuerySyntax(description: string): boolean {
    parseQuery(description);
    return true;
}


/**
 * Validates the syntax of a query description by trying to parse it
 * and then validates its semantics against a given schema description.
 * If no schema is specified, it is tried to deduce it from the query.
 *
 * @param description the description to validate
 * @param schemaDescription the description of the schema to validate against, optional
 * @returns true if the description is syntactically and semantically correct
 * @throws an error if the description is syntactically or semantically incorrect
 */
export function validateQuerySyntaxAndSemantics(description: string, schemaDescription: string)
    : boolean {
    const query = parseQuery(description);
    if(!query) throw new Error("The query description is empty.");
    const schema = schemaDescription && clean(schemaDescription) != ""
        ? parseSchema(schemaDescription)
        : SQL.Schema.deduceSchema(query);
    return query.validateSemantics(schema);
}








// ========
//  CONFIG
// ========

/**
 * Stringifies a given edit by stating its cost and description.
 *
 * @param edit the edit to stringify
 * @returns the stringified edit
 */
export function stringifyEdit(edit: Edit): string {
    return `Cost ${edit.cost}: ${edit.description}`;
}

/**
 * Parses the description of a cost configuration by setting the costs in a given set of edits.
 * If no set of edits is passed, [[`createDefaultConfig`]] is used instead.
 * Returns the given set of edits with the described costs.
 *
 * @param description the description of the cost configuration
 * @param config the set of edits to set the costs on, optional
 * @returns the given set of edits with the described costs
 */
export function parseConfig(description: string, config: EditSet = createDefaultConfig())
        : EditSet {
    if(!description || description == "") return config;
    for(let line of description.split('\n')) {
        if(!line.includes(':')) continue;
        let elements = line.split(':');
        let edit = clean(elements[0]);
        let cost = Number(elements[1]);
        if(!config.has(edit))
            throw new Error(`Edit "${edit}" could not be found in config.`);
        else if(isNaN(cost))
            throw new Error(`Cost ${elements[1]} of edit ${edit}` +
                ` could not be parsed into a number.`);
        config.get(edit).cost = cost;
    }
    return config;
}

/**
 * Stringifies the cost configuration of a given set of edits into a format parseable by [[`parseConfig`]].
 * If no set of edits is passed, [[`createDefaultConfig`]] is used instead.
 *
 * @param config the set of edits to stringify the costs of, optional
 * @returns the stringified cost configuration
 */
export function stringifyConfig(config: EditSet = createDefaultConfig()): string {
    return Array.from(config.values()).map(x => `${x.name}:${x.cost}`).join('\n');
}








// ==========
//  COMBINED
// ==========

/**
 * Stringifies the a distance and optionally also the edit-steps and/or queries of a shortest path.
 * The total distance is in the first line of the returned string.
 * If the distance is infinite, the result only says that the destination could not be reached.
 * If either the edit-steps or the path's queries are specified, they are listed below in order.
 * If both are specified, they are listed alternatingly, starting with a query.
 *
 * @param distance the distance to stringify
 * @param steps the edit-steps to stringify, optional
 * @param path the path's queries to stringify, optional
 * @returns the stringified distance, edit-steps and path's queries
 */
export function stringifyDistance(distance: number, steps: Edit[] = null, path: SQL.Query[] = null)
        : string {
    if(distance == Infinity)
        return `Destination could not be reached within the maximum distance.`;
    let result = `Total Distance: ${distance}\n`;
    let stringifySteps = steps != null, stringifyPath = path != null;
    if(stringifySteps || stringifyPath) {
        result += '\n';
        let editCount = stringifySteps ? steps.length : 0;
        let queryCount = stringifyPath ? path.length : 0;
        let combinedCount = Math.max(0, Math.min(editCount, queryCount - 1));
        for(let i=0; i<combinedCount; ++i) {
            if(stringifyPath)
                result += `\n\n${stringifyQuery(path[i])};`;
            if(stringifySteps)
                result += `\n\n>>> ${stringifyEdit(steps[i])}.`;
        }
        for(let i=combinedCount; i<editCount; ++i) {
            result += `\n\n>>> ${stringifyEdit(steps[i])}.`;
        }
        for(let i=combinedCount; i<queryCount; ++i) {
            result += `\n\n${stringifyQuery(path[i])};`;
        }
    }
    return result;
}
