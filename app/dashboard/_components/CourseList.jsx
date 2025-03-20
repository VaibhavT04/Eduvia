"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import CourseCardItem from "./_components/CourseCardItem";

function CourseList(){

    const {user}=useUser();
    const [courseList,setCourseList]=useState([]);
    useEffect(()=>{
        user&&GetCourseList();
    },[user])

    const GetCourseList=async()=>{
        const result=await axios.post("/api/courses",
            {createdBy:user?.primaryEmailAddress?.emailAddress});
            console.log(result);
            setCourseList(result.data.result);
    }
    return(
        <div>
            <h2 className="font-bold text-2xl">Your Study Material</h2>

            <div>
                {CourseList?.map((course,index)=>(
                    <CourseCardItem key={index} course={course}/>
                ))}
            </div>
        </div>
    )
}

export default CourseList