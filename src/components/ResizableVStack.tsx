import React, { useRef, useState } from "react"

type Props = {
  children: React.ReactNode[]
}

const ResizableVStack = (props: Props) => {
  const { children } = props

  const box1ref = useRef<HTMLDivElement>(null)
  const box2ref = useRef<HTMLDivElement>(null)

  const [resize, setResize] = useState(false)

  const handleMouseDown = (
    event:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.TouchEvent<HTMLDivElement>,
  ) => {
    setResize(true)
  }

  const handleMouseUp = (
    event:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.TouchEvent<HTMLDivElement>,
  ) => {
    setResize(false)
  }

  const handleMouseLeave = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    setResize(false)
  }

  const handleMouseMove = (
    event:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.TouchEvent<HTMLDivElement>,
  ) => {
    if (!resize) return

    const mouseY =
      event.type === "mousemove"
        ? (event as React.MouseEvent<HTMLDivElement, MouseEvent>).clientY
        : (event as React.TouchEvent<HTMLDivElement>).touches[0].clientY

    const box1 = box1ref?.current
    const box2 = box2ref?.current

    if (!box1 || !box2) return

    const box1Rect = box1.getBoundingClientRect()
    const box2Rect = box2.getBoundingClientRect()

    const box1newHeight = mouseY - box1Rect.top
    const box2newHeight = box2Rect.bottom - mouseY

    box1.style.height = `${box1newHeight}px`
    box2.style.height = `${box2newHeight}px`
  }

  return (
    <div
      className="flex h-5/6 flex-col"
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchEnd={handleMouseUp}
      onTouchMove={handleMouseMove}
    >
      <div className="h-3/4" ref={box1ref}>
        {children[0]}
      </div>
      <hr
        className="h-1 cursor-ns-resize bg-white hover:scale-150 hover:bg-cyan-400"
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      />
      <div className="h-1/4" ref={box2ref}>
        {children[1]}
      </div>
    </div>
  )
}

export default ResizableVStack
