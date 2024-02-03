const pool = require('./app'); 

const createTables = `
    CREATE TABLE Institution (
        InstitutionID INT AUTO_INCREMENT PRIMARY KEY,
        InstitutionName VARCHAR(255) NOT NULL
    );
    CREATE TABLE Category (
        CategoryID INT AUTO_INCREMENT PRIMARY KEY,
        CategoryName VARCHAR(255) NOT NULL
    );
    CREATE TABLE Publisher (
        PublisherID INT AUTO_INCREMENT PRIMARY KEY,
        PublisherName VARCHAR(255) NOT NULL
    );
    CREATE TABLE Research (
        ResearchID INT AUTO_INCREMENT PRIMARY KEY,
        ResearchName VARCHAR(255) NOT NULL,
        ResearchPDF VARCHAR(255) NOT NULL,
        PublicationDate DATE,
        PublisherID INT,
        InstitutionID INT,
        CategoryID INT,
        FOREIGN KEY (PublisherID) REFERENCES Publisher(PublisherID),
        FOREIGN KEY (InstitutionID) REFERENCES Institution(InstitutionID),
        FOREIGN KEY (CategoryID) REFERENCES Category(CategoryID)
    );
    CREATE TABLE Researcher (
        ResearcherID INT AUTO_INCREMENT PRIMARY KEY,
        ResearcherName VARCHAR(255) NOT NULL,
        Password VARCHAR(255) NOT NULL,
        Email VARCHAR(255) NOT NULL,
        InstitutionID INT,
        FOREIGN KEY (InstitutionID) REFERENCES Institution(InstitutionID)
    );
    CREATE TABLE ResearcherResearch (
        ResearcherResearchID INT AUTO_INCREMENT PRIMARY KEY,
        ResearchID INT,
        ResearcherID INT,
        FOREIGN KEY (ResearchID) REFERENCES Research(ResearchID),
        FOREIGN KEY (ResearcherID) REFERENCES Researcher(ResearcherID)
    );
`;

pool.query(createTables, (err, results) => {
    if (err) {
        console.error('Error creating tables:', err);
    } else {
        console.log('Tables created successfully');
    }
});
