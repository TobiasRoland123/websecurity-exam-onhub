# Exam Project

Build a development environment for a software project of your choice that covers:

- **Version Control System** (Git on GitLab)
- **Software Quality Assurance**
- **Containerization** (Docker)
- **Continuous Integration** (GitLab CI)

## Project Requirements

The project must include at least:

- A **web server** (e.g., nginx)
- An **application server**
- A **database server**

These services must be part of your dockerized system. You cannot rely on a cloud-hosted database system.

The software project should ideally be a development project you are currently working on. If that is not possible, you can use the Twitter clone from last semester. Make sure you use a database server rather than SQLite.

---

### Version Control System

- Document your **Git strategy**.
- Consider how your Git strategy aligns with continuous integration.

### Software Quality Assurance

Your development environment must be designed to improve software quality. Implement the following:

- **Testing**
- **Linting**
- **Security auditing** of dependencies
- **Code checking**
- **Code coverage**

### Containerization

- Containerize your project.
- You must be able to start your whole project with just **one command**.
- (Optional) It's a good idea if you can **scale** your application service.

### Continuous Integration

Implement a continuous integration pipeline on GitLab:

- **Static testing**
- **Runtime testing** (requests through the web server involving the database)
- **Build any custom Docker images**
- **Store Docker images in the GitLab container registry**

---

## Other Considerations

Make sure:

- Your **decision process** is clear and documented.
- You **evaluate** your choices and compare them to alternatives.
- You **reflect** on your choices; discuss what you've learned and what you might do differently next time.
- Discuss the **value** the development environment adds to your software project.

---

## General Requirements

The project must meet the requirements outlined in your study program's curriculum.

Please consult **Wiseflow** as per usual regarding hand-in dates and other details.
