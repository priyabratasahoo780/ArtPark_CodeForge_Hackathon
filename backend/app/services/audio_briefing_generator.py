import os
from gtts import gTTS
import json

class AudioBriefingGenerator:
    def __init__(self, translations_path: str):
        self.output_dir = "static/audio/briefings"
        os.makedirs(self.output_dir, exist_ok=True)
        with open(translations_path, "r", encoding="utf-8") as f:
            self.translations = json.load(f)

    def generate_briefing(self, user_name: str, mastered_count: int, total_skills: int, next_milestone: str, lang: str = "en") -> str:
        t = self.translations.get(lang, self.translations["en"])
        
        # Build script
        script = f"Hello {user_name}. "
        if mastered_count == 0:
            script += f"Welcome to your onboarding at CodeForge. You have {total_skills} skills to master. "
        else:
            progress = int((mastered_count / total_skills) * 100)
            script += f"Great job! You have already mastered {mastered_count} out of {total_skills} skills. That is {progress} percent progress. "
        
        script += f"Your next objective is {next_milestone}. Keep pushing forward!"
        
        # Save audio
        filename = f"briefing_{user_name}_{lang}.mp3"
        filepath = os.path.join(self.output_dir, filename)
        
        tts = gTTS(text=script, lang=lang)
        tts.save(filepath)
        
        return f"/static/audio/briefings/{filename}"
