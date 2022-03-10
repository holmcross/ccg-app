import React from "react"
import CardInPlay from "./CardInPlay"

const PlayingZone = (props) => {
    console.log("PlayingZone component props is:", props)

    return <div className="PlayingZone">
        <div className="PlayingZone-Creatures">
            {props.cardsInPlayProps.map((card, index) => 
                <CardInPlay 
                    cardProps={card}
                    key={index}
                />
            )}
        </div>
    </div>
}

export default PlayingZone