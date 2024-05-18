import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CurrencyListComponent } from './currency-list/currency-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule, CurrencyListComponent],
  template: '<app-currency-list></app-currency-list>',
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
