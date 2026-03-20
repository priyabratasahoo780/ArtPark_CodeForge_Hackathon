import asyncio
from app.services.skill_extractor import skill_extractor
from app.services.role_matcher import role_matcher
from app.services.gap_analyzer import gap_analyzer
from app.services.time_analytics import time_analytics
from app.services.learning_path_generator import learning_path_generator

async def test():
    try:
        jd = 'need react dev'
        resume = 'react resume'
        s1 = skill_extractor.extract_skills(resume)
        s2 = skill_extractor.extract_skills(jd)
        r = role_matcher.match_role(jd)
        gaps = gap_analyzer.analyze_gaps(s1, s2, r.get('role', 'General'))
        path = learning_path_generator.generate_path(gaps)
        ts = time_analytics.calculate_time_saved(gaps, path)
        print('SUCCESS')
    except Exception as e:
        import traceback
        traceback.print_exc()

asyncio.run(test())
