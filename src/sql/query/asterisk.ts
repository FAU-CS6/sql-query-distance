import { Query } from "../query";
import { Expression, ExpressionContext, ExpressionType } from "./expression";
import { ColumnReference } from "./columnReference";
import { cyrb53 } from "../../util";

// === Asterisk ===

/**
 * An asterisk expression, optionally referencing a specific table.
 */
export class Asterisk extends Expression {
    readonly type = ExpressionType.ASTERISK;
    constructor(
        readonly table: string = null
    ) { 
        super(table !== null ? cyrb53(table) : 1, 3, ColumnReference.HEIGHT);
    }

    public equals(other: Expression, thisQuery: Query, otherQuery: Query): boolean {
        if (!Asterisk.isAsterisk(other) || this.hash !== other.hash)
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

    public setTable(table: string): Asterisk {
        return new Asterisk(table);
    }

    public recursivelyReplace(
        _multimap: (e: Expression, context: ExpressionContext) => Expression[],
        _context: ExpressionContext, 
        _recursionDepth: number
    ): Expression[] {
        return [];
    }


    public static readonly baseAsterisk: Asterisk = new Asterisk();

    public static isAsterisk(e: Expression): e is Asterisk {
        return (e !== null) && e.type === ExpressionType.ASTERISK;
    }
}
