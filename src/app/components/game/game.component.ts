import { Component, OnInit, ViewChild, ElementRef, HostListener, Renderer2 } from '@angular/core';
import * as io from 'socket.io-client';
import { DeckService } from 'src/app/service/deck.service';
import { RoomServiceService } from 'src/app/service/room-service.service';
import { CookieService } from 'ngx-cookie-service';
import { HeaderTogglerServiceService } from 'src/app/service/header-toggler-service.service';
import { DisplayDetectionService } from 'src/app/service/display-detection.service';
import { PlayerRequestTypesEnum, StackFocusIdentifierEnum } from 'src/app/classes/Enums';
import { PerspectiveServiceService } from 'src/app/service/perspective-service.service';
import { StackFocusMap } from 'src/app/classes/stackFocusMap';
import { PlayerPerspective, CoinResult, CardInPlay } from 'src/app/classes/Interfaces';
import { RequestStructure } from 'src/app/classes/RequestStructure';


/*
  Component for facilitating all communications for gameplay for particular room from client to server

  client should:
  1.attempt to request changes to game state controller
  2.Ensure expected object is receieved from backend before issuing visual/user control constraints and allowances
  2.update the front-end visuals according to game state controller passed by node backend

  backend should:
  1.Ensure room integrity(no additional players, no players allowed in several rooms simultaneously)
  2.Validate incoming changes to state of game controller

  author: Charles Erd
*/


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})


export class GameComponent implements OnInit {
  ALLSTACKTYPES = StackFocusIdentifierEnum;
  ALLSTACKIDENTIFIERS = StackFocusIdentifierEnum;
  preventUpdateFlag = false;
  //todo determine if this is needed, or perhaps we don't
  fromStackIdentifierSelected: StackFocusIdentifierEnum = -1
  toStackIdentifierSelected: StackFocusIdentifierEnum = -1; // must only be set if a card has been selected by below var, otherwise let go
  cardSelected: any = {};
  isCardSelected:boolean= false;
  sourceImg:string='';//sets the focused card zoomed for the user to see, isCardSelected must be set after this is set to avoid lifecycle issue
  isTurn: boolean = true; //helps to allow user to view cards when not their turn, otherwise move intention is assumed
  event: string = '';
  pressed: any = {};
  currentPerspective: PlayerPerspective = {
    inHand: [],
    active: [],
    deckCount: [],
    prizeCount: -1,
    bench: [],
    isDiscarded: [],
    oppInHandCount: [],
    oppActive: [],
    oppDeckCount: [],
    oppPrizeCount: -1,
    oppBench: [],
    oppIsDiscarded: [],
    isTurn:false,
    energyAttachedThisTurn:false
  };
  roomName: string | any;
  roomConfirmation: boolean | any;
  opacityControl = 1

  @ViewChild('game')

  private gameCanvas: ElementRef | any;

  //coin flip mem vars
  currentImgSrc: string | any;
  backOfCard: string | any = '/assets/backOfCard.jpg';
  gameStarted: boolean = false;
  HEADSJPG = '/assets/heads.jpg';
  TAILSJPG = "/assets/tails.jpg";
  coinStarted = false; //coin flip
  private cookieVal: any;
  displayCoinDeciderDialog: boolean = false;
  displayCoinResultDialog: boolean = false;
  coinDecision: string = "HEADS";//defaulted incase user closes dialog without choice
  coinDecidedFlag: boolean = false;
  displayCoinWaiterDialog: boolean = false;
  TAILS_STR: string = 'TAILS';
  HEADS_STR: string = 'HEADS';
  coinTossResult: string | any;
  coinResultMsg: string | any;
  isHandShowing: boolean = false;//chang eot true later
  eventText = '';
  invalidDisplay: boolean = false;
  smallDisplay: boolean = false;

  displayBasic: boolean = false;

  //used to toggle focus of all stacks


  sampleBench = [[0, 1, 2, 3, 4, 5, 6], [0, 1, 2, 3, 4, 5, 6], [0, 1, 2, 3, 4, 5, 6], [0, 1, 2, 3, 4, 5, 6], [0, 1, 2, 3, 4, 5, 6]]


