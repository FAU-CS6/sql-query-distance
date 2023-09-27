import { Schema, Query, MetaInfo, Expression, BinaryExpression, JoinType, OperatorType,
    Not, HeightInfo, Asterisk, SelectElement, ColumnReference, ExpressionContext} from "../sql";
import { replaceFromExpression, replaceGroupbyExpression, replaceHavingExpression,
    replaceOrderbyExpression, replaceSelectExpression,
    replaceWhereExpression } from "./atomicEdits";
import { EditSet, addEdit } from "./edit";




// ==============
// Shortcut Edits
// ==============

/**
 * The set of shortcut edits, represented as a map, indexed by the edit names.
 */
export const shortcutEdits: EditSet = new Map();




function isBoolean(x: Expression): boolean {
    return Not.isNot(x) 
        || (BinaryExpression.isBinaryExpression(x) && BinaryExpression.isBoolean(x.operator));
}

function applyTautologyLaw(x: Expression, context: ExpressionContext) {
    const res: Expression[] = [];
    //forward application:
    //context.maxHeight >= context.stack.length + x.height + 1 => can I increase tree height by 1?
    if(isBoolean(x) && context.maxHeight.minDiff(x.height) >= context.stack.length + 1) {
        res.push(new BinaryExpression(OperatorType.AND, x, x));
        res.push(new BinaryExpression(OperatorType.OR, x, x));
    }
    //backward application:
    if(BinaryExpression.isBinaryExpression(x) 
        && (x.operator==OperatorType.AND || x.operator==OperatorType.OR) 
        && isBoolean(x.left) 
        && (x.left==x.right || (x.left && x.left.equals(x.right, context.query, context.query)))) {
        res.push(x.left);
    }
    return res;
}

function applyDoubleNegationLaw(x: Expression, context: ExpressionContext) {
    const res: Expression[] = [];
    //forward application:
    //context.maxHeight >= context.stack.length + x.height + 2 => can I increase tree height by 2?
    if(isBoolean(x) && context.maxHeight.minDiff(x.height) >= context.stack.length+2) {
        res.push(new Not(new Not(x)))
    }
    //backward application:
    if(Not.isNot(x) && Not.isNot(x.argument) && isBoolean(x.argument.argument)) {
        res.push(x.argument.argument);
    }
    return res;
}

function applyDistributiveLaw(x: Expression, context: ExpressionContext) {
    if(!BinaryExpression.isBinaryExpression(x)) return [];

    const res: Expression[] = [];
    //forward application:
    if(BinaryExpression.isBinaryExpression(x.left) 
        && BinaryExpression.isDistributive(x.operator, x.left.operator) 
        && (x.right==null 
            || context.maxHeight.minDiff(x.right.height) >= context.stack.length+2)) {
        res.push(x.setOperator(x.left.operator)
            .setLeft(new BinaryExpression(x.operator, x.left.left, x.right))
            .setRight(new BinaryExpression(x.operator, x.left.right, x.right)));
    }
    if(BinaryExpression.isBinaryExpression(x.right) 
        && BinaryExpression.isDistributive(x.operator, x.right.operator) 
        && (x.left==null 
            || context.maxHeight.minDiff(x.left.height) >= context.stack.length+2)) {
        res.push(x.setOperator(x.right.operator)
            .setLeft(new BinaryExpression(x.operator, x.left, x.right.left))
            .setRight(new BinaryExpression(x.operator, x.left, x.right.right)));
    }
    //backward application:
    if(BinaryExpression.isBinaryExpression(x.left) 
        && BinaryExpression.isBinaryExpression(x.right) 
        && x.left.operator==x.right.operator 
        && BinaryExpression.isDistributive(x.operator, x.left.operator)) {
        if(x.left.left==x.right.left 
            || (x.left.left 
                && x.left.left.equals(x.right.left, context.query, context.query))) {
            res.push(x.setOperator(x.left.operator)
                .setLeft(x.left.left)
                .setRight(new BinaryExpression(x.operator, x.left.right, x.right.right)));
        }
        if(x.left.right === x.right.right 
            || (x.left.right 
                && x.left.right.equals(x.right.right, context.query, context.query))) {
            res.push(x.setOperator(x.left.operator)
                .setLeft(new BinaryExpression(x.operator, x.left.left, x.right.left))
                .setRight(x.left.right));
        }
    }
    return res;
}

