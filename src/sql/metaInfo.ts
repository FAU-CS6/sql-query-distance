import { HeightInfo } from "./heightInfo";
import { Query, ColumnReference, AggregationFunction, Asterisk, Literal, 
    Expression, ExpressionContext } from "./query";
import { Schema } from "./schema";

// ===========
//  META INFO
// ===========

/**
 * A meta-info, containing certain information about the destination.
 * Required by edits in order to ensure termination and for optimization.
 */
export class MetaInfo {
    readonly distinct: boolean;
    readonly select: SelectMetaInfo;
    readonly from: FromMetaInfo;
    readonly where: WhereMetaInfo;
    readonly groupby: GroupByMetaInfo;
    readonly having: HavingMetaInfo;
    readonly orderby: OrderByMetaInfo;

    constructor(query: Query, schema: Schema) {
        this.distinct = query.distinct;
        this.select = new SelectMetaInfo(query, schema);
        this.from = new FromMetaInfo(query);
        this.where = new WhereMetaInfo(query);
        this.groupby = new GroupByMetaInfo(query);
        this.having = new HavingMetaInfo(query);
        this.orderby = new OrderByMetaInfo(query);
    }
}


export class SelectMetaInfo extends HeightInfo {
    readonly length: number;
    readonly asterisk: boolean;
    readonly columns: ColumnReference[];
    readonly literals: Literal[];
    readonly aggregations: AggregationFunction[];
    readonly as: string[];

    constructor(query: Query, schema: Schema) {
        let maxHeights = HeightInfo.EMPTY;
        let length = query.selectLength;
        let columns = new Array<ColumnReference>();
        let literals = new Array<Literal>();
        let aggregations = new Array<AggregationFunction>();
        let asterisks = new Array<Asterisk>();
        let as = new Array<string>();

        for (let s = 0; s < query.selectLength; ++s) {
            const se = query.getSelect(s);
            if(se.expression) maxHeights = HeightInfo.max(maxHeights, se.expression.height);
            se.recursivelyReplaceExpression(
                collect(query, columns, literals, aggregations, asterisks), Infinity, query);
            if (se.as != null && !containsPrimitive(as, se.as)) as.push(se.as);
        }

        for(let a = 0, n = asterisks.length; a < n; ++a) {
            const as = asterisks[a];
            if (as.table == null) {
                if (query.groupbyLength > 0) {
                    length += query.groupbyLength - 1;
                    for (let g = 0; g < query.groupbyLength; ++g) {
                        // const gb = query.getGroupby(g);
                        // if(!containsExpression(columns, gb, query)) columns.push(gb);
                        query.recursivelyReplaceGroupby(g, 
                            collect(query, columns, literals, aggregations, null), Infinity);
                    }
                } else {
                    for (let f = 0; f < query.fromLength; ++f) {
                        const table = schema.get(query.getFrom(f).table);
                        if(!table) continue;
                        length += table.size;
                        for (let [c] of table) {
                            const cr = new ColumnReference(c);
                            if(!containsExpression(columns, cr, query)) columns.push(cr);
                        }
                    }
                    --length;
                }
            } else {
                let t = as.table;
                for(let f=0; f<query.fromLength; ++f) {
                    const fe = query.getFrom(f);
                    if(fe.alias == t) {
                        t = fe.table;
                        break;
                    }
                }
                const table = schema.get(t);
                if(!table) continue;
                length += table.size - 1;
                for (let [c] of table) {
                    const cr = new ColumnReference(c);
                    if(!containsExpression(columns, cr, query)) columns.push(cr);
                }
            }
        }
        
        super(
            maxHeights.columnReferenceHeight, 
            maxHeights.literalHeight, 
            maxHeights.notHeight, 
            maxHeights.aggregationHeight, 
            maxHeights.binaryExpressionHeight
        );
        this.length = length;
        this.asterisk = asterisks.length > 0;
        this.columns = columns;
        this.literals = literals;
        this.aggregations = aggregations;
        this.as = as;
    }
}


class FromMetaInfo extends HeightInfo {
    readonly length: number;
    readonly join: boolean;
    readonly columns: ColumnReference[];
    readonly literals: Literal[];
    readonly tables: string[];

    constructor(query: Query) {
        let maxHeights = HeightInfo.EMPTY;
        let join = false;
        let columns = new Array<ColumnReference>();
        let literals = new Array<Literal>();
        let tables = new Array<string>();

        for (let f = 0; f < query.fromLength; ++f) {
            const fe = query.getFrom(f);
            if (fe.join != null) join = true;
            if(fe.on) maxHeights = HeightInfo.max(maxHeights, fe.on.height);
            fe.recursivelyReplaceOn(
                collect(query, columns, literals, [], []), Infinity, query);
            if(fe.table && !containsPrimitive(tables, fe.table)) tables.push(fe.table);
        }
        
        super(
            maxHeights.columnReferenceHeight, 
            maxHeights.literalHeight, 
            maxHeights.notHeight, 
            maxHeights.aggregationHeight, 
            maxHeights.binaryExpressionHeight
        );
        this.length = query.fromLength;
        this.join = join;
        this.columns = columns;
        this.literals = literals;
        this.tables = tables;
    }
}


