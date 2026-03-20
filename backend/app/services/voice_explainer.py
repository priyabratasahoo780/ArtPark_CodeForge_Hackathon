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

        Args:
            reasoning_trace: The reasoning_trace dict from /onboarding/complete.
            gap_stats:       Optional gap_analysis['statistics'] for numeric summary.
            custom_text:     If provided, synthesize this text directly instead.

        Returns:
            {
                "script":     str,    # The spoken text (always present)
                "audio_b64":  str,    # Base64-encoded MP3 (empty if gTTS unavailable)
                "audio_mime": str,    # "audio/mpeg" or ""
                "tts_available": bool
            }
        """
        script = custom_text if custom_text else self._build_script(reasoning_trace, gap_stats, role)
        audio_b64 = ""
        audio_mime = ""

        if self._gTTS is not None:
            try:
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
        script = (
            f"Skill: {skill_name}. "
            f"Confidence score: {round(confidence * 100)} percent. "
            f"Evidence: {signals_text}."
        )
        return self.explain(reasoning_trace={}, custom_text=script)

    # ------------------------------------------------------------------ #
    # Private — script generation                                          #
    # ------------------------------------------------------------------ #

    def _build_script(
        self, reasoning_trace: Dict, gap_stats: Optional[Dict], role: str = "USER"
    ) -> str:
        """Build a natural-sounding spoken explanation from the reasoning trace."""
        parts = []

        # Opening
        parts.append("Here is your personalized onboarding analysis.")

        # Gap stats summary
        if gap_stats:
            known = gap_stats.get("known_count", 0)
            total = gap_stats.get("total_required_skills", 0)
            coverage = gap_stats.get("coverage_percentage", 0)
            readiness = gap_stats.get("readiness_score", 0)
            missing = gap_stats.get("missing_count", 0)
            partial = gap_stats.get("partial_count", 0)

            parts.append(
                f"You currently have {known} out of {total} required skills. "
                f"Your skill coverage is {coverage} percent and your readiness score is {readiness} out of 100."
            )
            if missing > 0 or partial > 0:
                if role == "HR":
                    parts.append(
                        f"There are {missing} critical gaps identified. "
                        f"This candidate requires targeted training in these areas to meet benchmark standards."
                    )
                else:
                    parts.append(
                        f"You have {missing} missing skills and {partial} skills that need improvement."
                    )

        # Role analysis
        role_info = reasoning_trace.get("role_analysis", {})
        if role_info:
            role_name = role_info.get("matched_role", "specified")
            conf = role_info.get("confidence", 0)
            mode = role_info.get("mode", "")
            added = role_info.get("skills_added_from_role", [])
            if role == "HR":
                parts.append(
                    f"Our neural engine matches this profile to the {role_name} track "
                    f"with {round(conf * 100)} percent certainty. "
                    f"We have automatically adjusted the required skill set for this role."
                )
            else:
                parts.append(
                    f"Based on the job description, your closest role match is {role_name}, "
                    f"with a confidence of {round(conf * 100)} percent. "
                    f"Mode: {mode}."
                )
            if added and role == "USER":
                parts.append(
                    f"The following core skills were added from your role track: "
                    f"{', '.join(added[:5])}."
                )

        # Steps
        steps = reasoning_trace.get("steps", [])
        if steps:
            parts.append("Here is how the analysis was performed.")
            for step in steps:
                # Clean step text (remove leading numbers like "1. ")
                clean = step.lstrip("0123456789. ")
                parts.append(clean + ".")

        # Key insights
        insights = reasoning_trace.get("key_insights", [])
        if insights:
            parts.append("Key insights from your analysis.")
            for insight in insights[:4]:
                parts.append(insight + ".")

        # Recommendations
        recs = reasoning_trace.get("recommendations", [])
        if recs:
            parts.append("Recommendations for your learning journey.")
            for rec in recs[:3]:
                parts.append(rec + ".")

        # Closing
        if role == "HR":
            parts.append(
                "This concludes the candidate potential brief. "
                "Detailed metrics are available in your dashboard."
            )
        else:
            parts.append(
                "Your personalized learning path has been generated. "
                "Good luck with your onboarding journey!"
            )

        return " ".join(parts)
