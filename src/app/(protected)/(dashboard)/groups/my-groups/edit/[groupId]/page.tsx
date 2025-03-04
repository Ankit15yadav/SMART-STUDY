'use client'

import { useParams } from 'next/navigation'
import React from 'react'

type Props = {}

const EditGroups = (props: Props) => {

    const { groupId } = useParams();

    return (
        <div>
            {groupId}
        </div>
    )
}

export default EditGroups