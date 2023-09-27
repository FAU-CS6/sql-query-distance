import { Schema, Query, JoinType, SelectElement, Expression, ColumnReference, AggregationFunction,
    BinaryExpression, FromElement, OrderBy, MetaInfo, Asterisk, Not, HeightInfo, Literal, 
    ExpressionContext, 
    SelectMetaInfo} from "../sql";
import { EditSet, addEdit } from "./edit";




// ============
// Atomic Edits
// ============

/**
 * The set of atomic edits, represented as a map, indexed by the edit names.
 */
export const atomicEdits: EditSet = new Map();




// === Asterisk ===
function addAsterisk(x: Expression): Expression[] {
    return (x == null) ? [Asterisk.baseAsterisk] : [];
}
function removeAsterisk(x: Expression): Expression[] {
    return Asterisk.isAsterisk(x) ? [null] : [];
}
function setAsteriskTable(x: Expression, context: ExpressionContext): Expression[] {
    if(!Asterisk.isAsterisk(x) || x.table) return [];

    const res: Expression[] = new Array(context.query.fromLength);
    for(let f=0; f<context.query.fromLength; ++f) {
        res[f] = x.setTable(context.query.getFrom(f).alias);
    }
    return res;
}
function unsetAsteriskTable(x: Expression, context: ExpressionContext): Expression[] {
    return (Asterisk.isAsterisk(x) && x.table) ? [x.setTable(null)] : [];
}


// === ColumnReference ===
function addColumnReference(columnReferences: ColumnReference[]): (x: Expression) => Expression[] {
    return (x: Expression) => x==null ? columnReferences : [];
}
function removeColumnReference(x: Expression): Expression[] {
    return ColumnReference.isColumnReference(x) ? [null] : [];
}
function setColumnReferenceTable(x: Expression, context: ExpressionContext): Expression[] {
    if(!ColumnReference.isColumnReference(x) || x.table) return [];

    const res: Expression[] = new Array(context.query.fromLength);
    for(let f=0; f<context.query.fromLength; ++f) {
        res[f] = x.setTable(context.query.getFrom(f).alias);
    }
    return res;
}
function unsetColumnReferenceTable(x: Expression): Expression[] {
    return (ColumnReference.isColumnReference(x) && x.table) ? [x.setTable(null)] : [];
}


// === Literal ===
function addLiteral(literals: Literal[]): (x: Expression) => Expression[] {
    return (x: Expression) => x==null ? literals : [];
}
function removeLiteral(x: Expression): Expression[] {
    return Literal.isLiteral(x) ? [null] : [];
}


// === Not ===
function addNot(x: Expression, context: ExpressionContext) {
    //context.maxHeight < context.stack.length + x.height + 1 => can't increase tree height by 1
    if(x!=null && context.maxHeight.minDiff(x.height) < context.stack.length+1) return [];
    
    return (x!=null) ? [new Not(x)] : [Not.baseNot];
}
function removeNot(x: Expression): Expression[] {
    return Not.isNot(x) ? [x.argument] : [];
}


// === AggregationFunction ===
function addAggregationFunction(aggregations: AggregationFunction[]) {
    return (x: Expression, context: ExpressionContext) => {
        //context.maxHeight < context.stack.length + x.height + 1 => can't increase tree height by 1
        if(x!=null && context.maxHeight.minDiff(x.height) < context.stack.length+1) return [];

        //prevent aggregation functions from being inside each other
        if(x!=null && x.height.aggregationHeight>=0) return [];
        for(let t=0, n=context.stack.length; t<n; ++t) {
            if(AggregationFunction.isAggregationFunction(context.stack[t])) return [];
        }
        
        const res = new Array<AggregationFunction>(aggregations.length);
        for(let a=0, n=aggregations.length; a<n; ++a) {
            res[a] = x!=null ? aggregations[a].setArgument(x) : aggregations[a];
        }
        return res;
    }
}
function removeAggregationFunction(x: Expression) {
    return AggregationFunction.isAggregationFunction(x) ? [x.argument] : [];
}
function setAggregationFunctionDistinct(x: Expression) {
    return (AggregationFunction.isAggregationFunction(x) && 
            AggregationFunction.isDistinctValidFor(x.aggregation) && 
            !x.distinct) ? [x.setDistinct(true)] : [];
}
function unsetAggregationFunctionDistinct(x: Expression) {
    return (AggregationFunction.isAggregationFunction(x) && x.distinct) ? 
        [x.setDistinct(false)] : [];
}


// === BinaryExpression ===
function addBaseBinaryExpression(x: Expression, context: ExpressionContext) {
    //context.maxHeight < context.stack.length + x.height + 1 => can't increase tree height by 1
    if(x!=null && context.maxHeight.minDiff(x.height) < context.stack.length+1) return [];

    const res = new Array<BinaryExpression>(BinaryExpression.baseBinaryExpressions.length);
    for(let b=0, n=BinaryExpression.baseBinaryExpressions.length; b<n; ++b) {
        if(x==null) {
            res[b] = BinaryExpression.baseBinaryExpressions[b];
        } else {
            res[b] = BinaryExpression.baseBinaryExpressions[b].setLeft(x);
            res.push(BinaryExpression.baseBinaryExpressions[b].setRight(x));
        }
    }
    return res;
}
function removeBinaryExpression(x: Expression) {
    return (BinaryExpression.isBinaryExpression(x) && (x.left==null || x.right==null)) 
        ? [(x.left!=null) ? x.left : x.right] : [];
}








