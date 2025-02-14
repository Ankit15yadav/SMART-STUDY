// 'use client'

// import React, { useState } from 'react'
// import { Dancing_Script } from "next/font/google"
// import { Input } from '@/components/ui/input'
// import { data } from "../../../../../../public/assets/interests/data"
// import InterestsCard from '@/components/interests'
// import { Button } from '@/components/ui/button'
// import { ArrowRight, Loader2 } from 'lucide-react'
// import { api } from '@/trpc/react'
// import { toast } from 'sonner'
// import { useRouter } from 'next/navigation'
// import Image from 'next/image'


// const dancingScript = Dancing_Script({ subsets: ['latin'], weight: '400' })

// export type datainterst = {
//     title: string
//     id: string
// }

// const Interests = () => {

//     const [interests, setInterests] = useState<datainterst[]>([])
//     const createInterest = api.interest.insertInterest.useMutation()
//     const [isloading, setIsLoading] = useState(false)
//     const router = useRouter();

//     const handleInterest = () => {
//         // console.log(interests)

//         setIsLoading(true)
//         createInterest.mutate({ name: interests.map((interest) => interest.title).join(', ') },
//             {
//                 onSuccess: () => {
//                     toast.success('Interests added successfully')
//                     setIsLoading(false)
//                     // redirect('/')
//                     router.push("/")
//                 },
//                 onError: (error) => {
//                     console.log(error);
//                     setIsLoading(false)
//                     toast.error('Failed to add interests')
//                 },
//             }
//         )

//     }

//     return (
//         <div className='w-full '>
//             <div className='w-11/12 mx-auto  min-h-screen'>
//                 {/* <div className='flex items-center justify-center  pt-2'>
//                     <Image
//                         src={"/assets/images/logo.png"}
//                         alt='logo'
//                         width={150}
//                         height={150}
//                         className='flex it'
//                     />
//                 </div> */}

//                 <div className='flex flex-col justify-center items-center py-4'>
//                     <h1 className={`text-4xl ${dancingScript.className}`}>What are you interested in?</h1>
//                     <p className='text-muted-foreground mt-2 text-sm' >Choose  five interests or more</p>
//                 </div>

//                 <div className="h-8"></div>
//                 <div className='w-11/12 mx-auto  justify-center flex flex-wrap gap-4'>
//                     {data.map((Interest, index) => (
//                         <InterestsCard title={Interest.title} interests={interests} setInterests={setInterests} key={index} />
//                     ))}
//                 </div>
//                 <div className="h-4"></div>
//                 <div className='flex justify-end'>
//                     <Button
//                         onClick={handleInterest}
//                         disabled={interests.length < 5}
//                     >
//                         {
//                             isloading ?
//                                 (<div className='flex items-center gap-x-2'>
//                                     Saving...
//                                     <Loader2 className='animate-spin' />
//                                 </div>)
//                                 :
//                                 (<div className='flex items-center gap-x-2'>
//                                     Continue
//                                     <ArrowRight />
//                                 </div>)
//                         }
//                     </Button>
//                 </div>

//             </div>
//         </div>

//     )
// }

// export default Interests

'use client'
import { useState } from "react";

const PdfUploader = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];

        if (selectedFile) {
            if (selectedFile.type !== "application/pdf") {
                setError("Only PDF files are allowed.");
                setFile(null);
            } else {
                setError(null);
                setFile(selectedFile);
            }
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a PDF file first.");
            return;
        }

        setUploading(true);
        setError(null);
        setSuccessMessage(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/pdf-upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Upload failed.");
            }

            setSuccessMessage(data.secureUrl);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-4 border rounded-lg shadow-lg w-96 mx-auto">
            <h2 className="text-xl font-semibold mb-2">Upload a PDF</h2>

            <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="mb-3 border p-2 w-full"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}

            <button
                onClick={handleUpload}
                disabled={uploading || !file}
                className={`mt-3 px-4 py-2 text-white rounded ${uploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                    }`}
            >
                {uploading ? "Uploading..." : "Upload PDF"}
            </button>
        </div>
    );
};

export default PdfUploader;
