import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
//TODO CHECK THIS IMPORT IF NEEDED OR REMOVE
// import { Config } from 'protractor';
import { environment } from 'src/environments/environment';


export interface CredentialUser{
  name: string;
  token: string;
}


@Injectable({
  providedIn: 'root'
})


export class LoginServiceService {




  constructor(private cookieService: CookieService, private http: HttpClient) { }



  baseurl = environment.serviceEndpoint;

  login = '/user/login';
  session = '/deck/me';

  sessionActive = false;

  //todo check if <any> is ok
  performLogin(credentials: object): Promise<any> {

    let headers = new HttpHeaders({
            'Content-Type': 'application/json'});
    const options = { headers };

    console.log(credentials);
    console.log(this.baseurl);
    return this.http.post<CredentialUser>(`${this.baseurl}${this.login}`, credentials, options).toPromise();
  }






//TODO modify sessiondetection...
performSessionDetect(): Observable<object>{
  const token = this.cookieService.getAll()['authorization'];
  console.log('cooki eservice all stuff is ', this.cookieService.getAll());


  const httpOptions = {
    headers: new HttpHeaders({
     'authorization': token
    }),
    withCredentials: true
   };
  const allCookies: {} = this.cookieService.getAll()['authorization'];
  console.log(allCookies);
  return this.http.get<object>(
    `${this.baseurl}${this.session}`, httpOptions);



}
}
