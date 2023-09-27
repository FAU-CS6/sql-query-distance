import { Schema } from "./schema";
import { Hashable } from "./query/hashable";
import { Expression, ExpressionContext } from "./query/expression";
import { Asterisk } from "./query/asterisk";
import { ColumnReference } from "./query/columnReference";
import { AggregationFunction, AggregationType } from "./query/aggregation";
import { BinaryExpression } from "./query/binaryExpression";
import { SelectElement } from "./query/selectElement";
import { FromElement } from "./query/fromElement";
import { OrderBy } from "./query/orderBy";
import { append } from "../util";
import { HeightInfo } from "./heightInfo";

export * from "./query/hashable";
export * from "./query/expression";
export * from "./query/asterisk";
export * from "./query/columnReference";
export * from "./query/literal";
export * from "./query/not";
export * from "./query/aggregation";
export * from "./query/binaryExpression";
export * from "./query/selectElement";
export * from "./query/fromElement";
export * from "./query/orderBy";

// ===========
//  Query AST 
// ===========

/**
 * The root of an AST representing a SQL query.
 */
export class Query extends Hashable {
    constructor(
        readonly distinct: boolean = false,
        private select: SelectElement[] = [],
        private from: FromElement[] = [],
        readonly where: Expression = null,
        private groupby: Expression[] = [],
        readonly having: Expression = null,
        private orderby: OrderBy[] = [],
    ) {
        const selectLength = select.length;
        const fromLength = from.length;
        const groupbyLength = groupby.length;
        const orderbyLength = orderby.length;

        let hash = distinct ? 2 : 1;
        hash = hash * 4 + selectLength;
        for(let s=0; s<selectLength; ++s) {
            const se: SelectElement = select[s];
            hash = hash * se.hashMax + se.hash;
        }
        hash = hash * 4 + fromLength;
        for(let f=0; f<fromLength; ++f) {
            const fe: FromElement = from[f];
            hash = hash * fe.hashMax + fe.hash;
        }
        hash = where ? hash * where.hashMax + where.hash : hash;
        hash = hash * 4 + groupbyLength;
        for(let g=0; g<groupbyLength; ++g) {
            const ge: Expression = groupby[g];
            hash = ge ? hash * ge.hashMax + ge.hash : hash;
        }
        hash = having ? hash * having.hashMax + having.hash : hash;
        hash = hash * 4 + orderbyLength;
        for(let o=0; o<orderbyLength; ++o) {
            const oe: OrderBy = orderby[o];
            hash = hash * oe.hashMax + oe.hash;
        }
        super(hash, 1);

        this.selectLength = selectLength;
        this.fromLength = fromLength;
        this.groupbyLength = groupbyLength;
        this.orderbyLength = orderbyLength;
    }

    readonly selectLength: number;
    public getSelect(i: number): SelectElement { return this.select[i]; }
    public copySelect(): SelectElement[] { return this.select.slice(); }
    readonly fromLength: number;
    public getFrom(i: number): FromElement { return this.from[i]; }
    public copyFrom(): FromElement[] { return this.from.slice(); }
    readonly groupbyLength: number;
    public getGroupby(i: number): Expression { return this.groupby[i]; }
    public copyGroupby(): Expression[] { return this.groupby.slice(); }
    readonly orderbyLength: number;
    public getOrderby(i: number): OrderBy { return this.orderby[i]; }
    public copyOrderby(): OrderBy[] { return this.orderby.slice(); }


    public equals(other: Query): boolean {
        if((other === null) || (this.hash !== other.hash)) return false;
        if(this.distinct !== other.distinct) return false;
        if(this.selectLength !== other.selectLength) return false;
        if(this.fromLength !== other.fromLength) return false;
        if(this.groupbyLength !== other.groupbyLength) return false;
        if(this.orderbyLength !== other.orderbyLength) return false;
        for(let i=0, l=this.selectLength; i<l; ++i) {
            if(!this.select[i].equals(other.select[i], this, other)) return false;
        }
        for(let i=0, l=this.fromLength; i<l; ++i) {
            if(!this.from[i].equals(other.from[i], this, other)) return false;
        }
        if(!((this.where == other.where) ||
             (this.where !== null && this.where.equals(other.where, this, other))))
             return false;
        for(let i=0, l=this.groupbyLength; i<l; ++i) {
            if(!(this.groupby[i] === other.groupby[i] ||
                (this.groupby[i] && this.groupby[i].equals(other.groupby[i], this, other))))
                return false;
        }
        if(!((this.having == other.having) ||
             (this.having !== null && this.having.equals(other.having, this, other))))
             return false;
        for(let i=0, l=this.orderbyLength; i<l; ++i) {
            if(!this.orderby[i].equals(other.orderby[i], this, other)) return false;
        }
        return true;
    }


