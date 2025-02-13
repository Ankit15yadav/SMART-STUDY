import React from 'react';
import { Skeleton } from '../ui/skeleton';

const SkeletonCard = () => {
    return (
        <div className="flex flex-col mt-3 space-y-3 p-4 border rounded-lg">
            {/* Circular Avatar Skeleton */}
            <Skeleton className="h-12 w-12 rounded-full" />

            {/* Text Placeholders */}
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>

            {/* Additional Card Content Placeholder */}
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
            </div>

            {/* Button Placeholder */}
            <Skeleton className="h-10 w-[100px] rounded-md" />
        </div>
    );
};

export default SkeletonCard;