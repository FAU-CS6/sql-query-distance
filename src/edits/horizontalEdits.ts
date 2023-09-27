import { Schema, Query, MetaInfo, Asterisk, Expression, ColumnReference, AggregationFunction,
    BinaryExpression, JoinType, HeightInfo, Literal, OperatorType, ExpressionContext} from "../sql";
import { atomicEdits, replaceFromExpression, replaceGroupbyExpression, replaceHavingExpression,
    replaceOrderbyExpression,
    replaceSelectExpression, replaceWhereExpression } from "./atomicEdits";
import { EditSet, addEdit } from "./edit";




// ==============
// Horzonal Edits
// ==============

/**
 * The set of horizontal edits, represented as a map, indexed by the edit names.
 */
export const horizontalEdits: EditSet = new Map();




// === Asterisk ===
function changeAsteriskTable(x: Expression, context: ExpressionContext) {
    if(!Asterisk.isAsterisk(x) || x.table==null) return [];

    const res: Expression[] = [];
    for(let f=0; f<context.query.fromLength; ++f) {
        const fe = context.query.getFrom(f);
        if(fe.alias != x.table) {
            res.push(x.setTable(fe.alias));
        }
    }
    return res;
}


// === ColumnReference ===
function changeColumnReferenceColumn(columnReferences: ColumnReference[], schema: Schema) {
    return (x: Expression, context: ExpressionContext) => {
        if(!ColumnReference.isColumnReference(x)) return [];

        if(!x.table) return columnReferences;

        let from = null;
        for(let f=0; f<context.query.fromLength; ++f) {
            const fe = context.query.getFrom(f);
            if(fe.alias==x.table) {
                from = fe;
                break;
            }
        }
        if(from==null) return [];

        const res: Expression[] = [];
        for(let c of columnReferences) {
            if(schema.get(from.table).has(c.column)) {
                res.push(x.setColumn(c.column));
            }
        }
        return res;
    }
}
function changeColumnReferenceTable(x: Expression, context: ExpressionContext) {
    if(!ColumnReference.isColumnReference(x) || !x.table) return [];

    const res: Expression[] = [];
    for(let f=0; f<context.query.fromLength; ++f) {
        const fe = context.query.getFrom(f);
        if(fe.alias!=x.table) {
            res.push(x.setTable(fe.alias));
        }
    }
    return res;
}


// === Literal ===
function changeLiteralValue(literals: Literal[]) {
    return (x: Expression) => Literal.isLiteral(x) ? literals : [];
}


// === AggregationFunction ===
function changeAggregationFunctionAggregation(aggregations: AggregationFunction[]) {
    return (x: Expression) => {
        if(!AggregationFunction.isAggregationFunction(x)) return [];

        const res: Expression[] = [];
        for(let a=0, n=aggregations.length; a<n; ++a) {
            const aggregation = aggregations[a].aggregation;
            if(aggregation!=x.aggregation) {
                res.push(x.setAggregation(aggregation));
            }
        }
        return res;
    }
}


