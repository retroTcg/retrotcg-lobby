import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Deck } from '../classes/Deck';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})

//holds socket,room, and deck information for a given player 
export class DeckService {
  activeDeck: Deck=new Deck();


  constructor(private http: HttpClient, private cookieService: CookieService) { }
  private baseurl = environment.rootUrl;

  

  getDeckList(): Observable<Deck[]>{
    const token = this.cookieService.getAll()['authorization'];

    const httpOptions = {
      headers: new HttpHeaders({
       'authorization': token
      }),
      withCredentials: true
     };
    return this.http.get<Deck[]>(`${this.baseurl}`, httpOptions);
  }



}
