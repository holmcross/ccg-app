import React, { useReducer, useState } from 'react'
import Hand from './Hand'
import PlayingZone from './PlayingZone'
import ManaPoolHUD  from './ManaPoolHUD'
import AIZone from './AIZone'
import HS_db from "../HS_db.json"

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
            cardObj.damage = 0
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



    const playerActions = (state, action) =>{
        let newState = {};
        let newCardInPlay = {};
        let newCardsInPlay = [];
        let newCardInHand = {};
        let newHand = [];
        let newIndividualPlayerState = {};
        let newPlayerState = {};
        let newGameState = {};
        let newAiState = {};
        let newDeck = [];

        switch(action.type){
            case "SETUP_GAME":
                console.log("Starting up game...")
                const playerDeck = shuffleDeck(getInitialDeck(HS_db))
                const playerHand = playerDeck.splice(0, 5) 

                newState = {
                    gameState: {
                        state: "NEW_GAME",
                        ai: {
                            cardsInPlay:[
                                {"name":"Toe Cutter","cmc":2,"type":1,"color":"b","power":2,"toughness":2,"manaCost": 2, "printableManaCost":"BB", "damage":0, id: 30},
                                {"name":"Toe Protector","cmc":2,"type":1,"color":"b","power":1,"toughness":3,"manaCost": 2, "printableManaCost":"BB", "damage":0, id: 31},
                                {"name":"Toe Assaulter","cmc":3,"type":1,"color":"b","power":3,"toughness":3,"manaCost": 3, "printableManaCost":"BBB", "damage":0, id: 32}
                            ]
                        }
                    },
                    playerState: {
                        player: {
                            deck: playerDeck,
                            playerHitpoints: 20,
                            hand: playerHand,
                            cardsInPlay: [],
                            graveyard: [],
                            exile: [],
                            turn: 1,
                            currentMana: 1,
                            maxMana: 1
                        }
                    }
                }
                break

            case "BEGIN_TURN":
                newCardsInPlay = state.playerState.player.cardsInPlay.map(card => {
                    if(card.tapped){card.tapped = false}
                    return card
                })

                newDeck = structuredClone(state.playerState.player.deck)

                if (state.playerState.player.hand.length < 10){
                    newCardInHand = newDeck.shift()
                    newHand = [
                        ...state.playerState.player.hand,
                        newCardInHand
                    ]
                } else {
                    newHand = [
                        ...state.playerState.player.hand
                    ]
                }
                
                const newTurn = state.playerState.player.turn + 1;
                let newMana = 10;

                if(state.playerState.player.maxMana + 1 < 10){
                    newMana = state.playerState.player.maxMana + 1
                }

                newIndividualPlayerState = {
                    ...state.playerState.player,
                    hand: newHand,
                    cardsInPlay: newCardsInPlay,
                    deck: newDeck,
                    turn: newTurn,
                    currentMana: newMana,
                    maxMana: newMana
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

                newHand = state.playerState.player.hand.filter(cardObj => cardObj.id !== action.playedCard.id )
                
                /*
                // pays the cost of the card
                // let newManaPool = {...state.playerState.player.ManaPool}
                let newManaPool = structuredClone(state.playerState.player.ManaPool)
                for(const manaPip in action.newPlayerManaPool){
                    newManaPool[manaPip] = action.newPlayerManaPool[manaPip]
                }
                */
                
                newIndividualPlayerState = {
                    ...state.playerState.player,
                    hand: newHand,
                    cardsInPlay: newCardsInPlay,
                    currentMana: action.newPlayerManaPool
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

            case "ATTACK":
                // console.log(action.attackingSource.name, "is attacking", action.attackedTarget, "inside reducer")

                // let newDamage = action.attackedTarget.damage + action.attackingSource.power;
                // console.log("new damage is", newDamage, "due to", action.attackedTarget.damage, "+", action.attackingSource.power)
                const source = state.playerState.player.cardsInPlay.find(elem => elem.id === action.attackingSource);
                const target= state.gameState.ai.cardsInPlay.find(elem => elem.id === action.attackedTarget);

                const targetDestroyed = ( target.damage + source.power ) >= target.toughness;

                if (targetDestroyed) {
                    console.log(`${target.name} has been destroyed.`);
                }
                console.log([
                    ...state.gameState.ai.cardsInPlay
                ])

                newCardsInPlay = targetDestroyed 
                    ? state.gameState.ai.cardsInPlay.filter(card => card.id !== action.attackedTarget)
                    : state.gameState.ai.cardsInPlay.map(card => card.id === action.attackedTarget 
                        ? {
                            ...card,
                            damage: target.damage + source.power,
                        } 
                        : card
                    )

                newState = {
                    ...state,
                    gameState: {
                        ...state.gameState,
                        ai: {
                            ...state.gameState.ai,
                            cardsInPlay: newCardsInPlay
                        }
                    }
                }

                // this needs to be hard coded to the AI's cards in play

                // if(newDamage >= action.attackedTarget.toughness){
                //     console.log(action.attackedTarget.name, "has been destroyed")
                //     newCardsInPlay = state.gameState.ai.cardsInPlay.filter(card => card.id !== action.attackedTarget.id)
                //     console.log("new cards in play:", newCardsInPlay)
                // }else{
                //     newCardsInPlay = state.gameState.ai.cardsInPlay.map(card => {
                //         if(card.id === action.attackedTarget.id){
                //             let cardObj = action.attackedTarget
                //             cardObj.damage = newDamage
                //             return cardObj
                //         }else{
                //             return card
                //         }
                //     })
                // }

                // newAiState = {
                //     ...state.gameState.ai,
                //     cardsInPlay: newCardsInPlay
                // }

                // newGameState = {
                //     ...state.gameState,
                //     ai: newAiState
                // }

                // newState = {
                //     ...state,
                //     gameState: newGameState
                // }

                break;
            case "END_TURN":
                newCardsInPlay = state.playerState.player.cardsInPlay.map( card => {
                    let cardObj = card
                    cardObj.damage = 0
                    return cardObj
                })

                newIndividualPlayerState = {
                    ...state.playerState.player,
                    cardsInPlay: newCardsInPlay
                }

                newPlayerState = {
                    ...state.playerState,
                    player: newIndividualPlayerState
                }

                newState = {
                    ...state,
                    playerState: newPlayerState
                }

            break;
            default:
                break
        }
        //console.log("newState returned from reducer action", action.type, "is", newState)
        return newState
    }

    const [state, dispatchPlayerActions] = useReducer(playerActions, initialState)
    // check if player can pay the mana for a spell, and if so calculate the new mana pool
    //  after casting cost has been spent
    const attemptToCastSpell = (card) => {

        let remainingMana = state.playerState.player.currentMana - card.manaCost
        
        if (remainingMana >= 0) 
        {dispatchPlayerActions({
            type:"PLAY_CARD_FROM_HAND", playedCard:card, newPlayerManaPool: remainingMana})
        }else{
            console.log("Insufficent mana to play", card.name)
        }
    }

    const targetWithAction = (source, target, actionType) => {
        switch(actionType){
            case 'ATTACK':

            console.log("attacking from function")

            dispatchPlayerActions({
                type: "ATTACK",
                attackingSource: source.id,
                attackedTarget: target.id
            })
            break;
        default:
            console.log('unrecognized action')
            break;
        }
    }

    const endTurn = () => {
        dispatchPlayerActions({
            type:"END_TURN"
        })
        dispatchPlayerActions({
            type:"BEGIN_TURN"
        })
    }




    // render the appropiate UI depending on game state

    if(state.gameState.currentState === 'inactive'){
        return <div>
            <button onClick={() => dispatchPlayerActions({type:"SETUP_GAME"})}>START GAME</button>
        </div>
    }
    else{
        return <div>
            <button onClick={() => dispatchPlayerActions({type:"SETUP_GAME"})}>RESTART GAME</button>
            <button onClick={() => endTurn()}>NEW TURN</button>
            Turn: {state.playerState.player.turn}
            <ManaPoolHUD 
                currentManaProps={state.playerState.player.currentMana} 
                maxManaProps={state.playerState.player.maxMana}
            />
            <div className="Board">
                <AIZone
                    cardsInPlayProps={state.gameState.ai.cardsInPlay}
                    targetWithActionProps={targetWithAction}
                />
                <PlayingZone
                    cardsInPlayProps={state.playerState.player.cardsInPlay}
                    targetWithActionProps={targetWithAction}
                />
                <Hand
                    handProps={state.playerState.player.hand}
                    dispatchPlayerActionsProps={dispatchPlayerActions}
                    castSpellProps={attemptToCastSpell}
                />
            </div>
        </div>
    }
}

export default Game