    // public set(
    //     distinct: boolean = this.distinct,
    //     select: SelectElement[] = this.select,
    //     from: FromElement[] = this.from,
    //     where: Expression = this.where,
    //     groupby: Expression[] = this.groupby,
    //     having: Expression = this.having,
    //     orderby: OrderBy[] = this.orderby): Query {
    //     return new Query(distinct, select, from, where, groupby, having, orderby);
    // }

    public setDistinct(distinct: boolean): Query {
        return new Query(distinct, this.select, this.from, this.where,
            this.groupby, this.having, this.orderby);
    }
    public setSelect(select: SelectElement[]): Query {
        return new Query(this.distinct, select.slice(), this.from, this.where,
            this.groupby, this.having, this.orderby);
    }
    public setSelectElement(i: number = this.select.length, s: SelectElement = undefined,
        override: boolean = true): Query {
        const select = this.copySelect();
        if(s === undefined) select.splice(i, override?1:0);
        else select.splice(i, override?1:0, s);
        return new Query(this.distinct, select, this.from, this.where,
            this.groupby, this.having, this.orderby);
    }
    public setFrom(from: FromElement[]): Query {
        return new Query(this.distinct, this.select, from.slice(), this.where,
            this.groupby, this.having, this.orderby);
    }
    public setFromElement(i: number = this.from.length, f: FromElement = undefined,
        override: boolean = true): Query {
        const from = this.copyFrom();
        if(f === undefined) from.splice(i, override?1:0);
        else from.splice(i, override?1:0, f);
        return new Query(this.distinct, this.select, from, this.where,
            this.groupby, this.having, this.orderby);
    }
    public setWhere(where: Expression): Query {
        return new Query(this.distinct, this.select, this.from, where,
            this.groupby, this.having, this.orderby);
    }
    public setGroupby(groupby: Expression[]) {
        return new Query(this.distinct, this.select, this.from, this.where,
            groupby.slice(), this.having, this.orderby);
    }
    public setGroupbyElement(i: number = this.groupby.length, e: Expression = undefined,
        override: boolean = true): Query {
        const groupby = this.copyGroupby();
        if(e === undefined) groupby.splice(i, override?1:0);
        else groupby.splice(i, override?1:0, e);
        return new Query(this.distinct, this.select, this.from, this.where,
            groupby, this.having, this.orderby);
    }
    public setHaving(having: Expression): Query {
        return new Query(this.distinct, this.select, this.from, this.where,
            this.groupby, having, this.orderby);
    }
    public setOrderby(orderby: OrderBy[]): Query {
        return new Query(this.distinct, this.select, this.from, this.where,
            this.groupby, this.having, orderby.slice());
    }
    public setOrderbyElement(i: number = this.orderby.length, o: OrderBy = undefined,
        override: boolean = true): Query {
        const orderby = this.copyOrderby();
        if(o == undefined) orderby.splice(i, override?1:0);
        else orderby.splice(i, override?1:0, o);
        return new Query(this.distinct, this.select, this.from, this.where,
            this.groupby, this.having, orderby);
    }

    public recursivelyReplaceWhere(
        multimap: (e: Expression, context: ExpressionContext) => Expression[],
        recursionDepth: number,
        maxHeight: HeightInfo = null
    ): Expression[] {
        if(recursionDepth < 0) return [];

        const context = new ExpressionContext([], this, maxHeight);
        const res: Expression[] = [];
        append(res, multimap(this.where, context));
        if(this.where) {
            append(res, this.where.recursivelyReplace(multimap, context, recursionDepth-1));
        }

        return res;
    }
    public recursivelyReplaceGroupby(
        i: number, 
        multimap: (e: Expression, context: ExpressionContext) => Expression[],
        recursionDepth: number,
        maxHeight: HeightInfo = null
    ): Expression[] {
        if(recursionDepth < 0) return [];

        const context = new ExpressionContext([], this, maxHeight);
        const res: Expression[] = [];
        append(res, multimap(this.groupby[i], context));
        if(this.groupby[i]) {
            append(res, this.groupby[i].recursivelyReplace(multimap, context, recursionDepth-1));
        }

        return res;
    }
    public recursivelyReplaceHaving(
        multimap: (e: Expression, context: ExpressionContext) => Expression[],
        recursionDepth: number,
        maxHeight: HeightInfo = null
    ): Expression[] {
        if(recursionDepth < 0) return [];
        
        const context = new ExpressionContext([], this, maxHeight);
        const res: Expression[] = [];
        append(res, multimap(this.having, context));
        if(this.having) {
            append(res, this.having.recursivelyReplace(multimap, context, recursionDepth-1));
        }

        return res;
    }