// === DISTINCT ===

addEdit(atomicEdits, {
    name: "setDistinct",
    description: "Set (missing) distinct-declaration",
    cost: 2,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        if(!meta.distinct || query.distinct == true) return;

        result.push(query.setDistinct(true));
    }
});

addEdit(atomicEdits, {
    name: "unsetDistinct",
    description: "Unset (excess) distinct-declaration",
    cost: 2,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        if(meta.distinct || query.distinct == false) return;
        
        result.push(query.setDistinct(false));
    }
});








// === SELECT ===

export function replaceSelectExpression(
    query: Query, 
    result: Query[], 
    multimap: (x: Expression, context: ExpressionContext) => Expression[], 
    selectLength: number, 
    recursionDepth: number, 
    maxHeight: HeightInfo = null
): void {
    if(recursionDepth < 0) return;

    for(let s=0; s<query.selectLength && s<selectLength; ++s) {
        const select = query.getSelect(s);
        const expressions = select.recursivelyReplaceExpression(
            multimap, recursionDepth, query, maxHeight);
        for(let e=0, n=expressions.length; e<n; ++e) {
            result.push(query.setSelectElement(s, select.setExpression(expressions[e])));
        }
    }
}

addEdit(atomicEdits, {
    name: "addSelectElement",
    description: "Add (missing) element in select-clause",
    cost: 1,
    perform: (query: Query, schema: Schema, meta: MetaInfo, result: Query[]) => {
        if((new SelectMetaInfo(query, schema).length >= Math.max(meta.select.length, 1)) 
            || (query.fromLength <= 0)) return;

        for(let s=0; s<=query.selectLength; ++s) {
            result.push(query.setSelectElement(s, new SelectElement(), false));
        }
    }
});

addEdit(atomicEdits, {
    name: "removeSelectElement",
    description: "Remove (excess) element in select-clause",
    cost: 1,
    perform: (query: Query, _schema: Schema, _meta: MetaInfo, result: Query[]) => {
        for(let s=0; s<query.selectLength; ++s) {
            result.push(query.setSelectElement(s, undefined));
        }
    }
});

addEdit(atomicEdits, {
    name: "addSelectAsterisk",
    description: "Add (missing) asterisk-selection to a select-element expression",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        if(!meta.select.asterisk) return;

        replaceSelectExpression(query, result, 
            addAsterisk, 
            meta.select.length, 
            1);
    }
});

addEdit(atomicEdits, {
    name: "removeSelectAsterisk",
    description: "Remove (excess) asterisk-selection from a select-element expression",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceSelectExpression(query, result, 
            removeAsterisk, 
            meta.select.length, 
            Infinity);
    }
});

addEdit(atomicEdits, {
    name: "setSelectAsteriskTable",
    description: "Set (missing) table name on an asterisk in a select-element expression",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceSelectExpression(query, result, 
            setAsteriskTable, 
            meta.select.length, 
            meta.select.asterisk?1:0);
    }
});

addEdit(atomicEdits, {
    name: "unsetSelectAsteriskTable",
    description: "Unset (excess) table name on an asterisk in a select-element expression",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceSelectExpression(query, result, 
            unsetAsteriskTable, 
            meta.select.length, 
            meta.select.asterisk?1:0);
    }
});

addEdit(atomicEdits, {
    name: "addSelectColumnReference",
    description: "Add (missing) column-reference to a select-element expression",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceSelectExpression(query, result,
            addColumnReference(meta.select.columns), 
            meta.select.length,
            meta.select.columnReferenceHeight);
    }
});

addEdit(atomicEdits, {
    name: "removeSelectColumnReference",
    description: "Remove (excess) column-reference from a select-element expression",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceSelectExpression(query, result, 
            removeColumnReference, 
            meta.select.length, 
            Infinity);
    }
});

addEdit(atomicEdits, {
    name: "setSelectColumnReferenceTable",
    description: "Set (missing) table name on a column-reference in a select-element expression",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceSelectExpression(query, result, 
            setColumnReferenceTable, 
            meta.select.length,
            meta.select.columnReferenceHeight);
    }
});

addEdit(atomicEdits, {
    name: "unsetSelectColumnReferenceTable",
    description:
        "Unset (excess) table name on a column-reference in a select-element expression",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceSelectExpression(query, result, 
            unsetColumnReferenceTable, 
            meta.select.length,
            meta.select.columnReferenceHeight);
    }
});

