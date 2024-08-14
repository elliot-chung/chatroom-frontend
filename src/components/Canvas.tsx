import React, { useCallback, useEffect, useMemo } from "react"
import ServerMessage from "../types/ServerMessage"

type Props = {
  socket: WebSocket
  color: string
  user: string
}

const Canvas = (props: Props) => {
  const { socket, color, user } = props
  const [pixelData, setPixelData] = React.useState<Int32Array>(
    new Int32Array(100 * 100),
  )

  useEffect(() => {
    socket.addEventListener("message", (event) => {
      const message: ServerMessage = JSON.parse(event.data)
      if (message.Type !== "draw") return

      if (message.Canvas !== undefined) {
        setPixelData(message.Canvas)
      }
    })
  }, [socket])

  return (
    <div className="flex h-full w-full flex-col overflow-y-scroll border">
      {[...Array(100)].map((_, index) => (
        <Row
          user={user}
          pixelData={pixelData}
          brushColor={color}
          socket={socket}
          y={index}
          key={index}
        />
      ))}
    </div>
  )
}

type RowProps = {
  y: number
  user: string
  socket: WebSocket
  brushColor: string
  pixelData: Int32Array
}
const Row = (props: RowProps) => {
  const { y, socket, brushColor, pixelData, user } = props
  return (
    <div className="mx-auto flex w-fit flex-row">
      {[...Array(100)].map((_, index) => (
        <Cell
          user={user}
          pixelData={pixelData}
          brushColor={brushColor}
          socket={socket}
          x={index}
          y={y}
          key={index}
        />
      ))}
    </div>
  )
}

type CellProps = {
  brushColor: string
  user: string
  x: number
  y: number
  socket: WebSocket
  pixelData: Int32Array
}
const Cell = (props: CellProps) => {
  const { x, y, socket, brushColor, pixelData, user } = props
  const nameSet = user !== ""

  const serverColor = useMemo(
    () =>
      "#" + pixelData[y * 100 + x].toString(16).padStart(6, "0").toUpperCase(),
    [pixelData, x, y],
  )
  const [color, setColor] = React.useState<string>(serverColor)

  useEffect(() => {
    setColor(serverColor)
  }, [serverColor])

  const colorNum = parseInt(brushColor.replace("#", ""), 16)

  const handleMouseDown = useCallback(() => {
    if (!nameSet) return
    socket.send(
      JSON.stringify({
        Type: "draw",
        X: x,
        Y: y,
        Color: colorNum,
      }),
    )
  }, [x, y, colorNum, socket, nameSet])

  const handleMouseOver = useCallback(() => {
    setColor(brushColor)
  }, [brushColor])

  const handleMouseLeave = useCallback(() => {
    setColor(serverColor)
  }, [serverColor])

  return (
    <div
      onMouseLeave={handleMouseLeave}
      onMouseOver={handleMouseOver}
      onMouseDown={handleMouseDown}
      style={{ backgroundColor: color }}
      className={
        "h-3 w-3 cursor-pointer hover:bg-slate-400 md:h-2 md:w-2 lg:h-1 lg:w-1"
      }
    />
  )
}

export default Canvas
