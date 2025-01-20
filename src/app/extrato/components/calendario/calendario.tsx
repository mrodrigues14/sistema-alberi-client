"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./Calendar.module.css";

const Calendario: React.FC = () => {
    const [currentDate] = useState(new Date());
    const [months, setMonths] = useState<string[]>([]);
    const [selectedMonth, setSelectedMonth] = useState<string>("");
    const scrollRef = useRef<HTMLDivElement>(null);

    const monthNames = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
    ];

    function generateMonths(baseDate: Date, offset = 12): string[] {
        const monthsList: string[] = [];
        const baseYear = baseDate.getFullYear();
        const baseMonth = baseDate.getMonth();

        for (let i = -offset; i <= offset; i++) {
            const date = new Date(baseYear, baseMonth + i);
            const monthName = monthNames[date.getMonth()];
            const formattedMonth = `${monthName}/${date.getFullYear()}`; 
            monthsList.push(formattedMonth);
        }

        return monthsList;
    }

    useEffect(() => {
        const initialMonths = generateMonths(currentDate, 12); 
        const currentMonthName = `${monthNames[currentDate.getMonth()]}/${currentDate.getFullYear()}`;
        setMonths(initialMonths);
        setSelectedMonth(currentMonthName);
    
        setTimeout(() => {
            if (scrollRef.current) {
                const currentMonthIndex = initialMonths.indexOf(currentMonthName);
                scrollRef.current.scrollTo({
                    left: currentMonthIndex * 100, 
                    behavior: "smooth",
                });
            }
        }, 100);
    }, [currentDate]);
    
    
    

    const loadPreviousMonths = () => {
        if (scrollRef.current) {
            const scrollPosition = scrollRef.current.scrollLeft; 
            const firstDisplayedMonth = months[0];
            const [monthName, year] = firstDisplayedMonth.split("/");
            const firstMonthDate = new Date(parseInt(year, 10), monthNames.indexOf(monthName) - 12);
            const newMonths = generateMonths(firstMonthDate, 12);
            setMonths([...newMonths, ...months]);
    
            setTimeout(() => {
                if (scrollRef.current) {
                    scrollRef.current.scrollLeft = scrollPosition + scrollRef.current.clientWidth; 
                }
            }, 0);
        }
    };
    
    

    const loadNextMonths = () => {
        const lastDisplayedMonth = months[months.length - 1];
        const [monthName, year] = lastDisplayedMonth.split("/");
        const lastMonthDate = new Date(parseInt(year, 10), monthNames.indexOf(monthName) + 12);
        const newMonths = generateMonths(lastMonthDate, 12);
        setMonths([...months, ...newMonths]);

        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: 300,
                behavior: "smooth",
            });
        }
    };

    const handleSelectMonth = (month: string) => {
        setSelectedMonth(month);
    };

    return (
        <div className="flex items-center w-full overflow-hidden p-1 w-3/4">
            <button
                onClick={loadPreviousMonths}
                className="bg-blue-700 text-white px-3 py-1 rounded-l hover:bg-blue-800 mr-4 text-md"
            >
                &lt;
            </button>

            <div
                ref={scrollRef}
                className={`flex space-x-2 px-1 overflow-x-auto w-full ${styles.scrollbarHide}`}
            >
                {months.map((month, index) => (
                    <button
                        key={index}
                        onClick={() => handleSelectMonth(month)}
                        className={`px-3 py-1 border rounded shadow-md text-md ${selectedMonth === month
                                ? "bg-blue-700 text-white"
                                : "bg-white hover:bg-gray-100"
                            }`}
                    >
                        {month}
                    </button>
                ))}
            </div>

            <button
                onClick={loadNextMonths}
                className="bg-blue-700 text-white px-3 py-1 rounded-r hover:bg-blue-800 ml-4 text-md"
            >
                &gt;
            </button>
        </div>

    );
};

export default Calendario;
