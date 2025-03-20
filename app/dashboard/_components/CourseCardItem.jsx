import React from 'react'
import Image from 'next/image'

function CourseCardItem({course}) {
  return (
    <div>
      <div>
        <div>
            <Image src={'/public/knowledge.png'} alt='other' width={50} height={50} />
        </div>
      </div>
    </div>
  )
}

export default CourseCardItem