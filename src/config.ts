import { EditSet } from "./edits/edit";
import { atomicEdits } from "./edits/atomicEdits";
import { horizontalEdits } from "./edits/horizontalEdits";
import { shortcutEdits } from "./edits/shortcutEdits";

export { Edit, EditSet } from "./edits/edit";
export { atomicEdits } from "./edits/atomicEdits";
export { horizontalEdits } from "./edits/horizontalEdits";
export { shortcutEdits } from "./edits/shortcutEdits";


/**
 * Copies the entries of one set of edits to another.
 *
 * @param from the set of edits to copy from
 * @param to the set of edit to copy to 
 */
function copyEntries(from: EditSet, to: EditSet) {
    for(let [key, value] of from) to.set(key, Object.assign({}, value));
}

/**
 * Creates and returns a new set of edits with default cost configuration
 * by merging [[`atomicEdits`]], [[`horizontalEdits`]] and [[`shortcutEdits`]].
 *
 * @returns a set of edits with default configuration
 */
export function createDefaultConfig(): EditSet {
    let defaultConfig: EditSet = new Map();
    copyEntries(atomicEdits, defaultConfig);
    copyEntries(horizontalEdits, defaultConfig);
    copyEntries(shortcutEdits, defaultConfig);
    return defaultConfig;
}
