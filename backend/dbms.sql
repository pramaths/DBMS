
CREATE TABLE IF NOT EXISTS test_table (
  id INT PRIMARY KEY,
  message VARCHAR(255) NOT NULL
);

-- Students Table
CREATE TABLE Students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number CHAR(10) NOT NULL,
    image_url text,
    github_profile VARCHAR(255),
    Twitter_profile VARCHAR(255),
    image_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Developers Table
CREATE TABLE Developers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number CHAR(10) NOT NULL,
    bio TEXT,
    expertise VARCHAR(255),
    github_profile VARCHAR(255),
    Twitter_profile VARCHAR(255),
    Avg_Prive_perhour VARCHAR(10),
    payments_details VARCHAR(255),
    image_path VARCHAR(255),
    Completed_projects_Count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects Table
CREATE TABLE Projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('Open', 'In Progress', 'Completed') DEFAULT 'Open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES Students(id)
);

-- Proposals Table
CREATE TABLE Proposals (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    developer_id INT NOT NULL,
    proposal_text TEXT,
    Estimated_cost INT NOT NULL,
    Estimated_Time VARCHAR(255) NOT NULL,
    status ENUM('Pending', 'Accepted', 'Rejected') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES Projects(id),
    FOREIGN KEY (developer_id) REFERENCES Developers(id)
);

-- Reviews Table
CREATE TABLE Reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    project_id INT NOT NULL,
    developer_id INT NOT NULL,
    rating INT NOT NULL,
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES Student(id),
    FOREIGN KEY (project_id) REFERENCES Projects(id),
    FOREIGN KEY (developer_id) REFERENCES Developers(id)
);

CREATE TABLE Conversations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    developer_id INT NOT NULL,
    project_id INT NOT NULL,
    message_text TEXT, -- New field to store messages directly in the Conversations table
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES Students(id),
    FOREIGN KEY (developer_id) REFERENCES Developers(id),
    FOREIGN KEY (project_id) REFERENCES Projects(id)
);


-- Docs Table
CREATE TABLE Docs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    file_path TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

CREATE TABLE ProjectDocs (
    project_id INT NOT NULL,
    doc_id INT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES Projects(id),
    FOREIGN KEY (doc_id) REFERENCES Docs(id),
    PRIMARY KEY (project_id, doc_id)
);

ALTER TABLE Students
ADD COLUMN verification_token VARCHAR(255),
ADD COLUMN is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN reset_password_token VARCHAR(255),
ADD COLUMN reset_password_expires DATETIME;

ALTER TABLE Students
DROP COLUMN name;

ALTER TABLE Developers
ADD COLUMN verification_token VARCHAR(255),
ADD COLUMN is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN reset_password_token VARCHAR(255),
ADD COLUMN reset_password_expires DATETIME;

ALTER TABLE Projects
ADD COLUMN requirements TEXT,
ADD COLUMN deadline DATETIME;
ALTER TABLE projects
ADD COLUMN verification_token VARCHAR(255),

ALTER TABLE Students DROP INDEX name;
ALTER TABLE Developers ADD COLUMN name VARCHAR(255) NOT NULL;

ALTER TABLE Projects
ADD COLUMN price DECIMAL(10, 2);


ALTER TABLE Projects
ADD COLUMN due DATETIME;

ALTER TABLE Students 
MODIFY image_url VARCHAR(255);

ALTER TABLE Developers 
CHANGE image_path image_url VARCHAR(255);

DELIMITER //
CREATE TRIGGER after_student_signup
BEFORE INSERT ON Students
FOR EACH ROW
BEGIN
  IF NEW.image_url IS NULL OR NEW.image_url = '' THEN
    SET NEW.image_url = '/Images/default.jpg';
  END IF;
END;
//
DELIMITER ;

DELIMITER //
CREATE TRIGGER after_developer_signup
BEFORE INSERT ON Developers
FOR EACH ROW
BEGIN
  IF NEW.image_url IS NULL OR NEW.image_url = '' THEN
    SET NEW.image_url = '/Images/default.jpg';
  END IF;
END;
//
DELIMITER ;


DELIMITER //
CREATE PROCEDURE AcceptProposal(IN proposal_id INT, IN p_project_id INT)
BEGIN
    DECLARE current_status VARCHAR(255) ;

    SELECT status INTO current_status FROM Projects WHERE id = p_project_id;
    
    IF current_status = 'Open' THEN
        UPDATE Proposals SET status = 'Accepted' WHERE id = proposal_id;
        UPDATE Proposals SET status = 'Rejected' WHERE project_id = p_project_id AND id != proposal_id;
        UPDATE Projects SET status = 'In Progress' WHERE id = p_project_id;
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'This project already has an accepted proposal or is not open';
    END IF;
END;
//
DELIMITER ;


CREATE TABLE Payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT,
    payer_id INT, 
    amount DECIMAL(10, 2),
    status ENUM('Held', 'Released', 'Refunded'), 
    FOREIGN KEY (project_id) REFERENCES Projects(id),
    FOREIGN KEY (payer_id) REFERENCES Students(id)
);

DELIMITER //

CREATE FUNCTION CalculateAveragePrice(devID INT) RETURNS DECIMAL(10, 2)
BEGIN
    DECLARE totalCost DECIMAL(10, 2);
    DECLARE projectCount INT;

    SELECT SUM(Estimated_cost) INTO totalCost 
    FROM Proposals
    WHERE developer_id = devID AND status = 'Accepted';

    SELECT Completed_projects_Count INTO projectCount
    FROM Developers
    WHERE id = devID;

    IF projectCount > 0 THEN
        RETURN totalCost / projectCount;
    ELSE
        RETURN 0;
    END IF;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE ReleaseFundsAndIncrementCount(IN projectID INT)
BEGIN
    DECLARE devID INT;
    DECLARE projStatus VARCHAR(255);
    DECLARE avgPrice DECIMAL(10,2);
    SELECT Proposals.developer_id, Projects.status INTO devID, projStatus
    FROM Projects 
    JOIN Proposals ON Projects.id = Proposals.project_id 
    WHERE Projects.id = projectID AND Proposals.status = 'Accepted';

    IF projStatus = 'In Progress' AND devID IS NOT NULL THEN
        UPDATE Projects SET status = 'Completed' WHERE id = projectID;
        
        UPDATE Developers SET Completed_projects_Count = Completed_projects_Count + 1 WHERE id = devID;

        SET avgPrice = CalculateAveragePrice(devID);

        UPDATE Developers SET Avg_Prive_perhour = avgPrice WHERE id = devID;
    END IF;
END //

DELIMITER ;


DELIMITER //

CREATE TRIGGER after_payment_update
AFTER UPDATE ON Payments
FOR EACH ROW
BEGIN
    IF NEW.status = 'Released' AND OLD.status != 'Released' THEN
        DECLARE totalEarned DECIMAL(10,2);
        DECLARE devID INT;
        SELECT Proposals.developer_id INTO devID
        FROM Payments
        JOIN Projects ON Payments.project_id = Projects.id
        JOIN Proposals ON Projects.id = Proposals.project_id
        WHERE Payments.id = NEW.id AND Proposals.status = 'Accepted';
        SELECT SUM(amount) INTO totalEarned 
        FROM Payments
        JOIN Projects ON Payments.project_id = Projects.id
        JOIN Proposals ON Projects.id = Proposals.project_id
        WHERE Proposals.developer_id = devID AND Payments.status = 'Released';
        UPDATE Developers 
        SET total_earned = totalEarned 
        WHERE id = devID;
    END IF;
END //

DELIMITER ;
