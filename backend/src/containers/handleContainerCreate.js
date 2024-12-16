import Docker from 'dockerode';

const docker = new Docker();

export const listContainer = async () => {
    const containers = await docker.listContainers();
    console.log('Containers are: ', containers);

    containers.forEach((containerInfo) => {
        console.log(containerInfo.Ports);
    })
}

export const handleContainerCreate = async (projectId, terminalSocket, req, tcpSocket, head) => {
    console.log('Project id received for container create', projectId);
    
    try {
        const container = await docker.createContainer({
            Image: 'sandbox',
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            Cmd: ['/bin/bash'],
            Tty: true,
            User: 'sandbox',
            Volumes: {
                "/home/sandbox/app": {}
            },
            ExposedPorts: {
                '5173/tcp': {}
            },
            Env: ['HOST=0.0.0.0'],
            HostConfig: {
                Binds: [    // Mounting the project directory to the container
                    `${process.cwd()}/projects/${projectId}:/home/sandbox/app`
                ],
                PortBindings: {
                    '5173/tcp' : [
                        {
                            'HostPort': '0'     // Random port will be assigned by docker in the host machine
                        }
                    ]
                },
            }
        });
    
        console.log('Container Created', container.id);

        await container.start();

        console.log('Container Started');

        terminalSocket.handleUpgrade(req, tcpSocket, head, (establishedWSConn) => {
            terminalSocket.emit('connection', establishedWSConn, req, container);
        })
 
    } catch (error) {
        console.log('Error creating the container', error);
    }
    
}