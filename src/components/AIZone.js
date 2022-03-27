import React from 'react'
import CardInPlay from './CardInPlay'

const AIZone = (props) => {
  return (
  <div className='AIZone'>
    {props.cardsInPlayProps.map((card, index) =>
      <CardInPlay
      cardProps={card}
      key={card.id}
      targetWithActionProps={props.targetWithActionProps}
      ai={true}
      />
    )}
  </div>
  )
}

export default AIZone
