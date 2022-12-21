import React, { useCallback, useEffect, useMemo } from 'react'
import ServerMessage from '../types/ServerMessage'

type Props = {
    socket: WebSocket
    color: string
    user: string
}

const Canvas = (props: Props) => {
    const { socket, color, user } = props
    const [pixelData, setPixelData] = React.useState<Int32Array>(new Int32Array(100 * 100))


    socket.addEventListener("message", (event) => {
        const message: ServerMessage = JSON.parse(event.data)

        if (message.Type === 'draw') {
            if (message.Canvas !== undefined) {
                setPixelData(message.Canvas)
            }
        }
    })

    return (
        <div className="flex flex-col m-auto w-fit border">
            {[...Array(100)].map((_, index) => (
                <Row user={user} pixelData={pixelData} brushColor={color} socket={socket} y={index} key={index} />
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
        <div className="flex flex-row w-fit">
            {[...Array(100)].map((_, index) => (
                <Cell user={user} pixelData={pixelData} brushColor={brushColor} socket={socket} x={index} y={y} key={index} />
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

    const serverColor = useMemo(()=>"#" + pixelData[y * 100 + x].toString(16).padStart(6, "0").toUpperCase(), [pixelData, x, y])
    const [color, setColor] = React.useState<string>(serverColor)

    useEffect(() => {
        setColor(serverColor)
    }, [serverColor])

    const colorNum = parseInt(brushColor.replace("#", ""), 16)

    const handleClick = useCallback(() => {
        if (!nameSet) return
        socket.send(JSON.stringify({
                Type: "draw",
                X: x,
                Y: y,
                Color: colorNum
            }))
    }, [x, y, colorNum, socket, nameSet])

    const handleMouse = useCallback(() => {
        setColor(brushColor)
    }, [brushColor])

    const handleMouseLeave = useCallback(() => {
        setColor(serverColor)
    }, [serverColor])

    return (
        <div onMouseLeave={handleMouseLeave} onMouseOver={handleMouse} onMouseDown={handleClick} style={{backgroundColor: color}} className={"w-2 h-2 hover:bg-slate-400 cursor-pointer"} />
    )
}

export default Canvas