import { cyrb53 } from "../../util";
import { HeightInfo } from "../heightInfo";
import { Query } from "../query";
import { Expression, ExpressionContext, ExpressionType } from "./expression";

// === Column Reference ===

/**
 * A column-reference expression, referencing the name of a column and optionally its table.
 */
export class ColumnReference extends Expression {
    readonly type = ExpressionType.COLUMN_REFERENCE;
    constructor(
        readonly column: NonNullable<string>,
        readonly table: string = null
    ) { 
        super(cyrb53(column) + (table !== null ? 2 : 1), 3, ColumnReference.HEIGHT);
    }
    public static readonly HEIGHT = new HeightInfo(0, -1, -1, -1, -1);

    public equals(other: Expression, thisQuery: Query, otherQuery: Query): boolean {
        if (!ColumnReference.isColumnReference(other) || this.hash !== other.hash)
            return false;
        if (this.column !== other.column)
            return false;
        if (!thisQuery || !otherQuery)
            return false;
        for (let f = 0, fl = Math.max(thisQuery.fromLength, otherQuery.fromLength); f < fl; ++f) {
            if ((f < thisQuery.fromLength && this.table === thisQuery.getFrom(f).alias) !==
                (f < otherQuery.fromLength && other.table === otherQuery.getFrom(f).alias))
                return false;
        }
        return true;
    }

    public setColumn(column: string): ColumnReference {
        return new ColumnReference(column, this.table);
    }
    public setTable(table: string): ColumnReference {
        return new ColumnReference(this.column, table);
    }

    public recursivelyReplace(
        _multimap: (e: Expression, context: ExpressionContext) => Expression[],
        _context: ExpressionContext, 
        _recursionDepth: number
    ): Expression[] {
        return [];
    }


    public static isColumnReference(e: Expression): e is ColumnReference {
        return (e !== null) && e.type === ExpressionType.COLUMN_REFERENCE;
    }
}