addEdit(atomicEdits, {
    name: "addSelectLiteral",
    description: "Add (missing) literal to a select-element expression",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceSelectExpression(query, result, 
            addLiteral(meta.select.literals), 
            meta.select.length, 
            meta.select.literalHeight);
    }
});

addEdit(atomicEdits, {
    name: "removeSelectLiteral",
    description: "Remove (excess) literal from a select-element expression",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceSelectExpression(query, result, 
            removeLiteral, 
            meta.select.length, 
            Infinity);
    }
});

addEdit(atomicEdits, {
    name: "addSelectNot",
    description: "Add (missing) NOT to a select-element expression",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceSelectExpression(query, result, 
            addNot, 
            meta.select.length, 
            meta.select.notHeight, 
            meta.select);
    }
});

addEdit(atomicEdits, {
    name: "removeSelectNot",
    description: "Remove (excess) NOT from a select-element expression",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceSelectExpression(query, result, 
            removeNot, 
            meta.select.length, 
            Infinity);
    }
});

addEdit(atomicEdits, {
    name: "addSelectAggregationFunction",
    description: "Add (missing) aggregation-function to a select-element expression",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceSelectExpression(query, result,
            addAggregationFunction(meta.select.aggregations),
            meta.select.length, 
            meta.select.aggregationHeight, 
            meta.select);
    }
});

addEdit(atomicEdits, {
    name: "removeSelectAggregationFunction",
    description: "Remove (excess) aggregation-function from a select-element expression",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceSelectExpression(query, result, 
            removeAggregationFunction, 
            meta.select.length, 
            Infinity);
    }
});

addEdit(atomicEdits, {
    name: "setSelectAggregationFunctionDistinct",
    description: "Set (missing) distinct-declaration on an aggregation-function "+
        "in a select-element expression",
    cost: 2,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceSelectExpression(query, result, 
            setAggregationFunctionDistinct, 
            meta.select.length,
            meta.select.aggregationHeight);
    }
});

addEdit(atomicEdits, {
    name: "unsetSelectAggregationFunctionDistinct",
    description: "Unset (excess) distinct-declaration on an aggregation-function "+
        "in a select-element expression",
    cost: 2,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceSelectExpression(query, result, 
            unsetAggregationFunctionDistinct, 
            meta.select.length, 
            meta.select.aggregationHeight);
    }
});

addEdit(atomicEdits, {
    name: "addSelectBinaryExpression",
    description: "Add (missing) binary-expression to a select-element expression",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceSelectExpression(query, result, 
            addBaseBinaryExpression, 
            meta.select.length, 
            meta.select.binaryExpressionHeight, 
            meta.select);
    }
});

addEdit(atomicEdits, {
    name: "removeSelectBinaryExpression",
    description: "Remove (excess) binary-expression from a select-element expression",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceSelectExpression(query, result, 
            removeBinaryExpression, 
            meta.select.length, 
            Infinity);
    }
});

addEdit(atomicEdits, {
    name: "setSelectAlias",
    description: "Set (missing) explicit alias on a select-element",
    cost: 2,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        if(meta.select.as.length <= 0) return;

        for(let s=0; s<query.selectLength && s<meta.select.length; ++s) {
            const select = query.getSelect(s);
            if(select.as != null) continue;
            for(let a=0, n=meta.select.as.length; a<n; ++a) {
                result.push(query.setSelectElement(s, select.setAs(meta.select.as[a])));
            }
        }
    }
});

addEdit(atomicEdits, {
    name: "unsetSelectAlias",
    description: "Unset (excess) explicit alias on a select-element",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        for(let s=0; s<query.selectLength && s<meta.select.length; ++s) {
            const select = query.getSelect(s);
            if(select.as != null) result.push(query.setSelectElement(s, select.setAs(null)));
        }
    }
});








// === FROM ===

export function replaceFromExpression(
    query: Query, 
    result: Query[], 
    multimap: (x: Expression, context: ExpressionContext) => Expression[], 
    recursionDepth: number, 
    applyToFirst: boolean = false, 
    applyWithoutComplexJoin: boolean = false, 
    maxHeight: HeightInfo = null
): void {
    if(recursionDepth < 0) return;

    for(let f=(applyToFirst ? 0 : 1); f<query.fromLength; ++f) {
        const from = query.getFrom(f);
        if(!(applyWithoutComplexJoin || from.join!=null)) continue;
        const expressions = from.recursivelyReplaceOn(multimap, recursionDepth, query, maxHeight);
        for(let e=0, n=expressions.length; e<n; ++e) {
            result.push(query.setFromElement(f, from.setOn(expressions[e])));
        }
    }
}

addEdit(atomicEdits, {
    name: "addFromElement",
    description: "Add (missing) element in from-clause",
    cost: 2,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        if(query.fromLength >= meta.from.length) return;

        for(let f=0; f<=query.fromLength; ++f) {
            for(let table of meta.from.tables) {
                result.push(query.setFromElement(f, new FromElement(table), false));
            }
        }
    }
});

