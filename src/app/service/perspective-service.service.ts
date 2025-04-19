import { Injectable } from '@angular/core';
import { error } from 'console';
import { Card } from '../classes/Card';
import { StackFocusIdentifierEnum } from '../classes/Enums';
import { CardSelected, StackFocusMap } from '../classes/stackFocusMap';

@Injectable({
  providedIn: 'root'
})

export class PerspectiveServiceService {
  public stackFocusMapReference: StackFocusMap = new StackFocusMap();// for gamecomponent comms with card-stacks regarding focus only (.focusedStack)
  private cardSelected:CardSelected={index:-1, stackId:-1};
  private cardSelectedIndex: number = -1;
  private stackRemembered: StackFocusIdentifierEnum = -1;
  private destStackRemembered:StackFocusIdentifierEnum = -1;
  private destCardSelected:CardSelected={index:-1, stackId:-1};
  aStackIsInFocus: boolean = false;
  //we want this true immediately when a stack is clicked
  constructor() {
    
  }


  getStackFocusMapReference(): StackFocusMap {
    return this.stackFocusMapReference;
  }

  resetStackFocusMap() {
    this.stackFocusMapReference = new StackFocusMap();
  }


  // getAStackIsInFocus(): boolean {
  //   let quantityFocusedFound = Object.values(this.stackFocusMapReference).filter(ele => ele === true).length
  //   if (quantityFocusedFound > 1) {
  //     console.error("Bug occured where multiple stacks are in focus")
  //     return false


  //   }
  //   else {
  //     console.log("qauntity found for stacks in focus is ****************** " + quantityFocusedFound)
  //     return quantityFocusedFound === 1 ? true : false
  //   }
  // }

  getAStackIsInFocus(): boolean {
    return this.aStackIsInFocus;
  }
  setAStackIsInFocus(isFocused: boolean) {
    this.aStackIsInFocus = isFocused
  }
  resetAStackIsInFocus() {
    this.aStackIsInFocus = false
  }

  setRememberStack(stackToRemember: StackFocusIdentifierEnum) {
    this.stackRemembered = stackToRemember
  }
  getRememberedStack(): StackFocusIdentifierEnum {
    return this.stackRemembered
  }


  resetRemeberedStack() {
    this.stackRemembered = -1;
  }

  //lets components know that a stack is inf ocus selected to ignore action
  // setStackSelected(stackFocusIdentifier: StackFocusIdentifierEnum) {
  //   this.configFocusStackStyle(stackFocusIdentifier);

  // }

  //selects/deselects card of stack
  setCardSelected(indexArg: number, stackFocusIdentifierArg:StackFocusIdentifierEnum, isSourceCard:boolean) {
    if(isSourceCard){
      if (this.cardSelected.index === indexArg) {
        console.log("hit RESET CARD SELECTED")
        this.resetCardSelected(isSourceCard);
      }
      else {
        this.cardSelected = {index:indexArg, stackId:stackFocusIdentifierArg};
      }
  
    }
    else{
      if (this.destCardSelected.index === indexArg) {
        console.log("hit RESET DEST CARD SELECTED")
        this.resetCardSelected(isSourceCard);
      }
      else {
        this.destCardSelected = {index:indexArg, stackId:stackFocusIdentifierArg};
      }
    }

    //need to somehow report to the view to zoom this card
    //how?
    //
  }

  getCardSelected(isSourceCard:boolean): CardSelected {
    return isSourceCard?this.cardSelected:this.destCardSelected;
  }
  

  resetCardSelected(isSourceCard:boolean) {
    return isSourceCard?this.cardSelected = {index:-1,stackId:-1}:this.destCardSelected= {index:-1,stackId:-1};
  }

  //used specifically for resetting all configuration, specific use case for updates made to perspectives,  and game updates being denied
  resetAll(){
    this.resetCardSelected(!true);
    this.resetCardSelected(true);
    this.resetRemeberedStack();
    this.resetAStackIsInFocus();
    this.resetStackFocusMap();
  }

