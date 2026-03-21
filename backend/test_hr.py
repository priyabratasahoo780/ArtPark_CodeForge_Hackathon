import asyncio
from app.services.skill_extractor import SkillExtractor
from app.services.role_matcher import RoleMatcher
from app.services.gap_analyzer import SkillGapAnalyzer
from app.services.time_analytics import TimeAnalytics
from app.services.learning_path_generator import LearningPathGenerator

async def test():
    try:
        jd = 'need react dev'
        resume = 'react resume'
        skill_extractor = SkillExtractor()
        role_matcher = RoleMatcher()
        gap_analyzer = SkillGapAnalyzer()
        time_analytics = TimeAnalytics()
        learning_path_generator = LearningPathGenerator()
        
        s1 = skill_extractor.extract_from_resume(resume).get("skills", [])
        s2 = skill_extractor.extract_from_job_description(jd).get("required_skills", [])
        r = role_matcher.match_role(jd)
        gaps = gap_analyzer.analyze_gaps(s1, s2, r.get('role', 'General'))
        path = learning_path_generator.generate_learning_path(gaps['missing_skills'] + gaps['partial_skills'], s1)
        ts = time_analytics.calculate(gaps, path)
        print('SUCCESS')
    except Exception as e:
        import traceback
        traceback.print_exc()

asyncio.run(test())
