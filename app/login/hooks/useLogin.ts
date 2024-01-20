import { useMutation } from "@tanstack/react-query";
import axios from "axios";

// login hook
export default function useLogin({ username, password }: { username: string, password: string }) {

const info = useMutation({
mutationFn: async (formData: FormData) => {
    console.log("login hook");
    console.log(formData);
    // const response = await axios.post(process.env.API_URL + "/login", formData);
    // return response.data;
},
})
 return info;
}