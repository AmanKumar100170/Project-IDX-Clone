import { useEffect, useRef } from "react";
import { Input, Row } from "antd";
import { useEditorSocketStore } from "../../../store/editorSocketStore";
import { usePortStore } from "../../../store/portStore";
import { ReloadOutlined } from "@ant-design/icons";

export const Browser = ({ projectId }) => {

    const browserRef = useRef(null);

    const { editorSocket } = useEditorSocketStore();

    const { port } = usePortStore(); 

    useEffect(() => {
        if (!port) {
            editorSocket?.emit('getPort', {
                containerName: projectId
            })
        }
    }, [port, editorSocket]);

    if (!port) {
        return <div>Loading...</div>
    }

    function handleRefresh() {
        if (browserRef.current) {
            const oldAddress = browserRef.current.src;
            browserRef.current.src = oldAddress;
        }
    }

    return (
        <Row
            style={{
                backgroundColor: '#22212b'
            }}
        >

            <Input
                style={{
                    width: '100%',
                    height: '30px',
                    color: 'white',
                    fontFamily: 'Monospace',
                    backgroundColor: '#282a35'
                }}
                prefix={ <ReloadOutlined onClick={handleRefresh} /> }
                defaultValue={`http://localhost:${port}`}
            />

            <iframe 
                ref={browserRef}
                src={`http://localhost:${port}`}
                style={{
                    width: '100%',
                    height: '95vh',
                    border: 'none'
                }}
            />

        </Row>
    )

}