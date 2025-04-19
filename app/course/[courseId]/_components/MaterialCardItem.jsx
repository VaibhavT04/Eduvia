import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

function MaterialCardItem({item,studyTypeContent,course}) {
  const [loading,setLoading]=useState(false);
  const GenerateContent=async()=>{

    toast(' Generating your Content')
    setLoading(true)
    let chapters='';
    course?.courseLayout.chapters.forEach(chapter=>{
      chapters=(chapter.chapter_title||chapter.chapterTitle)+','+chapters
    });

    const result=await axios.post('/api/study-type-content',
      {
        courseId:course?.courseId,
        type:item.name,
        chapters:chapters
      });

      setLoading(false);
      refreshData(true);
      toast('Your Content is read to view')
  }

  return (
    <link href={'/course/'+course?.courseId+item.path}>
    <div className='border shadow-md rounded-lg p-5 flex flex-col items-center'>
        <h2 className='p-1 px-2 mb-2 text-white bg-green-500 rounded-full text-[11px]'>Ready</h2>
        <Image src={item.icon} alt={item.name} width={50} height={50}/>
        <h2 className='text-lg font-medium mt-3'>{item.name}</h2>
        <p className='mt-2 text-md text-gray-500 text-center'>{item.desc}</p>

        {studyTypeContent?.[item.type]?.Length==null?
        <Button className='mt-4 w-full' variant={'outline'} onClick={()=>GenerateContent()} 
        {loading&& <RefreshCcw className='animate-spin'/> }>
            Generate
        </Button>:
        <Button className='mt-4 w-full' variant={'outline'}>
            View
        </Button>}
    </div>
    </link>
  )
}

export default MaterialCardItem