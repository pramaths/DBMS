import React from 'react';

const StudentSatisfaction = ({ projectId, onSatisfactionConfirmed }) => {
    const handleSatisfaction = () => {
        onSatisfactionConfirmed(projectId);
    };

    return (
        <div>
            <h2>Confirm Satisfaction</h2>
            <button onClick={handleSatisfaction}>I'm Satisfied</button>
        </div>
    );
};

export default StudentSatisfaction;
