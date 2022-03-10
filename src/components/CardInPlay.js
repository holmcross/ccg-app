import React, { useState } from 'react'
import { Mana } from "@saeris/react-mana"

const CardInPlay = (props) => {

    return <div className="CardInPlay">
            <div className="Card-Header">
                {props.cardProps.name}
                <div className='Card-Cost'>
                    {props.cardProps.manaCost}
                </div>
            </div>
            <div className="Card-PT" style={{}}>{props.cardProps.power}/{props.cardProps.toughness}</div>
    </div>
}

export default CardInPlay