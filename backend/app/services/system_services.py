from pydantic import BaseModel
from typing import List, Dict
import random
import time

class SystemHealthResponse(BaseModel):
    status: str
    uptime: str
    services: Dict[str, str]
    latency_ms: int

class SquadStats(BaseModel):
    squad_name: str
    rank: int
    mastery_percentile: float
    active_members: int
    recent_activity: List[str]

class CareerPacketResponse(BaseModel):
    packet_id: str
    generated_at: str
    highlights: List[str]
    readiness_index: float
    download_url: str

class SystemService:
    def check_health(self) -> SystemHealthResponse:
        services = {
            "Core CPU": "Healthy",
            "Neural Mesh": "Operational",
            "Vision Engine": "Active",
            "Squad Sync": "Synchronized",
            "Audio Synthesis": "Standby",
            "Market Database": "Optimized"
        }
        return SystemHealthResponse(
            status="All Systems Green",
            uptime="14d 6h 32m",
            services=services,
            latency_ms=random.randint(10, 45)
        )

class SquadService:
    def get_stats(self, skills: List[str]) -> SquadStats:
        activities = [
            "Alpha Squad mastered React Essentials",
            "DeepMind Squad unlocked Neural Patterns",
            "Velocity Squad hit 50-day streak",
            "You earned 'System Architect' badge"
        ]
        return SquadStats(
            squad_name="Alpha Elite",
            rank=4,
            mastery_percentile=98.4,
            active_members=1284,
            recent_activity=activities
        )

class PacketService:
    def generate_packet(self, data: Dict) -> CareerPacketResponse:
        highlights = [
            f"Mastered {len(data.get('skills', []))} Core Competencies",
            "Achieved 95% Interview Readiness",
            "Verified by AI UI Vision Engine",
            "Top 2% Globally in Learning Velocity"
        ]
        return CareerPacketResponse(
            packet_id=f"PKT-{random.randint(1000, 9999)}",
            generated_at=time.strftime("%Y-%m-%d %H:%M:%S"),
            highlights=highlights,
            readiness_index=96.5,
            download_url="/exports/career_packet_alpha.pdf"
        )
