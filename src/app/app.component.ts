import { Component } from '@angular/core';
import { StocksComponent } from './stocks/stocks.component';

@Component({
  selector: 'app-root',
  imports: [StocksComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'real-time-stocks';
}
