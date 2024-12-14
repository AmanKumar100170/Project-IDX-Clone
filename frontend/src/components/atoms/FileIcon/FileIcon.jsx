import { FaCss3, FaJs, FaHtml5 } from "react-icons/fa";
import { GrReactjs } from "react-icons/gr";
import { LuFileJson } from "react-icons/lu";

export const FileIcon = ({ extension }) => {

    const iconStyle = {
        height: '25px', 
        width: '25px'
    }

    const IconMapper = {
        'js': <FaJs color='yellow' style={iconStyle}/>,
        'jsx': <GrReactjs color='#61dfbf' style={iconStyle}/>,
        'css': <FaCss3 color='#3c99dc' style={iconStyle}/>,
        'html' : <FaHtml5 color='#ff6347' style={iconStyle}/>,
        'json': <LuFileJson color='yellow' style={iconStyle}/>
    }

    return (
        <>
            {IconMapper[extension]}
        </>
    )
}