import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {SigninValidation } from "@/lib/validation"
import { z } from "zod"
import { Loader } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
// import { createUserAccount } from "@/lib/appwrite/api"
import { useCreateUserAccountMutuation, useSignInAccount } from "@/lib/react-query/queriesAndMutuations"
import { useUserContext } from "@/context/AuthContext"

const SigninForm = () => {
  const { toast } = useToast();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  // const { mutateAsync: createUserAccount, isPending: isCreatingAccount } = useCreateUserAccountMutuation();
  const { mutateAsync: signInAccount, isPending: isSigningIn } = useSignInAccount();
  const navigate = useNavigate();
  // 1. Define your form.
  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      // name: '',
      // username: '',
      email: '',
      password: ''
    },
  })
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SigninValidation>) {
    // const newUser = await createUserAccount(values);
    // if (!newUser) {
    //   return toast({
    //     title: "Sign up failed. Please try again."
    //   })
    // }
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    })

    if (!session) {
      return toast({ title: 'Sign in failed. Please try again. ' })
    }
    const isLoggedIn = await checkAuthUser();
    if (isLoggedIn) {
      form.reset();

      navigate('/');
    } else {
      return toast({ title: 'Sign up failed. Please try again.'})
    }
  }
  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <div className="logo-style">
          <img src="/assets/images/logo.svg" />
        </div>
        <div className="text-style signIn-text-style">
          <h2 className="h3-bold md: h2-bold pt-5">Log in to your account</h2>
          <p className="text-light-3 small-medium md:base-regular
        mt-2">Welcome back! Please enter your details</p>
        </div>


        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
          {/* <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">
            {isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader />Loading....
              </div>
            ) : "Sign in"}
          </Button>
          <p className="text-small-regular text-light-2 text-center
      mt-2">
            Don't have an account?
            <Link to="/sign-up" className="text-primary-500
        text-small-semibold ml-1">Sign up</Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SigninForm