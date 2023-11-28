import React from 'react'
import "./projectdetails.css"
import Navbar from '../Navbar/Navbar'
const ProjectDetails = () => {
    const Project={
        ProjectTitle:"I am looking for someone who knows and understands crypto software like Brainwords and MiniKeys",
        Price:"1200-2000",
        average:"1600",
        Bids:"10",
        details:"Whatsapp Sender Google Chrome Extension the function is not working.. the rest are fine.. just this function need to be resolved.",
        Skills:"Javascript, CSS, HTML , C, React",
        Id:"3232"
    }
  return (
    <div className='complete-project-details'>
           <Navbar/>
        <div className='about-projects'>
        <div className='project-header'>
        <div className='project-title'>
            {Project.ProjectTitle}
        </div>
        <div className='side-heading'>
        <div className='price-range'>
{Project.average}Rs
        </div>
        <div className='Bids'>
            Total Bids:{Project.Bids}
        </div>
        </div>
        </div>

        <div className='projectdetails'>
            <div className='projectdetails-header'>
                <div className='texto'> Project Details</div>
                <div className='texto'> Pricing-range:{" "}{Project.Price}</div>
            </div>
            <div className='projectdetails'>
                <div>
{Project.details}
                </div>
                <div className='Skills'>
                    <div className='texto'>Skill required:</div>
                    {Project.Skills.split(",").map((skill,index) => (
<span key={index} className='skillsbox'>{skill}</span>
                    ))}
                </div>
            </div>
            <div>Project Id:{Project.Id}</div>
        </div>
        <div className='scamscard'>
 <span className='texto'>Beaware of scams</span>
 <div>If you are being asked to pay a security deposit, or if you are being asked to chat on Telegram, WhatsApp, or another messaging platform, it is likely a scam. Report these projects or contact Support for assistance.</div>
        </div>
        </div>

        <div className='about-client'>
            <div className='client-container'>

                <div className='texto'>About the Client</div>
                <div className='client-details'>
                <div>
                    place
                </div>
                <div>
                    Joined since
                </div>

            </div>
            </div>
        </div>
    </div>
  )
}

export default ProjectDetails