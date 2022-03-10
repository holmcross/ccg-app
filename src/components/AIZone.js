import React from 'react'
import CardInPlay from './CardInPlay'

const AIZone = (props) => {
    return <div className='AIZone'>
        {props.cardsInPlayProps.map((card, index) => 
            <CardInPlay 
                cardProps={card}
                key={index}
            />
        )}
    </div>
}

export default AIZone