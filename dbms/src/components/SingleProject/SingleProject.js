import React, { useEffect, useState } from 'react';
import { useParams,Link } from 'react-router-dom';
import moment from 'moment';
import './SingleProject.css'
import { FaArrowLeft, FaFileAlt, FaUserFriends, FaShare, FaBook,} from 'react-icons/fa';
import Navbar from '../Navbar/Navbar';
import ApplyModal from '../Applymodal/Applymodal';
import Cookies from 'js-cookie';
import DocumentDetailsModal from '../documnet';
const getLoggedInUserId = () => {
    const token = Cookies.get('token');
    if (!token) return null;

    try {
        const base64Url = token.split('.')[1]; // Get payload part
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));

        return payload.id; 
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};
const loggedInUserId = getLoggedInUserId();
const SingleProject = () => {
  const [project, setProject] = useState(null);
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('details');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [proposals, setProposals] = useState([]);
  const [docs, setDocs] = useState([]);
  const [isLocked, setIsLocked] = useState(true); 
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
const [selectedProposal, setSelectedProposal] = useState(null);
const [discussionMessages, setDiscussionMessages] = useState([]);
const [newMessage, setNewMessage] = useState('');
const [editingMessageId, setEditingMessageId] = useState(null);
const [editingMessageText, setEditingMessageText] = useState('');
const [showDocModal, setShowDocModal] = useState(false);
const [isProposalAccepted, setIsProposalAccepted] = useState(false);

const renderProposalCard = (proposal,isProjectOwner, acceptProposal) => {
  const handleAcceptClick = () => {
    setSelectedProposal(proposal);
    setShowPaymentPopup(true);
  };
  return (
    <div className="proposal-card" key={proposal.id}>
    <img 
      src={proposal.image_url || '/path/to/default/image.jpg'} 
      alt="Developer" 
      className="developer-image"
    />
    <div className="proposal-info">
      <p className="proposal-text">{proposal.proposal_text}</p>
      <p>Estimated Cost: ${proposal.Estimated_cost}</p>
      <p>Estimated Time: {proposal.Estimated_Time}</p>
      <p>Submitted: {moment(proposal.created_at).fromNow()}</p>
      
      {proposal.github_profile && <a href={proposal.github_profile}>GitHub</a>}
      {proposal.Twitter_profile && <a href={proposal.Twitter_profile}>Twitter</a>}
      {isProjectOwner && !isProposalAccepted && (
        <button onClick={() => handleAcceptClick(proposal.id)}>Accept Proposal</button>
      )}
{proposal.avg_rating && (
  <p>Average Rating: {parseFloat(proposal.avg_rating).toFixed(1)} / 5</p>
)}
      {proposal.reviews && (
        <div>
          <h4>Reviews:</h4>
          {proposal.reviews.split('; ').map((review, index) => (
            <p key={index}>{review}</p>
          ))}
        </div>
      )}
    </div>
  </div>
  );
};
const handlePaymentAndAccept = () => {
  acceptProposal(selectedProposal.id);
  setShowPaymentPopup(false);
  setIsProposalAccepted(true); 
};
const PaymentPopup = () => {
  if (!selectedProposal) return null;

  return (
    <div className='payment-popup'>
      <p>Amount: ${selectedProposal.Estimated_cost}</p>
      <button onClick={handlePaymentAndAccept}>Pay</button>
      <button onClick={() => setShowPaymentPopup(false)}>Cancel</button>
    </div>
  );
};

  useEffect(() => {
    fetch(`http://localhost:8000/api/project/${id}/docs`)
      .then(response => response.json())
      .then(data => setDocs(data.data))
      .catch(error => console.error('Fetch error (docs):', error));

    fetch(`http://localhost:8000/api/project/${id}/discussions`)
      .then(response => response.json())
      .then(data => setDiscussionMessages(data.data))
      .catch(error => console.error('Fetch error (discussions):', error));

    checkAccess(id);
  }, [id]);

  const checkAccess = (projectId) => {
    fetch(`http://localhost:8000/api/project/${projectId}/check-access`, {
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        if (data.hasAccess) {
          setIsLocked(false);
        } else {
          setIsLocked(true);
        }
      })
      .catch(error => console.error('Error checking access:', error));
  };
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/project/${id}/conversation/read`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        if (data.success) {
          setDiscussionMessages(data.data);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [id]);
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch(`/project/${id}/conversation/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageText: newMessage }),
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
      }
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  const startEditingMessage = (message) => {
    setEditingMessageId(message.id);
    setEditingMessageText(message.content);
  };
  useEffect(() => {
    fetch(`http://localhost:8000/api/project/${id}`)
      .then(response => response.json())
      .then(data => setProject(data.data))
      .catch(error => console.error('Fetch error:', error));
  }, [id]);
  console.log("fhuerhirh",project)
  useEffect(() => {
    fetch(`http://localhost:8000/api/allproposals/${id}`)
      .then(response => response.json())
      .then(data => setProposals(data.data))
      .catch(error => console.error('Fetch error:', error));
  }, [id]);
  console.log("rbgegh ir",proposals)