addEdit(atomicEdits, {
    name: "removeFromElement",
    description: "Remove (excess) element in from-clause",
    cost: 2,
    perform: (query: Query, _schema: Schema, _meta: MetaInfo, result: Query[]) => {
        for(let f=0; f<query.fromLength; ++f) {
            result.push(query.setFromElement(f, undefined));
        }
    }
});

addEdit(atomicEdits, {
    name: "setTableJoinType",
    description: "Set complex join-type on a from-element (change cross join to a complex join)",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        if(!meta.from.join) return;

        //start at second element because first cannot have complex join
        for(let f=1; f<query.fromLength; ++f) {
            const from = query.getFrom(f);
            if(from.join != null) continue;
            for(let item in JoinType) {
                if (isNaN(Number(item))) {
                    result.push(query.setFromElement(f,
                        from.setJoin(JoinType[item] as any as JoinType)));
                }
            }
        }
    }
});

addEdit(atomicEdits, {
    name: "unsetTableJoinType",
    description: "Unset complex join-type on a from-element (change complex join to cross join)",
    cost: 1,
    perform: (query: Query, _schema: Schema, _meta: MetaInfo, result: Query[]) => {
        for(let f=0; f<query.fromLength; ++f) {
            const from = query.getFrom(f);
            if(from.join != null) {
                result.push(query.setFromElement(f, from.setJoin(null)));
            }
        }
    }
});

addEdit(atomicEdits, {
    name: "addFromColumnReference",
    description: "Add (missing) column-reference to a from-element join-condition",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceFromExpression(query, result,
            addColumnReference(meta.from.columns),
            meta.from.columnReferenceHeight);
    }
});

addEdit(atomicEdits, {
    name: "removeFromColumnReference",
    description: "Remove (excess) column-reference from a from-element join-condition",
    cost: 1,
    perform: (query: Query, _schema: Schema, _meta: MetaInfo, result: Query[]) => {
        replaceFromExpression(query, result, removeColumnReference, Infinity, true, true);
    }
});

addEdit(atomicEdits, {
    name: "setFromColumnReferenceTable",
    description: "Set (missing) table name on a column-reference in a from-element join-condition",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceFromExpression(query, result, 
            setColumnReferenceTable,
            meta.from.columnReferenceHeight);
    }
});

addEdit(atomicEdits, {
    name: "unsetFromColumnReferenceTable",
    description:
        "Unset (excess) table name on a column-reference in a from-element join-condition",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceFromExpression(query, result, 
            unsetColumnReferenceTable,
            meta.from.columnReferenceHeight);
    }
});

addEdit(atomicEdits, {
    name: "addFromLiteral",
    description: "Add (missing) literal to a from-element join-condition",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceFromExpression(query, result, 
            addLiteral(meta.from.literals), 
            meta.from.literalHeight);
    }
});

addEdit(atomicEdits, {
    name: "removeFromLiteral",
    description: "Remove (excess) literal from a from-element join-condition",
    cost: 1,
    perform: (query: Query, _schema: Schema, _meta: MetaInfo, result: Query[]) => {
        replaceFromExpression(query, result, removeLiteral, Infinity, true, true);
    }
});

addEdit(atomicEdits, {
    name: "addFromNot",
    description: "Add (missing) NOT to a from-element join-condition",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceFromExpression(query, result, addNot, meta.from.notHeight, false, false, meta.from);
    }
});

addEdit(atomicEdits, {
    name: "removeFromNot",
    description: "Remove (excess) NOT from a from-element join-condition",
    cost: 1,
    perform: (query: Query, _schema: Schema, _meta: MetaInfo, result: Query[]) => {
        replaceFromExpression(query, result, removeNot, Infinity, true, true);
    }
});

addEdit(atomicEdits, {
    name: "addFromBinaryExpression",
    description: "Add (missing) binary-expression to a from-element join-condition",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceFromExpression(query, result,
            addBaseBinaryExpression,
            meta.from.binaryExpressionHeight, 
            false, 
            false, 
            meta.from);
    }
});

addEdit(atomicEdits, {
    name: "removeFromBinaryExpression",
    description: "Remove (excess) binary-expression from a from-element join-condition",
    cost: 1,
    perform: (query: Query, _schema: Schema, _meta: MetaInfo, result: Query[]) => {
        replaceFromExpression(query, result, removeBinaryExpression, Infinity, true, true);
    }
});

addEdit(atomicEdits, {
    name: "setFromAlias",
    description: "Set (missing) explicit alias on from-element",
    cost: 1,
    perform: (query: Query, schema: Schema, _meta: MetaInfo, result: Query[]) => {
        for(let f=0; f<query.fromLength; ++f) {
            const from = query.getFrom(f);
            if(from.as !== null || !schema.has(from.table)) continue;

            let as = schema.get(from.table).name.charAt(0);
            let asNr = 0;
            for(let exists = true; exists; asNr++) {
                exists = false;
                for(let f2=0; f2<query.fromLength; ++f2) {
                    if(query.getFrom(f2).as == (as + asNr)) {
                        exists = true;
                        break;
                    }
                }
            }
            result.push(query.setFromElement(f, from.setAs(as+asNr)));
        }
    }
});

