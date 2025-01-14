import { Component, OnInit, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockUpdatesService, PRICE_CHANGE, Stock } from '../stock-updates.service';

@Component({
  selector: 'app-stocks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.scss'],
})
export class StocksComponent implements OnInit {
  private stockService = inject(StockUpdatesService);
  PRICE_CHANGE = PRICE_CHANGE;
  stocks: Stock[] = [];
  isMobile = false;

  constructor() {
    // Create effect to track stock updates
    effect(() => {
      this.stocks = this.stockService.stockData();
    });
  }

  ngOnInit(): void {
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize.bind(this));
  }

  toggleStock(symbol: string): void {
    this.stockService.toggleStock(symbol);
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 600;
  }
}