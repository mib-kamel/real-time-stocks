import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { StockUpdatesService } from './stock-updates.service';

describe('StockUpdatesService', () => {
  let service: StockUpdatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StockUpdatesService]
    });
    service = TestBed.inject(StockUpdatesService);
  });

  it('should initialize with stock data', () => {
    const stocks = service.stockData();
    expect(stocks.length).toBeGreaterThan(0);
    expect(stocks[0].symbol).toBeTruthy();
  });

  it('should toggle stock enabled status', () => {
    const initialStock = service.stockData()[0];
    const initialEnabled = initialStock.enabled;

    service.toggleStock(initialStock.symbol);

    const updatedStock = service.stockData()[0];
    expect(updatedStock.enabled).toBe(!initialEnabled);
  });

  it('should not update prices for disabled stocks', fakeAsync(() => {
    const stock = service.stockData()[0];
    service.toggleStock(stock.symbol); // Disable stock
    const priceBeforeInterval = service.stockData()[0].price;

    tick(6000);

    const priceAfterInterval = service.stockData()[0].price;
    expect(priceAfterInterval).toBe(priceBeforeInterval);
  }));

  it('should update price ranges correctly', fakeAsync(() => {
    const stock = service.stockData()[0];
    const initialHigh = stock.dayHigh;

    tick(6000);

    const updatedStock = service.stockData()[0];
    expect(updatedStock.dayHigh).toBeGreaterThanOrEqual(initialHigh);
  }));
});