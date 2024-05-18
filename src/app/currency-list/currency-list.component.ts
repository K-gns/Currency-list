import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { showDropdown, showItem, switchToggle } from './currency-list-animations';
import {CurrencyService} from '../currency.service';



interface Rates {
  [key: string]: number;
}

@Component({
  selector: 'app-currency-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './currency-list.component.html',
  styleUrls: ['./currency-list.component.css'],
  animations: [showDropdown, showItem, switchToggle]
})
export class CurrencyListComponent implements OnInit {
  rates: Rates = {};
  previousRates: Rates = {};
  currencies = ['USD', 'EUR', 'GBP'];
  additionalCurrencies = ['CNY', 'JPY', 'TRY'];
  filteredAdditionalCurrencies = ['CNY', 'JPY', 'TRY'];

  isDropdownVisible = false;
  searchText = '';
  useAPIData = false;

  timeOfUpdate = ""
  dateOfUpdate = ""

  constructor(private currencyService: CurrencyService) {
  }

  ngOnInit(): void {
    this.updateRates()
    setInterval(() => this.updateRates(), 5000); //Запускаем обновление данных каждые 5с
  }

  //Обновить курсы валют (с помощью mock-данных или API)
  updateRates() {
    if (this.useAPIData) {
      this.currencyService.getUpdatedRates(data => {
        this.previousRates = {...this.rates};
        this.rates = data.quotes;
        this.updateTime(); //Время не будет обновляться, если данные не были получены
      });
    } else {
        this.useMockRates();
        this.updateTime();
      }
  }

  //Мок данные
  useMockRates() {
    const generateRandomNumber = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    this.previousRates = {
      RUBUSD: generateRandomNumber(89, 96),
      RUBEUR: generateRandomNumber(117, 122),
      RUBGBP: generateRandomNumber(112, 117),
      RUBCNY: generateRandomNumber(12, 14),
      RUBJPY: generateRandomNumber(0.50, 0.60),
      RUBTRY: generateRandomNumber(2.70, 2.90)
    };

    this.rates = {
      RUBUSD: generateRandomNumber(89, 96),
      RUBEUR: generateRandomNumber(117, 122),
      RUBGBP: generateRandomNumber(112, 117),
      RUBCNY: generateRandomNumber(12, 14),
      RUBJPY: generateRandomNumber(0.50, 0.60),
      RUBTRY: generateRandomNumber(2.70, 2.90)
    };
  }

  //Обновление времени и даты
  updateTime() {
    this.dateOfUpdate = this.getDateNow();
    this.timeOfUpdate = this.getTimeNow();
  }

  //Показать/скрыть dropdown
  toggleDropdownVisibility() {
    this.isDropdownVisible = !this.isDropdownVisible;
    this.filterAdditionalCurrencies();
  }

  //Отфильтровать дополниетльные валюты
  filterAdditionalCurrencies() {
    this.filteredAdditionalCurrencies = this.additionalCurrencies.filter(currency =>
      currency.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  //Добавление дополнительной валюты из dropdown окна
  addCurrency(currency: string) {
    if (!this.currencies.includes(currency)) {
      this.currencies.push(currency);
      this.additionalCurrencies = this.additionalCurrencies.filter(c => c !== currency);
    }
    this.toggleDropdownVisibility()
    this.searchText = '';
  }

  //Считаем разницу между кэшированным прошлым значением и новым (в абсолютных единицах)
  getRateDifference(currency: string): number {
    if (!this.previousRates[`RUB${currency}`] || !this.rates[`RUB${currency}`]) return 0;
    return this.rates[`RUB${currency}`] - this.previousRates[`RUB${currency}`];
  }

  //Считаем разницу между кэшированным прошлым значением и новым (в процентах) (не используется сейчас)
  getRateDifferencePercent(currency: string): number {
    const previousRate = this.previousRates[`RUB${currency}`];
    const currentRate = this.rates[`RUB${currency}`];
    if (!previousRate || !currentRate) return 0;
    return ((currentRate - previousRate) / previousRate) * 100;
  }

  //Вычисляем цвет для изменения курса валюты
  //(выросла - зеленый, снизилась - красный, не изменилась - серый)
  getRateChangeClass(currency: string): string {
    const differencePercent = this.getRateDifferencePercent(currency);
    if (differencePercent > 0) {
      return 'positive';
    } else if (differencePercent < 0) {
      return 'negative';
    } else {
      return 'neutral';
    }
  }

  //Получаем время обновления
  getDateNow() {
    let currentDate = new Date();
    const formatNumber = (num: number) => num < 10 ? '0' + num : num.toString();

    const currentDay = formatNumber(currentDate.getDate());
    const currentMonth = formatNumber(currentDate.getMonth() + 1);
    const currentYear = currentDate.getFullYear().toString();

    return `${currentDay}.${currentMonth}.${currentYear}`;
  };

  getTimeNow() {
    let currentDate = new Date();
    const formatNumber = (num: number) => num < 10 ? '0' + num : num.toString();

    const hours = formatNumber(currentDate.getHours());
    const minutes = formatNumber(currentDate.getMinutes());
    const seconds = formatNumber(currentDate.getSeconds());

    return `${hours}:${minutes}:${seconds}`;
  };
}