// === BinaryExpression ===
function changeBaseBinaryExpressionOperator(x: Expression) {
    if(!BinaryExpression.isBinaryExpression(x)) return [];

    const res: Expression[] = [];
    for(let b=0, n=BinaryExpression.baseBinaryExpressions.length; b<n; ++b) {
        const operator = BinaryExpression.baseBinaryExpressions[b].operator;
        if(operator!=x.operator) {
            res.push(x.setOperator(operator));
        }
    }
    return res;
}
function swapCommutativeArguments(x: Expression, context: ExpressionContext) {
    if(!BinaryExpression.isBinaryExpression(x) 
        || !BinaryExpression.isCommutative(x.operator) 
        || x.left==x.right 
        || (x.left && x.left.equals(x.right, context.query, context.query))) {
        return []
    }

    return [x.setLeft(x.right).setRight(x.left)];
}
function swapAssociativeNesting(x: Expression, context: ExpressionContext) {
    if(!BinaryExpression.isBinaryExpression(x) 
        || !BinaryExpression.isAssiciative(x.operator)) {
        return [];
    }

    const res: Expression[] = [];
    if(BinaryExpression.isBinaryExpression(x.left) 
        && x.left.operator==x.operator 
        && (x.right==null || context.maxHeight.minDiff(x.right.height) >= context.stack.length+2)) { //TODO: +1, +2, or +0?
        res.push(x.left.setRight(x.setLeft(x.left.right)));
    }
    if(BinaryExpression.isBinaryExpression(x.right) 
        && x.right.operator==x.operator 
        && (x.left==null || context.maxHeight.minDiff(x.left.height) >= context.stack.length+2)) {
        res.push(x.right.setLeft(x.setRight(x.right.left)));
    }
    return res;
}
function mirrorInequation(x: Expression, context: ExpressionContext) {
    if(!BinaryExpression.isBinaryExpression(x) 
        || !(x.operator==OperatorType.LESS || x.operator==OperatorType.GREATER) 
        || x.left==x.right 
        || (x.left && x.left.equals(x.right, context.query, context.query))) {
        return [];
    }

    return [x.setLeft(x.right).setRight(x.left).setOperator(
        (x.operator==OperatorType.LESS) ? OperatorType.GREATER : OperatorType.LESS)];
}








// === SELECT ===

addEdit(horizontalEdits, {
    name: "swapSelectElements",
    description: "Swap elements in the select-clause",
    cost: 1,
    perform: (query: Query, _schema: Schema, _meta: MetaInfo, result: Query[]) => {
        if(query.selectLength < 2) return;

        const select = query.copySelect();
        for(let s=1, n=select.length; s<n; ++s) {
            const select1 = select[s-1], select2 = select[s];
            if(select1==select2 || (select1 && select1.equals(select2, query, query))) continue;

            select[s] = select1;
            select[s-1] = select2;
            result.push(query.setSelect(select));
            select[s-1] = select1;
            select[s] = select2;
        }
        // (function generate(k: number) {
        //     if(k==1) result.push(query.setSelect(select));
        //     else {
        //         generate(k-1);
        //         for(let i=0; i<k-1; ++i) {
        //             const j = (k%2==0) ? i : 0;
        //             const tmp = select[j];
        //             select[j] = select[k-1];
        //             select[k-1] = tmp;
        //             generate(k-1);
        //         }
        //     }
        // })(select.length);
        // result.shift();
    }
});

addEdit(horizontalEdits, {
    name: "changeSelectAsteriskTable",
    description: "Change (incorrect) table name on an asterisk in a select-element expression",
    cost: atomicEdits.get("setSelectAsteriskTable").cost,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceSelectExpression(query, result, 
            changeAsteriskTable, 
            meta.select.length, 
            1);
    }
});

addEdit(horizontalEdits, {
    name: "changeSelectColumnReferenceColumn",
    description: "Change (incorrect) column-reference column in a select-element expression",
    cost: atomicEdits.get("addSelectColumnReference").cost,
    perform: (query: Query, schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceSelectExpression(query, result,
            changeColumnReferenceColumn(meta.select.columns, schema), 
            meta.select.length, 
            meta.select.columnReferenceHeight);
    }
});

addEdit(horizontalEdits, {
    name: "changeSelectColumnReferenceTable",
    description: "Change (incorrect) column-reference table in a select-element expression",
    cost: atomicEdits.get("setSelectColumnReferenceTable").cost,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceSelectExpression(query, result, 
            changeColumnReferenceTable, 
            meta.select.length, 
            meta.select.columnReferenceHeight);
    }
});

addEdit(horizontalEdits, {
    name: "changeSelectLiteralValue",
    description: "Change (incorrect) literal value in a select-element expression",
    cost: atomicEdits.get("addSelectLiteral").cost,
    perform: (query: Query, schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceSelectExpression(query, result, 
            changeLiteralValue(meta.select.literals), 
            meta.select.length, 
            meta.select.literalHeight);
    }
});

