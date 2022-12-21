type ServerMessage = {
    Type: string,
    User: string,
    Color: number,
    Text?: string,
    Canvas?: Int32Array
}

export default ServerMessage