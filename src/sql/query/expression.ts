import { HeightInfo } from "../heightInfo";
import { Hashable } from "./hashable";
import { Query } from "../query";

// === Expression ===

export enum ExpressionType {
    ASTERISK, COLUMN_REFERENCE, LITERAL, NOT, AGGREGATION, BINARY
}

/**
 * An expression.
 */
export abstract class Expression extends Hashable {
    readonly type: NonNullable<ExpressionType>;
    protected constructor(
        hash: number,
        hashMax: number,
        readonly height: HeightInfo
    ) { super(hash, hashMax); }

    public abstract equals(other: Expression, thisQuery: Query, otherQuery: Query): boolean;

    public abstract recursivelyReplace(
        multimap: (e: Expression, context: ExpressionContext) => Expression[], 
        context: ExpressionContext, 
        recursionDepth: number
    ): Expression[];
}

/**
 * A container for information about the context of the current expression.
 * Passed through recursivelyReplace(), which keeps track of the stack, into multimap().
 */
export class ExpressionContext {
    constructor(
        /** 
         * The stack of parent-expressions containing the current expression. 
         * (The top of the stack is the direct parent, the bottom is the root expression.)
         */
        readonly stack: Expression[],
        /**
         * The query containing the current expression (sub-)tree.
         * (Used for comparing and further information e.g., tables referenced in the FROM-clause.)
         */
        readonly query: Query,
        /** 
         * The maximum height the root of the current expression (sub-)tree is allowed to have 
         * after recursivelyReplace() replaces the current expression (sub-)tree 
         * with any of the results of multimap().
         * (Used to limit the height of an expression tree, so it does not grow infinitely.)
         */
        readonly maxHeight: HeightInfo,
    ) {}
}
