import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderTogglerServiceService {
  headerOn:boolean = true;
  constructor() { }

  public toggleHeader(){
    this.headerOn = !this.headerOn;
  }
  public getHeader(){
    return this.headerOn;
  }
}
