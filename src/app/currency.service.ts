import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Rates {
  [key: string]: number;
}

interface CurrencyData {
  quotes: Rates;
}

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private apiKey = 'PF1CwE0qC0vUUW8RifcXH18ryO0LGJJv';  // Api ключ
  private apiUrl = 'https://api.apilayer.com/currency_data/live';
  private currencies = ['USD', 'EUR', 'GBP', 'CNY', 'JPY', 'TRY'];

  constructor(private http: HttpClient) {}

  //Запрос к apilayer.com/marketplace/currency_data-api
  getCurrencyRates(): Promise<CurrencyData> {
    const headers = new HttpHeaders({
      'apikey': this.apiKey
    });

    return this.http.get<CurrencyData>(`${this.apiUrl}?source=RUB&currencies=${this.currencies.join(',')}`, { headers }).toPromise() as Promise<CurrencyData>;
  }

  //Метод для получения данных
  async getUpdatedRates(callback: (data: CurrencyData) => void) {
      try {
        const data = await this.getCurrencyRates();

        //Конвертация в нужный формат (доллар = 90 рублей вместо 1 рубль = 0.01 доллара)
        for (const key in data.quotes) {
          data.quotes[key] = 1 / data.quotes[key]
        }
        callback(data);
        console.log(data)

      } catch (error) {
        console.error('Error fetching currency rates', error);
      }
  }
}
