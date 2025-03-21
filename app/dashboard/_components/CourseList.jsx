"use client";
import CourseCardItem from "./CourseCardItem";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

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
            <h2 className="mt-3 font-bold text-2xl">Your Study Material</h2>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 mt-2 gap-5">
                {courseList?.map((course,index)=>(
                    <CourseCardItem key={index} course={course}/>

                ))}

            </div>
        </div>
    )
}

export default CourseList