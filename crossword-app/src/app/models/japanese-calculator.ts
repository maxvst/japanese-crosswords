import { CommonCellStatus, UnraveledCell, AssumedCell } from './field-status.model';

export enum IterationSize {
    All,
    Field,
    Line
}

enum LineType {
    Row,
    Column,
}

export interface JapaneseCalculatorConstructor {
    rowData: number[][];
    columnData: number[][];
    iterationSize?: IterationSize;
}

export class JapaneseCalculator {
    private rowData: number[][];
    private columnData: number[][];

    private fieldSizeX: number;
    private fieldSizeY: number;

    private iterationSize: IterationSize = IterationSize.Line;

    private field: CommonCellStatus[][];

    get currentField(): CommonCellStatus[][] {
        return this.field;
    }

    constructor(data: JapaneseCalculatorConstructor) {
        this.columnData = data.columnData;
        this.rowData = data.rowData;

        this.fieldSizeX = this.columnData.length;
        this.fieldSizeY = this.rowData.length;

        this.field = this.makeEmptyField(this.fieldSizeX, this.fieldSizeY);

        if (data.iterationSize) {
            this.iterationSize = data.iterationSize;
        }
    }

    private makeEmptyField(sizeX: number, sizeY: number): CommonCellStatus.Unknown[][] {
        const res: CommonCellStatus.Unknown[][] = [];
        for (let x = 0; x < sizeX; x++) {
            const column: CommonCellStatus.Unknown[] = [];
            for (let y = 0; y < sizeY; y++) {
                column[y] = CommonCellStatus.Unknown;
            }
            res[x] = column;
        }
        console.log ('res:');
        console.log (res);
        return res;
    }

    calculate = function*() {
        let isUpdateFieldSuccess = true;
        while (isUpdateFieldSuccess) {
            isUpdateFieldSuccess = false;
            for (const lineData of this.getAllConditionTemplatePairs()) {
                console.log ('lineData: ', lineData);
                const newUnraveledLine = this.calculateLine(lineData.condition, lineData.template);
                const isUpdateLineSuccess: boolean = this.updateLine(newUnraveledLine, lineData.type, lineData.index);
                if (isUpdateLineSuccess && this.iterationSize === IterationSize.Line) {
                    yield this.currentField;
                }
                isUpdateFieldSuccess = isUpdateLineSuccess || isUpdateFieldSuccess;
            }
            if (this.iterationSize === IterationSize.Field) {
                yield this.currentField;
            }
        }
        yield this.currentField;
    }

    private *getAllConditionTemplatePairs() {
        for (let rowIndex = 0; rowIndex < this.fieldSizeY; rowIndex++) {
            yield {
                condition: this.rowData[rowIndex],
                template: this.getRow(rowIndex),
                index: rowIndex,
                type: LineType.Row,
            };
        }
        for (let columnIndex = 0; columnIndex < this.fieldSizeX; columnIndex++) {
            yield {
                condition: this.columnData[columnIndex],
                template: this.getColumn(columnIndex),
                index: columnIndex,
                type: LineType.Column,
            };
        }
    }

    private getRow(index: number) {
        return this.field[index];
    }

    private getColumn(index: number) {
        return this.field.map(line => line[index]);
    }

    private calculateLine(condition: number[], template: UnraveledCell[]): UnraveledCell[] {
        const lineLength: number = template.length;
        const assumedLine: AssumedCell[] = (new Array(lineLength)).fill(CommonCellStatus.Unknown);
        let assumedLines: AssumedCell[][] = [];
        const assumedLineOffset = 0;
        console.log ('condition:', condition);
        console.log ('template:', template);
        assumedLines = this.getAllPossibleLineCombinations(template, condition, assumedLine, assumedLineOffset);
        return this.matchAssumedLines(assumedLines);
    }

    private getAllPossibleLineCombinations(template: UnraveledCell[],
                                           condition: number[],
                                           assumedLine: AssumedCell[],
                                           assumedLineOffset: number): AssumedCell[][] {
        let assumedLines: AssumedCell[][] = [];
        const maxOffset = assumedLine.length
                        - assumedLineOffset
                        - condition.reduce((sum, current) => sum + current, 0)
                        - (condition.length - 1);
        for (let offset = 0; offset <= maxOffset; offset++) {
            const nextAssumedLine: AssumedCell[] = assumedLine.slice(0);

            nextAssumedLine.fill(CommonCellStatus.AssumedlyWhite,
                                 assumedLineOffset,
                                 assumedLineOffset + offset);

            nextAssumedLine.fill(CommonCellStatus.AssumedlyBlack,
                                 assumedLineOffset + offset,
                                 assumedLineOffset + offset + condition[0]);

            if (condition.length > 1) {
                nextAssumedLine[assumedLineOffset + offset + condition[0]] = CommonCellStatus.AssumedlyWhite;
                const nextAssumedLineOffset = assumedLineOffset + offset + condition[0] + 1;
                const newAssumedLines = this.getAllPossibleLineCombinations(template,
                                                                            condition.slice(1),
                                                                            nextAssumedLine,
                                                                            nextAssumedLineOffset);
                assumedLines = assumedLines.concat(newAssumedLines);
            } else {
                nextAssumedLine.fill(CommonCellStatus.AssumedlyWhite,
                                     assumedLineOffset + offset + condition[0]);

                if (this.isAssumedLineMatchTemplate(nextAssumedLine, template)) {
                    assumedLines.push(nextAssumedLine);
                }
            }
        }
        return assumedLines;
    }

    private isAssumedLineMatchTemplate(line: AssumedCell[], template: UnraveledCell[]): boolean {
        for (let i = 0; i < template.length; i++) {
            if (template[i] === CommonCellStatus.DefinitelyBlack && line[i] !== CommonCellStatus.AssumedlyBlack) {
                return false;
            }
            if (template[i] === CommonCellStatus.DefinitelyWhite && line[i] !== CommonCellStatus.AssumedlyWhite) {
                return false;
            }
        }
        return true;
    }

    private updateLine(newLine: UnraveledCell[], lineType: LineType, index: number): boolean {
        console.log ('---------------------field0:------------------------------', this.field);
        if (lineType === LineType.Row) {
            if (this.field[index].every((cell, i) => cell === newLine[i])) {
                return false;
            } else {
                this.field = this.field.slice(0);
                this.field[index] = newLine;
                return true;
            }
        } else {
            let isFieldModified = false;
            for (let i = 0; i < newLine.length; i++) {
                if (this.field[i][index] !== newLine[i]) {

                    if (!isFieldModified) {
                        this.field = this.field.slice(0);
                        isFieldModified = true;
                    }
                    this.field[i] = this.field[i].slice(0);
                    this.field[i][index] = newLine[i];
                }
            }
            return isFieldModified;
        }
    }

    private matchAssumedLines(lines: AssumedCell[][]): UnraveledCell[] {
        console.log ('matching lines:');
        console.log (lines);
        const length = lines[0].length;
        const unraveledLine: UnraveledCell[] = [];

        for (let i = 0; i < length; i++) {
            const slice = lines.map(line => line[i]);
            if (slice.every(cell => cell === CommonCellStatus.AssumedlyBlack)) {
                unraveledLine.push(CommonCellStatus.DefinitelyBlack);
            } else if (slice.every(cell => cell === CommonCellStatus.AssumedlyWhite)) {
                unraveledLine.push(CommonCellStatus.DefinitelyWhite);
            } else {
                unraveledLine.push(CommonCellStatus.Unknown);
            }
        }
        return unraveledLine;
    }
}
