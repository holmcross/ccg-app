import React, { useReducer, useState } from 'react'
import Hand from "./Hand"
import PlayingZone from "./PlayingZone"
import customDB from "../custom_db.json"

//rather then passing objects around components, it would be better if keys/identitifers were passed
//  and those components could access needed info from a single source (hash)

//cards need two forms of identitifers, one to identify what card it is, and another to distinguish
//  between multiple copies. At the moment we are matching based on name.
//  a possible solution is to match based on "<card_name>" + "<copy_number>"


    /*
    //reducer example

    const reducerFunc = (state,action) => {
        console.log('we done it')
        switch(action){
            case 'increment':
                return state + 1
            default:
                return state
        }
    }

    const [myNewState, dispatcher] = useReducer(reducerFunc, 10) // the initial state should be a literal
   
    // () => dispatcher('increment') is called somewhere
    
    console.log("state reducer is", myNewState)
    */




class GameState {
    constructor(){
        //this should be ENUMS
        this.currentPhase = ""
        this.activePlayer = ""
    }
}

const Game = () => {
    const getInitialDeck = () => {
        return customDB.map((card, index) => {
            let cardObj = card;
            cardObj.id = index
            return cardObj
        })
    }

    const shuffleDeck = (deck) => {
        return deck.sort(() => Math.random() - 0.5)
    }
    const initialPlayerObject = {
        deck: [],
        playerHitpoints: 20,
        hand: [],//this.deck.splice(0, 7),
        cardsInPlay: [],
        graveyard: [],
        exile: [],
        playedLand: false,
        manaPool: {
            w: 0,
            u: 0,
            b: 0,
            r: 0,
            g: 0,
            c: 0
        }
    }

    const initialState = {
        gameState: {
            state: "NEWGAME",
        },
        playerState: {
            player1: {
                ...initialPlayerObject,
            },
            player2: {
                ...initialPlayerObject,
            }
        },
    }

    // const playerObj = new playerObject(initialDeck)

    //const [player, setPlayer] = useState(new Player(deckDatabase))

    const playerActions = (state, action) => {
        let newState;
        switch(action.type){
            case "PLAY_CARD_FROM_HAND":
                console.log ('played card id', action.playedCard.id)
                let newCardInPlay = {
                    ...action.playedCard,
                    tapped: false
                }
                let newCardsInPlay = {
                    ...state.cardsInPlay,
                    newCardInPlay
                }
                let newHand = state.playerState.player1.hand
                console.log("hand contains", newHand)
                //newHand.filter(cardObj => cardObj.id != action.playedCard.id )

                newState = {
                    ...state,
                    gameState: "startGame",
                    playerState: {
                        player1: {
                            ...state.playerState.player1,
                            deck: player1Deck,
                            hand: newHand,
                        },
                        player2: {
                            ...state.playerState.player1,
                            deck: player2Deck,
                            hand: player2Hand,
                        }
                    }
                }
                //     state: {
                //         ...state,
                //         cardsInPlay: newCardsInPlay,
                //         hand: newHand
                //     }
                // }
                break;
            case "START_GAME":
                console.log("startGame")
                const player1Deck = shuffleDeck(getInitialDeck())
                const player2Deck = shuffleDeck(getInitialDeck())
                const player1Hand = player1Deck.splice(0, 7); 
                const player2Hand = player2Deck.splice(0, 7); 

                console.log("generating newState")
                newState = {
                    ...state,
                    gameState: "startGame",
                    playerState: {
                        player1: {
                            ...state.playerState.player1,
                            deck: player1Deck,
                            hand: player1Hand,
                        },
                        player2: {
                            ...state.playerState.player1,
                            deck: player2Deck,
                            hand: player2Hand,
                        }
                    }
                }
                console.log(newState);
                break;
            default:

                break;
        }
        console.log("new state is", newState)
        return newState
    }
    const [state, dispatchPlayerActions] = useReducer(playerActions, initialState)

    /*
    const [hand, setHand] = useState(player.hand)
    const [cardsInPlay, setCardsInPlay] = useState([])


    const tapCard = id => {
        setCardsInPlay(
            cardsInPlay.map(card => {
                if(card.id === id){
                    console.log('Tapped', card.name)
                    return{
                        ...card,
                        tapped: !card.tapped
                    }
                }
                return card
            })
        )
    }


    function putCardInPlay(cardObjParam){
        var newCardInPlay = {
            ...cardObjParam,
            tapped: false
        }

        setCardsInPlay([
            ...cardsInPlay,
            newCardInPlay
        ])

        console.log("the following cards are now in play:". cardsInPlay)
    }


    const playCardFromHand = (playedCardObj) => {
        console.log(playedCardObj.name, "was played")

        putCardInPlay(playedCardObj)

        setHand(
            hand.filter(cardObj => cardObj.id != playedCardObj.id )
        )
        console.log("Hand now contains", hand)
    }
    */

    return <div className="Board">
    <button onClick={() => dispatchPlayerActions({type: "START_GAME"})}>
        START Game
    </button>
    <PlayingZone
        cardsInPlayProps={state.playerState.player1.cardsInPlay}
    />
    <Hand
        handProps={state.playerState.player1.hand}
        dispatchPlayerActionsProps={dispatchPlayerActions}
    />
</div>
}

export default Game