  constructor(private deckService: DeckService, private roomService: RoomServiceService, private cookieService: CookieService, private headerService: HeaderTogglerServiceService, private displayDectionService: DisplayDetectionService, private renderer: Renderer2, private perspectiveService: PerspectiveServiceService) { }
  public ngOnInit() {
    this.perspectiveService.resetStackFocusMap();
    let thing: StackFocusIdentifierEnum = StackFocusIdentifierEnum.HAND;
    //dark filter on background
    console.log('attempting to get html root from within app component...');
    // this.renderer.setAttribute(document.getElementById('htmlRoot'), 'style', 'tr');
    // this.renderer.setStyle(document.getElementById('htmlRoot'), 'background', 'url(/assets/pokeImageDark.jpg) no-repeat center center fixed')
    // this.renderer.setStyle(document.getElementById('htmlRoot'), '-webkit-background-size', 'cover')
    // this.renderer.setStyle(document.getElementById('htmlRoot'), '-moz-background-size', 'cover')
    // this.renderer.setStyle(document.getElementById('htmlRoot'), ' background-size', 'cover')




    // this.doDisplayDetection();//ensures proper viewport variables set for card images and if display needs adjusted to user
    this.roomConfirmation = false;
    this.cookieVal = this.cookieService.get('authorization');
    console.log('COOKIE VALUE IN GAME COMPONENT IS: ' + this.cookieVal);
    this.HEADSJPG = 'assets/heads.jpg';
    this.TAILSJPG = "assets/tails.jpg";
    console.log("active socket hopefully once we've gotten to the game shown here...");
    console.log(this.roomService.socket);
    console.log("attempting to print active deck");
    console.log(this.deckService.activeDeck);
    this.currentImgSrc = this.TAILSJPG;//tails showing to start




  }

