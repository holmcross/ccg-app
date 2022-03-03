import React from "react"
import CardInPlay from "./CardInPlay"

const PlayingZone = (props) => {
    console.log("PlayingZone component props is:", props)
    var creatures = []
    var lands = []

    console.log("the props are", props.cardsInPlayProps)

    for(const card of props.cardsInPlayProps){
        console.log("YEAH I KNOW", card)
        if(card.type === 1){
            console.log("Its a creature")
            creatures.push(card)
        }else if(card.type === 0){
            console.log("Its a land")
            lands.push(card)
        }
    }

    console.log("lands contains", lands)

    return <div className="PlayingZone">
        <div className="PlayingZone-Creatures">
            {creatures.map((card, index) => 
                <CardInPlay 
                    cardProps={card}
                    tapCardProps={props.tapCardProps}
                    key={index}
                />
            )}
        </div>
        <div className="PlayingZone-Lands">
            {lands.map((card, index) => 
                <CardInPlay 
                    cardProps={card}
                    tapCardProps={props.tapCardProps}
                    key={index}
                />
            )}
        </div>
    </div>
}

export default PlayingZone