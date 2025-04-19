import { HostListener, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DisplayDetectionService {
  private getScreenWidth: number = -1;


  constructor() { }

  detectInvalidDisplay(): boolean {
    this.getScreenWidth = window.innerWidth;
    console.log('display width is? ' + this.getScreenWidth)
    if (this.getScreenWidth < 658) {
      return true;
    }
    else {
      return false;
    }
  }

  detectIsSmallDisplay(): boolean {
    if (this.getScreenWidth >= 1024) {//ipadmini breakoff point
      return false;
    }
    else {
      return true;
    }


  }
}
