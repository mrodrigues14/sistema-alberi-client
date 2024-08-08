'use client';

import Image from "next/image";
import { Poppins } from "next/font/google";
import { useState } from "react";

const font = Poppins({
    subsets: ["latin"],
    weight: ["400"],
});

export default function Home() {

    return (
        <main className={`bg-[#115C5E] h-screen w-full flex justify-center items-center ${font.className}`}>
            <div className="flex flex-col items-center">
                <Image
                    src="/logo.png"
                    alt="Alberi Consult"
                    width={200}
                    height={200}
                />
                <div className="bg-white p-8 rounded-lg shadow-md mt-4 w-80">

                </div>
            </div>
        </main>
    );
}
