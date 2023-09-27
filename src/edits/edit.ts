import { MetaInfo, Query, Schema } from "../sql";


/**
 * An edit, consisting of an identifying name, an intuitive desctiption, an integer cost
 * and a perform-function.
 */
export interface Edit {
    /**
     * A unique identifier for the edit.
     */
    name: string;
    /**
     * An intuitive desctiption in natural language of what the edit does.
     */
    description: string;
    /**
     * An integer cost quantifying the semantic difference the edit can cause.
     */
    cost: number;
    /**
     * A function, generating the neighbors of a given query by applying the edit on it.
     * Whether and how the edit is applied may depend on the database schema and a meta-info.
     * The result is returned via an out-parameter.
     *
     * @param query the query to apply the edit on
     * @param schema the database schema serving as context
     * @param info the meta-info, containing certain information about the destination
     * @param result the out-parameter list to store the generated neighbors into 
     */
    perform: (query: Query, schema: Schema, info: MetaInfo, result: Query[]) => void;
}

/**
 * A set of edits, represented as a map, indexed by the edit names.
 */
export type EditSet = Map<string, Edit>;

/**
 * Adds a given edit to a given set of edits.
 *
 * @param set the set of edit to add to
 * @param edit the edit to add
 * @throws an error if there already is an edit with the same name in the set
 *         or the edit's cost is not an integer
 */
export function addEdit(set: EditSet, edit: Edit): void {
    if(set.has(edit.name)) throw new Error(`Edit ${edit.name} already exists.`);
    if(edit.cost % 1 !== 0) throw new Error(`Edit cost ${edit.cost} is not an integer.`);
    set.set(edit.name, edit);
}
