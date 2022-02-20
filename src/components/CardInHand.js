import React, { useState } from 'react'

const CardInHand = (props) => {
    return <div class="CardInHand" 
        onClick={() => 
            props.dispatchPlayerActionsProps({type:"PLAY_CARD_FROM_HAND", playedCard:props.cardProps})}>
                <div class="CardInHand-Header">
                    {props.cardProps.name}
                </div>
        </div>
}
export default CardInHand