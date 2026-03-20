from typing import List, Dict, Set
import logging

logger = logging.getLogger(__name__)

class ResumeFeedbackGenerator:
    """
    Generates actionable feedback for resumes based on skill gaps.
    Suggests improvements, projects, and keywords to add.
    """
    
    # Mapping of skill categories to project suggestions
    CATEGORY_PROJECTS = {
        'Programming Language': [
            "Build a command-line tool to automate a repetitive task.",
            "Implement a common algorithm or data structure from scratch.",
            "Create a small script to scrape data from a website."
        ],
        'Frontend Framework': [
            "Develop a responsive personal portfolio website.",
            "Build a task management dashboard with real-time updates.",
            "Create a weather app fetching data from a public API."
        ],
        'Web Framework': [
            "Build a RESTful API with CRUD operations and authentication.",
            "Develop a simple blogging platform with search functionality.",
            "Create a URL shortener service with analytics."
        ],
        'Database Language': [
            "Design a relational database schema for an e-commerce platform.",
            "Write a series of complex SQL queries to analyze a public dataset.",
            "Implement a database migration script for a sample app."
        ],
        'Relational Database': [
            "Optimize query performance for a large dataset using indexing.",
            "Set up a database with proper foreign key constraints and triggers.",
            "Configure a database backup and recovery strategy."
        ],
        'NoSQL Database': [
            "Build a real-time chat application using a document-store.",
            "Implement a caching layer for a web application.",
            "Design a scalable schema for a social media feed."
        ],
        'ML/AI': [
            "Train a sentiment analysis model using a public dataset.",
            "Build an image classifier using a deep learning framework.",
            "Implement a recommendation engine for movies or products."
        ],
        'Containerization': [
            "Dockerize a multi-service web application (frontend + backend).",
            "Set up a local development environment using Docker Compose.",
            "Optimize a Docker image for production deployment."
        ],
        'Orchestration': [
            "Deploy a microservices application to a local Kubernetes cluster.",
            "Configure auto-scaling and self-healing for a web service.",
            "Set up an Ingress controller for routing traffic."
        ],
        'DevOps': [
            "Build a CI/CD pipeline that runs tests and deploys on every push.",
            "Automate infrastructure provisioning using an IaC tool.",
            "Set up centralized logging and monitoring for a cluster."
        ],
        'Cloud Platform': [
            "Deploy a static website to a cloud storage bucket.",
            "Set up a serverless function to handle API requests.",
            "Configure a virtual private cloud (VPC) with secure networking."
        ],
        'Soft Skill': [
            "Lead a small project or a study group.",
            "Write a technical blog post or documentation for a project.",
            "Volunteer to give a presentation or a code review."
        ]
    }

    def __init__(self):
        pass

    def generate_feedback(self, gap_analysis: Dict, resume_text: str) -> List[Dict]:
        """
        Generate actionable feedback based on gap analysis.
        """
        feedback_items = []
        
        # Address partial skills (skills that need improvement)
        for skill in gap_analysis.get('partial_skills', []):
            feedback_items.append(self._create_feedback_item(
                skill, 
                "Improvement Needed", 
                f"You have {skill['resume_level']} level, but the job requires {skill['required_level']}. Focus on advanced concepts and production-grade implementation."
            ))
            
        # Address missing skills (critical gaps)
        for skill in gap_analysis.get('missing_skills', []):
            feedback_items.append(self._create_feedback_item(
                skill, 
                "Critical Gap", 
                f"This skill is missing from your resume but is highly required for this role. You should learn the fundamentals and build a foundational project."
            ))

        # Sort by impact (missing skills first, then partial)
        feedback_items.sort(key=lambda x: x['type'] == "Critical Gap", reverse=True)
        
        return feedback_items

    def _create_feedback_item(self, skill: Dict, feedback_type: str, suggestion: str) -> Dict:
        """Helper to create a structured feedback item."""
        category = skill.get('category', 'General')
        skill_name = skill['name']
        
        # Get suggested projects based on category
        suggested_projects = self.CATEGORY_PROJECTS.get(category, [
            f"Build a small project that demonstrates your use of {skill_name}.",
            f"Implement a real-world use case for {skill_name} in your current portfolio.",
            f"Contribute to an open-source project that uses {skill_name}."
        ])
        
        return {
            'skill_name': skill_name,
            'category': category,
            'type': feedback_type,
            'suggestion': suggestion,
            'suggested_projects': suggested_projects,
            'keywords_to_add': [skill_name, f"{skill_name} expert", f"{skill_name} development", f"{category} optimization"]
        }
