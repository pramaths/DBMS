import React from 'react'

const Benefits = () => {
    const benefitData = [
        {
          title: "Benefit 1",
          description: "Description for benefit 1."
        },
        {
          title: "Benefit 2",
          description: "Description for benefit 2."
        },
        {
          title: "Benefit 3",
          description: "Description for benefit 3."
        },
        {
          title: "Benefit 4",
          description: "Description for benefit 4."
        }
      ];
    
  return (
    <div className='benefitscontainer'>

{benefitData.map((item,index)=>(
<div className='benefits'>
<h3>{item.title}</h3>
          <p>{item.description}</p>
</div>
))}
    </div>
  )
}

export default Benefits