export enum CommonCellStatus {
    Unknown,
    DefinitelyWhite,
    DefinitelyBlack,
    AssumedlyWhite,
    AssumedlyBlack
}

export type UnraveledCell = CommonCellStatus.Unknown |
                             CommonCellStatus.DefinitelyBlack |
                             CommonCellStatus.DefinitelyWhite;

export type AssumedCell = CommonCellStatus.Unknown |
                           CommonCellStatus.AssumedlyBlack |
                           CommonCellStatus.AssumedlyWhite;