  configFocusStackStyle(stackFocusIdentifier: StackFocusIdentifierEnum) {
    switch (stackFocusIdentifier) {
      case (StackFocusIdentifierEnum.HAND):
        this.stackFocusMapReference.handFocusActive = this.stackFocusMapReference.handFocusActive ? false : true;
        console.log('hit hand case stack type')
        break;
      case (StackFocusIdentifierEnum.ACTIVE):
        this.stackFocusMapReference.activeFocusActive = this.stackFocusMapReference.activeFocusActive ? false : true;
        console.log("hit active case")
        break;
      case (StackFocusIdentifierEnum.DISCARD):
        this.stackFocusMapReference.discardFocusActive = this.stackFocusMapReference.discardFocusActive ? false : true;
        console.log("hit discard case")
        break;
      case (StackFocusIdentifierEnum.PRIZE):
        // this.stackFocusMapReference.prize = this.stackFocusMapReference.prize ? false : true;
        console.log("hit prize case TOGGGLED FOCUS")
        break;
      case (StackFocusIdentifierEnum.DECK):
        // this.stackFocusMapReference.discard = this.stackFocusMapReference.discard ? false : true;
        console.log("hit deck case TOGGGLED FOCUS")
        break;
      case (StackFocusIdentifierEnum.BENCH1):
        this.stackFocusMapReference.bench1FocusActive = this.stackFocusMapReference.bench1FocusActive ? false : true;
        console.log("hit bench 1 case TOGGGLED FOCUS");
        break;
      case (StackFocusIdentifierEnum.BENCH2):
        this.stackFocusMapReference.bench2FocusActive = this.stackFocusMapReference.bench2FocusActive ? false : true;
        console.log("hit bench 2 case TOGGGLED FOCUS")
        break;
      case (StackFocusIdentifierEnum.BENCH3):
        this.stackFocusMapReference.bench3FocusActive = this.stackFocusMapReference.bench3FocusActive ? false : true;
        console.log("hit bench 3 case TOGGGLED FOCUS")
        break;
      case (StackFocusIdentifierEnum.BENCH4):
        this.stackFocusMapReference.bench4FocusActive = this.stackFocusMapReference.bench4FocusActive ? false : true;
        console.log("hit bench 4 case TOGGGLED FOCUS")
        break;
      case (StackFocusIdentifierEnum.BENCH5):
        this.stackFocusMapReference.bench5FocusActive = this.stackFocusMapReference.bench5FocusActive ? false : true;
        console.log("hit bench 5 case TOGGGLED FOCUS")
        break;
      case (StackFocusIdentifierEnum.OPPPRIZE):
        // this.stackFocusMapReference.oppPrizeFocusActive = this.stackFocusMapReference.oppPrizeFocusActive ? false : true;
        console.log("hit opp prize case TOGGGLED FOCUS")
        break;
      case (StackFocusIdentifierEnum.OPPACTIVE):
        this.stackFocusMapReference.oppFocusActive = this.stackFocusMapReference.oppFocusActive ? false : true;
        console.log("hit opp active case TOGGGLED FOCUS")
        break;
      case (StackFocusIdentifierEnum.OPPDISC):
        this.stackFocusMapReference.oppDiscardFocusActive = this.stackFocusMapReference.oppDiscardFocusActive ? false : true;
        console.log("hit opp disc case TOGGGLED FOCUS")
        break;
      case (StackFocusIdentifierEnum.OPPBENCH1):
        console.log("hit opp bench 1 case TOGGGLED FOCUS");
        this.stackFocusMapReference.oppbench1FocusActive = this.stackFocusMapReference.oppbench1FocusActive ? false : true;
        break;
      case (StackFocusIdentifierEnum.OPPBENCH2):
        console.log("hit opp bench 2 case TOGGGLED FOCUS")
        this.stackFocusMapReference.oppbench2FocusActive = this.stackFocusMapReference.oppbench2FocusActive ? false : true;
        break;
      case (StackFocusIdentifierEnum.OPPBENCH3):
        console.log("hit opp bench 3 case TOGGGLED FOCUS")
        this.stackFocusMapReference.oppbench3FocusActive = this.stackFocusMapReference.oppbench3FocusActive ? false : true;
        break;
      case (StackFocusIdentifierEnum.OPPBENCH4):
        console.log("hit opp bench 4 case TOGGGLED FOCUS")
        this.stackFocusMapReference.oppbench4FocusActive = this.stackFocusMapReference.oppbench4FocusActive ? false : true;
        break;
      case (StackFocusIdentifierEnum.OPPBENCH5):
        console.log("hit opp bench 5 case TOGGGLED FOCUS")
        this.stackFocusMapReference.oppbench5FocusActive = this.stackFocusMapReference.oppbench5FocusActive ? false : true;
        break;
      default:
        console.error("didn't find a case for stack, bug here")
        break;
    }

  }
  
