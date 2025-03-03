'use client'
import React, { useState, useEffect } from 'react'
import { Check, Plus } from 'lucide-react'
import { datainterst } from "../../app/(protected)/interests/page"

type Props = {
    title: string
    interests?: datainterst[]
    setInterests: React.Dispatch<React.SetStateAction<datainterst[]>>
}

const InterestsCard = ({ title, interests = [], setInterests }: Props) => {
    const [active, setActive] = useState(false);

    // Check if this interest is already in the selected list
    useEffect(() => {
        const isSelected = interests.some(interest => interest.title === title);
        setActive(isSelected);
    }, [interests, title]);

    const handleInterests = () => {
        setInterests((prev) => {
            // If already at 5+ interests and trying to add more, prevent it
            if (prev.length >= 5 && !active) return prev;

            // If active, remove this interest
            if (active) return prev.filter((interest) => interest.title !== title);

            // Otherwise add the interest
            return [...prev, { title, id: title }];
        });
    }

    return (
        <button
            onClick={() => {
                setActive(!active);
                handleInterests();
            }}
            className={`
                relative group transition-all duration-300 
                rounded-full px-4 py-2.5 text-sm font-medium 
                ${active
                    ? 'bg-primary text-primary-foreground border-transparent shadow-md'
                    : 'bg-primary/5 text-foreground border border-primary/20 hover:bg-primary/10 hover:border-primary/30'
                }
                focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-1
            `}
            disabled={interests.length >= 5 && !active}
        >
            <div className="flex items-center gap-x-1.5">
                <span>{title}</span>
                {active ? (
                    <Check className="h-4 w-4 text-primary-foreground" />
                ) : (
                    <Plus className="h-4 w-4 text-primary/70" />
                )}
            </div>

            {/* Selection effect */}
            {active && (
                <span className="absolute inset-0 rounded-full bg-primary/10 animate-pulse opacity-0"></span>
            )}

            {/* Disabled state */}
            {interests.length >= 5 && !active && (
                <span className="absolute inset-0 rounded-full bg-background/80 cursor-not-allowed"></span>
            )}
        </button>
    )
}

export default InterestsCard