addEdit(horizontalEdits, {
    name: "changeSelectAggregationFunctionAggregation",
    description:
        "Change (incorrect) aggregation-function aggregation in a select-element expression",
    cost: atomicEdits.get("addSelectAggregationFunction").cost,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceSelectExpression(query, result,
            changeAggregationFunctionAggregation(meta.select.aggregations), 
            meta.select.length, 
            meta.select.aggregationHeight);
    }
});

addEdit(horizontalEdits, {
    name: "changeSelectBinaryExpressionOperator",
    description: "Change (incorrect) binary-expression operator in a select-element expression",
    cost: atomicEdits.get("addSelectBinaryExpression").cost,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceSelectExpression(query, result,
            changeBaseBinaryExpressionOperator, 
            meta.select.length, 
            meta.select.binaryExpressionHeight);
    }
});

addEdit(horizontalEdits, {
    name: "swapSelectBinaryExpressionArguments",
    description: "Swap arguments of commutative binary-expression in a select-element expression",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceSelectExpression(query, result, 
            swapCommutativeArguments, 
            meta.select.length, 
            meta.select.binaryExpressionHeight);
    }
});

addEdit(horizontalEdits, {
    name: "swapSelectBinaryExpressionNesting",
    description: "Swap nesting of associative binary-expression in a select-element expression",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceSelectExpression(query, result, 
            swapAssociativeNesting, 
            meta.select.length, 
            meta.select.binaryExpressionHeight, 
            meta.select);
    }
});

addEdit(horizontalEdits, {
    name: "mirrorSelectBinaryExpressionInequation",
    description: "Mirror an inequation in a select-element expression",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceSelectExpression(query, result, 
            mirrorInequation, 
            meta.select.length, 
            meta.select.binaryExpressionHeight);
    }
});

addEdit(horizontalEdits, {
    name: "changeSelectAlias",
    description: "Change (incorrect) explicit alias on a select-element",
    cost: atomicEdits.get("setSelectAlias").cost,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        if(!meta.select.as.length) return;

        for(let s=0; s<query.selectLength && s<meta.select.length; ++s) {
            const se = query.getSelect(s);
            if(se.as==null) continue;
            for(let a=0, n=meta.select.as.length; a<n; ++a) {
                const as = meta.select.as[a];
                if(as!=se.as) {
                    result.push(query.setSelectElement(s, se.setAs(as)));
                }
            }
        }
    }
});








// === FROM ===

addEdit(horizontalEdits, {
    name: "swapFromElements",
    description: "Swap elements in the from-clause",
    cost: 0,
    perform: (query: Query, _schema: Schema, _meta: MetaInfo, result: Query[]) => {
        //TODO: further research needed about when swapping from elements is equivalence transform
        if(query.fromLength < 2) return;

        const from = query.copyFrom();
        for(let f=1, n=from.length; f<n; ++f) {
            const from1 = from[f-1], from2 = from[f];
            if(from1 == from2 || (from1 && from1.equals(from2, query, query)) 
                || from1.join!=null 
                || from2.join==JoinType.LEFT_OUTER 
                || from2.join==JoinType.RIGHT_OUTER) {
                continue;
            }
            from[f] = (from2.join!=null) ? from1.setJoin(from2.join).setOn(from2.on) : from1;
            from[f-1] = (from2.join!=null) ? from2.setJoin(null).setOn(null) : from2;
            result.push(query.setFrom(from));
            from[f-1] = from1;
            from[f] = from2;
        }
    }
});

addEdit(horizontalEdits, {
    name: "changeFromJoinType",
    description: "Change (incorrect) from-element join-type",
    cost: atomicEdits.get("setTableJoinType").cost,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        if(!meta.from.join) return;

        //start at second element because first cannot have complex join
        for(let f=1; f<query.fromLength; ++f) {
            const from = query.getFrom(f);
            if(from.join==null) continue;
            for(let item in JoinType) {
                if (isNaN(Number(item))) {
                    result.push(query.setFromElement(f,
                        from.setJoin(JoinType[item] as any as JoinType)));
                }
            }
        }
    }
});

