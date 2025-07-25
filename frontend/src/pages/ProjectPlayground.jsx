import { useParams } from "react-router-dom"
import { EditorComponent } from "../components/molecules/EditorComponent/EditorComponent";
import { TreeStructure } from "../components/organisms/TreeStructure/TreeStructure";
import { useEffect, useState } from "react";
import { useTreeStructureStore } from "../store/treeStructureStore";
import { useEditorSocketStore } from "../store/editorSocketStore";
import { io } from "socket.io-client";
import { BrowserTerminal } from "../components/molecules/Terminal/BrowserTerminal";
import { useTerminalSocketStore } from "../store/terminalSocketStore";
import { Browser } from '../components/organisms/Browser/Browser';
import { Button } from "antd";
import { Allotment } from "allotment";
import 'allotment/dist/style.css';

export const ProjectPlayground = () => {

    const { projectId: projectIdFromUrl } = useParams();

    const { setProjectId, projectId } = useTreeStructureStore();

    const { setEditorSocket } = useEditorSocketStore();

    const { terminalSocket, setTerminalSocket } = useTerminalSocketStore();

    const [loadBrowser, setLoadBrowser] = useState(false);

    useEffect(() => {
        if (projectIdFromUrl){
            setProjectId(projectIdFromUrl);
            const editorSocketConnection = io(`${import.meta.env.VITE_BACKEND_URL}/editor`, {
                query: {
                    projectId: projectIdFromUrl
                }
            });

            try {
                const ws = new WebSocket('ws://localhost:4000/terminal?projectId=' + projectIdFromUrl);
                setTerminalSocket(ws);
            } catch (error) {
                console.log('Error while creating socket connection', error);
            }

            setEditorSocket(editorSocketConnection);
        }

    }, [setProjectId, projectIdFromUrl, setEditorSocket, setTerminalSocket]);

    return (
        <>
            <div style={{display: 'flex'}}>
                { projectId && (
                    <div
                        style={{
                            backgroundColor: '#333254',
                            paddingRight: '10px',
                            paddingTop: '0.3vh',
                            minWidth: '250px',
                            maxWidth: '25%',
                            height: '100vh',
                            overflow: 'auto'
                        }}
                    >
                        <TreeStructure />
                    </div>
                )}

                <div
                    style={{
                        height: '100vh',
                        width: '100vw'
                    }}
                >

                    <Allotment>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#282a36'
                            }}
                        >

                            <Allotment
                                vertical={true}
                            >

                                <EditorComponent />
                                    
                                <BrowserTerminal />
                            </Allotment>

                        </div>

                        <div>
                            <Button
                                onClick={() => setLoadBrowser(true)}
                            >
                                Load Browser
                            </Button>
                            { loadBrowser && projectIdFromUrl && terminalSocket && <Browser projectId={projectIdFromUrl} /> } 
                        </div>

                    </Allotment>

                </div>

            </div>

            {/* <EditorButton isActive={false}/>
            <EditorButton isActive={true}/> */}

        </>
    )
}