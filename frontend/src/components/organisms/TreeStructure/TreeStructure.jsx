import { useTreeStructureStore } from "../../../store/treeStructureStore"
import { useEffect } from "react";
import { TreeNode } from '../../molecules/TreeNode/TreeNode';
import { useFileContextMenuStore } from '../../../store/fileContextMenuStore';
import { useFolderContextMenuStore } from '../../../store/folderContextMenuStore';
import { FileContextMenu } from "../../molecules/ContextMenu/FileContextMenu";
import { FolderContextMenu } from "../../molecules/ContextMenu/FolderContextMenu";

export const TreeStructure = () => {

    const { treeStructure, setTreeStructure } = useTreeStructureStore();

    const { isOpen: isFileContextOpen, x: fileContextX, y: fileContextY, file } = useFileContextMenuStore();
    const { isOpen: isFolderContextOpen, x: folderContextX, y: folderContextY, folder } = useFolderContextMenuStore();

    useEffect(() => {
        if (treeStructure){
            
        }
        else {
            setTreeStructure();
        }
    }, [setTreeStructure, treeStructure]);

    return (
        <>
            {isFileContextOpen && fileContextX && fileContextY && (
                <FileContextMenu 
                    x={fileContextX}
                    y={fileContextY}
                    path={file}
                />
            )}

            {isFolderContextOpen && folderContextX && folderContextY && (
                <FolderContextMenu 
                    x={folderContextX}
                    y={folderContextY}
                    path={folder}
                />
            )}

            <TreeNode 
                fileFolderData = {treeStructure}
            />
        </>
    )
}