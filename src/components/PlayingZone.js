import React from "react"
import CardInPlay from "./CardInPlay"

// question mark does a null check - this is called optional chaining

const PlayingZone = (props) => {
    return <div className="PlayingZone">
        {props.cardsInPlayProps?.map(card => 
            <CardInPlay 
                cardProps={card}
            />
        )}
    </div>
}

export default PlayingZone