import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeRole as changeRoleApi } from "../../../services/apiUsers";
import toast from "react-hot-toast";

export function useChangeRole() {
    const queryClient = useQueryClient();
    const { mutate: changeRole, error, isPending } = useMutation({
        mutationFn: ({ userID, role }) => changeRoleApi(userID, role),

        onSuccess: () => {
            queryClient.invalidateQueries(["users"], ["user"]);
            toast.success("User role changed successfully");
        }
    })

    return { changeRole, error, isPending };
}