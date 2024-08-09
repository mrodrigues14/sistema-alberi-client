'use client'

import { Poppins } from "next/font/google";
import Navbar from "@/components/Navbar";

const font = Poppins({
    subsets: ["latin"],
    weight: ["400"],
});

export default function home(){
    return(
        <><Navbar/>
            <div>
                <h1>Home</h1>
            </div>
        </>
    )
}