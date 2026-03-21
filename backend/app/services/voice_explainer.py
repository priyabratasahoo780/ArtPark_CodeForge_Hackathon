"""
Voice Explainer Service.

Converts reasoning trace / analysis summary into TTS audio using gTTS.
Returns base64-encoded MP3 for fast delivery over HTTP with no temp-file I/O.

Usage:
    explainer = VoiceExplainer()
    result = explainer.explain(reasoning_trace, gap_stats)
    # result['audio_b64']   → base64 MP3 to embed in <audio> src
    # result['script']      → plain text that was synthesized (always present)
"""

import io
import base64
import logging
import json
from pathlib import Path
from typing import Dict, Optional

logger = logging.getLogger(__name__)


def _try_import_gtts():
    try:
        from gtts import gTTS
        return gTTS
    except ImportError:
        return None


class VoiceExplainer:
    """
    Generates TTS audio from an onboarding analysis reasoning trace.
    Falls back gracefully when gTTS is unavailable.
    """

    def __init__(self, lang: str = "en", slow: bool = False):
        self.lang = lang
        self.slow = slow
        self._gTTS = _try_import_gtts()
        
        # Load translations
        try:
            translations_path = Path(__file__).parent.parent / "datasets" / "translations.json"
            with open(translations_path, "r", encoding="utf-8") as f:
                self.translations = json.load(f)
        except Exception as e:
            logger.error(f"Failed to load translations: {e}")
            self.translations = {}

        if self._gTTS is None:
            logger.warning(
                "gTTS not installed. VoiceExplainer will return text-only."
                " Install with: pip install gTTS"
            )

    # ------------------------------------------------------------------ #
    # Public API                                                           #
    # ------------------------------------------------------------------ #

    def explain(
        self,
        reasoning_trace: Dict,
        gap_stats: Optional[Dict] = None,
        custom_text: Optional[str] = None,
        role: str = "USER"
    ) -> Dict:
        """
        Generate a voice explanation for the analysis.
        """
        script = custom_text if custom_text else self._build_script(reasoning_trace, gap_stats, role)
        audio_b64 = ""
        audio_mime = ""

        if self._gTTS is not None:
            try:
                # Use the instance lang (or fallback to English for synthesis if lang not supported)
                tts = self._gTTS(text=script, lang=self.lang, slow=self.slow)
                buf = io.BytesIO()
                tts.write_to_fp(buf)
                buf.seek(0)
                audio_b64 = base64.b64encode(buf.read()).decode("utf-8")
                audio_mime = "audio/mpeg"
                logger.info(f"VoiceExplainer: generated {len(audio_b64)} chars of base64 audio")
            except Exception as e:
                logger.error(f"gTTS synthesis failed: {e}")

        return {
            "script": script,
            "audio_b64": audio_b64,
            "audio_mime": audio_mime,
            "tts_available": self._gTTS is not None and bool(audio_b64),
        }

    def explain_skill(self, skill_name: str, confidence: float, signals: list) -> Dict:
        """
        Generate a short voice explanation for a single skill confidence score.
        """
        signals_text = (
            ", ".join(signals[:3]) if signals else "standard extraction"
        )
        # TODO: Add translations for this if needed
        script = (
            f"Skill: {skill_name}. "
            f"Confidence score: {round(confidence * 100)} percent. "
            f"Evidence: {signals_text}."
        )
        return self.explain(reasoning_trace={}, custom_text=script)

    # ------------------------------------------------------------------ #
    # Private — script generation                                          #
    # ------------------------------------------------------------------ #

    def _get_txt(self, key: str, **kwargs) -> str:
        """Helper to get translated text with fallback to English."""
        # Get language dictionary, fallback to 'en'
        lang_dict = self.translations.get(self.lang, self.translations.get("en", {}))
        # Get key, fallback to 'en' version if not in current lang
        text = lang_dict.get(key, self.translations.get("en", {}).get(key, ""))
        try:
            return text.format(**kwargs)
        except Exception:
            return text

    def _build_script(
        self, reasoning_trace: Dict, gap_stats: Optional[Dict], role: str = "USER"
    ) -> str:
        """Build a natural-sounding spoken explanation from the reasoning trace."""
        parts = []

        # Opening
        parts.append(self._get_txt("opening"))

        # Gap stats summary
        if gap_stats:
            known = gap_stats.get("known_count", 0)
            total = gap_stats.get("total_required_skills", 0)
            coverage = gap_stats.get("coverage_percentage", 0)
            readiness = gap_stats.get("readiness_score", 0)
            missing = gap_stats.get("missing_count", 0)
            partial = gap_stats.get("partial_count", 0)

            parts.append(self._get_txt("gap_summary", known=known, total=total, coverage=coverage, readiness=readiness))

            if missing > 0 or partial > 0:
                if role == "HR":
                    parts.append(self._get_txt("gaps_identified_hr", missing=missing))
                else:
                    parts.append(self._get_txt("gaps_identified_user", missing=missing, partial=partial))

        # Role analysis
        role_info = reasoning_trace.get("role_analysis", {})
        if role_info:
            role_name = role_info.get("matched_role", "specified")
            conf = round(role_info.get("confidence", 0) * 100)
            mode = role_info.get("mode", "")
            added = role_info.get("skills_added_from_role", [])
            
            if role == "HR":
                parts.append(self._get_txt("role_match_hr", role_name=role_name, confidence=conf))
            else:
                parts.append(self._get_txt("role_match_user", role_name=role_name, confidence=conf, mode=mode))
            
            if added and role == "USER":
                parts.append(self._get_txt("role_skills_added", skills=", ".join(added[:5])))

        # Steps
        steps = reasoning_trace.get("steps", [])
        if steps:
            parts.append(self._get_txt("steps_intro"))
            for step in steps:
                clean = step.lstrip("0123456789. ")
                parts.append(clean + ".")

        # Key insights
        insights = reasoning_trace.get("key_insights", [])
        if insights:
            parts.append(self._get_txt("insights_intro"))
            for insight in insights[:4]:
                parts.append(insight + ".")

        # Recommendations
        recs = reasoning_trace.get("recommendations", [])
        if recs:
            parts.append(self._get_txt("recommendations_intro"))
            for rec in recs[:3]:
                parts.append(rec + ".")

        # Closing
        if role == "HR":
            parts.append(self._get_txt("closing_hr"))
        else:
            parts.append(self._get_txt("closing_user"))

        return " ".join(parts)
