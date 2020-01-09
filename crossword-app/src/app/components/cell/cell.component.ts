import { Component, OnInit, Input, HostBinding } from '@angular/core';
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

  @HostBinding('class.cell') get isCell() { return true; }
  @HostBinding('class.cell_black') get isBlack() { return this.value === this.black; }
  @HostBinding('class.cell_white') get isWhite() { return this.value === this.white; }
  @HostBinding('class.cell_unknown') get isUnknown() { return this.value === this.unknown; }

  ngOnInit() {
  }

}
