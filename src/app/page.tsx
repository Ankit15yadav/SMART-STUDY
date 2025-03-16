'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const Page = () => {

  const router = useRouter()
  useEffect(() => {
    router.push("/u/home")
  }, [])

  return (
    <></>
  )
}

export default Page