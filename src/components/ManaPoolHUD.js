import React from "react";

const ManaPoolHUD = (props) => {
    return <div>
        White:{props.manaPoolProps["w"]} | Blue:{props.manaPoolProps["u"]} | Black:{props.manaPoolProps["b"]} | Red:{props.manaPoolProps["r"]} | Green:{props.manaPoolProps["g"]}
    </div>
}

export default ManaPoolHUD