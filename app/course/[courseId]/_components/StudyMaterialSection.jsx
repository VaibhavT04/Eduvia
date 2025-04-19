import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useParams } from 'next/navigation'
import MaterialCardItem from './MaterialCardItem'

function StudyMaterialSection({ courseId, course }) {
    const [studyTypeContent, setStudyTypeContent] = useState();
    const MaterialList = [
        {
            name: 'Notes/Chapters',
            desc: 'Read notes to prepare it',
            icon: '/exam-time.png',
            path: '/notes'
        },
        {
            name: 'Flashcard',
            desc: 'Flashcards help remember concepts',
            icon: '/flash-card.png',
            path: '/flashcards'
        },
        {
            name: 'Quiz',
            desc: 'Great way to test your knowledge',
            icon: '/content-strategy.png',
            path: '/quiz'
        },
        {
            name: 'Question/Answer',
            desc: 'Help you understand the concepts better',
            icon: '/open-book.png',
            path: '/qa'
        }
    ]

    const GetStudyMaterial = async () => {
        try {
            const result = await axios.post('/api/study-type', {
                courseId: courseId,
                studyType: 'ALL'
            });
            console.log("Study material data:", result?.data);
            setStudyTypeContent(result.data);
        } catch (error) {
            console.error("Error fetching study material:", error);
        }
    }

    React.useEffect(() => {
        if (courseId) {
            GetStudyMaterial();
        }
    }, [courseId]);

    return (
        <div className='mt-8'>
            <h2 className='text-[20px] font-medium'>Study Materials</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-4 gap-5'>
                {MaterialList.map((item, index) => (
                    <MaterialCardItem
                        key={index}
                        item={item}
                        studyTypeContent={studyTypeContent?.data}
                        course={course}
                        refreshData={GetStudyMaterial}
                    />
                ))}
            </div>
        </div>
    )
}

export default StudyMaterialSection