addEdit(horizontalEdits, {
    name: "changeFromColumnReferenceColumn",
    description: "Change (incorrect) column-reference column in a from-element join-condition",
    cost: atomicEdits.get("addFromColumnReference").cost,
    perform: (query: Query, schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceFromExpression(query, result,
            changeColumnReferenceColumn(meta.from.columns, schema),
            meta.from.columnReferenceHeight);
    }
});

addEdit(horizontalEdits, {
    name: "changeFromColumnReferenceTable",
    description: "Change (incorrect) column-reference table in a from-element join-condition",
    cost: atomicEdits.get("setFromColumnReferenceTable").cost,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceFromExpression(query, result, 
            changeColumnReferenceTable,
            meta.from.columnReferenceHeight);
    }
});

addEdit(horizontalEdits, {
    name: "changeFromLiteralValue",
    description: "Change (incorrect) literal value in a from-element join-condition",
    cost: atomicEdits.get("addFromLiteral").cost,
    perform: (query: Query, schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceFromExpression(query, result, 
            changeLiteralValue(meta.from.literals), 
            meta.from.literalHeight);
    }
});

addEdit(horizontalEdits, {
    name: "changeFromBinaryExpressionOperator",
    description: "Change (incorrect) binary-expression operator in a from-element join-condition",
    cost: atomicEdits.get("addFromBinaryExpression").cost,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceFromExpression(query, result,
            changeBaseBinaryExpressionOperator,
            meta.from.binaryExpressionHeight);
    }
});

addEdit(horizontalEdits, {
    name: "swapFromBinaryExpressionArguments",
    description: "Swap arguments of commutative binary-expression in a from-element join-condition",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceFromExpression(query, result, 
            swapCommutativeArguments,
            meta.from.binaryExpressionHeight);
    }
});

addEdit(horizontalEdits, {
    name: "swapFromBinaryExpressionNesting",
    description: "Swap nesting of associative binary-expression in a from-element join-condition",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceFromExpression(query, result, 
            swapAssociativeNesting,
            meta.from.binaryExpressionHeight, 
            false, 
            false, 
            meta.from);
    }
});

addEdit(horizontalEdits, {
    name: "mirrorFromBinaryExpressionInequation",
    description: "Mirror an inequation in a from-element join-condition",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceFromExpression(query, result, 
            mirrorInequation,
            meta.from.binaryExpressionHeight);
    }
});

addEdit(horizontalEdits, {
    name: "changeFromAlias",
    description: "Change (incorrect) explicit alias on a from-element",
    cost: atomicEdits.get("setSelectAlias").cost,
    perform: (query: Query, schema: Schema, _meta: MetaInfo, result: Query[]) => {
        for(let f=0; f<query.fromLength; ++f) {
            const fe = query.getFrom(f);
            if(fe.as==null || !schema.has(fe.table)) continue;

            let as = schema.get(fe.table).name.charAt(0);
            let asNr = 0;
            for(let exists = true; exists; asNr++) {
                exists = false;
                for(let f2=0; f2<query.fromLength; ++f2) {
                    if(query.getFrom(f2).as == (as+asNr)) {
                        exists = true;
                        break;
                    }
                }
            }
            result.push(query.setFromElement(f, fe.setAs(as+asNr)));
        }
    }
});








// === WHERE ===

addEdit(horizontalEdits, {
    name: "changeWhereColumnReferenceColumn",
    description: "Change (incorrect) column-reference column in the where-clause",
    cost: atomicEdits.get("addWhereColumnReference").cost,
    perform: (query: Query, schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceWhereExpression(query, result,
            changeColumnReferenceColumn(meta.where.columns, schema),
            meta.where.columnReferenceHeight);
    }
});

