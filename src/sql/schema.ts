import { Query } from "./query";
import { ColumnReference } from "./query/columnReference";
import { Expression } from "./query/expression";

// =================
//  Database Schema
// =================

// export enum DataType {
//     VARCHAR, INTEGER, DATETIME
// };

/**
 * A column of a table of a database schema.
 */
export interface Column {
    /**
     * The name of the column.
     */
    readonly name: string;

    // readonly datatype: DataType;
    // readonly not_null: boolean;
    // readonly unique: boolean;
    // readonly primary_key: boolean;
    // readonly foreign_key: boolean;
    // readonly foreign_table: string;
}


/**
 * A table of a database schema, containing columns indexed by their name.
 */
export interface Table extends Map<string, Column> {
    /**
     * The name of the table.
     */
    readonly name: string;
}


/**
 * A databse schema, containing tables indexed by their name.
 */
export class Schema extends Map<string, Table> {
    private static collectAllColumnReferences(query: Query): ColumnReference[] {
        const columnReferences: ColumnReference[] = [];
        const collect = (x: Expression): Expression[] => {
            if(ColumnReference.isColumnReference(x)) columnReferences.push(x);
            return [];
        }
        for(let s=0; s<query.selectLength; ++s)
            query.getSelect(s).recursivelyReplaceExpression(collect, Infinity, query);
        for(let f=0; f<query.fromLength; ++f)
            query.getFrom(f).recursivelyReplaceOn(collect, Infinity, query);
        query.recursivelyReplaceWhere(collect, Infinity);
        for(let g=0; g<query.groupbyLength; ++g)
            query.recursivelyReplaceGroupby(g, collect, Infinity);
        query.recursivelyReplaceHaving(collect, Infinity);
        for(let o=0; o<query.orderbyLength; ++o)
            query.getOrderby(o).recursivelyReplaceExpression(collect, Infinity, query);
        return columnReferences;
    }

    public static deduceSchema(query: Query): Schema {
        if(!query) throw new Error("Query required to deduce the schema from.");
        const schema: Schema = new Schema();
        const columnReferences = Schema.collectAllColumnReferences(query);
        for(let f=0; f<query.fromLength; ++f) {
            const table: Table = Object.assign(new Map(), {name: query.getFrom(f).table});
            schema.set(table.name, table);
            for(let c=0; c<columnReferences.length; ++c) {
                if((!columnReferences[c].table)
                    || columnReferences[c].table == query.getFrom(f).alias)
                    table.set(columnReferences[c].column, {name: columnReferences[c].column});
            }
        }
        return schema;
    }
}