function applyDeMorgan(x: Expression) {
    const res: Expression[] = [];
    //forward application:
    if(Not.isNot(x) && BinaryExpression.isBinaryExpression(x.argument)) {
        if(x.argument.operator==OperatorType.AND) {
            res.push(x.argument
                .setOperator(OperatorType.OR)
                .setLeft(new Not(x.argument.left))
                .setRight(new Not(x.argument.right)));
        } else if(x.argument.operator==OperatorType.OR) {
            res.push(x.argument
                .setOperator(OperatorType.AND)
                .setLeft(new Not(x.argument.left))
                .setRight(new Not(x.argument.right)));
        }
    } 
    //backward application:
    else if(BinaryExpression.isBinaryExpression(x) && Not.isNot(x.left) && Not.isNot(x.right)) {
        if(x.operator==OperatorType.AND) {
            res.push(new Not(x
                .setOperator(OperatorType.OR)
                .setLeft(x.left.argument)
                .setRight(x.right.argument)));
        } else if(x.operator==OperatorType.OR) {
            res.push(new Not(x
                .setOperator(OperatorType.AND)
                .setLeft(x.left.argument)
                .setRight(x.right.argument)));
        }
    }
    return res;
}

function applyAbsorptionLaw(x: Expression, context: ExpressionContext) {
    if(!BinaryExpression.isBinaryExpression(x) 
        || (x.operator!=OperatorType.AND && x.operator!=OperatorType.OR)) return [];
    
    const res: Expression[] = [];
    //forward application:
    if((x.left==null || isBoolean(x.left)) 
        && BinaryExpression.isBinaryExpression(x.right) 
        && (x.right.operator == (x.operator==OperatorType.OR ? OperatorType.AND : OperatorType.OR)) 
        && (x.left==x.right.left 
            || (x.left && x.left.equals(x.right.left, context.query, context.query)) 
            || x.left==x.right.right 
            || (x.left && x.left.equals(x.right.right, context.query, context.query)))) {
        res.push(x.left);
    }
    if((x.right==null || isBoolean(x.right))
        && BinaryExpression.isBinaryExpression(x.left) 
        && (x.left.operator == (x.operator==OperatorType.OR ? OperatorType.AND : OperatorType.OR)) 
        && (x.right==x.left.left 
            || (x.right && x.right.equals(x.left.left, context.query, context.query)) 
            || x.right==x.left.right 
            || (x.right && x.right.equals(x.left.right, context.query, context.query)))) {
        res.push(x.right);
    }
    //backward application: would require generating infinitely many expression sub-trees
    //-> instead, forward-version of absorption law should be executed on the destination
    //before starting the search (this is currently not implemented, yet)
    return res;
}

function unsetColumnReferenceUnnecessaryTable(x: Expression, context: ExpressionContext): Expression[] {
    throw Error("not implemented, yet"); //TODO: implement
}








// === SELECT ===

addEdit(shortcutEdits, {
    name: "applySelectTautologyLaw",
    description: "Apply tautology law in a select-element expression",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceSelectExpression(query, result, 
            applyTautologyLaw, 
            meta.select.length, 
            meta.select.binaryExpressionHeight, 
            meta.select);
    }
});

addEdit(shortcutEdits, {
    name: "applySelectDoubleNegationLaw",
    description: "Apply double negation law in a select-element expression",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceSelectExpression(query, result, 
            applyDoubleNegationLaw, 
            meta.select.length, 
            meta.select.notHeight, 
            meta.select);
    }
});

addEdit(shortcutEdits, {
    name: "applySelectDistributiveLaw",
    description: "Apply distibutive law in a select-element expression",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceSelectExpression(query, result, 
            applyDistributiveLaw, 
            meta.select.length, 
            meta.select.binaryExpressionHeight, 
            meta.select);
    }
});

