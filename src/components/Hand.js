import React from "react";
import CardInHand from "./CardInHand";

const Hand = (props) => {
    return <div class="Hand">
        {props.handProps.map( card =>
            <CardInHand 
                cardProps={card} 
                dispatchPlayerActionsProps={props.dispatchPlayerActionsProps}
            /> 
        )}
    </div>
}

export default Hand