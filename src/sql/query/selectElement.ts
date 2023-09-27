import { Hashable } from "./hashable";
import { Query } from "../query";
import { Expression, ExpressionContext } from "./expression";
import { append } from "../../util";
import { HeightInfo } from "../heightInfo";

// === Select ===

/**
 * An element of the SELECT-clause.
 */
export class SelectElement extends Hashable {
    constructor(
        readonly expression: Expression = null,
        readonly as: string = null
    ) {
        super((expression ? expression.hash : 0) * 2 + (as != null ? 1 : 0),
            (expression ? expression.hashMax : 1) * 2);
    }

    public equals(other: SelectElement, thisQuery: Query, otherQuery: Query): boolean {
        if (other === null || this.hash !== other.hash)
            return false;
        if (!((this.expression === other.expression) ||
            (this.expression && this.expression.equals(other.expression, thisQuery, otherQuery))))
            return false;
        return true;
    }

    public setExpression(expression: Expression): SelectElement {
        return new SelectElement(expression, this.as);
    }
    public setAs(as: string): SelectElement {
        return new SelectElement(this.expression, as);
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
}