addEdit(shortcutEdits, {
    name: "applySelectDeMorgan",
    description: "Apply De Morgan's law in a select-element expression",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceSelectExpression(query, result, 
            applyDeMorgan, 
            meta.select.length, 
            Math.max(meta.select.binaryExpressionHeight, meta.select.notHeight));
    }
});

addEdit(shortcutEdits, {
    name: "applySelectAbsorptionLaw",
    description: "Apply absorption law in a select-element expression",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceSelectExpression(query, result, 
            applyAbsorptionLaw, 
            meta.select.length, 
            meta.select.binaryExpressionHeight);
    }
});

// addEdit(shortcutEdits, {
//     name: "unsetSelectColumnReferenceRedundantTable",
//     description:
//         "Unset (redundant) table name on a column-reference in a select-element expression",
//     cost: 0,
//     perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
//         replaceSelectExpression(query, result, 
//             unsetColumnReferenceUnnecessaryTable,
//             meta.select.columnReferenceHeight);
//     }
// });








// === FROM ===

addEdit(shortcutEdits, {
    name: "applyFromTautologyLaw",
    description: "Apply tautology law in a from-element join-condition",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceFromExpression(query, result, 
            applyTautologyLaw,
            meta.from.binaryExpressionHeight, 
            false, 
            false, 
            meta.from);
    }
});

addEdit(shortcutEdits, {
    name: "applyFromDoubleNegationLaw",
    description: "Apply double negation law in a from-element join-condition",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceFromExpression(query, result, 
            applyDoubleNegationLaw,
            meta.from.notHeight, 
            false, 
            false, 
            meta.from);
    }
});

addEdit(shortcutEdits, {
    name: "applyFromDistributiveLaw",
    description: "Apply distibutive law in a from-element join-condition",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceFromExpression(query, result, 
            applyDistributiveLaw,
            meta.from.binaryExpressionHeight, 
            false, 
            false, 
            meta.from);
    }
});

addEdit(shortcutEdits, {
    name: "applyFromDeMorgan",
    description: "Apply De Morgan's law in a from-element join-condition",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceFromExpression(query, result, 
            applyDeMorgan,
            Math.max(meta.from.binaryExpressionHeight, meta.from.notHeight));
    }
});

addEdit(shortcutEdits, {
    name: "applyFromAbsorptionLaw",
    description: "Apply absorption law in a from-element join-condition",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceFromExpression(query, result, 
            applyAbsorptionLaw,
            meta.from.binaryExpressionHeight);
    }
});








// === WHERE ===

addEdit(shortcutEdits, {
    name: "applyWhereTautologyLaw",
    description: "Apply tautology law in the where-clause",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceWhereExpression(query, result, 
            applyTautologyLaw,
            meta.where.binaryExpressionHeight, 
            meta.where);
    }
});

addEdit(shortcutEdits, {
    name: "applyWhereDoubleNegationLaw",
    description: "Apply double negation law in the where-clause",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceWhereExpression(query, result, 
            applyDoubleNegationLaw,
            meta.where.notHeight, 
            meta.where);
    }
});

addEdit(shortcutEdits, {
    name: "applyWhereDistributiveLaw",
    description: "Apply distibutive law in the where-clause",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceWhereExpression(query, result, 
            applyDistributiveLaw,
            meta.where.binaryExpressionHeight, 
            meta.where);
    }
});

addEdit(shortcutEdits, {
    name: "applyWhereDeMorgan",
    description: "Apply De Morgan's law in the where-clause",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceWhereExpression(query, result, 
            applyDeMorgan,
            Math.max(meta.where.binaryExpressionHeight, meta.where.notHeight));
    }
});

addEdit(shortcutEdits, {
    name: "applyWhereAbsorptionLaw",
    description: "Apply absorption law in the where-clause",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceWhereExpression(query, result, 
            applyAbsorptionLaw,
            meta.where.binaryExpressionHeight);
    }
});








// === GROUP BY ===

addEdit(shortcutEdits, {
    name: "applyGroupbyTautologyLaw",
    description: "Apply tautology law in a group-by expression",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceGroupbyExpression(query, result, 
            applyTautologyLaw,
            meta.groupby.binaryExpressionHeight, 
            meta.groupby);
    }
});

