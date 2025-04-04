import { INewUser } from '@/types'
import{
useQuery,
useMutation,
useQueryClient,
useInfiniteQuery,
} from '@tanstack/react-query'
import { createUserAccount, SignInAccount, SignOutAccount } from '../appwrite/api'


export const useCreateUserAccountMutuation = () =>{
    return useMutation({
        mutationFn :(user:INewUser) => createUserAccount(user)
    })
}

export const useSignInAccount = () =>{
    return useMutation({
        mutationFn :(user:{
            email: string,
            password: string
        }) => SignInAccount(user)
    })
}

export const useSignOutAccount = () =>{
    
    return useMutation({
        mutationFn: SignOutAccount
    })
}