class WhereMetaInfo extends HeightInfo {
    readonly columns: ColumnReference[];
    readonly literals: Literal[];

    constructor(query: Query) {
        let maxHeights = HeightInfo.EMPTY;
        let columns = new Array<ColumnReference>();
        let literals = new Array<Literal>();

        if(query.where) maxHeights = query.where.height;
        query.recursivelyReplaceWhere(
            collect(query, columns, literals, [], []), Infinity);

        super(
            maxHeights.columnReferenceHeight,
            maxHeights.literalHeight,
            maxHeights.notHeight,
            maxHeights.aggregationHeight,
            maxHeights.binaryExpressionHeight
        );
        this.columns = columns;
        this.literals = literals;
    }
}


class GroupByMetaInfo extends HeightInfo {
    readonly length: number;
    readonly columns: ColumnReference[];
    readonly literals: Literal[];

    constructor(query: Query) {
        let maxHeights = HeightInfo.EMPTY;
        let columns = new Array<ColumnReference>();
        let literals = new Array<Literal>();
        
        for (let g = 0; g < query.groupbyLength; ++g) {
            const x = query.getGroupby(g);
            if(x) maxHeights = HeightInfo.max(maxHeights, x.height);
            query.recursivelyReplaceGroupby(g, 
                collect(query, columns, literals, [], []), Infinity);
        }
        
        super(
            maxHeights.columnReferenceHeight, 
            maxHeights.literalHeight, 
            maxHeights.notHeight, 
            maxHeights.aggregationHeight, 
            maxHeights.binaryExpressionHeight
        );
        this.length = query.groupbyLength;
        this.columns = columns;
        this.literals = literals;
    }
}


class HavingMetaInfo extends HeightInfo {
    readonly columns: ColumnReference[];
    readonly literals: Literal[];
    readonly aggregations: AggregationFunction[];

    constructor(query: Query) {
        let maxHeights = HeightInfo.EMPTY;
        let columns = new Array<ColumnReference>();
        let literals = new Array<Literal>();
        let aggregations = new Array<AggregationFunction>();

        if(query.having) maxHeights = query.having.height;
        query.recursivelyReplaceHaving(
            collect(query, columns, literals, aggregations, []), Infinity);

        super(
            maxHeights.columnReferenceHeight, 
            maxHeights.literalHeight, 
            maxHeights.notHeight, 
            maxHeights.aggregationHeight, 
            maxHeights.binaryExpressionHeight
        );
        this.columns = columns;
        this.literals = literals;
        this.aggregations = aggregations;
    }
}


class OrderByMetaInfo extends HeightInfo {
    readonly length: number;
    readonly columns: ColumnReference[];
    readonly literals: Literal[];
    readonly aggregations: AggregationFunction[];

    constructor(query: Query) {
        let maxHeights = HeightInfo.EMPTY;
        let columns = new Array<ColumnReference>();
        let literals = new Array<Literal>();
        let aggregations = new Array<AggregationFunction>();

        for (let o = 0; o < query.orderbyLength; ++o) {
            const oe = query.getOrderby(o);
            if(oe.expression) maxHeights = HeightInfo.max(maxHeights, oe.expression.height);
            oe.recursivelyReplaceExpression(
                collect(query, columns, literals, aggregations, []), Infinity, query);
        }
        
        super(
            maxHeights.columnReferenceHeight, 
            maxHeights.literalHeight, 
            maxHeights.notHeight, 
            maxHeights.aggregationHeight, 
            maxHeights.binaryExpressionHeight
        );
        this.length = query.orderbyLength;
        this.columns = columns;
        this.literals = literals;
        this.aggregations = aggregations;
    }
}




function collect(
    query: Query,
    columns: ColumnReference[], 
    literals: Literal[], 
    aggregations: AggregationFunction[],
    asterisks: Asterisk[]
) {
    return (x: Expression): Expression[] => {
        if (Asterisk.isAsterisk(x)) {
            asterisks.push(x); //specifically no duplicate-elimination for asterisks!
        } else if (ColumnReference.isColumnReference(x)) {
            const cleanX = new ColumnReference(x.column);
            if(!containsExpression(columns, cleanX, query)) columns.push(cleanX);
        } else if (Literal.isLiteral(x)) {
            const cleanX = new Literal(x.value);
            if(!containsExpression(literals, cleanX, query)) literals.push(cleanX);
        } else if (AggregationFunction.isAggregationFunction(x)) {
            const cleanX = new AggregationFunction(x.aggregation);
            if(!containsExpression(aggregations, cleanX, query)) aggregations.push(cleanX);
        }
        return [];
    };
}


function containsExpression(list: Expression[], x: Expression, q: Query): boolean {
    for(let i=0; i<list.length; ++i) {
        if(list[i].equals(x, q, q)) return true;
    }
    return false;
}

function containsPrimitive(list: any[], x: any): boolean {
    for(let i=0; i<list.length; ++i) {
        if(list[i] == x) return true;
    }
    return false;
}
