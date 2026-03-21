import os
import logging

try:
    import google.generativeai as genai
    HAS_GENAI = True
except ImportError:
    HAS_GENAI = False

logger = logging.getLogger(__name__)

class LLMService:
    def __init__(self):
        self.api_key = os.environ.get("GEMINI_API_KEY")
        self.is_configured = False
        if self.api_key and HAS_GENAI:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('models/gemini-2.0-flash')
            self.is_configured = True
            logger.info("LLMService configured with Gemini API.")
        else:
            if not self.api_key:
                logger.warning("GEMINI_API_KEY not found in environment.")
            if not HAS_GENAI:
                logger.warning("google-generativeai module not installed.")
            logger.warning("LLMService is running in MOCK mode.")

    def generate(self, prompt: str, fallback_response: str) -> str:
        """
        Generates text using the Gemini LLM. Validates state and falls back gracefully.
        """
        if not self.is_configured:
            return fallback_response
        
        try:
            response = self.model.generate_content(prompt)
            # Safely handle potentially blocked responses
            if response.text:
                return response.text
            return fallback_response
        except Exception as e:
            logger.error(f"LLM Generation Error: {str(e)}")
            return fallback_response

llm_service = LLMService()
