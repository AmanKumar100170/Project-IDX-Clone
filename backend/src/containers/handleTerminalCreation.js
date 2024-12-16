export const handleTerminalCreation = (container, ws) => {
    container.exec({
        Cmd: ['/bin/bash'],
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        User: 'sandbox',
        Tty: true
    }, (err, exec) => {
        if(err) {
            console.log('Error while creating exec', err);
            return;
        }

        exec.start({
            hijack: true,
        }, (err, stream) => {
            if(err) {
                console.log('Error while creating exec', err);
                return;
            }

            // Stream Processing
            processStreamOutput(stream, ws);

            // Stream writing
            ws.on('message', (data) => {
                if (data === 'getPort'){
                    container.inspect((err, data) => {
                        const port = data.NetworkSettings;
                        console.log(port);
                    })
                    return;
                }

                stream.write(data);
            })

        })

    })
}

function processStreamOutput(stream, ws) {
    let nextDataType = null;    // Stores the type of next message
    let nextDataLength = null;  // Stores the length of next message
    let buffer = Buffer.from("");

    function processStreamData(data) {  // Helper function to process incoming data chunks
        if (data){
            buffer = Buffer.concat([buffer, data]);
        }

        if (!nextDataType) {    // If next data type is not known, then we need to read the next 8 bytes (representing header) to determine the type and length of the message
            if (buffer.length >= 8){
                const header = bufferSlicer(8);
                nextDataType = header.readUInt32BE(0);  // First 4 bytes represent the type of message
                nextDataLength = header.readUInt32BE(4);    // Next 4 bytes represent the length of message

                processStreamData();

            }

        } else{
            if (buffer.length >= nextDataLength) {
                const content = bufferSlicer(nextDataLength);
                ws.send(content);
                nextDataType = null;
                nextDataLength = null;
                processStreamData();
            }
        }

    }

    function bufferSlicer(end) {    // Slices the buffer and returns the sliced buffer and the remaining buffer
        const output = buffer.slice(0, end);    // header of the chunk

        buffer = Buffer.from(buffer.slice(end, buffer.length)); // remaining part

        return output;

    }

    stream.on('data', processStreamData);

}
