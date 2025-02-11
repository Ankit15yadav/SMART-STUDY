import React from 'react'
import { metadata } from './layout'
import Navbar from '@/components/globals/navbar'

metadata.title = "Smart-Study/home"

type Props = {}

const Page = (props: Props) => {
  return (
    <div>
      <Navbar />
    </div>
  )
}

export default Page