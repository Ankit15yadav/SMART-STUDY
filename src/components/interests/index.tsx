'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Plus } from 'lucide-react'
import { datainterst } from "../../../src/app/(protected)/interests/page"
import { set } from 'date-fns'

type Props = {
    title: string
    // setForm: ?
    interests?: datainterst[]
    setInterests: React.Dispatch<React.SetStateAction<datainterst[]>>
}

const InterestsCard = ({ title, setInterests }: Props) => {

    const [active, setActive] = useState(false);

    const handleInterests = () => {
        setInterests((prev) => {
            if (prev.length >= 5 && !active) return prev;
            if (active) return prev.filter((interest) => interest.title !== title);
            return [...prev, { title, id: title }];
        });
    }

    return (
        <div>
            <div
                onClick={() => {
                    setActive(!active);
                    handleInterests();
                }}
                className={`hover:cursor-pointer ${active ? 'bg-teal-900 text-white border-white' : ''} border-2 border-teal-300  rounded-lg gap-x-2 w-fit px-3 py-2 flex items-center justify-between`}>
                <p>{title}</p>
                <Plus size={20} />
            </div>
        </div>
    )
}

export default InterestsCard