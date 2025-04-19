
//any usually indicates the filter on backeend returned an empty Object {} which case we can handle these conditions on front end via check
export interface PlayerPerspective {
    'inHand': CardInPlay[]
    "active": CardInPlay[]
    "deckCount": number | any
    "prizeCount": number | any
    "bench": CardInPlay[][]
    "isDiscarded": CardInPlay[]
    "oppInHandCount": number | any
    "oppActive": CardInPlay[]
    "oppDeckCount": number | any
    "oppPrizeCount": number | any
    "oppBench": CardInPlay[][]
    "oppIsDiscarded": CardInPlay[]
    "isTurn":boolean
    "energyAttachedThisTurn":boolean


}
//copied precisely as mongoTable db spec used, dependent on backend consistency controlling in play cards with appropriate properties(handshake)
export interface CardInPlay {
    "isHand": Boolean,
    "isActive": Boolean,
    "isBench": Boolean,
    "isInDeck": Boolean,//must explicitly toggle off when deck modified
    "benchPos": Number,//should always be between 1-5 if 'isBench' is true
    "isPrizeCard": Boolean,
    "isDiscarded": Boolean,
    "hidden": Boolean,
    "damageCounters": Number,//if damageCounter * 10 >= hp, the pokemon should be removed from play
    //for all 'attachedAs' number indicates bench position/active pokemon, default is -1 interpreted as N/a
    "attachedAsEnergy": Number,
    "attachedAsEvo": Number,
    "attachedAsTrainer": Number, //for stupid defender and plus power that no one should use

    //api defined
    "types": String[],
    "retreatCost": String[],
    "id": String,
    "name": String,
    "imageUrl": String,
    "subtype": String,
    "supertype": String,
    "hp": String,
    "convertedRetreatCost": Number,
    "number": String,
    "artist": String,
    "rarity": String,
    "series": String,
    "set": String,
    "setCode": String,
    "attacks": [
        {
            "cost": String[],
            "name": String,
            "text": String,
            "damage": String,
            "convertedEnergyCost": Number,
        },
    ],
    "weaknesses": [
        {
            "type": {
                "type": String
            },
            "value": String,
        },
    ],
    "imageUrlHiRes": String,
    "nationalPokedexNumber": Number,
    "resistances": [
        {
            "type": {
                "type": String
            },
            "value": String,
        },
    ],
}


export interface CoinResult {
    'coinResult': string
    'coinTossPlayerChoseCorrect': boolean
}