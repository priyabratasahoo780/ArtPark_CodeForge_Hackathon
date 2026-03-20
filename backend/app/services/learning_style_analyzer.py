from typing import Dict

class LearningStyleAnalyzer:
    """
    Analyzes user interaction data to detect their preferred learning style.
    Styles: Visual (videos/courses), Reading (docs/articles), Practical (projects/interactive).
    """
    def detect_style(self, interactions: Dict[str, int]) -> str:
        if not interactions:
            return "Visual"
            
        scores = {
            "Visual": interactions.get("video", 0) + interactions.get("course", 0) + interactions.get("tutorial", 0),
            "Reading": interactions.get("article", 0) + interactions.get("documentation", 0) + interactions.get("textbook", 0),
            "Practical": interactions.get("interactive", 0) + interactions.get("project", 0) + interactions.get("assessment", 0)
        }
        
        # Find style with max score
        max_style = max(scores, key=scores.get)
        
        # Default to Visual if no interactions
        if scores[max_style] == 0:
            return "Visual"
            
        return max_style