addEdit(shortcutEdits, {
    name: "applyGroupbyDoubleNegationLaw",
    description: "Apply double negation law in a group-by expression",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceGroupbyExpression(query, result, 
            applyDoubleNegationLaw,
            meta.groupby.notHeight, 
            meta.groupby);
    }
});

addEdit(shortcutEdits, {
    name: "applyGroupbyDistributiveLaw",
    description: "Apply distibutive law in a group-by expression",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceGroupbyExpression(query, result, 
            applyDistributiveLaw,
            meta.groupby.binaryExpressionHeight, 
            meta.groupby);
    }
});

addEdit(shortcutEdits, {
    name: "applyGroupbyDeMorgan",
    description: "Apply De Morgan's law in a group-by expression",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceGroupbyExpression(query, result, 
            applyDeMorgan,
            Math.max(meta.groupby.binaryExpressionHeight, meta.groupby.notHeight));
    }
});

addEdit(shortcutEdits, {
    name: "applyGroupbyAbsorptionLaw",
    description: "Apply absorption law in a group-by expression",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceGroupbyExpression(query, result, 
            applyAbsorptionLaw,
            meta.groupby.binaryExpressionHeight);
    }
});








// === Having ===

addEdit(shortcutEdits, {
    name: "applyHavingTautologyLaw",
    description: "Apply tautology law in the having-clause",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceHavingExpression(query, result, 
            applyTautologyLaw,
            meta.having.binaryExpressionHeight, 
            meta.having);
    }
});

addEdit(shortcutEdits, {
    name: "applyHavingDoubleNegationLaw",
    description: "Apply double negation law in the having-clause",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceHavingExpression(query, result, 
            applyDoubleNegationLaw,
            meta.having.notHeight-1, 
            meta.having);
    }
});

addEdit(shortcutEdits, {
    name: "applyHavingDistributiveLaw",
    description: "Apply distibutive law in the having-clause",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceHavingExpression(query, result, 
            applyDistributiveLaw,
            meta.having.binaryExpressionHeight, 
            meta.having);
    }
});

addEdit(shortcutEdits, {
    name: "applyHavingDeMorgan",
    description: "Apply De Morgan's law in the having-clause",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceHavingExpression(query, result, 
            applyDeMorgan,
            Math.max(meta.having.binaryExpressionHeight, meta.having.notHeight));
    }
});

addEdit(shortcutEdits, {
    name: "applyHavingAbsorptionLaw",
    description: "Apply absorption law in the having-clause",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceHavingExpression(query, result, 
            applyAbsorptionLaw,
            meta.having.binaryExpressionHeight);
    }
});








// === Order By ===

addEdit(shortcutEdits, {
    name: "applyOrderbyTautologyLaw",
    description: "Apply tautology law in a order-by expression",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceOrderbyExpression(query, result, 
            applyTautologyLaw,
            meta.orderby.binaryExpressionHeight, 
            meta.orderby);
    }
});

addEdit(shortcutEdits, {
    name: "applyOrderbyDoubleNegationLaw",
    description: "Apply double negation law in a order-by expression",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceOrderbyExpression(query, result, 
            applyDoubleNegationLaw,
            meta.orderby.notHeight, 
            meta.orderby);
    }
});

addEdit(shortcutEdits, {
    name: "applyOrderbyDistributiveLaw",
    description: "Apply distibutive law in a order-by expression",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceOrderbyExpression(query, result, 
            applyDistributiveLaw,
            meta.orderby.binaryExpressionHeight, 
            meta.orderby);
    }
});

addEdit(shortcutEdits, {
    name: "applyOrderbyDeMorgan",
    description: "Apply De Morgan's law in a order-by expression",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceOrderbyExpression(query, result, 
            applyDeMorgan,
            Math.max(meta.orderby.binaryExpressionHeight, meta.orderby.notHeight));
    }
});

addEdit(shortcutEdits, {
    name: "applyOrderbyAbsorptionLaw",
    description: "Apply absorption law in a order-by expression",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        replaceOrderbyExpression(query, result, 
            applyAbsorptionLaw,
            meta.orderby.binaryExpressionHeight);
    }
});








// === Multi-clause transformations ===

