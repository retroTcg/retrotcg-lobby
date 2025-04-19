import { Component, Input, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { LoginServiceService } from 'src/app/service/login-service.service';
import { MenuItem } from 'primeng/api';
import { HeaderTogglerServiceService } from 'src/app/service/header-toggler-service.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  toggledOn:boolean = true;
  constructor( private router: Router, private cookieService: CookieService, private loginService: LoginServiceService, private headerService:HeaderTogglerServiceService) { }
  
  clearCookies(){
    //clear cookies
    
    this.cookieService.delete('authorization');
    this.loginService.sessionActive = false;
    this.router.navigate(['login']);


    
  }
  isLoggedIn(): boolean{
    return this.loginService.sessionActive;
  }

  isHeaderActive():boolean{
    // console.log("is header active? "+ this.headerService.getHeader())

    return this.headerService.getHeader();
  }


  ngOnInit() {
  }
}
