import React from 'react'
import { useDrop } from 'react-dnd'

const AICard = (props) => {
  const [{ isDrop, canDrop }, drop] = useDrop(
    () => ({
      accept: 'card',
      drop: (item) => {
        console.log('AI is being attacked by', item.card.name)
        props.targetWithActionProps(item.card.id, 'target', 'ATTACK_AI')
      },
      collect: (monitor) => ({
        isDrop: !!monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [props.targetWithActionProps] // dependency array, needs to reference this because the function has state
  )

  return <div className='AICard'>
    AI Hitpoints: {props.aiProps.hitPoints}
    <div
        ref={drop}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          left: 0,
          top: 0,
          // zIndex: !isDragging && canDrop ? 2 : 'auto',
          // border: canDrop && validTarget ? '5px solid blue' : '0px',
        }}
    />
  </div>
}
export default AICard
