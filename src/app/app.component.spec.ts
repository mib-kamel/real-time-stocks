import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StocksComponent } from './stocks/stocks.component';
import { StockUpdatesService, Stock, PRICE_CHANGE } from './stock-updates.service';
import { signal } from '@angular/core';

describe('StocksComponent', () => {
  let component: StocksComponent;
  let fixture: ComponentFixture<StocksComponent>;
  let mockStockService: jasmine.SpyObj<StockUpdatesService>;

  const mockStock: Stock = {
    symbol: 'TEST',
    name: 'Test Stock',
    price: 100,
    previousPrice: 100,
    priceChange: PRICE_CHANGE.SAME,
    dayHigh: 110,
    dayLow: 90,
    weekHigh: 120,
    weekLow: 80,
    enabled: true
  };

  beforeEach(async () => {
    mockStockService = jasmine.createSpyObj('StockUpdatesService', ['toggleStock'], {
      stockData: signal([mockStock])
    });

    //moch intervalTimeOut
    mockStockService.intervalTimeOut = 10000000;

    await TestBed.configureTestingModule({
      imports: [StocksComponent],
      providers: [
        { provide: StockUpdatesService, useValue: mockStockService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render mock stock data', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain(mockStock.name);
    expect(compiled.textContent).toContain(mockStock.symbol);
    expect(compiled.textContent).toContain(mockStock.price.toString());
  });

  it('should display correct price ranges', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    console.log(compiled.querySelector('#weekly-high'))
    expect(compiled.querySelector('#daily-high')?.textContent)
      .toContain(mockStock.dayHigh.toString());
    expect(compiled.querySelector('#daily-low')?.textContent)
      .toContain(mockStock.dayLow.toString());
    expect(compiled.querySelector('#weekly-high')?.textContent)
      .toContain(mockStock.weekHigh.toString());
    expect(compiled.querySelector('#weekly-low')?.textContent)
      .toContain(mockStock.weekLow.toString());
  });
});