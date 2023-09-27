import { append } from "../../util";
import { HeightInfo } from "../heightInfo";
import { Query } from "../query";
import { Expression, ExpressionContext, ExpressionType } from "./expression";

// === Binary Expression ===

export enum OperatorType {
    EQUALS, AND, OR, LESS, GREATER
}

/**
 * A binary expression, combining two subexpressions with an operator.
 */
export class BinaryExpression extends Expression {
    readonly type = ExpressionType.BINARY;
    constructor(
        readonly operator: NonNullable<OperatorType>,
        readonly left: Expression = null,
        readonly right: Expression = null
    ) {
        super(((right ? right.hash : 0) * (left ? left.hashMax : 1) + (left ? left.hash : 0)) 
                * 5 + operator,
            (left ? left.hashMax : 1) * (right ? right.hashMax : 1) * 5,
            (left && right) ? 
                HeightInfo.max(HeightInfo.max(left.height.increase(), right.height.increase()), 
                    BinaryExpression.EMPTY_HEIGHT) : 
            (left || right) ? 
                HeightInfo.max((left?left:right).height.increase(), BinaryExpression.EMPTY_HEIGHT) 
            : BinaryExpression.EMPTY_HEIGHT
        );
    }
    public static readonly EMPTY_HEIGHT = new HeightInfo(-1, -1, -1, -1, 0);

    public equals(other: Expression, thisQuery: Query, otherQuery: Query): boolean {
        if (!BinaryExpression.isBinaryExpression(other) || this.hash !== other.hash)
            return false;
        if (this.operator !== other.operator)
            return false;
        if (!((this.left === other.left) ||
            (this.left && this.left.equals(other.left, thisQuery, otherQuery))))
            return false;
        if (!((this.right === other.right) ||
            (this.right && this.right.equals(other.right, thisQuery, otherQuery))))
            return false;
        return true;
    }

    public setOperator(operator: NonNullable<OperatorType>): BinaryExpression {
        return new BinaryExpression(operator, this.left, this.right);
    }
    public setLeft(left: Expression): BinaryExpression {
        return new BinaryExpression(this.operator, left, this.right);
    }
    public setRight(right: Expression): BinaryExpression {
        return new BinaryExpression(this.operator, this.left, right);
    }

    public recursivelyReplace(
        multimap: (e: Expression, context: ExpressionContext) => Expression[],
        context: ExpressionContext, 
        recursionDepth: number
    ): Expression[] {
        if (recursionDepth < 0) return [];

        context.stack.push(this);
        const res: Expression[] = [];
        append(res, multimap(this.left, context));
        if(this.left) {
            append(res, this.left.recursivelyReplace(multimap, context, recursionDepth - 1));
        }
        const left_length: number = res.length;
        // if(!(this.left == null && this.right == null)) {
        append(res, multimap(this.right, context));
        // }
        if(this.right) {
            append(res, this.right.recursivelyReplace(multimap, context, recursionDepth - 1));
        }
        const res_length: number = res.length;
        context.stack.pop();
        
        for (let i = 0; i < left_length; ++i)
            res[i] = this.setLeft(res[i]);
        for (let i = left_length; i < res_length; ++i)
            res[i] = this.setRight(res[i]);
        return res;
    }


    public static readonly baseBinaryExpressions: BinaryExpression[] = (() => {
        const res = [];
        for (let item in OperatorType)
            if (isNaN(Number(item)))
                res.push(new BinaryExpression(OperatorType[item] as any as OperatorType));
        return res;
    })();
    
    public static isBinaryExpression(expression: Expression): expression is BinaryExpression {
        return (expression !== null) && expression.type === ExpressionType.BINARY;
    }

    public static isBoolean(operator: OperatorType): boolean {
        switch (operator) {
        case OperatorType.AND:
        case OperatorType.OR:
        case OperatorType.EQUALS:
            return true;
        default:
            return false;
        }
    }
    public static isCommutative(operator: OperatorType): boolean {
        switch (operator) {
        case OperatorType.AND:
        case OperatorType.OR:
        case OperatorType.EQUALS:
            return true;
        default:
            return false;
        }
    }
    public static isAssiciative(operator: OperatorType): boolean {
        switch (operator) {
        case OperatorType.AND:
        case OperatorType.OR:
        case OperatorType.EQUALS:
            return true;
        default:
            return false;
        }
    }
    public static isDistributive(outer: OperatorType, inner: OperatorType): boolean {
        switch (outer) {
        case OperatorType.AND:
            return inner == OperatorType.OR;
        case OperatorType.OR:
            return inner == OperatorType.AND;
        default:
            return false;
        }
    }
}
