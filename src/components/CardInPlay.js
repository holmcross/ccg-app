import React, { useState } from 'react'

const CardInPlay = (props) => {
    return <div class="CardInPlay">
        <div class="CardInPlay-Header">
            {props.cardProps.name}
        </div>

    </div>
}

export default CardInPlay