import { useState } from "react";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import { FileIcon } from "../../atoms/FileIcon/FileIcon";
import { useEditorSocketStore } from '../../../store/editorSocketStore';
import { useFileContextMenuStore } from "../../../store/fileContextMenuStore";
import { useFolderContextMenuStore } from "../../../store/folderContextMenuStore";

export const TreeNode = ({ fileFolderData }) => {

    const [visibility, setVisibility] = useState({});

    const { editorSocket } = useEditorSocketStore();

    const { 
        setFile, 
        setIsOpen: setFileContextMenuIsOpen, 
        setX: setFileContextMenuX, 
        setY: setFileContextMenuY 
    } = useFileContextMenuStore();

    const { 
        setFolder, 
        setIsOpen: setFolderContextMenuIsOpen, 
        setX: setFolderContextMenuX, 
        setY: setFolderContextMenuY 
    } = useFolderContextMenuStore();

    function toggleVisibility(name){
        setVisibility({
            ...visibility,
            [name]: !visibility[name]
        })
    }

    function computeExtension(fileFolderData){
        const names = fileFolderData.name.split(".");
        return names[names.length - 1];
    }
    
    function handleDoubleClick(fileFolderData){
        console.log('Double Clicked on ', fileFolderData);

        editorSocket.emit('readFile', {
            pathToFileOrFolder: fileFolderData.path
        });
    }

    function handleContextMenuForFiles(e, path){
        e.preventDefault();
        console.log('Right clicked on', path);

        setFile(path);
        setFileContextMenuX(e.clientX);
        setFileContextMenuY(e.clientY);
        setFileContextMenuIsOpen(true);
    }

    function handleContextMenuForFolders(e, path){
        e.preventDefault();
        console.log('Right clicked on', path);

        setFolder(path);
        setFolderContextMenuX(e.clientX);
        setFolderContextMenuY(e.clientY);
        setFolderContextMenuIsOpen(true);
    }

    return (
        ( fileFolderData && <div
            style={{
                paddingLeft: '15px',
                color: 'white'
            }}
        >
            {fileFolderData.children ? (
                <button
                    onClick={() => {toggleVisibility(fileFolderData.name)}}
                    style={{
                        border: 'none',
                        cursor: 'pointer',
                        outline: 'none',
                        color: 'white',
                        backgroundColor: 'transparent',
                        padding: '15px',
                        fontSize: '16px',
                        marginTop: '10px'
                    }}

                    onContextMenu={(e) => {handleContextMenuForFolders(e, fileFolderData.path)}}
                >
                    {visibility[fileFolderData.name] ? <IoIosArrowDown /> : <IoIosArrowForward />}
                    {fileFolderData.name}
                </button>
            ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
                    <FileIcon extension={computeExtension(fileFolderData)} />

                    <p
                        style={{
                            marginTop: '8px',
                            fontSize: '15px',
                            cursor: 'pointer',
                            marginLeft: '18px',
                            paddingTop: '15px',
                            paddingBottom: '15px'
                        }}
                        onContextMenu={(e) => {handleContextMenuForFiles(e, fileFolderData.path)}}
                        onDoubleClick={() => handleDoubleClick(fileFolderData)}
                    >
                        {fileFolderData.name}
                    </p>
                </div>
            )}

            {visibility[fileFolderData.name] && fileFolderData.children && (
                fileFolderData.children.map((child) => (
                    <TreeNode 
                        fileFolderData={child}
                        key={child.name}
                    />
                ))
            )}

        </div>)
    )
}