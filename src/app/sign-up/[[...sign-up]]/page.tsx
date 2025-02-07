// "use client";

// import * as React from "react";
// import { useSignUp } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import { toast, Toaster } from "sonner";

// import { Button } from "@/components/ui/button";
// import {
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Icons } from "@/components/icons";
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardFooter,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card";

// // Define form validation schema using Zod
// const formSchema = z.object({
//     email: z.string().email({
//         message: "Please enter a valid email address.",
//     }),
//     password: z.string().min(8, {
//         message: "Password must be at least 8 characters long.",
//     }),
// });

// export default function SignUpPage() {
//     const { signUp, isLoaded, setActive } = useSignUp();
//     const [isSubmitting, setIsSubmitting] = React.useState(false);
//     const router = useRouter();

//     // Initialize the form using react-hook-form and zod for validation
//     const form = useForm<z.infer<typeof formSchema>>({
//         resolver: zodResolver(formSchema),
//         defaultValues: {
//             email: "",
//             password: "",
//         },
//     });

//     // Handle form submission for email/password sign-up
//     async function onSubmit(values: z.infer<typeof formSchema>) {
//         if (!isLoaded || isSubmitting) return;

//         try {
//             setIsSubmitting(true);
//             const result = await signUp.create({
//                 emailAddress: values.email,
//                 password: values.password,
//             });

//             console.log("Sign up result:", result);

//             // If sign-up is complete (no further verification needed), set active session and redirect
//             if (result.status === "complete") {
//                 await setActive({ session: result.createdSessionId });
//                 router.push("/dashboard");
//             } else {
//                 // If additional verification is required (e.g., email verification)
//                 console.log("Additional verification needed:", result);
//                 toast.success("Account created! Please check your email to verify your account.", {
//                     description: "Verification email sent.",
//                 });
//             }
//         } catch (error) {
//             console.error("Sign-up error:", error);
//             toast.error("Sign Up Failed", {
//                 description: "An error occurred during sign up. Please try again.",
//             });
//         } finally {
//             setIsSubmitting(false);
//         }
//     }

//     // Handle Google OAuth sign-up
//     const handleGoogleSignUp = async () => {
//         if (!isLoaded || isSubmitting) return;

//         try {
//             setIsSubmitting(true);
//             await signUp.authenticateWithRedirect({
//                 strategy: "oauth_google",
//                 redirectUrl: "/sso-callback",
//                 redirectUrlComplete: "/dashboard",
//             });
//         } catch (error) {
//             console.error("Google sign-up error:", error);
//             toast.error("Google Sign Up Failed", {
//                 description: "An error occurred while signing up with Google. Please try again.",
//             });
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <div className="container flex h-screen w-screen flex-col items-center justify-center bg-gradient-to-br from-teal-100 to-teal-300">
//             <Card className="w-full max-w-md">
//                 <CardHeader className="space-y-1">
//                     <CardTitle className="text-3xl font-bold text-center">Create an Account</CardTitle>
//                     <CardDescription className="text-center">
//                         Join Smart Study and start learning together!
//                     </CardDescription>
//                 </CardHeader>
//                 <CardContent className="grid gap-4">
//                     <Form {...form}>
//                         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//                             <FormField
//                                 control={form.control}
//                                 name="email"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Email</FormLabel>
//                                         <FormControl>
//                                             <Input placeholder="name@example.com" {...field} />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />
//                             <FormField
//                                 control={form.control}
//                                 name="password"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Password</FormLabel>
//                                         <FormControl>
//                                             <Input type="password" {...field} />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />
//                             <Button className="w-full" type="submit" disabled={isSubmitting}>
//                                 {isSubmitting && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
//                                 Create Account
//                             </Button>
//                         </form>
//                     </Form>
//                     <div className="relative">
//                         <div className="absolute inset-0 flex items-center">
//                             <span className="w-full border-t" />
//                         </div>
//                         <div className="relative flex justify-center text-xs uppercase">
//                             <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
//                         </div>
//                     </div>
//                     <Button
//                         variant="outline"
//                         type="button"
//                         disabled={isSubmitting}
//                         onClick={handleGoogleSignUp}
//                         className="w-full"
//                     >
//                         {isSubmitting ? (
//                             <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
//                         ) : (
//                             <Icons.google className="mr-2 h-4 w-4" />
//                         )}
//                         Sign up with Google
//                     </Button>
//                 </CardContent>
//                 <CardFooter>
//                     <p className="px-8 text-center text-sm text-muted-foreground w-full">
//                         Already have an account?{" "}
//                         <Link href="/sign-in" className="underline underline-offset-4 hover:text-primary font-medium">
//                             Sign in
//                         </Link>
//                     </p>
//                 </CardFooter>
//             </Card>

//             {/* Optional: Container for any CAPTCHA you might be using */}
//             <div id="clerk-captcha" className="mt-4" />

//             <Toaster />
//         </div>
//     );
// }

import { SignUp } from '@clerk/nextjs'
import React from 'react'

type Props = {}

const signUp = (props: Props) => {
    return (
        <div>
            <SignUp routing='hash' />
        </div>
    )
}

export default signUp