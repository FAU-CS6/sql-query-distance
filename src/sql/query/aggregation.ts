import { append } from "../../util";
import { HeightInfo } from "../heightInfo";
import { Query } from "../query";
import { Expression, ExpressionContext, ExpressionType } from "./expression";

// === Aggregation Function ===

export enum AggregationType {
    COUNT, SUM, AVG, MIN, MAX
}

/**
 * An aggregation function expression, containing a subexpression.
 */
export class AggregationFunction extends Expression {
    readonly type = ExpressionType.AGGREGATION;
    constructor(
        readonly aggregation: NonNullable<AggregationType>,
        readonly distinct: boolean = false,
        readonly argument: Expression = null
    ) {
        super(((argument ? argument.hash : 0) * 5 + aggregation) * 2 + (distinct ? 1 : 0),
            (argument ? argument.hashMax : 1) * 5 * 2,
            argument ? HeightInfo.max(argument.height.increase(), AggregationFunction.EMPTY_HEIGHT) 
                : AggregationFunction.EMPTY_HEIGHT
        );
    }
    public static readonly EMPTY_HEIGHT = new HeightInfo(-1, -1, -1, 0, -1);

    public equals(other: Expression, thisQuery: Query, otherQuery: Query): boolean {
        if (!AggregationFunction.isAggregationFunction(other) || this.hash !== other.hash)
            return false;
        if (this.aggregation !== other.aggregation)
            return false;
        if (!((this.argument === other.argument) ||
            (this.argument && this.argument.equals(other.argument, thisQuery, otherQuery))))
            return false;
        return true;
    }

    public setAggregation(aggregation: NonNullable<AggregationType>): AggregationFunction {
        return new AggregationFunction(aggregation, this.distinct, this.argument);
    }
    public setDistinct(distinct: boolean): AggregationFunction {
        return new AggregationFunction(this.aggregation, distinct, this.argument);
    }
    public setArgument(argument: Expression): AggregationFunction {
        return new AggregationFunction(this.aggregation, this.distinct, argument);
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


    public static isAggregationFunction(e: Expression): e is AggregationFunction {
        return (e !== null) && e.type === ExpressionType.AGGREGATION;
    }

    public static isDistinctValidFor(aggregation: AggregationType): boolean {
        switch(aggregation) {
        case AggregationType.COUNT:
            return true;
        default:
            return false;
        }
    }
}
