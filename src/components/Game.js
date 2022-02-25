import React, { useReducer, useState } from 'react'
import Hand from "./Hand"
import PlayingZone from "./PlayingZone"
import customDB from "../custom_db.json"

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

    const getInitialDeck = () => {
        return customDB.map((card, index) => {
            let cardObj = card
            cardObj.id = index
            return cardObj
        })
    }

    const shuffleDeck = (deck) => {
        return deck.sort(() => Math.random() - 0.5)
    }

    const playerObject = {
        deck: [],
        playerHitpoints: 20,
        hand: [],
        cardsInPlay: [],
        graveyard: [],
        exile: [],
        playedLand : false,
        ManaPool: {
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
            activePlayer: "PLAYER_1"
        },
        playerState: {
            player: {
                ...playerObject,
            }
        },
    }

    const [state, dispatchPlayerActions] = useReducer(playerActions, initialState)

    function playerActions(state, action){
        let newState, newCardInPlay, newCardsInPlay, newHand, newManaPool, newIndividualPlayerState, newPlayerState

        switch(action.type){
            case "SETUP_GAME":
                console.log("Starting up game...")
                const playerDeck = shuffleDeck(getInitialDeck())
                const playerHand = playerDeck.splice(0, 7) 

                newState = {
                    ...state,
                    playerState: {
                        player: {
                            ...state.playerState.player,
                            deck: playerDeck,
                            hand: playerHand,
                        }
                    }
                }
                newState.playerState.player.ManaPool.b = 4
                break

            case "PLAY_CARD_FROM_HAND":
                console.log ('played card id', action.playedCard.id)
                newCardInPlay = {
                    ...action.playedCard,
                    tapped: false
                }
                
                newCardsInPlay = [
                    ...state.playerState.player.cardsInPlay,
                    newCardInPlay
                ]

                newHand = state.playerState.player.hand.filter(cardObj => cardObj.id != action.playedCard.id )
                
                newManaPool = state.playerState.player.ManaPool
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

                newHand = state.playerState.player.hand.filter(cardObj => cardObj.id != action.playedCard.id )
                
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
                newCardInPlay = {
                    ...action.tappedCard,
                    tapped: true
                }
                newCardsInPlay = {
                    ...state.playerState.player.cardsInPlay,
                    newCardInPlay
                }
                if(action.tappedCard.type === 0){
                    newManaPool = state.playerState.player.ManaPool
                    newManaPool[action.playedCard.color]++

                    newIndividualPlayerState = {
                        ...state.playerState.player,
                        ManaPool: newManaPool,
                        cardsInPlay: newCardInPlay
                    }
                }else{
                    newIndividualPlayerState = {
                        ...state.playerState.player,
                        cardsInPlay: newCardInPlay
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
            default:
                break
        }
        console.log("new state is", newState)
        return newState
    }

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
        dispatchPlayerActions({type:"TAP_CARD", tappedCard:card})
    }

    return <div>
        <button onClick={() => dispatchPlayerActions({type:"SETUP_GAME"})}>START GAME</button>
        <div class="Board">
            <PlayingZone
                cardsInPlayProps={state.playerState.player.cardsInPlay}
            />
            <Hand
                handProps={state.playerState.player.hand}
                dispatchPlayerActionsProps={dispatchPlayerActions}
                castSpellProps={attemptToCastSpell}
                playLandProps={attemptToPlayLand}
                tapLandProps=[]
            />
        </div>
    </div>
}

export default Game