import React, { useState } from 'react'

const CardInPlay = (props) => {
    return <div className="CardInPlay">
        <div className="CardInPlay-Header">
            {props.cardProps.name}
        </div>

    </div>
}

export default CardInPlay