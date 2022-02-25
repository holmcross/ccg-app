import React, { useState } from 'react'

const CardInPlay = (props) => {
    return <div class="CardInPlay">
        <div class="CardInPlay-Header">
            {props.cardProps.name}
        </div>
        {props.cardProps.type === 1 && <div>{props.cardProps.power}/{props.cardProps.toughness}</div>}
    </div>
}

export default CardInPlay