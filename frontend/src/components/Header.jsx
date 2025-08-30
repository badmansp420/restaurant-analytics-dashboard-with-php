import React from 'react'
import { BarChart3 } from "lucide-react";


export default function Header() {
    return (
        <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <BarChart3 className="h-8 w-8 text-primary" />
                Restaurant Management Dashboard
            </h1>
            <p className="text-muted-foreground">
                Track restaurant performance, analyze order trends, and monitor revenue metrics
            </p>
        </div>
    )
}
