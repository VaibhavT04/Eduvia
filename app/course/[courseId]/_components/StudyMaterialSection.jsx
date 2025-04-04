import React from 'react'
import MaterialCardItem from './MaterialCardItem'

function StudyMaterialSection(courseId) {
    const[studyTypeContent,setStudyTypeContent]=useState();
    const MaterialList=[
        {
            name:'Notes/Chapters',
            desc:'Read notes to prepare it',
            icon: '/exam-time.png',
            path:'/notes'
        },
        {
            name:'Flashcard',
            desc:'Flashcards help remember concepts',
            icon: '/flash-card.png',
            path:'/flashcards'
        },
        {
            name:'Quiz',
            desc:'Great way to test your knowledge',
            icon: '/content-strategy.png',
            path:'/quiz'
        },
        {
            name:'Question/Answer',
            desc:'Help you understand the concepts better',
            icon: '/open-book.png',
            path:'/qa'
        }
    ]
const GetStudyMaterial=async()=>{
    const result=await axios.post('/api/study-type',{
        courseId:courseId,
        studyType:'ALL'
    })
    console.result(result?.data);
    setStudyTypeContent(result.data)
}


  return (
    <div className='mt-5'>
        <h2 className='text-xl font-medium'>Study Material</h2>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-5 mt-5'>
            {MaterialList.map((item, index)=>(
                <MaterialCardItem item={item}/>
            ))}
        </div>
    </div>
  )
}

export default StudyMaterialSection