  getIsStackFocused(stackFocusIdentifier: StackFocusIdentifierEnum) {
    switch (stackFocusIdentifier) {
      case (StackFocusIdentifierEnum.HAND):

        console.log('hit hand case GET IS FOOCUSED' + this.stackFocusMapReference.handFocusActive)
        return this.stackFocusMapReference.handFocusActive
        break;
      case (StackFocusIdentifierEnum.ACTIVE):
        console.log("hit active cas GET IS FOOCUSED " + this.stackFocusMapReference.activeFocusActive)
        return this.stackFocusMapReference.activeFocusActive
        break;
      case (StackFocusIdentifierEnum.DISCARD):
        console.log("hit discard case GET IS FOOCUSED " + this.stackFocusMapReference.discardFocusActive)
        return this.stackFocusMapReference.discardFocusActive

        break;
      case (StackFocusIdentifierEnum.PRIZE):
        // this.stackFocusMapReference.prize = this.stackFocusMapReference.prize ? false : true;
        console.log("hit prize case GET IS FOOCUSED")
        break;
      case (StackFocusIdentifierEnum.DECK):
        // this.stackFocusMapReference.discard = this.stackFocusMapReference.discard ? false : true;
        console.log("hit deck case GET IS FOOCUSED")
        break;
      case (StackFocusIdentifierEnum.BENCH1):
        console.log("hit bench 1 case GET IS FOCUSED? " + this.stackFocusMapReference.bench1FocusActive)
        return this.stackFocusMapReference.bench1FocusActive;
        break;
      case (StackFocusIdentifierEnum.BENCH2):
        console.log("hit bench 2 case GET IS FOCUSED? " + this.stackFocusMapReference.bench2FocusActive)
        return this.stackFocusMapReference.bench2FocusActive;
        break;
      case (StackFocusIdentifierEnum.BENCH3):
        console.log("hit bench 3 case GET IS FOCUSED? " + this.stackFocusMapReference.bench3FocusActive)
        return this.stackFocusMapReference.bench3FocusActive;
        break;
      case (StackFocusIdentifierEnum.BENCH4):
        console.log("hit bench 4 case GET IS FOCUSED? " + this.stackFocusMapReference.bench4FocusActive)
        return this.stackFocusMapReference.bench4FocusActive
        break;
      case (StackFocusIdentifierEnum.BENCH5):
        console.log("hit bench 5 case GET IS FOCUSED? " + this.stackFocusMapReference.bench5FocusActive)
        return this.stackFocusMapReference.bench5FocusActive;
        break;
      case (StackFocusIdentifierEnum.OPPPRIZE):
        // this.stackFocusMapReference.oppPrizeFocusActive = this.stackFocusMapReference.oppPrizeFocusActive ? false : true;
        console.log("hit opp prize case GET IS FOOCUSED")
        break;
      case (StackFocusIdentifierEnum.OPPACTIVE):
        return this.stackFocusMapReference.oppFocusActive;
        break;
      case (StackFocusIdentifierEnum.OPPDISC):
        console.log("hit opp discard case GET IS FOCUSED? " + this.stackFocusMapReference.oppDiscardFocusActive)
        return this.stackFocusMapReference.oppDiscardFocusActive;
        break;
      case (StackFocusIdentifierEnum.OPPBENCH1):
        console.log("hit opp bench 1 case GET IS FOOCUSED" + this.stackFocusMapReference.oppbench1FocusActive);
        return this.stackFocusMapReference.oppbench1FocusActive;
        break;
      case (StackFocusIdentifierEnum.OPPBENCH2):
        console.log("hit opp bench 2 case GET IS FOOCUSED" + this.stackFocusMapReference.oppbench2FocusActive)
        return this.stackFocusMapReference.oppbench2FocusActive;
        break;
      case (StackFocusIdentifierEnum.OPPBENCH3):
        console.log("hit opp bench 3 case GET IS FOOCUSED" + this.stackFocusMapReference.oppbench3FocusActive)
        return this.stackFocusMapReference.oppbench3FocusActive;
        break;
      case (StackFocusIdentifierEnum.OPPBENCH4):
        console.log("hit opp bench 4 case GET IS FOOCUSED" + this.stackFocusMapReference.oppbench4FocusActive)
        return this.stackFocusMapReference.oppbench4FocusActive;
        break;
      case (StackFocusIdentifierEnum.OPPBENCH5):
        console.log("hit opp bench 5 case GET IS FOOCUSED" + this.stackFocusMapReference.oppbench5FocusActive)
        return this.stackFocusMapReference.oppbench5FocusActive;
        break;
      default:
        console.error("didn't find a case for stack, bug here")

        break;
    }
    return null;

  }




}
