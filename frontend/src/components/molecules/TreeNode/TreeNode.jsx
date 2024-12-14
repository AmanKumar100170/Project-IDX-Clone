import { useState } from "react";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import { FileIcon } from "../../atoms/FileIcon/FileIcon";

export const TreeNode = ({ fileFolderData }) => {

    const [visibility, setVisibility] = useState({});

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
                        paddingTop: '15px',
                        fontSize: '16px'
                    }}
                >
                    {visibility[fileFolderData.name] ? <IoIosArrowDown /> : <IoIosArrowForward />}
                    {fileFolderData.name}
                </button>
            ) : (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FileIcon extension={computeExtension(fileFolderData)} />

                    <p
                        style={{
                            fontSize: '15px',
                            cursor: 'pointer',
                            marginLeft: '5px',
                        }}
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