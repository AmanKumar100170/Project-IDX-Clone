import { useParams } from "react-router-dom"
import { EditorComponent } from "../components/molecules/EditorComponent/EditorComponent";
import { EditorButton } from '../components/atoms/EditorButton/EditorButton';
import { TreeStructure } from "../components/organisms/TreeStructure/TreeStructure";
import { useEffect } from "react";
import { useTreeStructureStore } from "../store/treeStructureStore";
import { useEditorSocketStore } from "../store/editorSocketStore";
import { io } from "socket.io-client";
import { BrowserTerminal } from "../components/molecules/Terminal/BrowserTerminal";
import { useTerminalSocketStore } from "../store/terminalSocketStore";

export const ProjectPlayground = () => {

    const { projectId: projectIdFromUrl } = useParams();

    const { setProjectId, projectId } = useTreeStructureStore();

    const { editorSocket, setEditorSocket } = useEditorSocketStore();

    const { setTerminalSocket } = useTerminalSocketStore();

    function fetchPort() {
        editorSocket.emit('getPort');
    }

    useEffect(() => {
        if (projectIdFromUrl){
            setProjectId(projectIdFromUrl);
            const editorSocketConnection = io(`${import.meta.env.VITE_BACKEND_URL}/editor`, {
                query: {
                    projectId: projectIdFromUrl
                }
            });

            const ws = new WebSocket('ws://localhost:3000/terminal?projectId=' + projectIdFromUrl);
            setTerminalSocket(ws);

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
                            height: '99.7vh',
                            overflow: 'auto'
                        }}
                    >
                        <TreeStructure />
                    </div>
                ) }

                <EditorComponent />
            </div>

            <EditorButton isActive={false}/>
            <EditorButton isActive={true}/>

            <div>
                <button
                    onClick={fetchPort}
                >
                    Get Port
                </button>
            </div>

            <div>
                <BrowserTerminal />
            </div>

        </>
    )
}