const acceptProposal = (proposalId) => {
  fetch(`http://localhost:8000/api/project/${id}/accept-proposal`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ proposalId }),
      credentials: 'include' 
  })
  .then(response => response.json())
  .then(data => {
      console.log('Proposal accepted:', data);
      setIsProposalAccepted(true);
      setProject(prevProject => ({ ...prevProject, isProposalAccepted: true }));
  })
  .catch(error => {
      console.error('Error accepting proposal:', error);
  });
};
  if (!project) {
    return <div>Loading...</div>;
  }

  const handleApplyClick = () => {
    setShowApplyModal(true);
  };

  const handleCloseModal = () => {
    setShowApplyModal(false);
  };
  const submitEditedMessage = async () => {
    try {
        const response = await fetch(`/project/${id}/conversation/update/${editingMessageId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messageText: editingMessageText }),
            credentials: 'include',
        });
        const data = await response.json();
        if (data.success) {
            const updatedMessages = discussionMessages.map(msg => {
                if (msg.id === editingMessageId) {
                    return { ...msg, content: editingMessageText };
                }
                return msg;
            });
            setDiscussionMessages(updatedMessages);
        }
        setEditingMessageId(null);
        setEditingMessageText('');
    } catch (error) {
        console.error('Error updating message:', error);
    }
};
const deleteMessage = async (messageId) => {
  try {
      const response = await fetch(`/project/${id}/conversation/delete/${messageId}`, {
          method: 'DELETE',
          credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
          const updatedMessages = discussionMessages.filter(msg => msg.id !== messageId);
          setDiscussionMessages(updatedMessages);
      }
  } catch (error) {
      console.error('Error deleting message:', error);
  }
};

  const handleSubmitApplication = (applicationData) => {
    console.log('Application Data:', applicationData);
    setShowApplyModal(false);
  };

  const isProjectOwner = project && project.student_id === loggedInUserId;
  console.log('Project Owner ID:', project ? project.student_id : 'No project');
console.log('Logged In User ID:', loggedInUserId);
const handleDocDetailsSubmit = async ({ title, description, filePath }) => {
  const project_id=id;
  try {
    const response = await fetch(`http://localhost:8000/api/postDoc/${project_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, description, file_path: filePath }),
      credentials: 'include'
    });
    const data = await response.json();
    if (response.ok) {
      console.log('Document submitted successfully:', data);
    } else {
      console.error('Error submitting document:', data);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};
const handleFinishClick = async () => {
  try {
    const projectId = id;
    const response = await fetch(`http://localhost:8000/api/send-verification/${projectId}`, {
      method: 'POST',
      credentials: 'include' 
    });

    if (response.ok) {
      console.log('Verification email sent');
    } else {
      console.error('Failed to send verification email');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
  return (
    <div>
    <Navbar/>
    <div className='singleprojectdetails'>
    
      <div className='backlink'>
      <Link to="/home">
        <div> <button><FaArrowLeft/>Back To projects
     </button></div>
     </Link>
      </div>
     <div> 

      <div className='projectprice'>
        <div>
         EARN {""}${ 
        project.price} {" "}</div>
        <div>{" "}    {} {project.price*88}</div>
        
        </div>
      <div className='texto projectTitle'>{project.title}</div>
      <div className='project-oa'>
  <div className='project-poster'>
  <div className='student-image-container'>
  <img 
    src={project.uname ? `http://localhost:8000${project.S_image}` : '/path/to/default/image.jpg'}
    alt="Student" 
    className='student-image'
/>
.
</div>
.
  <div className='project-owner'>{project.uname}</div>
  <div className='project-due'>{moment(project.created_at, "YYYYMMDD").fromNow()}.</div>
  </div>
  <button onClick={handleApplyClick}><FaShare /> Apply</button>
      {showApplyModal && (
        <ApplyModal onClose={handleCloseModal} onSubmit={handleSubmitApplication} />
      )}
    <div className="action-buttons">
                <button><FaFileAlt /> Details</button>
                <button onClick={handleFinishClick}>Finish Project</button>
                <button onClick={() => setShowDocModal(true)}>Upload Document</button>

<DocumentDetailsModal
  isOpen={showDocModal}
  onClose={() => setShowDocModal(false)}
  onUpload={handleDocDetailsSubmit}
/>
            </div>
</div>
<div className='projectdetail'>
        <div onClick={() => setActiveTab('details')} tiv
             className={`tab-content ${activeTab === 'details' ? 'details' : ''}`}>
          Details
        </div>
        <div onClick={() => setActiveTab('applications')} 
             className={`tab-content ${activeTab === 'applications' ? 'applications' : ''}`}>
       <FaUserFriends/>
          Applications {project.total_proposals}
        </div>
        <div onClick={() => setActiveTab('docs')} className={`tab-content ${activeTab === 'docs' ? 'active' : ''}`}>
 <FaBook/>   Docs
  </div>
  <div onClick={() => setActiveTab('discussion')} className={`tab-content ${activeTab === 'discussion' ? 'active' : ''}`}>
    Discussion
  </div>
      </div>
      <div>
        {activeTab === 'details' && (
          <div className='details'>
            <div>{project.description}</div>
          </div>
        )}

{activeTab === 'applications' && (
    <div className="proposals-container">
        {proposals && proposals.length > 0 ? (
            proposals.map(proposal => 
                renderProposalCard(proposal, isProjectOwner && !project.isProposalAccepted, acceptProposal)
            )
        ) : (
            <p>No proposals yet.</p>
        )}
    </div>
)}
 {activeTab === 'docs' && (
    <div className='docs'>
      {isLocked ? (
        <p><div>{project.description}</div></p>
      ) : (
        docs.map(doc => <div key={doc.id}>{doc.title}</div>)
      )}
    </div>
  )}

  {activeTab === 'discussion' && (
        <div className='discussion'>
          {isLocked ? (
            <p><div>{project.description}</div></p>
          ) : (
            <div>
             {discussionMessages.map(msg => (
    <div key={msg.id} className="message-container">
        {editingMessageId === msg.id ? (
            <div>
                <textarea
                    value={editingMessageText}
                    onChange={(e) => setEditingMessageText(e.target.value)}
                ></textarea>
                <button onClick={submitEditedMessage}>Update</button>
                <button onClick={() => setEditingMessageId(null)}>Cancel</button>
            </div>
        ) : (
            <div>
                <p>{msg.content}</p>
                <div className="message-actions">
                    <button onClick={() => startEditingMessage(msg)}>Edit</button>
                    <button onClick={() => deleteMessage(msg.id)}>Delete</button>
                </div>
            </div>
        )}
    </div>
))}

            </div>
          )}
        </div>
      )}
       {showPaymentPopup && <PaymentPopup />}
      </div>
            </div>
    </div>
    </div>
    
  );
};
export default SingleProject;
