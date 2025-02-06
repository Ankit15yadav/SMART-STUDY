import { SignIn } from '@clerk/nextjs'
import React from 'react'

type Props = {}

const signIn = (props: Props) => {
    return (
        <div>
            <SignIn />
        </div>
    )
}

export default signIn