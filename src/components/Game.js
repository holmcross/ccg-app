import React, { useReducer, useState } from 'react'
import Hand from './Hand'
import PlayingZone from './PlayingZone'
import ManaPoolHUD  from './ManaPoolHUD'
import customDB from "../custom_db.json"

    /*
    //reducer example:
    const reducerFunc = (state,action) => {
        console.log('we done it')
        switch(action){
            case 'increment':
                return state + 1
            default:
                return state
        }
    }

    condtional example for JSX:
    {(conditional expression)) && (code to return if true)}
    */

const COLORS = {
    w: 0,
    u: 1,
    b: 2,
    r: 3,
    g: 4,
    c: 5
}

const Game = () => {

    /*
    function getInitialState () {
        this.gameState = {
            currentState: "",
            activePlayer: ""
        };
        this.playerState = {
            player: {
                deck: [],
                playerHitpoints: 20,
                hand: [],
                cardsInPlay: [],
                graveyard: [],
                exile: [],
                playedLand: false,
                turn: 0,
                ManaPool: {
                    w: 0,
                    u: 0,
                    b: 0,
                    r: 0,
                    g: 0,
                    c: 0
                }
            }
        }
    }
    */

    const getInitialDeck = (customDBParam) => {
        return customDBParam.map((card, index) => {
            let cardObj = card
            cardObj.id = index
            return cardObj
        })
    }

    const shuffleDeck = (deck) => {
        return deck.sort(() => Math.random() - 0.5)
    }

    const initialState = {
        gameState:{
            currentState: "inactive"
        }
    }

    const [state, dispatchPlayerActions] = useReducer(playerActions, initialState)


    function playerActions(state, action){
        let newState = {};
        let newCardInPlay = {};
        let newCardsInPlay = [];
        let newCardInHand = {};
        let newHand = [];
        let newIndividualPlayerState = {};
        let newPlayerState = {};
        let newDeck = [];

        switch(action.type){
            case "SETUP_GAME":
                console.log("Starting up game...")
                const playerDeck = shuffleDeck(getInitialDeck(customDB))
                const playerHand = playerDeck.splice(0, 7) 

                newState = {
                    gameState: {
                        state: "NEW_GAME",
                        activePlayer: "player"
                    },
                    playerState: {
                        player: {
                            deck: playerDeck,
                            playerHitpoints: 20,
                            hand: playerHand,
                            cardsInPlay: [],
                            graveyard: [],
                            exile: [],
                            playedLand: false,
                            turn: 1,
                            ManaPool: {
                                w: 0,
                                u: 0,
                                b: 0,
                                r: 0,
                                g: 0,
                                c: 0
                            }
                        }
                    },
                    aiState: {

                    }
                }
                break

            case "BEGIN_TURN":
                newCardsInPlay = state.playerState.player.cardsInPlay.map(card => {
                    if(card.tapped){card.tapped = false}
                    return card
                })

                newDeck = structuredClone(state.playerState.player.deck)

                newCardInHand = newDeck.shift()
                
                newHand = [
                    ...state.playerState.player.hand,
                    newCardInHand
                ]

                const newTurn = state.playerState.player.turn + 1

                newIndividualPlayerState = {
                    ...state.playerState.player,
                    hand: newHand,
                    cardsInPlay: newCardsInPlay,
                    deck: newDeck,
                    playedLand: false,
                    turn: newTurn,
                    ManaPool: {
                        w: 0,
                        u: 0,
                        b: 0,
                        r: 0,
                        g: 0,
                        c: 0
                    }
                }

                newPlayerState = {
                    ...state.playerState,
                    player: newIndividualPlayerState
                }

                newState = {
                    ...state,
                    playerState: newPlayerState
                }
                break

            // this accepts 'action.newPlayerManaPool' which is the remaining mana in the player 
            //  mana pool after the casting cost has been paid
            case "PLAY_CARD_FROM_HAND":
                console.log ('played card id', action.playedCard.id)
                newCardInPlay = {
                    ...action.playedCard,
                    tapped: false,
                    damage: 0
                }
                
                newCardsInPlay = [
                    ...state.playerState.player.cardsInPlay,
                    newCardInPlay
                ]

                newHand = state.playerState.player.hand.filter(cardObj => cardObj.id != action.playedCard.id )
                
                // pays the cost of the card
                // let newManaPool = {...state.playerState.player.ManaPool}
                let newManaPool = structuredClone(state.playerState.player.ManaPool)
                for(const manaPip in action.newPlayerManaPool){
                    newManaPool[manaPip] = action.newPlayerManaPool[manaPip]
                }
                
                newIndividualPlayerState = {
                    ...state.playerState.player,
                    hand: newHand,
                    cardsInPlay: newCardsInPlay,
                    ManaPool: newManaPool
                }
                newPlayerState = {
                    ...state.playerState,
                    player: newIndividualPlayerState
                }
                newState = {
                    ...state,
                    playerState: newPlayerState
                }
                break

            case "PLAY_LAND_FROM_HAND":
                console.log ('played card id', action.playedCard.id)
                newCardInPlay = {
                    ...action.playedCard,
                    tapped: false
                }
                
                newCardsInPlay = [
                    ...state.playerState.player.cardsInPlay,
                    newCardInPlay
                ]

                newHand = state.playerState.player.hand.filter(cardObj => cardObj.id !== action.playedCard.id )
                
                newIndividualPlayerState = {
                    ...state.playerState.player,
                    hand: newHand,
                    cardsInPlay: newCardsInPlay,
                    playedLand: true
                }
                newPlayerState = {
                    ...state.playerState,
                    player: newIndividualPlayerState
                }
                newState = {
                    ...state,
                    playerState: newPlayerState
                }
                break

            case "TAP_CARD":

                console.log("Tapping card")

                // find the card that was tapped, and set the tapped the attribute
                newCardsInPlay = state.playerState.player.cardsInPlay.map( card => {
                    if(card.id === action.tappedCard.id){ card.tapped = true }
                    return card
                })

                // if the tapped card was a land, add mana
                if(action.tappedCard.type === 0){
                    // I use const here just to tell myself I won't change these directly
                    const manaPool = state.playerState.player.ManaPool
                    const color = action.tappedCard.color
                    const newManaPool = {
                        ...manaPool,
                        // Here, I add 1 to a reference of the property, instead of incrementing the property
                        [color]: manaPool[color] + 1 

                    }

                    newIndividualPlayerState = {
                        ...state.playerState.player,
                        ManaPool: newManaPool,
                        cardsInPlay: newCardsInPlay
                    }
                }else{ // is creature, add no mana
                    newIndividualPlayerState = {
                        ...state.playerState.player,
                        cardsInPlay: newCardsInPlay
                    }
                }
                    
                newState = {
                    ...state,
                    playerState: {
                        ...state.playerState,
                        player: newIndividualPlayerState,
                    }
                }
                break;
            default:
                break
        }
        console.log("newState returned from reducer action", action.type, "is", newState)
        return newState
    }

    // check if player can pay the mana for a spell, and if so calculate the new mana pool
    //  after casting cost has been spent
    const attemptToCastSpell = (card) => {

        let flag = 1
        let newPlayerManaPool = {}
        for(const manaPip in card.manaCost){

            if (state.playerState.player.ManaPool[manaPip] < card.manaCost[manaPip]){
                flag = 0
            }else{
                newPlayerManaPool[manaPip] = state.playerState.player.ManaPool[manaPip] - card.manaCost[manaPip]
            }
            if (!flag) {break}
        }
        if (flag) {dispatchPlayerActions({
            type:"PLAY_CARD_FROM_HAND", playedCard:card, newPlayerManaPool: newPlayerManaPool})
        }else{
            console.log("Insufficent mana to play", card.name)
        }
    }

    const attemptToPlayLand = (card) => {
        if(!state.playerState.player.playedLand){
            dispatchPlayerActions({type:"PLAY_LAND_FROM_HAND", playedCard: card})
        }
        else{
            console.log("You cannot play this land")
        }
    }

    const tapCard = (card) => {
        if(!card.tapped){
            dispatchPlayerActions({type:"TAP_CARD", tappedCard:card})
        }
    }

    if(state.gameState.currentState === 'inactive'){
        return <div>
            <button onClick={() => dispatchPlayerActions({type:"SETUP_GAME"})}>START GAME</button>
        </div>
    }
    else{
        return <div>
            <button onClick={() => dispatchPlayerActions({type:"SETUP_GAME"})}>RESTART GAME</button>
            <button onClick={() => dispatchPlayerActions({type:"BEGIN_TURN"})}>NEW TURN</button>
            Turn: {state.playerState.player.turn}
            <ManaPoolHUD manaPoolProps={state.playerState.player.ManaPool} />
            <div className="Board">
                <PlayingZone
                    cardsInPlayProps={state.playerState.player.cardsInPlay}
                    tapCardProps={tapCard}
                />
                <Hand
                    handProps={state.playerState.player.hand}
                    dispatchPlayerActionsProps={dispatchPlayerActions}
                    castSpellProps={attemptToCastSpell}
                    playLandProps={attemptToPlayLand}
                />
            </div>
        </div>
    }
}

export default Game