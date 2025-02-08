import React, { useState } from 'react';
import Image from 'next/image';

function SelectOption() {
    const Options = [
        {
            name: 'Exam',
            icon: '/exam-time.png'
        },
        {
            name: 'Job Interview',
            icon: '/job.png'
        },
        {
            name: 'Practice',
            icon: '/practice.png'
        },
        {
            name: 'Coding Preparation',
            icon: '/programming.png'
        },
        // {
        //     name: 'content',
        //     icon: '/content-strategy.png'
        // },
        {
            name: 'Other',
            icon: '/open-book.png'
        }
    ];

    const [selectedOption, setSelectedOption] = useState();

    return (
        <div>
            <h2 className="text-center mb-2 text-lg">For which you want to create your personal study material</h2>
            <div className="grid grid-cols-2 mt-5 md:grid-cols-3 lg:grid-cols-5 gap-5">
                {Options.map((option, index) => (
                    <div
                        key={index}
                        className={`p-4 mt-2 flex flex-col items-center justify-center border rounded-xl cursor-pointer
                            hover:bg-gray-300 hover:border-primary ${option.name === selectedOption ? 'border-primary bg-gray-300' : ''}`}
                        onClick={() => {setSelectedOption(option.name);selectedStudyType(option.name)}}
                    >
                        <Image src={option.icon} alt={option.name} width={50} height={50} />
                        <h2 className='text-sm mt-2'>{option.name}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SelectOption;