addEdit(atomicEdits, {
    name: "unsetFromAlias",
    description: "Remove (excess) explicit alias from from-element",
    cost: 1,
    perform: (query: Query, _schema: Schema, _meta: MetaInfo, result: Query[]) => {
        for(let f=0; f<query.fromLength; ++f) {
            const from = query.getFrom(f);
            if(from.as !== null) {
                result.push(query.setFromElement(f, from.setAs(null)));
            }
        }
    }
});








// === Where ===

export function replaceWhereExpression(
    query: Query, 
    result: Query[], 
    multimap: (x: Expression, context: ExpressionContext) => Expression[], 
    recursionDepth: number,
    maxHeight: HeightInfo = null
): void {
    if(recursionDepth < 0) return;

    const expressions = query.recursivelyReplaceWhere(multimap, recursionDepth, maxHeight);
    for(let e=0, n=expressions.length; e<n; ++e) {
        result.push(query.setWhere(expressions[e]));
    }
}

addEdit(atomicEdits, {
    name: "addWhereColumnReference",
    description: "Add (missing) column-reference to the where-clause",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceWhereExpression(query, result,
            addColumnReference(meta.where.columns),
            meta.where.columnReferenceHeight);
    }
});

addEdit(atomicEdits, {
    name: "removeWhereColumnReference",
    description: "Remove (excess) column-reference from the where-clause",
    cost: 1,
    perform: (query: Query, _schema: Schema, _meta: MetaInfo, result: Query[]) => {
        replaceWhereExpression(query, result, removeColumnReference, Infinity);
    }
});

addEdit(atomicEdits, {
    name: "setWhereColumnReferenceTable",
    description: "Set (missing) table name on a column-reference in the where-clause",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceWhereExpression(query, result, 
            setColumnReferenceTable,
            meta.where.columnReferenceHeight);
    }
});

addEdit(atomicEdits, {
    name: "unsetWhereColumnReferenceTable",
    description: "Unset (excess) table name on a column-reference in the where-clause",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceWhereExpression(query, result, 
            unsetColumnReferenceTable,
            meta.where.columnReferenceHeight);
    }
});

addEdit(atomicEdits, {
    name: "addWhereLiteral",
    description: "Add (missing) literal to the where-clause",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceWhereExpression(query, result, 
            addLiteral(meta.where.literals), 
            meta.where.literalHeight);
    }
});

addEdit(atomicEdits, {
    name: "removeWhereLiteral",
    description: "Remove (excess) literal from the where-clause",
    cost: 1,
    perform: (query: Query, _schema: Schema, _meta: MetaInfo, result: Query[]) => {
        replaceWhereExpression(query, result, removeLiteral, Infinity);
    }
});

addEdit(atomicEdits, {
    name: "addWhereNot",
    description: "Add (missing) NOT to the where-clause",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceWhereExpression(query, result, addNot, meta.where.notHeight, meta.where);
    }
});

addEdit(atomicEdits, {
    name: "removeWhereNot",
    description: "Remove (excess) NOT from the where-clause",
    cost: 1,
    perform: (query: Query, _schema: Schema, _meta: MetaInfo, result: Query[]) => {
        replaceWhereExpression(query, result, removeNot, Infinity);
    }
});

addEdit(atomicEdits, {
    name: "addWhereBinaryExpression",
    description: "Add (missing) binary-expression to the where-clause",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceWhereExpression(query, result,
            addBaseBinaryExpression,
            meta.where.binaryExpressionHeight, 
            meta.where);
    }
});

addEdit(atomicEdits, {
    name: "removeWhereBinaryExpression",
    description: "Remove (excess) binary-expression from the where-clause",
    cost: 1,
    perform: (query: Query, _schema: Schema, _meta: MetaInfo, result: Query[]) => {
        replaceWhereExpression(query, result, removeBinaryExpression, Infinity);
    }
});








// === Group By ===

export function replaceGroupbyExpression(
    query: Query, 
    result: Query[], 
    multimap: (x: Expression, context: ExpressionContext) => Expression[], 
    recursionDepth: number,
    maxHeight: HeightInfo = null
): void {
    if(recursionDepth < 0) return;

    for(let g=0; g<query.groupbyLength; ++g) {
        const expressions = query.recursivelyReplaceGroupby(g, multimap, recursionDepth, maxHeight);
        for(let e=0, n=expressions.length; e<n; ++e) {
            result.push(query.setGroupbyElement(g, expressions[e]));
        }
    }
}

addEdit(atomicEdits, {
    name: "addGroupbyElement",
    description: "Add (missing) element in group-by-clause",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        if(query.groupbyLength >= meta.groupby.length) return;

        for(let g=0; g<=query.groupbyLength; ++g) {
            result.push(query.setGroupbyElement(g, null, false));
        }
    }
});

