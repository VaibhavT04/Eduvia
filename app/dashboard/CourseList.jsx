"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import CourseCardItem from "./_components/CourseCardItem";

function CourseList() {
    const { user } = useUser();
    const [courseList, setCourseList] = useState([]);

    const GetCourseList = async () => {
        if (!user) return; // Prevent API call if user is not available

        try {
            const result = await axios.post("/api/courses", {
                createdBy: user?.primaryEmailAddress?.emailAddress,
            });
            setCourseList(result.data.result || []);
        } catch (error) {
            console.error("Failed to fetch courses:", error);
        }k
    };

    useEffect(() => {
        if (user) GetCourseList();
    }, [user]);

    return (
        <div className="mt-10">
            <h2 className="font-bold text-2xl">Your Study Material</h2>
            <div>
                {courseList.length > 0 ? (
                    courseList.map((course, index) => (
                        <CourseCardItem course={course} key={index} />
                    ))
                ) : (
                    <p className="text-gray-500 mt-4">No courses found.</p>
                )}
            </div>
        </div>
    );
}

export default CourseList;
