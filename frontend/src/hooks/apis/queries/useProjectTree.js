import { useQuery } from "@tanstack/react-query"
import { getProjectTree } from "../../../apis/projects"

export const useProjecTree = (projectId) => {
    const { isLoading, isError, data: projectTree, error } = useQuery({
        queryFn: getProjectTree({ projectId })
    })

    return {
        isLoading,
        isError,
        projectTree,
        error
    };
}