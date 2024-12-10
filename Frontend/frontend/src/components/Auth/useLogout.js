import { useQuery } from "@tanstack/react-query";
import { logout as logoutApi } from "../../services/apiAuth";

const { isLoading, error } = useQuery({
    queryKey: ["user"],
    queryFn: logoutApi

})
return { isLoading, error }