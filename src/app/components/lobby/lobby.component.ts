import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DeckService } from 'src/app/service/deck.service';
import { Deck } from 'src/app/classes/Deck';
import { Router } from '@angular/router';
import * as io from 'socket.io-client';
import { RoomServiceService } from 'src/app/service/room-service.service';
import { LoginServiceService } from 'src/app/service/login-service.service';
/*
  Component for waiting in back-end queue for an available opposing player
  Should handle entering a queue held by server, and awaiting a response to 
  enter a peer-to-peer connection

  author: Charles Erd
*/
@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  constructor(private roomService: RoomServiceService, private router: Router, private loginService: LoginServiceService, 
                private deckService: DeckService) { }
  queueResponse: boolean = false;
  
  decks: Observable<Deck[]>|any;
  deckSelected: Deck|any;
  categoryName: String='';
  ngOnInit(): void {
    console.log("requesting socket....")
    //TODO rewire socket endpoint to configured socket.io ep on node
    this.roomService.socket = io.connect('https://pokemongo-be-master.onrender.com');//connection event called here
    console.log("Checking if login active from inside of lobbycomponent");

    console.log(this.loginService.sessionActive);
    // console.log("attempting to log socket object " + JSON.stringify(this.roomService.socket));
    this.reloadData();



  }
  public ngAfterViewInit(){
    this.roomService.socket.on('lobbyUpdate', ()=>{
      console.log('updating lobby service component across all sockets');
      //todo follow roomService todo
      // this.roomService.removeRoom(data);
    })
  }
  enterQueue(){
    //TODO add logic to handle waiting after creating a room for another to join/joining a lobby after a room is found


    //TODO clean socket connection/errors with connection regarding multiple clients per room
    this.queueResponse = true;
    this.router.navigate(['game']);
    console.log(this.queueResponse);
  }
  myFunc(): any{
    console.log('clicked');
  }


  reloadData() {
    console.log("gimme something");
    this.decks = this.deckService.getDeckList();
    console.log(this.decks);

  }



  setActive(deck: Deck){
    console.log('Logging deck object  ' + JSON.stringify(deck));
    console.log('setting deck id for this user via deck service for deck id#: ' + deck._id);

    this.deckService.activeDeck = deck;
    this.deckSelected = this.deckService.activeDeck;
  }
  getActive(){
    return this.deckSelected;
  }

}
