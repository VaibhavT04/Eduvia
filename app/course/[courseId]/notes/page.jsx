'use client';
import React from 'react'
import { useParams } from 'next/navigation';
import axios from 'axios';

function ViewNotes() {
    const {courseId}=useParams();
    const [notes,setNotes]=useState();
    const [stepCount,setStepCount]=useState(0);
    useEffect(()=>{
        GetNotes();
    },[]);
    const GetNotes=async()=>{
        const result=await axios.get('/api/study-type',{courseId:courseId,
            studyType:'Notes'});
        console.log(result?.data);
        setNotes(result?.data);
    }
  return (
    <div>
        <div className='flex items-center gap-5'>
            <button variant='outline' size='sm'>previous</button>
            {notes?.map((item,index)=>(
                <div key={index} className={` w-full h-2 rounded-full ${index<stepCount?'bg-primary':'bg-200'}`}>
                    <h2>{item.title}</h2>
                    <p>{item.description}</p>
                </div>
            ))}
            <button variant='outline' size='sm'>next</button>
        </div>
    </div>
  )
}

export default ViewNotes