import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs/operators'

import { CountriesService } from '../../services/countries.service';
import { CountrySmall } from '../../interfaces/country.interface';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css']
})
export class SelectorPageComponent implements OnInit {

  public countriesForm: FormGroup = this.formBuilder.group({
    continent: [  , [ Validators.required ]],
    country: [  , [ Validators.required ]],
    border: [  , [ Validators.required ]]
  });

  public continents: string[] = [];
  public countries: CountrySmall[] = [];
  public borders: CountrySmall[] = [];
  public loading : boolean = false;


  constructor(private formBuilder: FormBuilder,
              private countriesService: CountriesService) { }

  ngOnInit(): void {

    this.continents = this.countriesService.continents;

    this.countriesForm.get('country')?.disable();
    this.countriesForm.get('border')?.disable();

    // this.countriesForm.get('continent')?.valueChanges.subscribe( continen =>{
    //   console.log(continen);

    //   this.countriesService.getCountriesByContinent(continen).subscribe(countries =>{
    //     this.countries = countries;
    //     console.log(this.countries);
    //   });
    // });

    this.countriesForm.get('continent')?.valueChanges
      .pipe(
        tap( () => {
          this.countriesForm.get('country')?.reset(null);
          this.loading = true;
          this.countriesForm.get('country')?.enable();
          this.countriesForm.get('border')?.disable();
        }),
        switchMap( continent =>  this.countriesService.getCountriesByContinent(continent))
      )
      .subscribe( countries => {
        this.countries = countries;
        this.loading = false;
      });

      this.countriesForm.get('country')?.valueChanges
        .pipe(
          tap( () => {
            this.countriesForm.get('border')?.reset(null);
            this.loading = true;
            this.countriesForm.get('border')?.enable();
          }),
          switchMap (code => this.countriesService.getCountryByCode (code)),
          switchMap (country => this.countriesService.getCountriesByCode (country?.borders!)) 
        )  
      .subscribe( countries => {

        this.borders = countries
        this.loading = false;
      })
  }

  save(){
    console.log(this.countriesForm.value);
  }
}
