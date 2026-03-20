from typing import List, Dict, Set
import json
from pathlib import Path
import logging

logger = logging.getLogger(__name__)


class LearningPathGenerator:
    """
    Generates adaptive learning paths based on skill gaps.
    Uses dependency graphs and priorities to create optimal learning sequences.
    """
    
    # Estimated learning time per skill (in hours)
    LEARNING_TIME_ESTIMATES = {
        'Beginner': {'short': 2, 'medium': 5, 'long': 10},
        'Intermediate': {'short': 5, 'medium': 15, 'long': 30},
        'Advanced': {'short': 10, 'medium': 30, 'long': 60}
    }
    
    # Cost multipliers for different skill categories
    CATEGORY_MULTIPLIERS = {
        'Programming Language': 1.2,
        'Frontend Framework': 1.0,
        'Backend Framework': 1.1,
        'Database Language': 1.3,
        'ML Library': 1.5,
        'Cloud Platform': 1.3,
        'Soft Skill': 0.5
    }
    
    def __init__(self, taxonomy_path: str = None):
        """Initialize learning path generator with skill taxonomy."""
        if taxonomy_path is None:
            current_dir = Path(__file__).parent.parent / "datasets" / "skills_taxonomy.json"
        else:
            current_dir = Path(taxonomy_path)
        
        with open(current_dir, 'r') as f:
            self.taxonomy = json.load(f)
        
        self.dependencies = self._build_dependency_graph()
    
    def _build_dependency_graph(self) -> Dict[str, Set[str]]:
        """Build graph of skill prerequisites."""
        graph = {}
        
        for category, skills in self.taxonomy['skills'].items():
            for skill_name, skill_data in skills.items():
                prerequisites = skill_data.get('prerequisites', [])
                graph[skill_name.lower()] = {p.lower() for p in prerequisites}
        
        return graph
    
    def generate_learning_path(self, gaps_to_address: List[Dict], resume_skills: List[Dict]) -> Dict:
        """
        Generate comprehensive learning path for addressing skill gaps.
        
        Args:
            gaps_to_address: Skills that need to be learned (from gap analysis)
            resume_skills: Current skills from resume
            
        Returns:
            Structured learning path with modules, timeline, and reasoning
        """
        # Build current skills set
        current_skills = {skill['name'].lower() for skill in resume_skills}
        
        # Get list of prerequisite skills to include
        all_prereqs = set()
        for gap in gaps_to_address:
            prereqs = gap.get('prerequisites', [])
            for prereq in prereqs:
                if prereq.lower() not in current_skills:
                    all_prereqs.add(prereq.lower())
        
        # Combine gaps and prerequisites
        skills_to_learn = gaps_to_address + [
            {
                'name': self._get_skill_name(p),
                'category': 'Prerequisite',
                'required_level': 'Intermediate',
                'prerequisites': [],
                'gap_score': 2,
                'reason': 'Prerequisite for other skills'
            }
            for p in all_prereqs
        ]
        
        # Build learning sequence using topological sort
        sequence = self._topological_sort_skills(skills_to_learn, current_skills)
        
        # Create learning modules
        modules = self._create_learning_modules(sequence, current_skills)
        
        # Calculate timeline
        timeline = self._calculate_timeline(modules)
        
        return {
            'modules': modules,
            'timeline': timeline,
            'total_duration_hours': timeline['total_hours'],
            'total_duration_days': timeline['estimated_days'],
            'learning_sequence': sequence,
            'strategies': self._generate_learning_strategies(modules),
            'milestones': self._create_milestones(modules),
            'reasoning': {
                'approach': 'Dependency-based adaptive learning path',
                'optimization': 'Prerequisites first, then critical gaps, then nice-to-haves',
                'personalization': 'Based on your current skill level and job requirements'
            }
        }
    
    def _topological_sort_skills(self, skills: List[Dict], current_skills: Set[str]) -> List[Dict]:
        """
        Sort skills by dependencies using topological sort.
        Skills with no unmet dependencies come first.
        """
        skills_to_learn = {s['name'].lower(): s for s in skills}
        sorted_path = []
        visited = set()
        visiting = set()
        
        def visit(skill_name: str, path: List):
            """DFS visit for topological sort."""
            skill_name_lower = skill_name.lower()
            
            if skill_name_lower in visited:
                return True
            
            if skill_name_lower in visiting:
                return False  # Cycle detected
            
            visiting.add(skill_name_lower)
            
            # Visit dependencies first
            if skill_name_lower in self.dependencies:
                for dep in self.dependencies[skill_name_lower]:
                    if dep not in current_skills and dep in skills_to_learn:
                        if not visit(dep, path):
                            return False
            
            visiting.remove(skill_name_lower)
            visited.add(skill_name_lower)
            
            if skill_name_lower in skills_to_learn:
                path.append(skills_to_learn[skill_name_lower])
            
            return True
        
        # Process skills by priority (gap_score descending)
        sorted_skills = sorted(skills, key=lambda x: -x.get('gap_score', 0))
        
        for skill in sorted_skills:
            visit(skill['name'].lower(), sorted_path)
        
        return sorted_path
    
    def _create_learning_modules(self, sequence: List[Dict], current_skills: Set[str]) -> List[Dict]:
        """Convert skill sequence into structured learning modules."""
        modules = []
        
        for i, skill in enumerate(sequence):
            # Estimate learning difficulty and time
            required_level = skill.get('required_level', 'Intermediate')
            category = skill.get('category', 'Other')
            
            # Determine learning difficulty
            difficulty = self._estimate_difficulty(
                skill, current_skills, required_level
            )
            
            # Estimate time
            time_estimate = self._estimate_learning_time(
                difficulty, category, required_level
            )
            
            module = {
                'id': f"module_{i+1}",
                'order': i + 1,
                'skill_name': skill['name'],
                'category': skill['category'],
                'level': required_level,
                'difficulty': difficulty,
                'time_estimate_hours': time_estimate,
                'prerequisites': skill.get('prerequisites', []),
                'gap_score': skill.get('gap_score', 0),
                'reason': skill.get('reason', 'Building required skill'),
                'resources': self._suggest_resources(skill['name'], required_level),
                'learning_objectives': self._generate_learning_objectives(skill),
                'assessment_criteria': self._generate_assessment_criteria(skill),
                'status': 'pending'
            }
            
            modules.append(module)
        
        return modules
    
    def _estimate_difficulty(self, skill: Dict, current_skills: Set[str], level: str) -> str:
        """Estimate learning difficulty based on prerequisites and level."""
        prereqs = skill.get('prerequisites', [])
        met_prereqs = len([p for p in prereqs if p.lower() in current_skills])
        
        if met_prereqs < len(prereqs) * 0.5 and level == 'Advanced':
            return 'Hard'
        elif met_prereqs < len(prereqs) or level == 'Advanced':
            return 'Medium'
        else:
            return 'Easy'
    
    def _estimate_learning_time(self, difficulty: str, category: str, level: str) -> int:
        """Estimate learning time in hours."""
        difficulty_map = {
            'Easy': 'short',
            'Medium': 'medium',
            'Hard': 'long'
        }
        
        base_estimate = self.LEARNING_TIME_ESTIMATES[level][difficulty_map[difficulty]]
        multiplier = self.CATEGORY_MULTIPLIERS.get(category, 1.0)
        
        return round(base_estimate * multiplier)
    
    def _suggest_resources(self, skill: str, level: str) -> List[Dict]:
        """Suggest learning resources for a skill."""
        resources = {
            'Python': [
                {'type': 'Course', 'name': 'Python for Everybody', 'platform': 'Coursera', 'duration': '4 weeks'},
                {'type': 'Documentation', 'name': 'Python Official Docs', 'platform': 'python.org', 'duration': 'Self-paced'},
                {'type': 'Project', 'name': 'Build Python CLI Tool', 'platform': 'Personal', 'duration': '1 week'}
            ],
            'JavaScript': [
                {'type': 'Course', 'name': 'Modern JavaScript Basics', 'platform': 'Udemy', 'duration': '20 hours'},
                {'type': 'Tutorial', 'name': 'JavaScript.info', 'platform': 'Online', 'duration': 'Self-paced'},
                {'type': 'Project', 'name': 'Build Interactive Webpage', 'platform': 'Personal', 'duration': '3 days'}
            ],
            'React': [
                {'type': 'Course', 'name': 'React Complete Guide', 'platform': 'Udemy', 'duration': '40 hours'},
                {'type': 'Documentation', 'name': 'React Official Docs', 'platform': 'react.dev', 'duration': 'Self-paced'},
                {'type': 'Project', 'name': 'Build Todo App with React', 'platform': 'Personal', 'duration': '1 week'}
            ],
            'Machine Learning': [
                {'type': 'Course', 'name': 'ML Specialization', 'platform': 'Coursera', 'duration': '3 months'},
                {'type': 'Textbook', 'name': 'Hands-On ML with sklearn and TensorFlow', 'platform': 'OReilly', 'duration': '8 weeks'},
                {'type': 'Project', 'name': 'Build Predictive Model', 'platform': 'Kaggle', 'duration': '2 weeks'}
            ]
        }
        
        return resources.get(skill, [
            {'type': 'Course', 'name': f'{skill} Fundamentals', 'platform': 'Udemy/Coursera', 'duration': 'Varies'},
            {'type': 'Documentation', 'name': f'{skill} Official Docs', 'platform': 'Official', 'duration': 'Self-paced'},
            {'type': 'Project', 'name': f'Build with {skill}', 'platform': 'Personal', 'duration': 'Varies'}
        ])
    
    def _generate_learning_objectives(self, skill: Dict) -> List[str]:
        """Generate learning objectives for a skill."""
        skill_name = skill['name']
        level = skill.get('required_level', 'Intermediate')
        
        objectives = {
            'Python': [
                'Understand Python syntax and basic data types',
                'Work with functions, loops, and conditionals',
                'Handle file I/O and data processing',
                'Write clean, documented Python code'
            ],
            'JavaScript': [
                'Master JavaScript ES6+ syntax',
                'Understand DOM manipulation and events',
                'Work with async operations and promises',
                'Debug JavaScript in browser'
            ],
            'React': [
                'Build component-based UIs',
                'Manage state with hooks',
                'Handle props and component lifecycle',
                'Optimize React performance'
            ]
        }
        
        return objectives.get(skill_name, [
            f'Understand {skill_name} fundamentals',
            f'Apply {skill_name} in practical projects',
            f'Master {skill_name} at {level} level',
            f'Build real-world solutions with {skill_name}'
        ])
    
    def _generate_assessment_criteria(self, skill: Dict) -> List[str]:
        """Generate assessment criteria for skill mastery."""
        level = skill.get('required_level', 'Intermediate')
        
        if level == 'Beginner':
            return [
                'Can explain core concepts',
                'Can write basic code/solve simple problems',
                'Understand documentation',
                'Pass introductory quizzes'
            ]
        elif level == 'Intermediate':
            return [
                'Can build small projects independently',
                'Can debug issues and troubleshoot',
                'Can read and understand others\' code',
                'Pass intermediate assessments',
                'Understand best practices'
            ]
        else:  # Advanced
            return [
                'Can architect complex solutions',
                'Can mentor others',
                'Can optimize for performance',
                'Can handle edge cases',
                'Pass advanced certification'
            ]
    
    def _calculate_timeline(self, modules: List[Dict]) -> Dict:
        """Calculate overall timeline for learning path."""
        total_hours = sum(m['time_estimate_hours'] for m in modules)
        
        # Assume ~5 hours learning per week (25 hours/month)
        weeks_needed = round(total_hours / 5)
        days_needed = round(total_hours / 2)  # Assume 2 hours/day
        
        return {
            'total_hours': total_hours,
            'estimated_weeks': weeks_needed,
            'estimated_days': days_needed,
            'estimated_months': round(weeks_needed / 4),
            'pace': 'Self-paced',
            'recommendation': f'Complete in approximately {weeks_needed} weeks at ~5 hours/week'
        }
    
    def _generate_learning_strategies(self, modules: List[Dict]) -> List[Dict]:
        """Generate learning strategies based on module composition."""
        strategies = [
            {
                'name': 'Learn by Doing',
                'description': 'Build projects while learning each skill',
                'implementation': 'Complete hands-on projects for each module'
            },
            {
                'name': 'Structured Path',
                'description': 'Follow prerequisites before advanced topics',
                'implementation': 'Complete modules in recommended order'
            },
            {
                'name': 'Spaced Repetition',
                'description': 'Review concepts regularly to retention',
                'implementation': 'Review completed modules weekly'
            },
            {
                'name': 'Active Recall',
                'description': 'Test yourself on key concepts',
                'implementation': 'Complete assessments after each module'
            }
        ]
        
        return strategies
    
    def _create_milestones(self, modules: List[Dict]) -> List[Dict]:
        """Create learning milestones."""
        milestones = []
        cumulative_hours = 0
        
        for i, module in enumerate(modules):
            cumulative_hours += module['time_estimate_hours']
            
            if cumulative_hours % 20 < module['time_estimate_hours'] or i == len(modules) - 1:
                milestones.append({
                    'milestone_number': len(milestones) + 1,
                    'description': f"Completed {i+1} modules - {cumulative_hours} hours of learning",
                    'modules_completed': i + 1,
                    'total_hours_invested': cumulative_hours,
                    'checkpoint': f"Review and consolidate knowledge up to {module['skill_name']}"
                })
        
        return milestones
    
    def _get_skill_name(self, skill_lower: str) -> str:
        """Get proper skill name from lowercase."""
        for category, skills in self.taxonomy['skills'].items():
            for skill_name in skills.keys():
                if skill_name.lower() == skill_lower:
                    return skill_name
        
        return skill_lower.title()
