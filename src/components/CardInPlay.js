import React, { useState } from 'react'
import { Mana } from "@saeris/react-mana"
import { useDrag, useDrop } from 'react-dnd'

const CardInPlay = (props) => {

    
    const [{ isDrop, canDrop }, drop] = useDrop(() => ({
        accept: "card",
        drop: (item) => {
            console.log("You are dropping", item.card.name, "on", props.cardProps.name)
            props.targetWithActionProps(item.card, props.cardProps, 'ATTACK')
        },
        collect: (monitor) => ({
            isDrop: !!monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }))
    // drag will be used to reference the item that is to be made draggable
    const validTarget = props.ai;

    const [{ isDragging, canDrag }, drag] = useDrag(() => ({
        type: "card",
        item: { id: props.cardProps.id, card: props.cardProps },
        // collection function defines different states and props accessible 
        collect: (monitor) => ({
            // double bang just returns the truthy-ness
            isDragging: props.cardProps.id === monitor?.getItem()?.id,
            canDrag: monitor.canDrag(),
        })
    }))
    

    return <div className="CardInPlay">

            <div
                ref={drop}
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    zIndex: !isDragging && canDrop ? 2: 'auto',
                    border: (canDrop && validTarget) ? "5px solid blue" : "0px",
                }} 
            />
            {validTarget && canDrop && <div style={{position: "absolute", fontSize: "20pt", color: "white"}}>{props.cardProps.id}</div>}
            <div
                ref={drag}
                style={{
                    //border: isDragging ? "5px solid pink" : "0px",
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                }}
            />

            <div className="Card-Header">
                {props.cardProps.name}
                <div className='Card-Cost'>
                    {props.cardProps.manaCost}
                </div>
            </div>
            damage is : {props.cardProps.damage}
            <div className="Card-PT" style={{}}>{props.cardProps.power}/{props.cardProps.toughness}</div>
    </div>
}

export default CardInPlay