addEdit(horizontalEdits, {
    name: "changeWhereColumnReferenceTable",
    description: "Change (incorrect) column-reference table in the where-clause",
    cost: atomicEdits.get("setWhereColumnReferenceTable").cost,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceWhereExpression(query, result, 
            changeColumnReferenceTable,
            meta.where.columnReferenceHeight);
    }
});

addEdit(horizontalEdits, {
    name: "changeWhereLiteralValue",
    description: "Change (incorrect) literal value in the where-clause",
    cost: atomicEdits.get("addWhereLiteral").cost,
    perform: (query: Query, schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceWhereExpression(query, result, 
            changeLiteralValue(meta.where.literals), 
            meta.where.literalHeight);
    }
});

addEdit(horizontalEdits, {
    name: "changeWhereBinaryExpressionOperator",
    description: "Change (incorrect) binary-expression operator in the where-clause",
    cost: atomicEdits.get("addWhereBinaryExpression").cost,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceWhereExpression(query, result,
            changeBaseBinaryExpressionOperator,
            meta.where.binaryExpressionHeight);
    }
});

addEdit(horizontalEdits, {
    name: "swapWhereBinaryExpressionArguments",
    description: "Swap arguments of commutative binary-expression in the where-clause",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceWhereExpression(query, result, 
            swapCommutativeArguments,
            meta.where.binaryExpressionHeight);
    }
});

addEdit(horizontalEdits, {
    name: "swapWhereBinaryExpressionNesting",
    description: "Swap nesting of associative binary-expression in the where-clause",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceWhereExpression(query, result, 
            swapAssociativeNesting,
            meta.where.binaryExpressionHeight, 
            meta.where);
    }
});

addEdit(horizontalEdits, {
    name: "mirrorWhereBinaryExpressionInequation",
    description: "Mirror an inequation in the where-clause",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceWhereExpression(query, result, 
            mirrorInequation,
            meta.where.binaryExpressionHeight);
    }
});








// === GROUP BY ===

addEdit(horizontalEdits, {
    name: "swapGroupbyElements",
    description: "Swap elements in the group-by-clause",
    cost: 0,
    perform: (query: Query, _schema: Schema, _meta: MetaInfo, result: Query[]) => {
        if(query.groupbyLength < 2) return;

        const groupby = query.copyGroupby();
        for(let g=1, n=groupby.length; g<n; ++g) {
            const g1 = groupby[g-1], g2 = groupby[g];
            if(g1==g2 || (g1 && g1.equals(g2, query, query))) continue;

            groupby[g] = g1;
            groupby[g-1] = g2;
            result.push(query.setGroupby(groupby));
            groupby[g-1] = g1;
            groupby[g] = g2;
        }
    }
});

addEdit(horizontalEdits, {
    name: "changeGroupbyColumnReferenceColumn",
    description: "Change (incorrect) column-reference column in a group-by expression",
    cost: atomicEdits.get("addGroupbyColumnReference").cost,
    perform: (query: Query, schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceGroupbyExpression(query, result,
            changeColumnReferenceColumn(meta.groupby.columns, schema),
            meta.groupby.columnReferenceHeight);
    }
});

addEdit(horizontalEdits, {
    name: "changeGroupbyColumnReferenceTable",
    description: "Change (incorrect) column-reference table in a group-by expression",
    cost: atomicEdits.get("setGroupbyColumnReferenceTable").cost,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceGroupbyExpression(query, result, 
            changeColumnReferenceTable,
            meta.groupby.columnReferenceHeight);
    }
});

addEdit(horizontalEdits, {
    name: "changeGroupbyLiteralValue",
    description: "Change (incorrect) literal value in a group-by expression",
    cost: atomicEdits.get("addGroupbyLiteral").cost,
    perform: (query: Query, schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceGroupbyExpression(query, result, 
            changeLiteralValue(meta.groupby.literals), 
            meta.groupby.literalHeight);
    }
});

