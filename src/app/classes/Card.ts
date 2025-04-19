export class Card{
    
    types: string[]|any; 
    retreatCost: string[]|any;
    attacks: Attack[]|any;
       

    resistances: Resistance[]|any;
    weaknesses: Weakness[]|any;
     _id : string|any;
     id: string|any;
     name: string|any;
     imageUrl: string|any;
     subtype: string|any;
     supertype: string|any;
     hp: string|any;
     convertedRetreatCost: Number|any;
     number: string|any;
     artist: string|any;
     rarity: string|any;
     series: string|any;
     set: string|any;
     setCode: string|any;
     imageUrlHiRes: string|any;
     nationalPokedexNumber: Number|any;
}


export class Attack{

cost: string[]|any;
_id: string|any; 
name: string|any;
convertedEnergyCost: Number|any;
damage: string|any;
text: string|any;

}

export class Resistance{
_id: string|any;
type: string|any;
value: string|any;
}

export class Weakness{
_id: string|any;
type: string|any;
value: string|any;
}