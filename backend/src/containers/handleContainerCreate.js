import Docker from 'dockerode';

const docker = new Docker();

export const handleContainerCreate = async (projectId, socket) => {
    console.log('Project id received for container create', projectId);
    
    try {
        const container = await docker.createContainer({
            Image: 'sandbox',
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            CMD: ['/bin/bash'],
            Tty: true,
            User: 'sandbox',
            HostConfig: {
                Binds: [    // Mounting the project directory to the container
                    `${import.meta.dirname}/../projects/${projectId}:/home/sandbox/app`
                ],
                PortBindings: {
                    '5173/tcp' : [
                        {
                            'HostPort': '0'     // Random port will be assigned by docker in the host machine
                        }
                    ]
                },
                ExposedPorts: {
                    '5173/txp': {}
                },
                Env: ['HOST=0.0.0.0']
            }
        });
    
        console.log('Container Created', container.id);

        await container.start();

        console.log('Container Started');

        container.exec({
            CMD: ['/bin/bash'],
            User: 'sandbox',
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true
        }, (err, exec) => {
            if (err){
                console.log('Error while creating exec', err);
                return;
            }

            exec.start({hijack: true}, (err, stream) => {
                if (err){
                    console.log('Error while creating exec', err);
                    return;
                }

                processStream(stream, socket);
                socket.on('shell-input', (data) => {
                    stream.write(data);
                })

            });

        })

    } catch (error) {
        console.log('Error creating the container', error);
    }
    
}

function processStream (stream, socket){
    let buffer = Buffer.from("");
    stream.on('data', (data) => {
        buffer = Buffer.concat([buffer, data]);
        socket.emit('shell-output', buffer.toString());
        buffer = Buffer.from("");
    });

    stream.on('end', () => {
        console.log('Stream ended');
        socket.emit('shell-output', 'Stream ended');
    });

    stream.on('error', (err) => {
        console.log('Stream error', err);
        socket.emit('shell-output', 'Stream error');
    })

}