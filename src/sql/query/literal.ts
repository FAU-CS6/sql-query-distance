import { cyrb53 } from "../../util";
import { HeightInfo } from "../heightInfo";
import { Query } from "../query";
import { Expression, ExpressionContext, ExpressionType } from "./expression";

// === Literal Value ===

/**
 * A literal expression, consisting of a string or number value.
 */
export class Literal extends Expression {
    readonly type = ExpressionType.LITERAL;
    constructor(
        readonly value: NonNullable<number|string>
    ) { 
        super(typeof value == "string" ? cyrb53(value) : value, 2, Literal.HEIGHT);
    }
    public static readonly HEIGHT = new HeightInfo(-1, 0, -1, -1, -1);

    public equals(other: Expression, thisQuery: Query, otherQuery: Query): boolean {
        if (!Literal.isLiteral(other) || this.hash !== other.hash)
            return false;
        if (this.value !== other.value)
            return false;
        return true;
    }

    public setValue(value: number|string): Literal {
        return new Literal(value);
    }

    public recursivelyReplace(
        _multimap: (e: Expression, context: ExpressionContext) => Expression[],
        _context: ExpressionContext, 
        _recursionDepth: number
    ): Expression[] {
        return [];
    }


    public static isLiteral(e: Expression): e is Literal {
        return (e !== null) && e.type === ExpressionType.LITERAL;
    }
}
