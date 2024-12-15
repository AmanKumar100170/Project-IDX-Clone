import { useEditorSocketStore } from "../../../store/editorSocketStore";
import { useFolderContextMenuStore } from "../../../store/folderContextMenuStore";
import './FolderContextMenu.css';

export const FolderContextMenu = ({ x, y, path }) => {

    const { setIsOpen } = useFolderContextMenuStore();

    const { editorSocket } = useEditorSocketStore();

    function handleCreateFile(e){
        e.preventDefault();
        console.log('Creating file at', path);

        editorSocket.emit('createFile', {
            pathToFileOrFolder: path
        })
    }

    return (
        <div
            onMouseLeave={() => {
                console.log('Mouse left');
                setIsOpen(false);
            }}

            className="folderContextOptionsWrapper"

            style={{
                top: y,
                left: x,
            }}
        >

            <button
                className="folderContextButton"                
                onClick={handleCreateFile}
            >
                Create File
            </button>

            <button
                className="folderContextButton"
            >
                Rename Folder
            </button>

        </div>
    )
}