addEdit(horizontalEdits, {
    name: "changeGroupbyBinaryExpressionOperator",
    description: "Change (incorrect) binary-expression operator in a group-by expression",
    cost: atomicEdits.get("addGroupbyBinaryExpression").cost,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceGroupbyExpression(query, result,
            changeBaseBinaryExpressionOperator,
            meta.groupby.binaryExpressionHeight);
    }
});

addEdit(horizontalEdits, {
    name: "swapGroupbyBinaryExpressionArguments",
    description: "Swap arguments of commutative binary-expression in a group-by expression",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceGroupbyExpression(query, result, 
            swapCommutativeArguments,
            meta.groupby.binaryExpressionHeight);
    }
});

addEdit(horizontalEdits, {
    name: "swapGroupbyBinaryExpressionNesting",
    description: "Swap nesting of associative binary-expression in a group-by expression",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceGroupbyExpression(query, result, 
            swapAssociativeNesting,
            meta.groupby.binaryExpressionHeight, 
            meta.groupby);
    }
});

addEdit(horizontalEdits, {
    name: "mirrorGroupbyBinaryExpressionInequation",
    description: "Mirror an inequation in a group-by expression",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceGroupbyExpression(query, result, 
            mirrorInequation,
            meta.groupby.binaryExpressionHeight);
    }
});








// === Having ===

addEdit(horizontalEdits, {
    name: "changeHavingColumnReferenceColumn",
    description: "Change (incorrect) column-reference column in the having-clause",
    cost: atomicEdits.get("addHavingColumnReference").cost,
    perform: (query: Query, schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceHavingExpression(query, result,
            changeColumnReferenceColumn(meta.having.columns, schema),
            meta.having.columnReferenceHeight);
    }
});

addEdit(horizontalEdits, {
    name: "changeHavingColumnReferenceTable",
    description: "Change (incorrect) column-reference table in the having-clause",
    cost: atomicEdits.get("setHavingColumnReferenceTable").cost,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceHavingExpression(query, result, 
            changeColumnReferenceTable,
            meta.having.columnReferenceHeight);
    }
});

addEdit(horizontalEdits, {
    name: "changeHavingLiteralValue",
    description: "Change (incorrect) literal value in the having-clause",
    cost: atomicEdits.get("addHavingLiteral").cost,
    perform: (query: Query, schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceHavingExpression(query, result, 
            changeLiteralValue(meta.having.literals), 
            meta.having.literalHeight);
    }
});

addEdit(horizontalEdits, {
    name: "changeHavingAggregationFunctionAggregation",
    description:
        "Change (incorrect) aggregation-function aggregation in the having-clause",
    cost: atomicEdits.get("addHavingAggregationFunction").cost,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceHavingExpression(query, result,
            changeAggregationFunctionAggregation(meta.having.aggregations),
            meta.having.aggregationHeight);
    }
});

addEdit(horizontalEdits, {
    name: "changeHavingBinaryExpressionOperator",
    description: "Change (incorrect) binary-expression operator in the having-clause",
    cost: atomicEdits.get("addHavingBinaryExpression").cost,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceHavingExpression(query, result,
            changeBaseBinaryExpressionOperator,
            meta.having.binaryExpressionHeight);
    }
});

addEdit(horizontalEdits, {
    name: "swapHavingBinaryExpressionArguments",
    description: "Swap arguments of commutative binary-expression in the having-clause",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceHavingExpression(query, result, 
            swapCommutativeArguments,
            meta.having.binaryExpressionHeight);
    }
});

addEdit(horizontalEdits, {
    name: "swapHavingBinaryExpressionNesting",
    description: "Swap nesting of associative binary-expression in the having-clause",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceHavingExpression(query, result, 
            swapAssociativeNesting,
            meta.having.binaryExpressionHeight, 
            meta.having);
    }
});

