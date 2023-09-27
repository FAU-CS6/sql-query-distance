/**
 * A hashable object.
 */
export abstract class Hashable {
    protected constructor(readonly hash: number, readonly hashMax: number) { }
}
