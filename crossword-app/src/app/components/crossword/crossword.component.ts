import { Component, OnInit } from '@angular/core';
import { UnraveledCell, CommonCellStatus } from '../../models/field-status.model';
import { JapaneseCalculator, JapaneseCalculatorConstructor } from 'src/app/models/japanese-calculator';

@Component({
  selector: 'app-crossword',
  templateUrl: './crossword.component.html',
  styleUrls: ['./crossword.component.less']
})
export class CrosswordComponent implements OnInit {

  field: UnraveledCell[][] = null;
  fieldSizeX: number = null;
  fieldSizeY: number = null;
  rowNumbers: number[][] = null;
  columnNumbers: number[][] = null;

  calculator: JapaneseCalculator;

  constructor() {
    this.fieldSizeX = 9;
    this.fieldSizeY = 9;
    this.rowNumbers = [[2, 2], [4, 4], [9], [9], [9], [7], [5], [3], [1]];
    this.columnNumbers = [[4], [6], [7], [7], [7], [7], [7], [6], [4]];
    Object.freeze(this.rowNumbers);
    for (const i of this.rowNumbers) {
      Object.freeze(i);
    }
    // this.field = this.getEmptyField(this.columnNumbers.length, this.rowNumbers.length);
  }

  ngOnInit() {
  }

  run() {
    this.calculator = new JapaneseCalculator({rowData: this.rowNumbers, columnData: this.columnNumbers});
    for (const field of this.calculator.calculate()) {
      console.log (field);
      this.field = field;
    }
  }
}
