# EduQuiz - Remote Exam Platform

![logo](https://github.com/user-attachments/assets/88b1010b-b45c-4b61-adc2-17091a1e0494)


## Description

EduQuiz is a MERN-stack application designed to simplify remote MCQ-based exams. Teachers can create and grade exams effortlessly, and students can participate in exams from any location. This project was inspired by the shift to remote learning during the lockdown and was developed as part of an undergraduate course.

## Features

### For Teachers
- **Exam Management**: Easily create, edit, and delete exams with details like title, description, time window, and duration.
- **Question Management**: Add, edit, or delete questions, set points, max attempts, and multiple correct answers.
- **Markdown Support**: Format exam descriptions and questions with Markdown.
- **Student Submissions**: Access and review student submissions with automatic grading and answer details.
- **Grade Exporting**: Download gradesheets as CSV or HTML files.
- **Share Exams**: Distribute exam links to students effortlessly.

### For Students
- **Exam Access**: View exam status (e.g., "Too early", "Too late") and available duration.
- **Participation**: Join exams with a single click and view the countdown timer.
- **Auto-submit on Expiry**: Responses auto-submit when time ends.
- **Results**: Check detailed results, including correct answers and scores, once published by the teacher.

![6336cd36-bb2e-4f0d-b2e3-af976b57a5d6](https://github.com/user-attachments/assets/50c8766b-fda2-4374-8131-9ff9c3b08590)
![ac845d2e-0481-4ad2-b3fe-844fe7459768](https://github.com/user-attachments/assets/680922dd-df01-4039-b590-98dc93450f2d)
![ac845d2e-0481-4ad2-b3fe-844fe7459768](https://github.com/user-attachments/assets/e390e125-fb00-441d-83d1-e20083ea9141)


## Installation and Starting Guide

To get started with EduQuiz on your local machine, an all-in-one setup script is available on our [EduQuiz Demo Website](https://your-demo-website.com). This script handles everything from cloning the repository to running the application.

### Running the Setup Script

1. Download the installation script from the website.
2. Grant execution permissions:
   ```bash
   chmod +x setup.sh
   ```
3. Run The Script
   ```bash
   ./setup.sh
   ```
The setup script will:

Clone the repository
Install necessary dependencies
Set up environment variables and permissions
Launch the application
Once complete, the application will be accessible on your specified port.(By default 8080)