addEdit(atomicEdits, {
    name: "removeGroupbyElement",
    description: "Remove (excess) element in group-by-clause",
    cost: 2,
    perform: (query: Query, _schema: Schema, _meta: MetaInfo, result: Query[]) => {
        for(let g=0; g<query.groupbyLength; ++g) {
            result.push(query.setGroupbyElement(g, undefined));
        }
    }
});

addEdit(atomicEdits, {
    name: "addGroupbyColumnReference",
    description: "Add (missing) column reference to a group-by expression",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceGroupbyExpression(query, result,
            addColumnReference(meta.groupby.columns),
            meta.groupby.columnReferenceHeight);
    }
});

addEdit(atomicEdits, {
    name: "removeGroupbyColumnReference",
    description: "Remove (excess) column-reference from a group-by expression",
    cost: 1,
    perform: (query: Query, _schema: Schema, _meta: MetaInfo, result: Query[]) => {
        replaceGroupbyExpression(query, result, removeColumnReference, Infinity);
    }
});

addEdit(atomicEdits, {
    name: "setGroupbyColumnReferenceTable",
    description: "Set (missing) table name on a column reference in a group-by expression",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceGroupbyExpression(query, result, 
            setColumnReferenceTable,
            meta.groupby.columnReferenceHeight);
    }
});

addEdit(atomicEdits, {
    name: "unsetGroupbyColumnReferenceTable",
    description:
        "Unset (excess) table name on a column reference in a group-by expression",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceGroupbyExpression(query, result, 
            unsetColumnReferenceTable,
            meta.groupby.columnReferenceHeight);
    }
});

addEdit(atomicEdits, {
    name: "addGroupbyLiteral",
    description: "Add (missing) literal to a group-by expression",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceGroupbyExpression(query, result, 
            addLiteral(meta.groupby.literals), 
            meta.groupby.literalHeight);
    }
});

addEdit(atomicEdits, {
    name: "removeGroupbyLiteral",
    description: "Remove (excess) literal from a group-by expression",
    cost: 1,
    perform: (query: Query, _schema: Schema, _meta: MetaInfo, result: Query[]) => {
        replaceGroupbyExpression(query, result, removeLiteral, Infinity);
    }
});

addEdit(atomicEdits, {
    name: "addGroupbyNot",
    description: "Add (missing) NOT to a group-by expression",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceGroupbyExpression(query, result, addNot, meta.groupby.notHeight, meta.groupby);
    }
});

addEdit(atomicEdits, {
    name: "removeGroupbyNot",
    description: "Remove (excess) NOT from a group-by expression",
    cost: 1,
    perform: (query: Query, _schema: Schema, _meta: MetaInfo, result: Query[]) => {
        replaceGroupbyExpression(query, result, removeNot, Infinity);
    }
});

addEdit(atomicEdits, {
    name: "addGroupbyBinaryExpression",
    description: "Add (missing) binary expression to a group-by expression",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceGroupbyExpression(query, result,
            addBaseBinaryExpression,
            meta.groupby.columnReferenceHeight, 
            meta.groupby);
    }
});

addEdit(atomicEdits, {
    name: "removeGroupbyBinaryExpression",
    description: "Remove (excess) binary-expression from a group-by expression",
    cost: 1,
    perform: (query: Query, _schema: Schema, _meta: MetaInfo, result: Query[]) => {
        replaceGroupbyExpression(query, result, removeBinaryExpression, Infinity);
    }
});








// === Having ===

export function replaceHavingExpression(
    query: Query, 
    result: Query[], 
    multimap: (x: Expression, context: ExpressionContext) => Expression[], 
    recursionDepth: number,
    maxHeight: HeightInfo = null
): void {
    if(recursionDepth < 0) return;

    const expressions = query.recursivelyReplaceHaving(multimap, recursionDepth, maxHeight);
    for(let e=0, n=expressions.length; e<n; ++e) {
        result.push(query.setHaving(expressions[e]));
    }
}

addEdit(atomicEdits, {
    name: "addHavingColumnReference",
    description: "Add (missing) column reference to the having-clause",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceHavingExpression(query, result,
            addColumnReference(meta.having.columns),
            meta.having.columnReferenceHeight);
    }
});

addEdit(atomicEdits, {
    name: "removeHavingColumnReference",
    description: "Remove (excess) column-reference from the having-clause",
    cost: 1,
    perform: (query: Query, _schema: Schema, _meta: MetaInfo, result: Query[]) => {
        replaceHavingExpression(query, result, removeColumnReference, Infinity);
    }
});

addEdit(atomicEdits, {
    name: "setHavingColumnReferenceTable",
    description: "Set (missing) table name on a column reference in the having-clause",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceHavingExpression(query, result, 
            setColumnReferenceTable,
            meta.having.columnReferenceHeight);
    }
});

addEdit(atomicEdits, {
    name: "unsetHavingColumnReferenceTable",
    description: "Unset (excess) table name on a column reference in the having-clause",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceHavingExpression(query, result, 
            unsetColumnReferenceTable,
            meta.having.columnReferenceHeight);
    }
});

