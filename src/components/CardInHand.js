import React, { useState } from 'react'

const CardInHand = (props) => {
    if(props.cardProps.type === 1){
        return <div class="CardInHand" 
            onClick={() => 
                props.castSpellProps(props.cardProps)}>
                    <div class="CardInHand-Header">
                        {props.cardProps.name}
                        {props.cardProps.printableManaCost}
                    </div>
            </div>
    } else if (props.cardProps.type === 0) {
        return <div class="CardInHand" 
            onClick={() => 
                props.playLandProps(props.cardProps)}>
                    <div class="CardInHand-Header">
                        {props.cardProps.name}
                    </div>
            </div>  
    }
}
export default CardInHand