function extractFirstLevelConjugate(removed: Expression[]) {
    return (x: Expression, context: ExpressionContext) => {
        if(!BinaryExpression.isBinaryExpression(x) || x.operator!=OperatorType.AND) return [];
        for(let s=context.stack.length-1; s>=0; --s) {
            const se = context.stack[s];
            if(!BinaryExpression.isBinaryExpression(se) 
                || se.operator!=OperatorType.AND) return [];
        }

        const res: Expression[] = [];
        if(x.left!=null) {
            removed.push(x.left);
            res.push(x.right);
        }
        if(x.right!=null) {
            removed.push(x.right);
            res.push(x.left);
        }
        return res;
    }
}

addEdit(shortcutEdits, {
    name: "moveInnerJoinConditionToWhere",
    description: "Move the join-condition of an INNER JOIN to the where-clause",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        if((meta.where.binaryExpressionHeight < 0 
                && meta.where.columnReferenceHeight < 0 
                && meta.where.literalHeight < 0)
            || (query.where && meta.where.minDiff(query.where.height) < 1)) return;

        for(let f=1; f<query.fromLength; ++f) {
            const fe = query.getFrom(f);
            if(fe.on==null || fe.join!=JoinType.INNER) continue;

            const removed: Expression[] = [];
            const expressions = fe.recursivelyReplaceOn(
                extractFirstLevelConjugate(removed), 
                Infinity, 
                query);
            removed.push(fe.on);
            expressions.push(null);

            for(let e=0, n=expressions.length; e<n; ++e) {
                if(removed[e] 
                    && meta.where.minDiff(removed[e].height) < (query.where == null ? 0 : 1)) {
                    continue;
                }

                result.push(query.setFromElement(f, fe
                    .setJoin(expressions[e]==null ? null : fe.join)
                    .setOn(expressions[e])
                    ).setWhere(query.where==null ? removed[e] :
                        new BinaryExpression(OperatorType.AND, removed[e], query.where)));
            }
        }
    }
});

addEdit(shortcutEdits, {
    name: "moveWhereToInnerJoinCondition",
    description: "Move expression from the where-clause to the join-condition of an INNER JOIN",
    cost: 0,
    perform: (query: Query, _schema: Schema, meta: MetaInfo, result: Query[]) => {
        if(query.where==null 
            || (meta.from.binaryExpressionHeight < 0 
                && meta.from.columnReferenceHeight < 0 
                && meta.from.literalHeight < 0)) return;
        
        const removed: Expression[] = [];
        const expressions = query.recursivelyReplaceWhere(
            extractFirstLevelConjugate(removed), 
            meta.where.binaryExpressionHeight);
        removed.push(query.where);
        expressions.push(null);

        for(let f=1; f<query.fromLength; ++f) {
            const fe = query.getFrom(f);
            if((fe.join!=null && fe.join!=JoinType.INNER) 
                || (fe.on && meta.from.minDiff(fe.on.height) < 1)) continue;

            for(let e=0, n=expressions.length; e<n; ++e) {
                if(removed[e] 
                    && meta.from.minDiff(removed[e].height) < (fe.on == null ? 0 : 1)) {
                    continue;
                }

                result.push(query
                    .setWhere(expressions[e])
                    .setFromElement(f, fe
                        .setJoin(JoinType.INNER)
                        .setOn(fe.on==null ? removed[e] :
                            new BinaryExpression(OperatorType.AND, removed[e], fe.on))));
            }
        }
    }
});


