import { create } from 'zustand';
import { QueryClient } from '@tanstack/react-query';
import { getProjectTree } from '../apis/projects';

export const useTreeStructureStore = create((set, get) => {

    const queryClient = new QueryClient();

    return {
        projectId: null,
        treeStructure: null,
        setTreeStructure: async () => {
            const id = get().projectId;

            const data = await queryClient.fetchQuery({
                queryKey: [`projectTree-${ id }`],
                queryFn: () => getProjectTree({ projectId: id })
            })

            set({
                treeStructure: data
            });
        },
        setProjectId: (projecId) => {
            set({
                projectId: projecId
            });
        }
    }
})