addEdit(atomicEdits, {
    name: "addHavingLiteral",
    description: "Add (missing) literal to the having-clause",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceHavingExpression(query, result, 
            addLiteral(meta.having.literals), 
            meta.having.literalHeight);
    }
});

addEdit(atomicEdits, {
    name: "removeHavingLiteral",
    description: "Remove (excess) literal from the having-clause",
    cost: 1,
    perform: (query: Query, _schema: Schema, _meta: MetaInfo, result: Query[]) => {
        replaceHavingExpression(query, result, removeLiteral, Infinity);
    }
});

addEdit(atomicEdits, {
    name: "addHavingNot",
    description: "Add (missing) NOT to the having-clause",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceHavingExpression(query, result, addNot, meta.having.notHeight, meta.having);
    }
});

addEdit(atomicEdits, {
    name: "removeHavingbyNot",
    description: "Remove (excess) NOT from the having-clause",
    cost: 1,
    perform: (query: Query, _schema: Schema, _meta: MetaInfo, result: Query[]) => {
        replaceHavingExpression(query, result, removeNot, Infinity);
    }
});

addEdit(atomicEdits, {
    name: "addHavingAggregationFunction",
    description: "Add (missing) aggregation function to the having-clause",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceHavingExpression(query, result,
            addAggregationFunction(meta.having.aggregations),
            meta.having.aggregationHeight, 
            meta.having);
    }
});

addEdit(atomicEdits, {
    name: "removeHavingAggregationFunction",
    description: "Remove (excess) aggregation-function from the having-clause",
    cost: 1,
    perform: (query: Query, _schema: Schema, _meta: MetaInfo, result: Query[]) => {
        replaceHavingExpression(query, result, removeAggregationFunction, Infinity);
    }
});

addEdit(atomicEdits, {
    name: "setHavingAggregationFunctionDistinct",
    description:
        "Set (missing) distinct-declaration on an aggregation function in the having-clause",
    cost: 2,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceHavingExpression(query, result, 
            setAggregationFunctionDistinct,
            meta.having.aggregationHeight);
    }
});

addEdit(atomicEdits, {
    name: "unsetHavingAggregationFunctionDistinct",
    description:
        "Unset (excess) distinct-declaration on an aggregation function in the having-clause",
    cost: 2,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceHavingExpression(query, result, 
            unsetAggregationFunctionDistinct,
            meta.having.aggregationHeight);
    }
});

addEdit(atomicEdits, {
    name: "addHavingBinaryExpression",
    description: "Add (missing) binary expression to the having-clause",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceHavingExpression(query, result,
            addBaseBinaryExpression,
            meta.having.binaryExpressionHeight, 
            meta.having);
    }
});

addEdit(atomicEdits, {
    name: "removeHavingBinaryExpression",
    description: "Remove (excess) binary-expression from the having-clause",
    cost: 1,
    perform: (query: Query, _schema: Schema, _meta: MetaInfo, result: Query[]) => {
        replaceHavingExpression(query, result, removeBinaryExpression, Infinity);
    }
});








// === Order By ===

export function replaceOrderbyExpression(
    query: Query, 
    result: Query[], 
    multimap: (x: Expression, context: ExpressionContext) => Expression[], 
    recursionDepth: number,
    maxHeight: HeightInfo = null
): void {
    if(recursionDepth < 0) return;

    for(let o=0; o<query.orderbyLength; ++o) {
        const orderby = query.getOrderby(o);
        const expressions = orderby.recursivelyReplaceExpression(
            multimap, recursionDepth, query, maxHeight);
        for(let e=0, n=expressions.length; e<n; ++e) {
            result.push(query.setOrderbyElement(o, orderby.setExpression(expressions[e])));
        }
    }
}

addEdit(atomicEdits, {
    name: "addOrderbyElement",
    description: "Add (missing) element in order-by-clause",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        if(query.orderbyLength >= meta.orderby.length) return;

        for(let o=0; o<=query.orderbyLength; ++o) {
            result.push(query.setOrderbyElement(o, OrderBy.baseOrderBy, false));
        }
    }
});

addEdit(atomicEdits, {
    name: "removeOrderbyElement",
    description: "Remove (excess) element in order-by-clause",
    cost: 1,
    perform: (query: Query, _schema: Schema, _meta: MetaInfo, result: Query[]) => {
        for(let o=0; o<query.orderbyLength; ++o) {
            result.push(query.setOrderbyElement(o));
        }
    }
});

addEdit(atomicEdits, {
    name: "setOrderbyDescending",
    description: "Set order of order-by-element from ascending to descending",
    cost: 1,
    perform: (query: Query, _schema: Schema, _meta: MetaInfo, result: Query[]) => {
        for(let o=0; o<query.orderbyLength; ++o) {
            const orderby = query.getOrderby(o);
            if(orderby.descending == false) {
                result.push(query.setOrderbyElement(o, orderby.setDescending(true)));
            }
        }
    }
});

