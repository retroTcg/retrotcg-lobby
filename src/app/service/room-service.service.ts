import { Injectable } from '@angular/core';
import { StateController } from '../classes/StateController';
import { HttpClient } from '@angular/common/http';
import { DeckService } from './deck.service';

@Injectable({
  providedIn: 'root'
})

export class RoomServiceService {


  //TODO implement request to remove room after game completes
  // removeRoom(data: any) {
  //   throw new Error("Method not implemented.");
  // }
  // rooms: object[];
  constructor(private httpClient:HttpClient, private deckService: DeckService) { 
    //TODO find room in list and remove it
    //TODO display all rooms via socket broadcast


  }
  socket: any;
  stateController: StateController = new StateController();

}