    public validateSemantics(schema: Schema): boolean {
        const forbidAsterisk = (element: string) => ((x: Expression): Expression[] => {
            if(Asterisk.isAsterisk(x)) throw new Error(element+" contains asterisk.");
            return []});
        const forbidAggregation = (element: string) => ((x: Expression): Expression[] => {
            if(AggregationFunction.isAggregationFunction(x))
                throw new Error(element+"contains aggregation function.");
            return []});
        const checkAsterisk = (element: string) => (
            (x: Expression): Expression[] => {
                if(Asterisk.isAsterisk(x) && x.table!=null) {
                    let found: boolean = false;
                    for(let f=0; f<this.fromLength; ++f) {
                        if(this.from[f].alias==x.table) {
                            found = true;
                            break;
                        }
                    }
                    if(!found) throw new Error(`${element} references all columns of table `+
                        `"${x.table}", which cannot be found within the from-elements.`);
                }
                return [];
            }
        );
        const checkColumnReference = (element: string, checkGroupby: boolean,
            fromElements: number = this.fromLength) =>
            ((x: Expression, context: ExpressionContext): Expression[] => {
                if(ColumnReference.isColumnReference(x)) {
                    let source: FromElement = null;
                    for(let f=0; f<fromElements; ++f) {
                        let fe = this.from[f];
                        if(x.table ? fe.alias==x.table : schema.get(fe.table).has(x.column)) {
                            if(source==null) source = fe;
                            else throw new Error(`${element} references column `+
                            `"${(x.table?x.table+'.':'')+x.column}", whose source is ambigous.`);
                        }
                    }
                    if(source==null) throw new Error(`${element} references column `+
                        `"${(x.table?x.table+'.':'')+x.column}", which cannot be found `+
                        `within the (preceeding) from-elements.`);
                    if(!schema.get(source.table).has(x.column)) throw new Error(element+
                        ` references column "${(x.table?x.table+'.':'')+x.column}", which is`+
                        ` not part of the schema.`);
                    if(checkGroupby && this.groupbyLength) {
                        let legal = false;
                        for(let t=context.stack.length-1; t>=0; --t) {
                            if(AggregationFunction.isAggregationFunction(context.stack[t])) {
                                legal = true;
                                break;
                            }
                        }
                        if(!legal) {
                            for(let g=0; g<this.groupbyLength; ++g) {
                                const ge = this.groupby[g];
                                if(ColumnReference.isColumnReference(ge) && ge.column==x.column &&
                                    (!ge.table || !x.table || ge.table==x.table)) {
                                    legal = true;
                                    break;
                                }
                            }
                        }
                        if(!legal) throw new Error(`${element} references column `+
                            `"${(x.table?x.table+'.':'')+x.column}", which is neither grouped by `+
                            `nor inside an aggregation function.`);
                    }
                }
                return [];
            }
        );
        const checkAggregationFunction = (element: string) => (
            (x: Expression, context: ExpressionContext): Expression[] => {
                if(AggregationFunction.isAggregationFunction(x)) {
                    if(x.argument==null && x.aggregation!=AggregationType.COUNT) throw new Error(
                        `${element} contains aggregation function without argument.`);
                    for(let t=context.stack.length-1; t>=0; --t) {
                        if(AggregationFunction.isAggregationFunction(context.stack[t]))
                            throw new Error(`${element} contains aggregation function `+
                                `inside another aggregation function`);
                    }
                }
                return [];
            }
        );
        const checkBinaryExpression = (element: string) => (
            (x: Expression): Expression[] => {
                if(BinaryExpression.isBinaryExpression(x)) {
                    if(x.left==null) throw new Error(
                        `${element} contains binary expression without left argument.`);
                    if(x.right==null) throw new Error(
                        `${element} contains binary expression without right argument.`);
                }
                return [];
            }
        );
        if(this.fromLength && this.from[0].join!=null)
            throw new Error(`The first from-element cannot have a complex join-type.`);
        for(let f=0; f<this.fromLength; ++f) {
            const fe = this.from[f], name = `Join-condition of from-element ${f+1}`;
            if(!schema.has(fe.table)) throw new Error(
                `Table "${fe.table}" referenced by from-element ${f+1} is not part of schema.`);
            for(let f2=f+1; f2<this.fromLength; ++f2) {
                if(fe.alias == this.from[f2].alias) throw new Error(
                    `From-element ${f+1} and ${f2+1} have the same table name/alias.`);
            }
            if(fe.join!=null && fe.on==null) throw new Error(
                `From-element ${f+1} has complex join-type but no join-condition.`);
            if(fe.join==null && fe.on!=null) throw new Error(
                `From-element ${f+1} has join-condition but no complex join-type.`);
            fe.recursivelyReplaceOn(forbidAsterisk(name), Infinity, this);
            fe.recursivelyReplaceOn(checkColumnReference(name, false, f+1), Infinity, this);
            fe.recursivelyReplaceOn(forbidAggregation(name), Infinity, this);
            fe.recursivelyReplaceOn(checkBinaryExpression(name), Infinity, this);
        }
        this.recursivelyReplaceWhere(forbidAsterisk("Where-clause"), Infinity, null);
        this.recursivelyReplaceWhere(checkColumnReference("Where-clause", false), Infinity, null);
        this.recursivelyReplaceWhere(forbidAggregation("Where-clause"), Infinity, null);
        this.recursivelyReplaceWhere(checkBinaryExpression("Where-clause"), Infinity, null);
        for(let g=0; g<this.groupbyLength; ++g) {
            const name = `Group-by expression ${g+1}`;
            this.recursivelyReplaceGroupby(g, forbidAsterisk(name), Infinity, null);
            this.recursivelyReplaceGroupby(g, checkColumnReference(name, false), Infinity, null);
            this.recursivelyReplaceGroupby(g, forbidAggregation(name), Infinity, null);
            this.recursivelyReplaceGroupby(g, checkBinaryExpression(name), Infinity, null);
        }
        if(this.having!=null && this.groupbyLength==0)
            throw new Error(`Query contains having-clause without group-by-clause.`);
        this.recursivelyReplaceHaving(forbidAsterisk("Having-clause"), Infinity, null);
        this.recursivelyReplaceHaving(checkColumnReference("Having-clause", true), Infinity, null);
        this.recursivelyReplaceHaving(checkAggregationFunction("Having-clause"), Infinity, null);
        this.recursivelyReplaceHaving(checkBinaryExpression("Having-clause"), Infinity, null);
        selectLoop: for(let s=0; s<this.selectLength; ++s) {
            const se = this.select[s], name = `Select-element ${s+1}`;
            if(se.as!=null) {
                for(let s2=s+1; s2<this.selectLength; ++s2) {
                    if(se.as == this.select[s2].as) throw new Error(
                        `Select-element ${s+1} and ${s2+1} have the same alias.`);
                }
            }
            for(let g=0; g<this.groupbyLength; ++g) {
                if(se.expression == this.groupby[g] ||
                    (se.expression && se.expression.equals(this.groupby[g], this, this)))
                    continue selectLoop;
            }
            se.recursivelyReplaceExpression(checkAsterisk(name), Infinity, this);
            se.recursivelyReplaceExpression(checkColumnReference(name, true), Infinity, this);
            se.recursivelyReplaceExpression(checkAggregationFunction(name), Infinity, this);
            se.recursivelyReplaceExpression(checkBinaryExpression(name), Infinity, this);
        }
        orderbyLoop: for(let o=0; o<this.orderbyLength; ++o) {
            const oe = this.orderby[o], name = `Order-by-element ${o+1}`;
            for(let g=0; g<this.groupbyLength; ++g) {
                if(oe.expression == this.groupby[g] ||
                    (oe.expression && oe.expression.equals(this.groupby[g], this, this)))
                    continue orderbyLoop;
            }
            oe.recursivelyReplaceExpression(checkAsterisk(name), Infinity, this);
            oe.recursivelyReplaceExpression(checkColumnReference(name, true), Infinity, this);
            oe.recursivelyReplaceExpression(checkAggregationFunction(name), Infinity, this);
            oe.recursivelyReplaceExpression(checkBinaryExpression(name), Infinity, this);
        }
        return true;
    }
}
