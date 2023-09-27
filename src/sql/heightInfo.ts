// ============
//  HEIGHT INFO
// ============

/**
 * HeightInfo objects contain information about the height 
 * (= the length of the longest downward path to a leaf) 
 * of individual expression types within an expression (sub-)tree.
 */
export class HeightInfo {
    constructor(
        readonly columnReferenceHeight: number,
        readonly literalHeight: number,
        readonly notHeight: number,
        readonly aggregationHeight: number,
        readonly binaryExpressionHeight: number,
    ) {}

    public minDiff(info: HeightInfo): number {
        return Math.min(
            info.columnReferenceHeight < 0  ? Infinity
                : this.columnReferenceHeight  - info.columnReferenceHeight,
            info.literalHeight < 0          ? Infinity
                : this.literalHeight          - info.literalHeight,
            info.notHeight < 0              ? Infinity
                : this.notHeight              - info.notHeight,
            info.aggregationHeight < 0      ? Infinity 
                : this.aggregationHeight      - info.aggregationHeight,
            info.binaryExpressionHeight < 0 ? Infinity
                : this.binaryExpressionHeight - info.binaryExpressionHeight
        );
    }

    public static max(info1: HeightInfo, info2: HeightInfo): HeightInfo {
        return new HeightInfo(
            Math.max(info1.columnReferenceHeight, info2.columnReferenceHeight),
            Math.max(info1.literalHeight, info2.literalHeight),
            Math.max(info1.notHeight, info2.notHeight),
            Math.max(info1.aggregationHeight, info2.aggregationHeight),
            Math.max(info1.binaryExpressionHeight, info2.binaryExpressionHeight)
        );
    }

    public static readonly EMPTY = 
        new HeightInfo(-1, -1, -1, -1, -1);

    public increase(): HeightInfo {
        return new HeightInfo(
            this.columnReferenceHeight  >= 0 ? this.columnReferenceHeight   + 1 : -1, 
            this.literalHeight          >= 0 ? this.literalHeight           + 1 : -1, 
            this.notHeight              >= 0 ? this.notHeight               + 1 : -1, 
            this.aggregationHeight      >= 0 ? this.aggregationHeight       + 1 : -1, 
            this.binaryExpressionHeight >= 0 ? this.binaryExpressionHeight  + 1 : -1
        );
    }
}