addEdit(horizontalEdits, {
    name: "mirrorHavingBinaryExpressionInequation",
    description: "Mirror an inequation in the having-clause",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceHavingExpression(query, result, 
            mirrorInequation,
            meta.having.binaryExpressionHeight);
    }
});








// === Order By ===

addEdit(horizontalEdits, {
    name: "changeOrderbyElements",
    description: "Change position of elements in the order-by-clause",
    cost: atomicEdits.get("addOrderbyElement").cost,
    perform: (query: Query, _schema: Schema, _meta: MetaInfo, result: Query[]) => {
        if(query.orderbyLength < 2) return;

        const orderby = query.copyOrderby();
        for(let o=1, n=orderby.length; o<n; ++o) {
            const o1 = orderby[o-1], o2 = orderby[o];
            if(o1==o2 || (o1 && o1.equals(o2, query, query))) continue;

            orderby[o] = o1;
            orderby[o-1] = o2;
            result.push(query.setOrderby(orderby));
            orderby[o-1] = o1;
            orderby[o] = o2;
        }
    }
});

addEdit(horizontalEdits, {
    name: "changeOrderbyColumnReferenceColumn",
    description: "Change (incorrect) column-reference column in a order-by expression",
    cost: atomicEdits.get("addOrderbyColumnReference").cost,
    perform: (query: Query, schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceOrderbyExpression(query, result,
            changeColumnReferenceColumn(meta.orderby.columns, schema),
            meta.orderby.columnReferenceHeight);
    }
});

addEdit(horizontalEdits, {
    name: "changeOrderbyColumnReferenceTable",
    description: "Change (incorrect) column-reference table in a order-by expression",
    cost: atomicEdits.get("setOrderbyColumnReferenceTable").cost,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceOrderbyExpression(query, result, 
            changeColumnReferenceTable,
            meta.orderby.columnReferenceHeight);
    }
});

addEdit(horizontalEdits, {
    name: "changeOrderbyLiteralValue",
    description: "Change (incorrect) literal value in a order-by expression",
    cost: atomicEdits.get("addOrderbyLiteral").cost,
    perform: (query: Query, schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceOrderbyExpression(query, result, 
            changeLiteralValue(meta.orderby.literals), 
            meta.orderby.literalHeight);
    }
});

addEdit(horizontalEdits, {
    name: "changeOrderbyAggregationFunctionAggregation",
    description:
        "Change (incorrect) aggregation-function aggregation in a order-by expression",
    cost: atomicEdits.get("addOrderbyAggregationFunction").cost,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceOrderbyExpression(query, result,
            changeAggregationFunctionAggregation(meta.orderby.aggregations),
            meta.orderby.aggregationHeight);
    }
});

addEdit(horizontalEdits, {
    name: "changeOrderbyBinaryExpressionOperator",
    description: "Change (incorrect) binary-expression operator in a order-by expression",
    cost: atomicEdits.get("addOrderbyBinaryExpression").cost,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceOrderbyExpression(query, result,
            changeBaseBinaryExpressionOperator,
            meta.orderby.binaryExpressionHeight);
    }
});

addEdit(horizontalEdits, {
    name: "swapOrderbyBinaryExpressionArguments",
    description: "Swap arguments of commutative binary-expression in a order-by expression",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceOrderbyExpression(query, result, 
            swapCommutativeArguments,
            meta.orderby.binaryExpressionHeight);
    }
});

addEdit(horizontalEdits, {
    name: "swapOrderbyBinaryExpressionNesting",
    description: "Swap nesting of associative binary-expression in a order-by expression",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceOrderbyExpression(query, result, 
            swapAssociativeNesting,
            meta.orderby.binaryExpressionHeight, 
            meta.orderby);
    }
});

addEdit(horizontalEdits, {
    name: "mirrorOrderbyBinaryExpressionInequation",
    description: "Mirror an inequation in a order-by expression",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceOrderbyExpression(query, result, 
            mirrorInequation,
            meta.orderby.binaryExpressionHeight);
    }
});
