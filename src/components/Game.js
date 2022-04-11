import React, { useReducer } from 'react'
import Hand from './Hand'
import PlayingZone from './PlayingZone'
import ManaPoolHUD from './ManaPoolHUD'
import AIZone from './AIZone'
// eslint-disable-next-line camelcase
import HS_db from '../HS_db.json'
import AICard from './AICard'

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

tips for reducers: try to pass the reducer all the new state data, and keep state mutation
  logic outside of the reducer

condtional example for JSX:
{(conditional expression)) && (code to return if true)}
*/

/* PROBLEMS ****

1. does not handle empty deck

*/

const Game = () => {
  const getInitialDeck = (customDBParam) => {
    return customDBParam.map((card, index) => {
      const cardObj = card
      cardObj.id = index
      return cardObj
    })
  }

  const shuffleDeck = (deck) => {
    return deck.sort(() => Math.random() - 0.5)
  }

  const initialState = {
    gameState: {
      currentState: 'INACTIVE',
    },
  }

  const playerActions = (state, action) => {
    let newState = {}
    let newCardInPlay = {}
    let newCardsInPlay = []
    let newCardInHand = {}
    let newHand = []
    let newIndividualPlayerState = {}
    let newPlayerState = {}
    let newAiState = {}
    let newDeck = []

    switch (action.type) {
      case 'SETUP_GAME':
        {
          console.log('Starting up game...')
          const playerDeck = shuffleDeck(getInitialDeck(HS_db))
          const playerHand = playerDeck.splice(0, 5)

          newState = {
            gameState: {
              currentState: 'ACTIVE',
              ai: {
                hitPoints: 20,
                cardsInPlay: [
                  {
                    name: 'Toe Cutter',
                    cmc: 2,
                    type: 1,
                    color: 'b',
                    power: 2,
                    toughness: 2,
                    manaCost: 2,
                    printableManaCost: 'BB',
                    damage: 0,
                    id: 30,
                  },
                  {
                    name: 'Toe Protector',
                    cmc: 2,
                    type: 1,
                    color: 'b',
                    power: 1,
                    toughness: 3,
                    manaCost: 2,
                    printableManaCost: 'BB',
                    damage: 0,
                    id: 31,
                  },
                  {
                    name: 'Toe Assaulter',
                    cmc: 3,
                    type: 1,
                    color: 'b',
                    power: 3,
                    toughness: 3,
                    manaCost: 3,
                    printableManaCost: 'BBB',
                    damage: 0,
                    id: 32,
                  },
                ],
              },
            },
            playerState: {
              player: {
                deck: playerDeck,
                hitpoints: 20,
                hand: playerHand,
                cardsInPlay: [],
                graveyard: [],
                exile: [],
                turn: 1,
                currentMana: 1,
                maxMana: 1,
              },
            },
          }
        }
        break

      case 'BEGIN_TURN':
        {
          newCardsInPlay = state.playerState.player.cardsInPlay.map((card) => {
            if (card.tapped) {
              card.tapped = false
            }
            card.canAttack = true
            return card
          })

          newDeck = structuredClone(state.playerState.player.deck)

          if (state.playerState.player.hand.length < 10) {
            newCardInHand = newDeck.shift()
            newHand = [...state.playerState.player.hand, newCardInHand]
          } else {
            newHand = [...state.playerState.player.hand]
          }

          const newTurn = state.playerState.player.turn + 1
          let newMana = 10

          if (state.playerState.player.maxMana + 1 < 10) {
            newMana = state.playerState.player.maxMana + 1
          }

          newIndividualPlayerState = {
            ...state.playerState.player,
            hand: newHand,
            cardsInPlay: newCardsInPlay,
            deck: newDeck,
            turn: newTurn,
            currentMana: newMana,
            maxMana: newMana,
          }

          newPlayerState = {
            ...state.playerState,
            player: newIndividualPlayerState,
          }

          newState = {
            ...state,
            playerState: newPlayerState,
          }
        }
        break

      // this accepts 'action.newPlayerManaPool' which is the remaining mana in the player
      //  mana pool after the casting cost has been paid
      case 'PLAY_CARD_FROM_HAND':
        console.log('played card id', action.playedCard.id)
        newCardInPlay = {
          ...action.playedCard,
          // tapped: false,
          damage: 0,
          canAttack: false,
        }

        newCardsInPlay = [
          ...state.playerState.player.cardsInPlay,
          newCardInPlay,
        ]

        newHand = state.playerState.player.hand.filter(
          (cardObj) => cardObj.id !== action.playedCard.id
        )

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
          currentMana: action.newPlayerManaPool,
        }
        newPlayerState = {
          ...state.playerState,
          player: newIndividualPlayerState,
        }
        newState = {
          ...state,
          playerState: newPlayerState,
        }
        break

      case 'ATTACK':
        {
          // console.log(action.attackingSource.name, "is attacking", action.attackedTarget, "inside reducer")

          // let newDamage = action.attackedTarget.damage + action.attackingSource.power;
          // console.log("new damage is", newDamage, "due to", action.attackedTarget.damage, "+", action.attackingSource.power)
          const source = state.playerState.player.cardsInPlay.find((elem) => {
            console.log('finding card', elem)
            return elem.id === action.attackingSource
          })
          const target = state.gameState.ai.cardsInPlay.find(
            (elem) => elem.id === action.attackedTarget
          )

          const targetDestroyed =
            target.damage + source.power >= target.toughness

          const sourceDestroyed =
            source.damage + target.power >= source.toughness

          if (targetDestroyed) {
            console.log(`${target.name} has been destroyed.`)
          }
          console.log('AI cards:', [...state.gameState.ai.cardsInPlay])

          const newPlayerCardsInPlay = sourceDestroyed
            ? state.playerState.player.cardsInPlay.filter(
              (card) => card.id !== action.attackingSource
            )
            : state.playerState.player.cardsInPlay.map((card) =>
              card.id === action.attackingSource
                ? {
                    ...card,
                    damage: source.damage + target.power,
                    canAttack: false,
                  }
                : card
            )

          newCardsInPlay = targetDestroyed
            ? state.gameState.ai.cardsInPlay.filter(
              (card) => card.id !== action.attackedTarget
            )
            : state.gameState.ai.cardsInPlay.map((card) =>
              card.id === action.attackedTarget
                ? {
                    ...card,
                    damage: target.damage + source.power,
                  }
                : card
            )

          newState = {
            // ...state,
            playerState: {
              player: {
                ...state.playerState.player,
                cardsInPlay: newPlayerCardsInPlay,
              },
            },
            gameState: {
              ...state.gameState,
              ai: {
                ...state.gameState.ai,
                cardsInPlay: newCardsInPlay,
              },
            },
          }
        }
        break

      case 'END_TURN':
        newCardsInPlay = state.playerState.player.cardsInPlay.map((card) => {
          const cardObj = card
          // card.Obj.damage = 0
          return cardObj
        })
        /*
          let newAiCardsInPlay = state.gameState.ai.cardsInPlay.map( card => {
            let cardObj = card
            card.Obj.damage = 0
            return cardObj
          })
          */

        newIndividualPlayerState = {
          ...state.playerState.player,
          cardsInPlay: newCardsInPlay,
        }

        newPlayerState = {
          ...state.playerState,
          player: newIndividualPlayerState,
        }

        newState = {
          ...state,
          playerState: newPlayerState,
        }
        break
      case 'ATTACK_AI':
        console.log('attacking AI from inside the reducer, new hitpoints are', action.newHitpoints)

        newAiState = {
          ...state.gameState.ai,
          hitPoints: action.newHitpoints
        }

        const newCurrentState = action.newHitpoints <= 0 ? 'PLAYER_WIN' : state.gameState.currentState

        const newPlayerCardsInPlay = state.playerState.player.cardsInPlay.map((card) => {
          if(card.id === action.attackingSource.id){
            console.log("found card")
            return {
              ...card,
              canAttack: false
            }
          } else { return card }
        })

        newState = {
          playerState: {
            player: {
              ...state.playerState.player,
              cardsInPlay: newPlayerCardsInPlay
            }
          },
          gameState: {
            ...state.gameState,
            currentState: newCurrentState,
            ai: newAiState
          }
        }
        break
      case 'AI_ATTACK_RESULTS':
        {
            newState = {
              gameState: {
                ...state.gameState,
                currentState: action.newGameState,
                ai: {
                  ...state.gameState.ai,
                  cardsInPlay: action.aiCards
                }
              },
              playerState: {
                player: {
                  ...state.playerState.player,
                  cardsInPlay: action.playerCards,
                  hitpoints: action.playerHitpoints
                }
              }
            }
            break
        }
      default:
        console.log('unrecogonized reducer action')
        break
    }
    // console.log("newState returned from reducer action", action.type, "is", newState)
    return newState
  }

  const [state, dispatchPlayerActions] = useReducer(playerActions, initialState)
  // check if player can pay the mana for a spell, and if so calculate the new mana pool
  //  after casting cost has been spent
  const attemptToCastSpell = (card) => {
    console.log(state)

    const remainingMana = state.playerState.player.currentMana - card.manaCost

    if (remainingMana >= 0) {
      dispatchPlayerActions({
        type: 'PLAY_CARD_FROM_HAND',
        playedCard: card,
        newPlayerManaPool: remainingMana,
      })
    } else {
      console.log('Insufficent mana to play', card.name)
    }
  }


  const targetWithAction = (source, target, actionType) => {
    console.log('cards in play are', state.playerState.player.cardsInPlay)
    switch (actionType) {
      case 'ATTACK':
        {
          const attacker = state.playerState.player.cardsInPlay.find((elem) => {
            console.log('inside find function, current card is', elem)
            return elem.id === source
          })

          console.log('source ID is', source)

          console.log('attacker ID is', attacker)

          // console.log(attacker.name, "can attack? ", source.canAttack)

          // console.log(attacker.damage, "points of damage on source")

          if (attacker.canAttack === true) {
            console.log('attacking from function')
            dispatchPlayerActions({
              type: 'ATTACK',
              attackingSource: source,
              attackedTarget: target,
            })
          } else {
            console.log(attacker.name, 'cannot attack')
          }
        }
        break
      case 'ATTACK_AI':
        {
          const attacker = state.playerState.player.cardsInPlay.find((elem) => {
            console.log('inside find function, current card is', elem)
            return elem.id === source
          })
          if (attacker.canAttack === true) {
            console.log('attacking from function')
            const newHitpoints = state.gameState.ai.hitPoints - attacker.power
            dispatchPlayerActions({
              type: 'ATTACK_AI',
              attackingSource: attacker,
              newHitpoints: newHitpoints
            })
          } else {
            console.log(attacker.name, 'cannot attack')
          }
        }
        break
      default:
        console.log('unrecognized reducer action type')
        break
    }
  }

  const endTurn = () => {
    dispatchPlayerActions({
      type: 'END_TURN',
    })
    aiAttackPhase()
    dispatchPlayerActions({
      type: 'BEGIN_TURN',
    })
  }

  const aiAttackPhase = () => {

    let newPlayerCardsInPlay = state.playerState.player.cardsInPlay
    let newPlayerHitpoints = state.playerState.player.hitpoints

    console.log('player HP at the start are', newPlayerHitpoints)
    
    let newAiCardsInPlay = state.gameState.ai.cardsInPlay.map(card => {
      if (newPlayerCardsInPlay.length > 0) {
        console.log('cards in play detected, searching for target')
        let counter = 0
        // find card to attack
        while(newPlayerCardsInPlay[counter].damage >= newPlayerCardsInPlay[counter].toughness
          && counter < newPlayerCardsInPlay.length){
            counter++
          }
        if(counter === newPlayerCardsInPlay.length){
          newPlayerHitpoints -= card.power
          return card
        } else {
          // found card to attack
          newPlayerCardsInPlay[counter].damage += card.power
          card.damage += newPlayerCardsInPlay[counter].power
          if(newPlayerCardsInPlay[counter].damage >= newPlayerCardsInPlay[counter].toughness){
            newPlayerCardsInPlay.splice(counter,1)
          }
          return card
        }
      } else {
        console.log('attacking player')
        newPlayerHitpoints -= card.power
        return card
      }
    })

    let adjustedAiCardsInPlay = newAiCardsInPlay.filter(card => !(card.damage >= card.toughness))

    let newGameState = newPlayerHitpoints <= 0 ? 'PLAYER_LOSS' : state.gameState.currentState
    console.log('results of AI attack - new player HP', newPlayerHitpoints)
    dispatchPlayerActions({type: 'AI_ATTACK_RESULTS', playerCards: newPlayerCardsInPlay,
      aiCards: adjustedAiCardsInPlay, playerHitpoints: newPlayerHitpoints, newGameState: newGameState})
  }

  // render the appropiate UI depending on game state

  if (state.gameState.currentState === 'INACTIVE') {
    return (
      <div>
        <button onClick={() => dispatchPlayerActions({ type: 'SETUP_GAME' })}>
          START GAME
        </button>
      </div>
    )
  } else if (state.gameState.currentState === 'PLAYER_WIN') {
    return (
      <div>
        <button onClick={() => dispatchPlayerActions({ type: 'SETUP_GAME' })}>
          START GAME
        </button>
        YOU WON THE GAME!
      </div>
    )
  } else if (state.gameState.currentState === 'PLAYER_LOSS') {
    return (
      <div>
        <button onClick={() => dispatchPlayerActions({ type: 'SETUP_GAME' })}>
          START GAME
        </button>
        YOU GOT KILLED!
      </div>
    )
  } else {
      return (
        <div>
          <button onClick={() => dispatchPlayerActions({ type: 'SETUP_GAME' })}>
            RESTART GAME
          </button>
          <button onClick={() => endTurn()}>NEW TURN</button>
          Turn: {state.playerState.player.turn}
          <ManaPoolHUD
            currentManaProps={state.playerState.player.currentMana}
            maxManaProps={state.playerState.player.maxMana}
          />
          <div className="Board">
            <AICard
              targetWithActionProps={targetWithAction}
              aiProps={state.gameState.ai}
            />
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
      )
    }
}

export default Game