addEdit(shortcutEdits, {
    name: "expandAsterisk",
    description: "Replace an asterisk with the expressions it represents",
    cost: 0,
    perform: (query: Query, schema: Schema, meta: MetaInfo, result: Query[]) => {
        if(query.groupbyLength > 0) {
            for(let s=0; s<query.selectLength && s<meta.select.length; ++s) {
                const se = query.getSelect(s);
                if(!Asterisk.isAsterisk(se.expression) || se.expression.table!=null) continue;

                let groups: SelectElement[] = [];
                for(let g=0; g<query.groupbyLength; ++g) {
                    groups.push(new SelectElement(query.getGroupby(g)));
                }
                let select = query.copySelect();
                select.splice(s, 1, ...groups);
                result.push(query.setSelect(select));
            }
        } else {
            for(let s=0; s<query.selectLength && s<meta.select.length; ++s) {
                const se = query.getSelect(s);
                if(!Asterisk.isAsterisk(se.expression)) continue;

                let columns: SelectElement[] = [];
                if(se.expression.table==null) {
                    if(query.fromLength <= 0) continue;
                    for(let f=0; f<query.fromLength; ++f) {
                        let fe = query.getFrom(f);
                        let table = fe.table
                        for(let [column] of schema.get(table)) {
                            let tableAliasRequired = false;
                            for(let [otherTable] of schema) {
                                if(otherTable == table) continue;
                                if(schema.get(otherTable).has(column)) {
                                    tableAliasRequired = true;
                                    break;
                                }
                            }
                            columns.push(new SelectElement(new ColumnReference(column, 
                                tableAliasRequired ? fe.alias : null)));
                        }
                    }
                } else {
                    let t = se.expression.table;
                    for(let f=0; f<query.fromLength; ++f) {
                        const fe = query.getFrom(f);
                        if(fe.alias == t) {
                            t = fe.table;
                            break;
                        }
                    }
                    const table = schema.get(t);
                    if(!table) continue;
                    for(let [column] of table) {
                        let tableAliasRequired = false;
                        for(let [otherTable] of schema) {
                            if(otherTable == t) continue;
                            if(schema.get(otherTable).has(column)) {
                                tableAliasRequired = true;
                                break;
                            }
                        }
                        columns.push(new SelectElement(new ColumnReference(column, 
                            tableAliasRequired ? se.expression.table : null)));
                    }
                }
                //if(query.selectLength + columns.length - 1 <= meta.select.length)
                let select = query.copySelect();
                select.splice(s, 1, ...columns);
                result.push(query.setSelect(select));
            }
        }
    }
});

addEdit(shortcutEdits, {
    name: "collapseAsterisk",
    description: "Replace a number of expressions with an asterisk representing them",
    cost: 0,
    perform: (query: Query, schema: Schema, meta: MetaInfo, result: Query[]) => {
        if(!meta.select.asterisk) return;

        if(query.groupbyLength > 0) {
            // TODO
        } else if(query.fromLength > 0) {
            for(let s=0; s<query.selectLength && s<meta.select.length; ++s) {
                let replaceAll = true;
                let sAll = s;
                for(let f=0; f<query.fromLength; ++f) {
                    const fe = query.getFrom(f);
                    if(!schema.has(fe.table) || schema.get(fe.table).size>query.selectLength-s) {
                        replaceAll = false;
                        continue;
                    }
                    let replaceOne = true;
                    let sOne = s;
                    for(let [column] of schema.get(fe.table)) {
                        if(replaceAll && sAll < query.selectLength) {
                            const se = query.getSelect(sAll);
                            if(!ColumnReference.isColumnReference(se.expression) 
                                || se.expression.column != column 
                                || (se.expression.table!=null && se.expression.table!=fe.alias)) {
                                replaceAll = false;
                            }
                            ++sAll;
                            if(sAll > query.selectLength) replaceAll = false;
                        }
                        if(replaceOne && sOne < query.selectLength) {
                            const se = query.getSelect(sOne);
                            if(!ColumnReference.isColumnReference(se.expression) 
                                || se.expression.column != column 
                                || (se.expression.table!=null && se.expression.table!=fe.alias)) {
                                replaceOne = false;
                            }
                            ++sOne;
                            if(sOne > query.selectLength) replaceOne = false;
                        }
                        if(!(replaceAll || replaceOne)) break;
                    }
                    if(replaceOne && sOne > s) {
                        let select = query.copySelect();
                        select.splice(s, sOne - s, new SelectElement(new Asterisk(fe.alias)));
                        result.push(query.setSelect(select));
                    }
                }
                if(replaceAll && sAll > s) {
                    let select = query.copySelect();
                    select.splice(s, sAll - s, new SelectElement(Asterisk.baseAsterisk));
                    result.push(query.setSelect(select));
                }
            }
        }
    }
});

//TODO: other Shortcut edits
