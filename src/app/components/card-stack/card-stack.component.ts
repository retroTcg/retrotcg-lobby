import { Component, HostListener, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { json } from 'express';
import { StackFocusIdentifierEnum } from 'src/app/classes/Enums';
import { DisplayDetectionService } from 'src/app/service/display-detection.service';
import { PerspectiveServiceService } from 'src/app/service/perspective-service.service';
/*
Ease the eyes in game component by providing a single component that contains all behavior of a stack of cards,including add/remove
*/


enum StackFocusCancelEnum {
  CARDCHOSEN = 0,
  CANCELED,
}



@Component({
  selector: 'app-card-stack',
  templateUrl: './card-stack.component.html',
  styleUrls: ['./card-stack.component.css']
})
export class CardStackComponent implements OnInit {


  @Input() stack: any[] = [];//the cards in the stack ideally or this is fucked
  @Input() stackType: StackFocusIdentifierEnum = -1;
  @Input() stackFocusIdentifier: StackFocusIdentifierEnum = -1;
  @Input() isPlayersTurn:boolean = false;
  @Output() modifyAllButOneStackOpacityEvent = new EventEmitter<number>();
  @Output() setCardSelectedEvent = new EventEmitter<any>();
  @Output() socketEmitGameUpdateEvent = new EventEmitter<any>();
  backOfCard: string | any = '/assets/backOfCard.jpg';
  invalidDisplay: boolean = false;
  smallDisplay: boolean = false;
  ALLSTACKTYPES = StackFocusIdentifierEnum;
  ALLSTACKIDENTIFIERS = StackFocusIdentifierEnum;
  focusViewActive = false; //traces focus on this child for applying conditional css, also set in parent i.e. see 'oppbench1FocusActive' set by configFocusStackStyle switch statement
  showBox = true;
  thisStackIsFocused = false;




  constructor(private displayDectionService: DisplayDetectionService, private perspectiveService: PerspectiveServiceService) {
    //identify the stack soon...

    // switch (this.hero.stackType) {
    //   case ("DISCARD"):
    //     console.log('HIT DISCARD CASE IN STACK')
    //     this.stackType = StackFocusIdentifierEnum.DISCARD;
    //     break;
    //   default:
    //     console.log('HIT DEFAULT CASE IN STACK')

    //     break;
    // }

  }

  ngOnInit(): void {
    this.doDisplayDetection(); // ensures proper viewport variables set for card images and if display needs adjusted to user
  }
  //display detection related
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.doDisplayDetection();
  }

  //sets appropriate display settings response on init and changes
  doDisplayDetection() {
    // console.log("performing display detection methods")
    this.invalidDisplay = this.displayDectionService.detectInvalidDisplay()
    if (!this.invalidDisplay) {
      this.smallDisplay = this.displayDectionService.detectIsSmallDisplay();
      // console.log("display is valid and small display? " + JSON.stringify(this.smallDisplay));

    }
    else {
      console.log("display is invalid")

    }
  }
  setThisStackIsFocused(isFocused: boolean) {
    this.thisStackIsFocused = isFocused;
  }

  //set a flag that when true applies a special style that provides absolute positioning+zindex and makes everything transparent
  onStackClicked() {
    let sourceCard = true;
    if (this.perspectiveService.getAStackIsInFocus()) {
      console.log("focus view already active! SKIPPING")
    }
    //destination source intended, this triggers backend call for user move check (if turn/etc)

    else {
      //allows attempt to fire off parent event, only limited by ui if not players turn, otherwise lets user navigate by remaining statements
      //unit tested emission on non-player turn by removing extra boolean condition
      if(this.perspectiveService.getCardSelected(sourceCard).index>=0 && this.isPlayersTurn){
        //set DESTINATION stack only(no card)
        this.perspectiveService.setCardSelected(-2,this.stackFocusIdentifier, !sourceCard)
        //fire off parent event
        //simply provide conditional in addition in order to emit event, if its players turn
        //their intention is not to browse when its their turn, if it is, they must deselect, otherwise
        //action takes place
      
          console.log("for sure my turn")
          this.socketEmitGameUpdateEvent.emit('')
       
      }
      else{
          console.log('no card selected or not players turn or both, or update attempt to view made, reset allowed')
        this.setResetFocus(sourceCard)
      }
      
      // this.logStackTypeAndFocusId(); //uneeded, may be removed
    }

  }

  setResetFocus(sourceCard:boolean):void{
      this.setThisStackIsFocused(true);
      this.perspectiveService.setAStackIsInFocus(true);//keeps other stacks from becoming focused
      this.perspectiveService.resetCardSelected(sourceCard);
      this.perspectiveService.configFocusStackStyle(this.stackFocusIdentifier); //toggles on focus for parent
      console.log("stack IS " + JSON.stringify(this.stack))
      this.stack.forEach(element => {
        console.log('element in stack allegedly is ' + element)

      });
      // this.focusViewActive = true;

      this.modifyAllButOneStackOpacityEvent.emit(.4);
  }
  //todo uneeded may be removed, helps for logging stack chosen
  logStackTypeAndFocusId() {
    console.log('stacktype is ' + JSON.stringify(this.stackType))
    switch (this.stackType) {
      case (StackFocusIdentifierEnum.HAND):
        console.log('hit hand case')
        break;
      case (StackFocusIdentifierEnum.ACTIVE):
        break;
      case (StackFocusIdentifierEnum.BENCH1):
        break;
      case (StackFocusIdentifierEnum.DISCARD):
        break;
      case (StackFocusIdentifierEnum.PRIZE):
        break;
      case (StackFocusIdentifierEnum.DECK):
        break;
      default:
        break;
    }
    console.log('stackFocusIdentifier is ' + JSON.stringify(this.stackFocusIdentifier))

    switch (this.stackFocusIdentifier) {
      case (StackFocusIdentifierEnum.HAND):
        console.log('hit hand case stack type')
        break;
      case (StackFocusIdentifierEnum.ACTIVE):
        console.log("hit active case")
        break;
      case (StackFocusIdentifierEnum.DISCARD):
        console.log("hit discard case")
        break;
      case (StackFocusIdentifierEnum.PRIZE):
        console.log("hit prize case")
        break;
      case (StackFocusIdentifierEnum.DECK):
        console.log("hit deck case")
        break;
      case (StackFocusIdentifierEnum.BENCH1):
        console.log("hit bench 1 case TOGGGLED FOCUS");
        break;
      case (StackFocusIdentifierEnum.BENCH2):
        console.log("hit bench 2 case")
        break;
      case (StackFocusIdentifierEnum.BENCH3):
        console.log("hit bench 3 case")
        break;
      case (StackFocusIdentifierEnum.BENCH4):
        console.log("hit bench 4 case")
        break;
      case (StackFocusIdentifierEnum.BENCH5):
        console.log("hit bench 5 case")
        break;
      case (StackFocusIdentifierEnum.OPPPRIZE):
        console.log("hit opp prize case")
        break;
      case (StackFocusIdentifierEnum.OPPACTIVE):
        console.log("hit opp active case")
        break;
      case (StackFocusIdentifierEnum.OPPDISC):
        console.log("hit opp disc case")
        break;
      case (StackFocusIdentifierEnum.OPPBENCH1):
        console.log("hit opp bench 1 case");
        break;
      case (StackFocusIdentifierEnum.OPPBENCH2):
        console.log("hit opp bench 2 case")
        break;
      case (StackFocusIdentifierEnum.OPPBENCH3):
        console.log("hit opp bench 3 case")
        break;
      case (StackFocusIdentifierEnum.OPPBENCH4):
        console.log("hit opp bench 4 case")
        break;
      case (StackFocusIdentifierEnum.OPPBENCH5):
        console.log("hit opp bench 5 case")
        break;
      default:
        console.error("didn't find a case for stack, bug here")
        break;
    }
  }

  //TODO provide visibility image div with selected label traced by this component with absolute positioning top right of screen with some padding
  setCardFocus(cardPositionInStack: number) {
    let sourceCard = true;
    if (this.thisStackIsFocused) {
      this.perspectiveService.setCardSelected(cardPositionInStack, this.stackFocusIdentifier, sourceCard);
      this.setCardSelectedEvent.emit('');
      console.log('attempted to set card focus, result in cardSelectedIndex of ' + JSON.stringify(this.perspectiveService.getCardSelected(sourceCard)));
      //inform parent about user's request, if its their turn it will allow the selection, otherwise ignores request

    }
    else if(this.perspectiveService.getCardSelected(sourceCard).index>=0 && this.isPlayersTurn){
        console.log('this stack was clicked after another card had been selected')
    }


    console.log("This stack is in focus during setCardFocus? " + this.thisStackIsFocused);

  }

  //reset self styleing via flag and emit stack cancel
  // if card chosen when clicked outside, remember the stack, if there is a stack remembered on
  // subsequent stack clicked, we issue standard move, we will deal with card selection specific
  // within a stack effects later
  onClickedOutside(e: Event) {
    //TODO remove conditional here eventually, provided for debugging purposes of testing focus stack view
    // if (this.thisStackIsInFocus()) {
    //   console.log('focus view is active on this stack DESIGNED FOR CANCEL OUTSIDE' + this.stackFocusIdentifier)

    // }
    // else {
    //   console.log('focus view is not active on this stack ' + this.stackFocusIdentifier)
    // }

    //stack clicked, card selected, and clicked outside
    let sourceCard = true
    if (this.thisStackIsFocused && this.perspectiveService.getCardSelected(sourceCard).index >= 0) {

      this.perspectiveService.setRememberStack(this.stackFocusIdentifier) //remember source stack
      this.onStackCancel()
      console.log("clicked outside of hand allegedly on focused stack CARD CHOSEN: " + this.perspectiveService.getCardSelected(sourceCard) + " from stack: " + this.perspectiveService.getRememberedStack)
      //TODO modify here for trainer card to simply activate if turn?
    }
    //stack clicked, card not selected, and clicked outside(they were just browsing)
    else if (this.thisStackIsFocused && this.perspectiveService.getCardSelected(sourceCard).index < 0) {
      this.perspectiveService.resetRemeberedStack();
      this.onStackCancel()
      console.log("clicked outside of hand allegedly on focused stack CANCELED")

    }
    else {
      console.log("ignorable stack clicked")
    }

  }
  //
  //important to emit opacity back to 1 for modify opacity to regain focus to all game content
  onStackCancel() {
    //need to maintain some 'state' of card chosen and options for that card, if not immediately played such as a trainer
    // this.focusViewActive = false;
    this.modifyAllButOneStackOpacityEvent.emit(1);
    this.perspectiveService.configFocusStackStyle(this.stackFocusIdentifier); //toggles off
    this.setThisStackIsFocused(false);
    this.perspectiveService.resetAStackIsInFocus();


  }



  getIsAStackInFocus(): boolean {
    return this.perspectiveService.getAStackIsInFocus();
  }

  //method onclick of card stack, s.t. a 'zoomed' view is applied with background darkened etc for players
  //to see better(usability)

  //TODO method for adding card to stack

  //Method for moving single card from stack

  //method for moving 



}
