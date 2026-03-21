from typing import List, Dict, Any, Optional, Union
from app.supabase_client import supabase_admin
import logging

logger = logging.getLogger(__name__)

class SupabaseService:
    def __init__(self):
        self.client = supabase_admin

    def get_user_by_email(self, email: str) -> Optional[Dict]:
        try:
            response = self.client.table("users").select("*").eq("email", email.lower()).execute()
            if response.data:
                return response.data[0]
            return None
        except Exception as e:
            logger.error(f"Error fetching user by email: {str(e)}")
            return None

    def create_user(self, email: str, role: str = "USER", hashed_password: Optional[str] = None) -> Dict:
        try:
            data = {"email": email.lower(), "role": role, "hashed_password": hashed_password}
            response = self.client.table("users").insert(data).execute()
            return response.data[0] if response.data else {}
        except Exception as e:
            logger.error(f"Error creating user: {str(e)}")
            raise e

    def save_resume(self, user_id: str, resume_text: str) -> Dict:
        try:
            data = {"user_id": user_id, "resume_text": resume_text}
            response = self.client.table("resumes").insert(data).execute()
            return response.data[0] if response.data else {}
        except Exception as e:
            logger.error(f"Error saving resume: {str(e)}")
            raise e

    def get_skills_by_names(self, skill_names: List[str]) -> List[Dict]:
        try:
            response = self.client.table("skills").select("*").in_("name", skill_names).execute()
            return response.data or []
        except Exception as e:
            logger.error(f"Error fetching skills: {str(e)}")
            return []

    def ensure_skills_exist(self, skill_names: List[str], category: str = "Technical"):
        """Bulk insert skills if they don't exist."""
        try:
            # Check existing
            existing = self.get_skills_by_names(skill_names)
            existing_names = [s["name"] for s in existing]
            
            to_insert = [{"name": name, "category": category} for name in skill_names if name not in existing_names]
            
            if to_insert:
                self.client.table("skills").insert(to_insert).execute()
        except Exception as e:
            logger.warning(f"Skill sync warning: {str(e)}")

    def update_user_skill(self, user_id: str, skill_name: str, status: str, mastery: float = 0):
        try:
            # Get skill id
            skill_res = self.client.table("skills").select("id").eq("name", skill_name).execute()
            if not skill_res.data:
                return
            
            skill_id = skill_res.data[0]["id"]
            data = {
                "user_id": user_id,
                "skill_id": skill_id,
                "status": status,
                "mastery_level": mastery,
                "updated_at": "now()"
            }
            # Upsert
            self.client.table("user_skills").upsert(data, on_conflict="user_id,skill_id").execute()
            
            # If mastered, notify HR
            if status == "Mastered":
                self.create_notification(f"User completed skill: {skill_name}", user_id)
        except Exception as e:
            logger.error(f"Error updating user skill: {str(e)}")

    def save_learning_path(self, user_id: str, path_data: Dict):
        try:
            data = {"user_id": user_id, "path_data": path_data}
            self.client.table("learning_paths").insert(data).execute()
        except Exception as e:
            logger.error(f"Error saving learning path: {str(e)}")

    def create_notification(self, message: str, user_id: Optional[str] = None):
        try:
            # Resolve user email if user_id provided
            user_email = None
            if user_id:
                user_res = self.client.table("users").select("email").eq("id", user_id).execute()
                if user_res.data:
                    user_email = user_res.data[0]["email"]

            data = {
                "recipient_role": "HR",
                "message": message,
                "user_email": user_email
            }
            self.client.table("notifications").insert(data).execute()
        except Exception as e:
            logger.error(f"Error creating notification: {str(e)}")

supabase_service = SupabaseService()
