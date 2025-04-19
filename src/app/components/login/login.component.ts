import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginServiceService } from 'src/app/service/login-service.service';
import { CookieService } from 'ngx-cookie-service';
// import { Config } from 'protractor';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  name = '';
  password = '';
  config = {};
  showError = false;




  constructor(private cookieService: CookieService,
              private loginService: LoginServiceService, private router: Router) { }

  async login() {
    const credentialsSubmitted = {
      name: this.name,
      password: this.password
    }
    await this.loginService.performLogin(credentialsSubmitted)
    .then(data => {console.log(data);

                   this.cookieService.set( 'authorization', data.token );
                   let cookieValue = this.cookieService.get('authorization');
                   console.log(cookieValue);
                   this.router.navigate(['lobby']);
                   this.loginService.sessionActive = true;

    } 
    ,

    error => {
      console.log(error);
      this.showError = true;
    });
  }
  detectSession(){
    //if they have an active session already, navigate them
    if (this.loginService.sessionActive) {
      this.router.navigate(['lobby']);
    }
    this.loginService.performSessionDetect().subscribe(
      (data) => {this.config = { ...data };
                         console.log(data);
                         console.log(typeof(data));
                         this.loginService.sessionActive = true;
                         this.router.navigate(['lobby']);

    }, // success path
      error => console.error("session not yet active") // error path
    );

  }

  ngOnInit() {
  // route to products based on returned response, thus indicating an active session



    this.detectSession();


  // console.log('session not found');

  }
}
