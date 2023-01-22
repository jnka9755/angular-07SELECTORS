import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { CountrySmall, Country } from '../interfaces/country.interface';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private baseURL: string = 'https://restcountries.com/v2';
  private _continents: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get continents(): string[] {
    return [ ...this._continents ];
  }

  constructor(private http: HttpClient) { }

  getCountriesByContinent(continent: string): Observable<CountrySmall[]> {

    const url: string = `${ this.baseURL }/region/${continent}?fields=alpha3Code,name`
    return this.http.get<CountrySmall[]>(url);
  }

  getCountryByCode(code: string): Observable<Country | null>  {
    
    if(!code) return of(null)

    const url = `${this.baseURL}/alpha/${code}`;
    return this.http.get<Country>( url );
  }

  getCountryByCodeSmall(code: string): Observable<CountrySmall>  {
    
    const url = `${this.baseURL}/alpha/${code}?fields=alpha3Code,name`;
    return this.http.get<CountrySmall>( url );
  }

  getCountriesByCode(borders: string[]) :Observable<CountrySmall[]> {
    
    if(!borders) return of([]);

    const queries: Observable<CountrySmall>[] = [];
    borders.forEach( code => {
      const query = this.getCountryByCodeSmall(code);
      queries.push(query);
    })

    return combineLatest( queries );
  }
}
