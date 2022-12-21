import React, { useCallback, useEffect, useMemo } from 'react'
import { ServerMessage } from '../types'

type Props = {
    socket: WebSocket
    color: string
}

const Canvas = (props: Props) => {
    const { socket, color } = props
    const [brushDown, setBrushDown] = React.useState<boolean>(false)
    const [pixelData, setPixelData] = React.useState<Int32Array>(new Int32Array(100 * 100))


    socket.addEventListener("message", (event) => {
        const message: ServerMessage = JSON.parse(event.data)

        if (message.Type === 'draw') {
            setPixelData(message.Canvas)
        }
    })

    const handleMouseDown = () => {
        setBrushDown(true)
    }

    const handleMouseUp = () => {
        setBrushDown(false)
    }

    return (
        <div onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} className="flex flex-col m-auto w-fit border">
            {[...Array(100)].map((_, index) => (
                <Row pixelData={pixelData} brushColor={color} brushDown={brushDown} socket={socket} y={index} key={index} />
            ))}
        </div>
    )
}

type RowProps = {
    y: number
    socket: WebSocket
    brushDown: boolean
    brushColor: string
    pixelData: Int32Array
}
const Row = (props: RowProps) => {
    const { y, socket, brushDown, brushColor, pixelData } = props
    return (
        <div className="flex flex-row w-fit">
            {[...Array(100)].map((_, index) => (
                <Cell pixelData={pixelData} brushColor={brushColor} brushDown={brushDown} socket={socket} x={index} y={y} key={index} />
            ))}
        </div>
    )
}

type CellProps = {
    brushColor: string
    x: number
    y: number
    socket: WebSocket
    brushDown: boolean
    pixelData: Int32Array
}
const Cell = (props: CellProps) => {
    const { x, y, socket, brushDown, brushColor, pixelData } = props

    const serverColor = useMemo(()=>"#" + pixelData[y * 100 + x].toString(16).padStart(6, "0").toUpperCase(), [pixelData, x, y])
    const [color, setColor] = React.useState<string>(serverColor)

    useEffect(() => {
        setColor(serverColor)
    }, [serverColor])

    const colorNum = parseInt(brushColor.replace("#", ""), 16)

    const handleMouse = useCallback(() => {
        console.log(pixelData[0])
        if (brushDown) {
            socket.send(JSON.stringify({
                Type: "draw",
                X: x,
                Y: y,
                Color: colorNum
            }))
        } else {
            setColor(brushColor)
        }
    }, [x, y, brushDown, brushColor, colorNum, socket, pixelData])

    const handleMouseLeave = useCallback(() => {
        setColor(serverColor)
    }, [serverColor])

    return (
        <div onMouseLeave={handleMouseLeave} onMouseOver={handleMouse} onMouseUp={handleMouse} style={{backgroundColor: color}} className={"w-2 h-2 hover:bg-slate-400 cursor-pointer"} />
    )
}

export default Canvas