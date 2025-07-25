import Docker from 'dockerode';

const docker = new Docker();

export const listContainer = async () => {
    const containers = await docker.listContainers();
    console.log('Containers are: ', containers);

    containers.forEach((containerInfo) => {
        console.log(containerInfo.Ports);
    })
}

export const handleContainerCreate = async (projectId) => {
    console.log('Project id received for container create', projectId);
    
    try {

        // Deleting existing container running with same name
        const existingContainer = await docker.listContainers({
            name: projectId
        });

        if (existingContainer.length > 0){
            console.log('Container already exists, stopping and removing it');
            const container = docker.getContainer(existingContainer[0].Id)
            await container.remove({ force: true });
            console.log('Container removed');
        }

        const container = await docker.createContainer({
            Image: 'sandbox',
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            Cmd: ['/bin/bash'],
            name: projectId,
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

        return container;
 
    } catch (error) {
        console.log('Error creating the container', error);
    }
    
}

export async function getContainerPort (containerName){
    const container = await docker.listContainers({
        name: containerName
    });

    if (container.length > 0) {
        const containerInfo = await docker.getContainer(container[0].Id).inspect();
        console.log('Container Info: ', containerInfo);
        
        try {
            console.log(containerInfo?.NetworkSettings?.Ports['5173/tcp'][0].HostPort);
            return containerInfo?.NetworkSettings?.Ports['5173/tcp'][0].HostPort;
        } catch (error) {
            console.log('Port not present');
            return undefined;
        }

    }

}