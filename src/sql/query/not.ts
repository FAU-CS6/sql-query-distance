import { append } from "../../util";
import { HeightInfo } from "../heightInfo";
import { Query } from "../query";
import { Expression, ExpressionContext, ExpressionType } from "./expression";

// === Not ===

/**
 * A logical negation expression, containing a subexpression.
 */
export class Not extends Expression {
    readonly type = ExpressionType.NOT;
    constructor(
        readonly argument: Expression = null
    ) {
        super((argument ? argument.hash : 0) * 2 + 1, (argument ? argument.hashMax : 1) * 2, 
            argument ? HeightInfo.max(argument.height.increase(), Not.EMPTY_HEIGHT) 
                : Not.EMPTY_HEIGHT
        );
    }
    public static readonly EMPTY_HEIGHT = new HeightInfo(-1, -1, 0, -1, -1);

    public equals(other: Expression, thisQuery: Query, otherQuery: Query): boolean {
        if (!Not.isNot(other) || this.hash !== other.hash)
            return false;
        if (!((this.argument === other.argument) ||
            (this.argument && this.argument.equals(other.argument, thisQuery, otherQuery))))
            return false;
        return true;
    }

    public setArgument(argument: Expression): Not {
        return new Not(argument);
    }

    public recursivelyReplace(
        multimap: (e: Expression, context: ExpressionContext) => Expression[],
        context: ExpressionContext, 
        recursionDepth: number
    ): Expression[] {
        if (recursionDepth < 0) return [];

        context.stack.push(this);
        const res: Expression[] = [];
        append(res, multimap(this.argument, context));
        if(this.argument) {
            append(res, this.argument.recursivelyReplace(multimap, context, recursionDepth - 1));
        }
        context.stack.pop();

        for (let i = 0; i < res.length; ++i)
            res[i] = this.setArgument(res[i]);
        return res;
    }


    public static readonly baseNot = new Not();

    public static isNot(e: Expression): e is Not {
        return (e !== null) && e.type === ExpressionType.NOT;
    }
}
