import { Component, OnInit, Input } from '@angular/core';
import { UnraveledCell } from 'src/app/models/field-status.model';

@Component({
  selector: 'app-row',
  templateUrl: './row.component.html',
  styleUrls: ['./row.component.less']
})
export class RowComponent implements OnInit {

  @Input() row: UnraveledCell[];

  constructor() { }

  ngOnInit() {
  }

  trackByFn(index, item) {
    return index; // or item.id
  }

}
