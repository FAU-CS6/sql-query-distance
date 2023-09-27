import { Hashable } from "./hashable";
import { Query } from "../query";
import { Expression, ExpressionContext } from "./expression";
import { append } from "../../util";
import { HeightInfo } from "../heightInfo";

// === Order By ===

/**
 * An element of the ORDER-BY-clause.
 */
export class OrderBy extends Hashable {
    constructor(
        readonly descending: NonNullable<boolean> = false,
        readonly expression: Expression = null
    ) {
        super((expression ? expression.hash : 0) * 2 + (descending ? 1 : 0),
            (expression ? expression.hashMax : 1) * 2);
    }

    public equals(other: OrderBy, thisQuery: Query, otherQuery: Query): boolean {
        if (other === null || this.hash !== other.hash)
            return false;
        if (this.descending !== other.descending)
            return false;
        if (!((this.expression === other.expression) ||
            (this.expression && this.expression.equals(other.expression, thisQuery, otherQuery))))
            return false;
        return true;
    }

    public setDescending(descending: NonNullable<boolean>): OrderBy {
        return new OrderBy(descending, this.expression);
    }
    public setExpression(expression: Expression): OrderBy {
        return new OrderBy(this.descending, expression);
    }

    public recursivelyReplaceExpression(
        multimap: (e: Expression, context: ExpressionContext) => Expression[], 
        recursionDepth: number, 
        query: Query,
        maxHeight: HeightInfo = null
    ): Expression[] {
        if(recursionDepth < 0) return [];
        
        const context = new ExpressionContext([], query, maxHeight);
        const res: Expression[] = [];
        append(res, multimap(this.expression, context));
        if(this.expression) {
            append(res, this.expression.recursivelyReplace(multimap, context, recursionDepth - 1));
        }
        return res;
    }


    public static readonly baseOrderBy: OrderBy = new OrderBy();
}