  //display detection related
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.doDisplayDetection();
  }
  //trigger from child on card selection from focused stack, this way we maintain state
  setCardSelectedParent(arg:string){
    let isSourceCard= true
    if(this.perspectiveService.getCardSelected(isSourceCard).index>=0){
      this.setImgSrcFromFocusedStackSelectedCard();

      
    }
    //then we set the state, this way the source doesn't change after checked hopefully
    this.isCardSelected = this.perspectiveService.getCardSelected(isSourceCard).index>=0;
  }
  //returns img url of focused stack-clicked card by user for focused view of card
  setImgSrcFromFocusedStackSelectedCard(){

      let sourceCard = true;
      
      console.log('OBTAINING IMG URL ATTEMPT')
      let stackRem = this.perspectiveService.getRememberedStack();
      let cardSelected = this.perspectiveService.getCardSelected(sourceCard);
      console.log("STACK of selected card IS " + JSON.stringify(cardSelected.stackId));
      console.log("INDEX OF CARD SEL IS " + JSON.stringify(cardSelected.index));
      const sourceStack= this.getSourceStackFromEnum(cardSelected.stackId)
      if (sourceStack === null){
        console.log('HIT NULL CASE')
        this.sourceImg = ''
      }
      else{
        console.log('HIT ELSE CASE')
        const reversedIndex = sourceStack.length-1-cardSelected.index;
        console.log('card info is ' + JSON.stringify(sourceStack[reversedIndex]))
        const sourceImg = sourceStack[reversedIndex].imageUrlHiRes;
        console.log('source img hopefully here is present...' + sourceImg)
        this.sourceImg = sourceImg;
      }


  }
  getSourceStackFromEnum(stackFocusIdentifier:StackFocusIdentifierEnum):any{
    switch (stackFocusIdentifier) {
      case (StackFocusIdentifierEnum.HAND):
        return this.currentPerspective.inHand;
        break;
      case (StackFocusIdentifierEnum.ACTIVE):
        return this.currentPerspective.active
        break;
      case (StackFocusIdentifierEnum.DISCARD):
        return this.currentPerspective.isDiscarded
        break;
      case (StackFocusIdentifierEnum.PRIZE):
        break;
      case (StackFocusIdentifierEnum.DECK):
        break;
      case (StackFocusIdentifierEnum.BENCH1):
        return this.currentPerspective.bench[0]
        break;
      case (StackFocusIdentifierEnum.BENCH2):
        return this.currentPerspective.bench[1]
        break;
      case (StackFocusIdentifierEnum.BENCH3):
        return this.currentPerspective.bench[2]
        break;
      case (StackFocusIdentifierEnum.BENCH4):
        return this.currentPerspective.bench[3]
        break;
      case (StackFocusIdentifierEnum.BENCH5):
        return this.currentPerspective.bench[4]
        break;
      case (StackFocusIdentifierEnum.OPPPRIZE):

        break;
      case (StackFocusIdentifierEnum.OPPACTIVE):
        return this.currentPerspective.oppActive
        break;
      case (StackFocusIdentifierEnum.OPPDISC):
        return this.currentPerspective.oppIsDiscarded
        break;
      case (StackFocusIdentifierEnum.OPPBENCH1):
        return this.currentPerspective.oppBench[0]
        break;
      case (StackFocusIdentifierEnum.OPPBENCH2):
        return this.currentPerspective.oppBench[1]
        break;
      case (StackFocusIdentifierEnum.OPPBENCH3):
        return this.currentPerspective.oppBench[2]
        break;
      case (StackFocusIdentifierEnum.OPPBENCH4):
        return this.currentPerspective.oppBench[3]
        break;
      case (StackFocusIdentifierEnum.OPPBENCH5):
        return this.currentPerspective.oppBench[4]
        break;
      default:
        return null
      
        break;
    }
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
      // console.log("display is invalid")

    }
  }




  //apparently we'll use ngAfterViewInit() to listen to changes from server throughout gameplay
  public ngAfterViewInit() {//if the view may not have rendered yet, we use this...

    // listening for .emit("joinResp") from back-end to confirm room is not full/player isn't already in a room
    this.roomService.socket.on('joinResp', (data: string) => {
      if (data === this.roomName) {
        console.log("room was not full! Now able to issue action in room");
        this.roomConfirmation = true;
      }
      else {
        console.log("room was full or some other bug happening...");
      }
    });


    // booted from room based on server socket logic
    this.roomService.socket.on('gtfo', (data: string) => {
      if (data === 'boot') {
        console.log('found boot message');
        this.roomConfirmation = false;
      }
    });

    //from client perspective, we know if we decided the coin toss and will produce the correct message based on coin result
    this.roomService.socket.on('coinResultReady', (data: CoinResult) => {

      let resultMsgForDialog = ""
      switch (this.coinDecidedFlag) {
        case (true):
          if (data.coinTossPlayerChoseCorrect) {
            resultMsgForDialog = "You've chosen " + data.coinResult + ". You've won the toss and will decide who plays first"

          }
          else {
            resultMsgForDialog = "You've chosen " + data.coinResult + ". You've lossed the toss and the other player will decide who plays first"
          }
          break;
        case (false):
          if (data.coinTossPlayerChoseCorrect) {
            resultMsgForDialog = "Other player has chosen: " + data.coinResult + ". You've lossed the toss and the other player will decide who plays first"

          }
          else {
            resultMsgForDialog = "Other player has chosen: " + data.coinResult + ". You've won the toss and will decide who plays first"
          }
          break;

      }
      this.coinResultMsg = resultMsgForDialog;
      this.coinTossResult = data.coinResult;
      console.log("final coin image should be " + this.coinTossResult + " with result message for new dialog as " + resultMsgForDialog);
      this.displayCoinWaiterDialog = false; //in the case of being the water, ensures dialog is toggled off, either client is ok to set this to false here
      this.coin_flip();
    });



    // this.deckService.socket.on('controller', data =>{
    //   console.log(data);
    // });
    this.roomService.socket.on('preGameDeckRequest', () => {
      console.log('HIT PREGAME REQUEST FROM SERVER OF ROOM with cookie val of: ' + this.cookieVal + " deck passed is " + JSON.stringify(this.deckService.activeDeck._id));
      this.roomService.socket.emit('preGameDeckResponse', { token: this.cookieVal, deckId: this.deckService.activeDeck._id }, this.roomName);


    });
    // listening for .emit("reqCoinTossDecision") from back-end to tell it position
    this.roomService.socket.on('reqCoinTossDecision', (data: any) => {
      console.log("COIN DECISION TO THIS CLIENT with value of " + JSON.stringify(data))
      this.showCoinDeciderDialog();

    });

    //STATE at which decks are configured/coin toss decided, decks shuffled+ starting hands have been determined, can start perspective
    // listening for .emit("reqCoinTossDecisionWaitingPlayer") from back-end to tell it position

    this.roomService.socket.on('reqCoinTossDecisionWaitingPlayer', (data: any) => {
      console.log("COIN DECISION TO OTHER CLIENT " + JSON.stringify(data))

      this.showCoinWaiterDialog();
    });
    this.roomService.socket.on('showStartingPerspective', (data: any) => {
      console.log("Starting/Updated content for hand has arrived/opponent info for this client" + JSON.stringify(data))

      this.currentPerspective = data.PlayerPerspective;
      console.log('currentPerspective deck count now shown as ' + JSON.stringify(this.currentPerspective.deckCount));
      console.log('currentPerspective discard now shown as ' + JSON.stringify(this.currentPerspective.isDiscarded));
      console.log('current perspect whole is ' + JSON.stringify(this.currentPerspective))
      //IMPORTANT FLAG that must remain true on refresh/etc until turn ending moves are made by any effect during players turn including attack
      this.preventUpdateFlag = this.currentPerspective.isTurn;
      //TODO initialize all card stacks
      //discard

      if(!this.gameStarted) this.gameStarted = true;

      if(this.headerService.getHeader()) this.headerService.toggleHeader();
    });
    this.roomService.socket.on('showChangeRequestDecision', (data: any) => {
      console.log("Got a response for the request of this player action for the ongoing game" + JSON.stringify(data))
      if(data.changeApproved === true){
        console.log('request approved for the update')
        this.currentPerspective = data.PlayerPerspective;

      }
      else{
        console.log('request denied for update!')
      }
      //blinking changes aren't very enticing/but hell that's post beta version we'll worry about animations/transitions
      //from and to stacks after beta release
      console.log('currentPerspective deck count shown as ' + JSON.stringify(this.currentPerspective.deckCount));
      console.log('currentPerspective discard now shown as ' + JSON.stringify(this.currentPerspective.isDiscarded));
   
      console.log('current perspect whole is ' + JSON.stringify(this.currentPerspective))

      this.perspectiveService.resetAll();
   
    });
    this.roomService.socket.on('promoteViewUpdate', (data:any) =>{
      //if its this players turn cannot be used if they attacked, because 
      // we need to flag that it is no longer the players turn, or perhaps
      // provide additional variables 'attackedThisTurn' and have additional
      // what can we do to avoid that.. hmmm smoke a cigarette on that one

      //option 1: IF not turn, we need to have a flag on ui to not request
      //on turn end which can be activated by limited behaviors of the game
      //for example attacking the most common, 
      // if we do this, we must make sure this flag stays on until one of those
      // conditions are met when its the players turn, and maintain this state
      // on disconnect/refresh
      if(this.currentPerspective.isTurn || this.preventUpdateFlag){
        console.log("preventing update for this player for now to limit requests needed to server")
      }
      else{
        console.log("allowing update for opposing player of view update todo emit request for new perspective! " + data.promoteViewUpdate)
        this.socketEmitViewUpdateRequest();
      }
    })


    // this.roomService.socket.on('')

  }


  getFocusMapReference(): StackFocusMap {
    return this.perspectiveService.getStackFocusMapReference();
  }
  touchMoving($event: any) {
    console.log($event);
  }
  touchStart($event: any) {
    console.log($event);
  }
  touchEnd($event: any) {
    console.log($event);
  }

  public joinRoom() {
    console.log('room name passed is  ' + this.roomName);
    this.roomService.socket.emit('join_room', this.roomName);
    console.log("succesfully joined room via this socket if name was provided and not full...");
  }
  public leaveRoom() {
    this.roomService.socket.emit('leave_room', this.roomName);
  }


  coinAnimation(ms: number): Promise<any> {
    return new Promise((resolve) => {
      switch (this.currentImgSrc) {
        case (this.TAILSJPG):
          this.currentImgSrc = this.HEADSJPG;
          break;

        case (this.HEADSJPG):
          this.currentImgSrc = this.TAILSJPG;
          break;

      }
      setTimeout(resolve, ms);

    });




  }


  //utility
  async coin_flip() {
    this.coinStarted = true;
    for (let i = 0; i < 50; i++) {
      await this.coinAnimation(200);//alternates each time it is passed

    }
    this.coinStarted = false;

    //TODO below var replace with set result from backend response, only start coin toss above after result has been decided =)

    switch (this.coinTossResult) {
      case (this.TAILS_STR):
        this.currentImgSrc = this.TAILSJPG;
        break;
      case (this.HEADS_STR):
        this.currentImgSrc = this.HEADSJPG;
        break;


    }
    //now we emit request for gameStart for starting hand perspective
    this.displayCoinResultDialog = true;
    this.socketEmitGameStart();
  }

  showCoinDeciderDialog() {
    this.displayCoinDeciderDialog = true;
  }


  showCoinWaiterDialog() {
    this.displayCoinWaiterDialog = true;
  }
  forceCoinDecision(event: any) {
    console.log("imagine working" + JSON.stringify(event))
    this.socketEmitCoinDecision(this.coinDecision)
  }

  //in the case of user closing without deciding, we have onhide forceDecision method in place, hence the conditional flag here below to prevent multi-emission
  socketEmitCoinDecision(decision: string) {

    if (!this.coinDecidedFlag) {
      switch (decision) {
        case ("TAILS"):
          console.log("EMITTING TAILS DECISION");
          this.roomService.socket.emit('coinDecision', { token: this.cookieVal, headsOrTailsChosen: decision }, this.roomName);

          break;
        case ("HEADS"):
          console.log("EMMITING HEADS DECISION");
          this.roomService.socket.emit('coinDecision', { token: this.cookieVal, headsOrTailsChosen: decision }, this.roomName);

          break;
        default:
          console.log("DEFAULT decision of HEADS");
          break;
      }
      this.coinDecidedFlag = true;

      this.displayCoinDeciderDialog = false;
    }
    else {
      console.log("onhide trigger, coin already has been decided =)")
    }
  }
  socketEmitViewUpdateRequest() {
    this.displayCoinResultDialog = false;

    //tokena nd room name good enough to verify authenticated, get updatedView   
    console.log("emmited game view udpate request");
    this.roomService.socket.emit('gameViewUpdateRequest', { token: this.cookieVal }, this.roomName);

    //backend will find the matching socket and emit the starting hand perspective
  }
  socketEmitGameStart() {
    this.displayCoinResultDialog = false;

    //tokena nd room name good enough to verify authenticated, and use rinside of room at minimum    
    console.log("emmited game start request");
    this.roomService.socket.emit('gameStart', { token: this.cookieVal }, this.roomName);

    //backend will find the matching socket and emit the starting hand perspective
  }
  socketEmitGameUpdateParent(arg:string) {
    let sourceCard = true;
    //track type of sourc estack
    let sourceStackTypeEnum = this.perspectiveService.getCardSelected(sourceCard).stackId
    //track source stack itself
    let sourceStackAct = this.getUserSourceOrDestCardIntention(this.perspectiveService.getCardSelected(sourceCard).stackId)

    let destinationStack = this.perspectiveService.getCardSelected(!sourceCard).stackId
    let indexOfSourceCard = this.perspectiveService.getCardSelected(sourceCard).index
    let indexOfDestinationCard = this.perspectiveService.getCardSelected(!sourceCard).index;


    //log the source/dest cards for debugging
    console.log("THIS BETTER BE THE SOURCE CARD OR RAGE:" + JSON.stringify(sourceStackAct[sourceStackAct.length -1 - indexOfSourceCard]))
    //log the source/dest cards for debugging
    console.log("THIS BETTER BE THE DEST STACK OR RAGE:" + JSON.stringify(this.getUserSourceOrDestCardIntention(destinationStack)));


    console.log("THIS BETTER BE THE DEST CARD OR RAGE:" + JSON.stringify(this.getUserSourceOrDestCardIntention(destinationStack)[indexOfDestinationCard]));

    //tokena nd room name good enough to verify authenticated, and use rinside of room at minimum    
    //case-by-case req structure based on source and destination stacks
    let reqStructure:RequestStructure = {CATEGORY:-1, REQ_INFO:{srcStack:-1, destStack:-1, slctdSrcCardIndex: -1, slctdDestCardIndex:-1}};
    switch(sourceStackAct[sourceStackAct.length -1 - indexOfSourceCard].supertype){
      case('Energy'):
        if(!this.currentPerspective.energyAttachedThisTurn && sourceStackTypeEnum === StackFocusIdentifierEnum.HAND){
          reqStructure.CATEGORY = PlayerRequestTypesEnum.ENERGY_ATTACH
        }
        break;
      case('Trainer'):
        reqStructure.CATEGORY = PlayerRequestTypesEnum.TRAINER_ACTIVATE;
        break;
      case('Pokémon'):
        //todo compensate for 'pokemon power action' can differentiate if from hand or not
        if(sourceStackTypeEnum === StackFocusIdentifierEnum.HAND){
          reqStructure.CATEGORY = PlayerRequestTypesEnum.EVOLVE_ORDER
        }
        else{
          //if not from the hand, we assume they attempt to use pokemon power
          reqStructure.CATEGORY = PlayerRequestTypesEnum.POKE_POWER
        }
        break;
      default:
          console.error("Error: could not identify the request type from the selected card/stack combination")
          break;

    }
    reqStructure.REQ_INFO.srcStack= sourceStackTypeEnum;
    reqStructure.REQ_INFO.destStack= destinationStack;
    reqStructure.REQ_INFO.slctdSrcCardIndex = indexOfSourceCard;
    reqStructure.REQ_INFO.slctdDestCardIndex = destinationStack;
    console.log("request structure sent is" + JSON.stringify(reqStructure));
    //checks if energy was already attached currently, could check other situations before sending update(UI validation for update)
    if(reqStructure.CATEGORY >= 0){
      console.log("emmited game update request");
      //key formatting done in json here for properties provided/object structure of 'RequestStructure' handshake with backend
      this.roomService.socket.emit('gameUpdate', { token: this.cookieVal, requestFromPlayer:reqStructure }, this.roomName);
  
    }
    else{
      console.log('rejected emit update request')
      this.perspectiveService.resetAll();
    }
    //backend will find the matching socket and emit the starting hand perspective
  }


 

  //Game events
  //
  //

  toggleBench($event: any) {

    console.log('HIT HOVER/touch EVENT YAY!')
    this.isHandShowing = false;
  }
  toggleHand($event: any) {

    console.log('HIT HOVER/touch EVENT YAY!')
    this.isHandShowing = true;
  }


  modifyAllButOneStackOpacityParent(newItem: number) {
    console.log("opacity passed as " + newItem + " and is of type " + typeof (newItem));
    this.opacityControl = newItem;
  }






  //translates the perspective stack needed from the perspective service stack enums
  getUserSourceOrDestCardIntention(stackEnum: StackFocusIdentifierEnum):CardInPlay[] {
   
      switch (stackEnum) {
        case (StackFocusIdentifierEnum.HAND):
          return this.currentPerspective.inHand;
          break;
        case (StackFocusIdentifierEnum.ACTIVE):
          console.log("hit active case")
          return this.currentPerspective.active;
          break;
        case (StackFocusIdentifierEnum.DISCARD):
          console.log("hit discard case")
          return this.currentPerspective.isDiscarded;
          break;
        case (StackFocusIdentifierEnum.PRIZE):
          console.log("hit prize case")
          return this.currentPerspective.isDiscarded;
          break;
        case (StackFocusIdentifierEnum.DECK):
          console.log("hit deck case")
          return this.currentPerspective.deckCount;
          break;
        case (StackFocusIdentifierEnum.BENCH1):
          console.log("hit bench 1 case");
          return this.currentPerspective.bench[0];
          break;
        case (StackFocusIdentifierEnum.BENCH2):
          return this.currentPerspective.bench[1];

          console.log("hit bench 2 case")
          break;
        case (StackFocusIdentifierEnum.BENCH3):
          return this.currentPerspective.bench[2];

          console.log("hit bench 3 case")
          break;      console.log("user did not select a card after clicking outside of a stack");

        case (StackFocusIdentifierEnum.BENCH4):
          return this.currentPerspective.bench[3];

          console.log("hit bench 4 case")
          break;
        case (StackFocusIdentifierEnum.BENCH5):
          return this.currentPerspective.bench[4];

          console.log("hit bench 5 case")
          break;
        case (StackFocusIdentifierEnum.OPPPRIZE):
          return this.currentPerspective.bench[0];

          console.log("hit opp prize case")
          break;
        case (StackFocusIdentifierEnum.OPPACTIVE):
          return this.currentPerspective.bench[0];

          console.log("hit opp active case")
          break;
        case (StackFocusIdentifierEnum.OPPDISC):
          return this.currentPerspective.bench[0];

          console.log("hit opp disc case")
          break;
        case (StackFocusIdentifierEnum.OPPBENCH1):
          return this.currentPerspective.bench[0];

          console.log("hit opp bench 1 case");
          break;
        case (StackFocusIdentifierEnum.OPPBENCH2):
          return this.currentPerspective.bench[0];

          console.log("hit opp bench 2 case")
          break;
        case (StackFocusIdentifierEnum.OPPBENCH3):
          return this.currentPerspective.bench[0];

          console.log("hit opp bench 3 case")
          break;
        case (StackFocusIdentifierEnum.OPPBENCH4):
          return this.currentPerspective.bench[0];

          console.log("hit opp bench 4 case")
          break;
        case (StackFocusIdentifierEnum.OPPBENCH5):
          return this.currentPerspective.bench[0];

          console.log("hit opp bench 5 case")
          break;
        default:
          return [];
          console.error("didn't find a case for stack, bug here")
          break;
      }

    

    

  }




}
