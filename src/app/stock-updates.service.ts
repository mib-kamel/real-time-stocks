import { Injectable, effect, signal } from '@angular/core';
import { interval } from 'rxjs';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  previousPrice: number;
  priceChange: PRICE_CHANGE;
  dayHigh: number;
  dayLow: number;
  weekHigh: number;
  weekLow: number;
  enabled: boolean;
}

enum PRICE_CHANGE {
  UP = 'up',
  DOWN = 'down',
  SAME = 'same'
}

@Injectable({
  providedIn: 'root',
})
export class StockUpdatesService {
  private enabledStocks = new Set<string>();

  stockData = signal<Stock[]>([
    { symbol: 'AAPL', name: 'Apple', price: 150, dayHigh: 155, dayLow: 145, weekHigh: 180, weekLow: 120, enabled: true, previousPrice: 150, priceChange: PRICE_CHANGE.SAME },
    { symbol: 'GOOGL', name: 'Alphabet', price: 2800, dayHigh: 2825, dayLow: 2775, weekHigh: 3000, weekLow: 2500, enabled: true, previousPrice: 2800, priceChange: PRICE_CHANGE.SAME },
    { symbol: 'MSFT', name: 'Microsoft', price: 330, dayHigh: 335, dayLow: 325, weekHigh: 350, weekLow: 300, enabled: true, previousPrice: 330, priceChange: PRICE_CHANGE.SAME },
    { symbol: 'TSLA', name: 'Tesla', price: 950, dayHigh: 970, dayLow: 940, weekHigh: 1200, weekLow: 700, enabled: true, previousPrice: 950, priceChange: PRICE_CHANGE.SAME },
    { symbol: 'AMZN', name: 'Amazon', price: 3400, dayHigh: 3425, dayLow: 3375, weekHigh: 3600, weekLow: 3200, enabled: true, previousPrice: 3400, priceChange: PRICE_CHANGE.SAME },
    { symbol: 'FB', name: 'Facebook', price: 350, dayHigh: 355, dayLow: 345, weekHigh: 370, weekLow: 320, enabled: true, previousPrice: 350, priceChange: PRICE_CHANGE.SAME },
    { symbol: 'NVDA', name: 'Nvidia', price: 700, dayHigh: 710, dayLow: 690, weekHigh: 750, weekLow: 650, enabled: true, previousPrice: 700, priceChange: PRICE_CHANGE.SAME },
    { symbol: 'PYPL', name: 'PayPal', price: 250, dayHigh: 255, dayLow: 245, weekHigh: 270, weekLow: 230, enabled: true, previousPrice: 250, priceChange: PRICE_CHANGE.SAME },
    { symbol: 'NFLX', name: 'Netflix', price: 550, dayHigh: 560, dayLow: 540, weekHigh: 600, weekLow: 500, enabled: true, previousPrice: 550, priceChange: PRICE_CHANGE.SAME },
    { symbol: 'INTC', name: 'Intel', price: 60, dayHigh: 62, dayLow: 58, weekHigh: 70, weekLow: 50, enabled: true, previousPrice: 60, priceChange: PRICE_CHANGE.SAME },
    { symbol: 'AMD', name: 'AMD', price: 100, dayHigh: 105, dayLow: 95, weekHigh: 120, weekLow: 80, enabled: true, previousPrice: 100, priceChange: PRICE_CHANGE.SAME },
    { symbol: 'IBM', name: 'IBM', price: 120, dayHigh: 125, dayLow: 115, weekHigh: 140, weekLow: 100, enabled: true, previousPrice: 120, priceChange: PRICE_CHANGE.SAME },
  ]);

  intervalTimeOut = 6000;

  constructor() {
    this.stockData().forEach(stock => {
      if (stock.enabled) this.enabledStocks.add(stock.symbol);
    });

    interval(this.intervalTimeOut).subscribe(() => {
      this.stockData.update(stocks => {
        return stocks.map(stock => {
          // Only update price if stock is enabled
          if (this.enabledStocks.has(stock.symbol)) {
            const newPrice = this.getRandom(stock.price - 10, stock.price + 10);
            return {
              ...stock,
              enabled: true,
              previousPrice: stock.price,
              price: newPrice,
              priceChange: newPrice > stock.price ? PRICE_CHANGE.UP :
                newPrice < stock.price ? PRICE_CHANGE.DOWN :
                  PRICE_CHANGE.SAME,
              dayHigh: Math.max(stock.dayHigh, newPrice),
              dayLow: Math.min(stock.dayLow, newPrice),
              weekHigh: Math.max(stock.weekHigh, newPrice),
              weekLow: Math.min(stock.weekLow, newPrice),
            };
          }
          // Return unchanged stock data if disabled
          return stock;
        });
      });
    });
  }

  toggleStock(symbol: string) {
    this.stockData.update(stocks => {
      return stocks.map(stock => {
        if (stock.symbol === symbol) {
          const newEnabled = !stock.enabled;
          newEnabled ? this.enabledStocks.add(symbol) : this.enabledStocks.delete(symbol);
          return { ...stock, enabled: newEnabled };
        }
        return stock;
      });
    });
  }

  private getRandom(min: number, max: number): number {
    return Math.round(Math.random() * (max - min) + min);
  }
}

export { PRICE_CHANGE };
export type { Stock };