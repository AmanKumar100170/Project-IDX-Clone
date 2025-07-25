import Editor from '@monaco-editor/react';
import { useEffect, useState } from 'react';
import { useActiveFileTabStore } from '../../../store/activeFileTabStore';
import { useEditorSocketStore } from '../../../store/editorSocketStore';
import { extensionToFileType } from '../../../utils/extensionToFileType';

export const EditorComponent = () => {
    let timerId = null;

    const [editorState, setEditorState] = useState({
        theme: null
    })

    const { activeFileTab } = useActiveFileTabStore();

    const { editorSocket } = useEditorSocketStore();

    async function downloadTheme() {
        const response = await fetch('/Dracula.json');
        const data = await response.json();
        setEditorState({ ...editorState, theme: data });
    }

    function handleEditorTheme (monaco) {
        console.log(monaco);
        // monaco.editor.defineTheme('dracula', editorState.theme);
        // monaco.editor.setTheme('dracula');
    }

    function handleChange(value){
        // Debouncing
        if (timerId != null){
            clearTimeout(timerId);
        }
        
        timerId = setTimeout(() => {
            editorSocket.emit('writeFile', {
                data: value,
                pathToFileOrFolder: activeFileTab.path
            })
        }, 2000);

    }

    useEffect(() => {
        downloadTheme();
    }, []);

    return (
        <>
            {   editorState.theme && 
                <Editor 
                    width={'100%'}
                    defaultValue='// Welcome to the Playground'
                    defaultLanguage={undefined}
                    options={{
                        fontSize: 18,
                        fontFamily: 'monospace'
                    }}
                    language={extensionToFileType(activeFileTab?.extension)}
                    value={activeFileTab?.value ? activeFileTab.value : '// Welcome to the Playground'}
                    onMount={handleEditorTheme}
                    onChange={handleChange}
                />
            }
        </>
    )
}