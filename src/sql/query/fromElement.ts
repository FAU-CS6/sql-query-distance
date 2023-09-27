import { Hashable } from "./hashable";
import { Query } from "../query";
import { Expression, ExpressionContext } from "./expression";
import { append } from "../../util";
import { HeightInfo } from "../heightInfo";

// === From ===

export enum JoinType {
    INNER, LEFT_OUTER, RIGHT_OUTER, FULL_OUTER
}

/**
 * An element of the FROM-clause.
 */
export class FromElement extends Hashable {
    readonly alias: string;
    constructor(
        readonly table: NonNullable<string>,
        readonly join: JoinType = null,
        readonly on: Expression = null,
        readonly as: string = null
    ) {
        super(((on ? on.hash : 0) * 2 + (as != null ? 1 : 0)) * 5 + (join != null ? join + 1 : 0), 
            (on ? on.hashMax : 1) * 2 * 5);
        this.alias = as || table;
    }

    public equals(other: FromElement, thisQuery: Query, otherQuery: Query): boolean {
        if (other === null || this.hash !== other.hash)
            return false;
        if (this.table !== other.table)
            return false;
        if (this.join !== other.join)
            return false;
        if (!((this.on === other.on) ||
            (this.on && this.on.equals(other.on, thisQuery, otherQuery))))
            return false;
        if ((this.as === null) != (other.as === null))
            return false;
        return true;
    }

    public setTable(table: NonNullable<string>): FromElement {
        return new FromElement(table, this.join, this.on, this.as);
    }
    public setJoin(join: JoinType): FromElement {
        return new FromElement(this.table, join, this.on, this.as);
    }
    public setOn(on: Expression): FromElement {
        return new FromElement(this.table, this.join, on, this.as);
    }
    public setAs(as: string): FromElement {
        return new FromElement(this.table, this.join, this.on, as);
    }

    public recursivelyReplaceOn(
        multimap: (e: Expression, context: ExpressionContext) => Expression[],
        recursionDepth: number, 
        query: Query,
        maxHeight: HeightInfo = null
    ): Expression[] {
        if(recursionDepth < 0) return [];

        const context = new ExpressionContext([], query, maxHeight);
        const res: Expression[] = [];
        append(res, multimap(this.on, context));
        if(this.on) {
            append(res, this.on.recursivelyReplace(multimap, context, recursionDepth - 1));
        }
        return res;
    }
}
