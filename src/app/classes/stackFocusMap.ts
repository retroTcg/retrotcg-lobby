import { StackFocusIdentifierEnum } from "./Enums";

export class StackFocusMap {
  handFocusActive: boolean = false;
  activeFocusActive: boolean = false;
  discardFocusActive: boolean = false;
  bench1FocusActive: boolean = false;
  bench2FocusActive: boolean = false;
  bench3FocusActive: boolean = false;
  bench4FocusActive: boolean = false;
  bench5FocusActive: boolean = false;
  oppFocusActive: boolean = false;
  oppDiscardFocusActive: boolean = false;
  oppbench1FocusActive: boolean = false;
  oppbench2FocusActive: boolean = false;
  oppbench3FocusActive: boolean = false;
  oppbench4FocusActive: boolean = false;
  oppbench5FocusActive: boolean = false;


}

export class CardSelected{
  index:number=-1;
  stackId:StackFocusIdentifierEnum=-1;
  
}