"use client"
import React from 'react'

function Flashcards() {

  const {courseId}=useParams();
  
  useEffect(()=>{
    GetFlashcards();
  },[])
  
  const GetFlashcards=async()=>{
    const result=await axios.post('/api/study-type',{
        courseId:courseId,
        studyType:'Flashcard'
    });

    console.log('Flashcard',result.data);

  }

  return (
    <div>Flashcards</div>
  )
}

export default Flashcards