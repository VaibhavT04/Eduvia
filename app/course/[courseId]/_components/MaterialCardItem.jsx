import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { RefreshCcw } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'
import Link from 'next/link'

function MaterialCardItem({item, studyTypeContent, course, refreshData}) {
  const [loading, setLoading] = useState(false);
  
  const GenerateContent = async () => {
    try {
      setLoading(true);
      toast('Generating your Content');

      if (!course?.courseId) {
        toast('Course data not available');
        setLoading(false);
        return;
      }

      // Parse courseLayout if it's a string
      let courseLayoutData = course.courseLayout;
      if (typeof courseLayoutData === 'string') {
        try {
          courseLayoutData = JSON.parse(courseLayoutData);
        } catch (error) {
          console.error('Failed to parse course layout:', error);
          toast('Error parsing course data');
          setLoading(false);
          return;
        }
      }

      // Extract chapters
      let chapters = '';
      if (courseLayoutData?.chapters && Array.isArray(courseLayoutData.chapters)) {
        chapters = courseLayoutData.chapters
          .map(chapter => chapter.chapterTitle || chapter.chapter_title || chapter.title)
          .filter(Boolean)
          .join(',');
      }

      if (!chapters) {
        toast('No chapters found to generate content from');
        setLoading(false);
        return;
      }

      const payload = {
        courseId: course.courseId,
        type: item.name,
        chapters: chapters
      };

      const result = await axios.post('/api/generate-study-type-content', payload);
      
      if (result.data?.success) {
        if (item.name === 'Notes/Chapters') {
          toast('Your notes are being generated. This may take a few moments.');
        } else if (item.name === 'Quiz') {
          toast('Your quiz is being generated. Please wait a moment.');
        } else {
          toast('Your content is being generated. Please wait a moment.');
        }
        
        // Wait a bit before refreshing to allow the Inngest function to start
        setTimeout(() => {
          refreshData(true);
          toast('Your content will be ready soon. You can refresh the page to check.');
        }, 2000);
      } else {
        throw new Error(result.data?.message || 'Failed to generate content');
      }
    } catch (error) {
      console.error("Error generating content:", error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to generate content. Please try again.';
      toast(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  const getContentLength = () => {
    if (!studyTypeContent || !item.type) return null;
    const content = studyTypeContent[item.type];
    if (!content) return null;
    return Array.isArray(content) ? content.length : null;
  };

  return (
    <Link href={'/course/' + course?.courseId + item.path}>
      <div className='border shadow-md rounded-lg p-5 flex flex-col items-center'>
        <h2 className='p-1 px-2 mb-2 text-white bg-green-500 rounded-full text-[11px]'>Ready</h2>
        <Image src={item.icon} alt={item.name} width={50} height={50}/>
        <h2 className='text-lg font-medium mt-3'>{item.name}</h2>
        <p className='mt-2 text-md text-gray-500 text-center'>{item.desc}</p>

        {getContentLength() === null ? (
          <Button className='mt-4 w-full' variant={'outline'} onClick={(e) => {
            e.preventDefault();
            GenerateContent();
          }}>
            {loading && <RefreshCcw className='animate-spin mr-2'/>}
            Generate
          </Button>
        ) : (
          <Button className='mt-4 w-full' variant={'outline'}>
            View
          </Button>
        )}
      </div>
    </Link>
  )
}

export default MaterialCardItem