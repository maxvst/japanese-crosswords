import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CrosswordComponent } from './components/crossword/crossword.component';
import { CellComponent } from './components/cell/cell.component';
import { RowComponent } from './components/row/row.component';

@NgModule({
  declarations: [
    AppComponent,
    CrosswordComponent,
    CellComponent,
    RowComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