addEdit(atomicEdits, {
    name: "unsetOrderbyDescending",
    description: "Set order of order-by-element from descending to ascending",
    cost: 1,
    perform: (query: Query, _schema: Schema, _meta: MetaInfo, result: Query[]) => {
        for(let o=0; o<query.orderbyLength; ++o) {
            const orderby = query.getOrderby(o);
            if(orderby.descending == true) {
                result.push(query.setOrderbyElement(o, orderby.setDescending(false)));
            }
        }
    }
});

addEdit(atomicEdits, {
    name: "addOrderbyColumnReference",
    description: "Add (missing) column reference to a order-by-element expression",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceOrderbyExpression(query, result,
            addColumnReference(meta.orderby.columns),
            meta.orderby.columnReferenceHeight);
    }
});

addEdit(atomicEdits, {
    name: "removeOrderbyColumnReference",
    description: "Remove (excess) column-reference from a order-by-element expression",
    cost: 1,
    perform: (query: Query, _schema: Schema, _meta: MetaInfo, result: Query[]) => {
        replaceOrderbyExpression(query, result, removeColumnReference, Infinity);
    }
});

addEdit(atomicEdits, {
    name: "setOrderbyColumnReferenceTable",
    description: "Set (missing) table name on a column reference in a order-by-element expression",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceOrderbyExpression(query, result, 
            setColumnReferenceTable,
            meta.orderby.columnReferenceHeight);
    }
});

addEdit(atomicEdits, {
    name: "unsetOrderbyColumnReferenceTable",
    description:
        "Unset (excess) table name on a column reference in a order-by-element expression",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceOrderbyExpression(query, result, 
            unsetColumnReferenceTable,
            meta.orderby.columnReferenceHeight);
    }
});

addEdit(atomicEdits, {
    name: "addOrderbyLiteral",
    description: "Add (missing) literal to a order-by-element expression",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceOrderbyExpression(query, result, 
            addLiteral(meta.orderby.literals), 
            meta.orderby.literalHeight);
    }
});

addEdit(atomicEdits, {
    name: "removeOrderbyLiteral",
    description: "Remove (excess) literal from a order-by-element expression",
    cost: 1,
    perform: (query: Query, _schema: Schema, _meta: MetaInfo, result: Query[]) => {
        replaceOrderbyExpression(query, result, removeLiteral, Infinity);
    }
});

addEdit(atomicEdits, {
    name: "addOrderbyNot",
    description: "Add (missing) NOT to a order-by-element expression",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceOrderbyExpression(query, result, addNot, meta.orderby.notHeight, meta.orderby);
    }
});

addEdit(atomicEdits, {
    name: "removeOrderbyNot",
    description: "Remove (excess) NOT from a order-by-element expression",
    cost: 1,
    perform: (query: Query, _schema: Schema, _meta: MetaInfo, result: Query[]) => {
        replaceOrderbyExpression(query, result, removeNot, Infinity);
    }
});

addEdit(atomicEdits, {
    name: "addOrderbyAggregationFunction",
    description: "Add (missing) aggregation function to a order-by-element expression",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceOrderbyExpression(query, result,
            addAggregationFunction(meta.orderby.aggregations),
            meta.orderby.aggregationHeight, 
            meta.orderby);
    }
});

addEdit(atomicEdits, {
    name: "removeOrderbyAggregationFunction",
    description: "Remove (excess) aggregation-function from a order-by-element expression",
    cost: 1,
    perform: (query: Query, _schema: Schema, _meta: MetaInfo, result: Query[]) => {
        replaceOrderbyExpression(query, result, removeAggregationFunction, Infinity);
    }
});

addEdit(atomicEdits, {
    name: "setOrderbyAggregationFunctionDistinct",
    description: "Set (missing) distinct-declaration on an aggregation function "+
        "in an order-by-element expression",
    cost: 2,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceOrderbyExpression(query, result, 
            setAggregationFunctionDistinct,
            meta.orderby.aggregationHeight);
    }
});

addEdit(atomicEdits, {
    name: "unsetOrderbyAggregationFunctionDistinct",
    description: "Unset (excess) distinct-declaration on an aggregation function "+
        "in an order-by-element expression",
    cost: 2,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceOrderbyExpression(query, result, 
            unsetAggregationFunctionDistinct,
            meta.orderby.aggregationHeight);
    }
});

addEdit(atomicEdits, {
    name: "addOrderbyBinaryExpression",
    description: "Add (missing) binary expression to a order-by-element expression",
    cost: 1,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceOrderbyExpression(query, result,
            addBaseBinaryExpression,
            meta.orderby.binaryExpressionHeight, 
            meta.orderby);
    }
});

addEdit(atomicEdits, {
    name: "removeOrderbyBinaryExpression",
    description: "Remove (excess) binary-expression from a order-by-element expression",
    cost: 1,
    perform: (query: Query, _schema: Schema, _meta: MetaInfo, result: Query[]) => {
        replaceOrderbyExpression(query, result, removeBinaryExpression, Infinity);
    }
});
