import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeaderService } from './header.service';
import { apiURL } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CalendarService extends HeaderService {
  urlBase = '';
  apiKey:string = '73f252f8-96bf-44ee-a8e3-93d3234de6c3';

  constructor(public http: HttpClient) {
    super();
    this.urlBase = apiURL;
  }

  getVacations(country:string,year:string) {
    return this.http.get(this.urlBase+'pretty&country='+country+'&year='+year+'&key='+this.apiKey, { headers: this.header });
  }

}
