import { PlayerRequestTypesEnum } from "./Enums";

//TBD for actions like trainers/pokemon power response i.e. gust of wind opp choice


export class RequestStructure{
	CATEGORY:PlayerRequestTypesEnum = -1;
    //TBD, different structure for each, start with sample energy attach and build this out from there
    REQ_INFO={
        srcStack:-1,
        destStack:-1,
        slctdSrcCardIndex: -1,
        slctdDestCardIndex: -1
    };



	

}