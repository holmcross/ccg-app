import React from 'react'

const CardInHand = (props) => {
  if (props.cardProps.type === 1) {
    return <div className="CardInHand"
            onClick={() =>
              props.castSpellProps(props.cardProps)}>
                    <div className="Card-Header">
                        <div> {props.cardProps.name} </div>
                        <div className='Card-Cost'>
                            {props.cardProps.manaCost}
                        </div>
                    </div>
                <div className="Card-PT" style={{}}>{props.cardProps.power}/{props.cardProps.toughness}</div>
            </div>
  } else {
    console.log('Unknown card type')
  }
}

export default CardInHand
