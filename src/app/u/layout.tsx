import Navbar from "@/components/globals/navbar";
import React from "react";

export default function ULayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main>{children}</main>
        </>
    )
}
