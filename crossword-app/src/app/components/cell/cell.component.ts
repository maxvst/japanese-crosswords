import { Component, OnInit, Input } from '@angular/core';
import { UnraveledCell, CommonCellStatus } from 'src/app/models/field-status.model';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.less']
})
export class CellComponent implements OnInit {

  @Input() value: UnraveledCell;

  black = CommonCellStatus.DefinitelyBlack;
  white = CommonCellStatus.DefinitelyWhite;
  unknown = CommonCellStatus.Unknown;

  constructor() { }

  ngOnInit() {
  }

}
