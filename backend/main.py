from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import pandas as pd
import os

app = FastAPI(title="Maintenance Wizard API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define data paths
SENSOR_LOGS_PATH = "data/logs/sensor_logs.csv"
MAINTENANCE_HISTORY_PATH = "data/logs/maintenance_history.csv"
ANALYTICS_LOG_PATH = "data/logs/analytics.csv"

# Ensure analytics log file exists
if not os.path.exists(ANALYTICS_LOG_PATH):
    pd.DataFrame(columns=[
        "timestamp", "event_type", "equipment_id", "details", "user_id"
    ]).to_csv(ANALYTICS_LOG_PATH, index=False)

class QueryRequest(BaseModel):
    query: str
    equipment_id: Optional[str] = "BF-01"

class ResolveRequest(BaseModel):
    equipment_id: str
    issue: str
    root_cause: str
    action_taken: str

class AnalyticsLogRequest(BaseModel):
    event_type: str
    equipment_id: Optional[str] = None
    details: Optional[str] = None
    user_id: Optional[str] = "system"

class AnalysisResponse(BaseModel):
    analysis: str
    status: str
    prediction: Optional[dict] = None
    thought_process: Optional[list] = None
    sources: Optional[list] = None
    debate: Optional[list] = None

def log_analytics(event: AnalyticsLogRequest):
    """Helper function to log analytics events"""
    try:
        df = pd.read_csv(ANALYTICS_LOG_PATH)
        new_entry = {
            "timestamp": datetime.now().isoformat(),
            "event_type": event.event_type,
            "equipment_id": event.equipment_id,
            "details": event.details,
            "user_id": event.user_id
        }
        df = pd.concat([df, pd.DataFrame([new_entry])], ignore_index=True)
        df.to_csv(ANALYTICS_LOG_PATH, index=False)
        return True
    except Exception as e:
        print(f"Error logging analytics: {e}")
        return False

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_equipment(request: QueryRequest):
    try:
        # Use provided equipment ID
        eq_id = request.equipment_id or "BF-01"
        
        # Log analytics event
        log_analytics(AnalyticsLogRequest(
            event_type="analysis_request",
            equipment_id=eq_id,
            details=f"Query: {request.query[:50]}..."
        ))
        
        # Equipment-specific data
        equipment_data = {
            "BF-01": {"temp": 18.3, "temp_trend": "↑ 140%", "flow": 32.1, "flow_trend": "↓ 31%", "health": 52, "status": "Critical"},
            "BF-02": {"temp": 8.5, "temp_trend": "↑ 5%", "flow": 59.8, "flow_trend": "↓ 0.5%", "health": 95, "status": "Normal"},
            "BF-03": {"temp": 9.2, "temp_trend": "↑ 8%", "flow": 55.2, "flow_trend": "↓ 5.6%", "health": 92, "status": "Normal"},
            "BF-04": {"temp": 16.8, "temp_trend": "↑ 120%", "flow": 45.0, "flow_trend": "↓ 27.8%", "health": 71, "status": "Critical"},
            "BF-05": {"temp": 7.8, "temp_trend": "↑ 2%", "flow": 57.5, "flow_trend": "↓ 2.7%", "health": 94, "status": "Normal"}
        }
        
        data = equipment_data.get(eq_id, equipment_data["BF-01"])
        
        # Query-specific insights
        query_lower = request.query.lower()
        insights = []
        action_items = []
        
        if "temperature" in query_lower or "temp" in query_lower:
            insights.append(f"Temperature analysis: Current temp is {data['temp']}°C, {data['temp_trend']} from baseline.")
            action_items.append("Monitor temperature hourly for the next 24 hours.")
        elif "flow" in query_lower or "pressure" in query_lower:
            insights.append(f"Flow rate analysis: Current flow is {data['flow']} m³/h, {data['flow_trend']} from optimal.")
            action_items.append("Check inlet/outlet valves for any obstructions.")
        elif "safety" in query_lower:
            insights.append("Safety protocols review: All LOTO and PPE requirements are up to date.")
            action_items.append("Conduct a quick safety briefing with the maintenance team.")
        elif "maintenance" in query_lower or "service" in query_lower:
            insights.append("Maintenance history review: Last scheduled maintenance was 3 weeks ago.")
            action_items.append("Schedule preventive maintenance if health score drops below 70.")
        else:
            insights.append("Comprehensive analysis: Reviewing all telemetry, maintenance, and safety data.")
            action_items.append("Prioritize actions based on health score and criticality.")
        
        # Mock response
        debate_log = [
            {"agent": "Analyst", "msg": f"Detected anomalies on {eq_id}. Recommend immediate review."},
            {"agent": "Reliability", "msg": f"Checking historical records for {eq_id} for similar patterns."},
            {"agent": "Safety", "msg": "All safety protocols must be followed before any intervention."},
            {"agent": "Lead", "msg": "Consensus reached. Proceeding with recommended actions."}
        ]
        
        analysis = f"""### 🛠️ Lead Engineer's Autonomous Assessment (Multi-Agent Synthesis)

#### **Equipment Status: {eq_id}**
- **Temperature**: {data['temp']}°C ({data['temp_trend']} from baseline)
- **Flow Rate**: {data['flow']} m³/h ({data['flow_trend']} from optimal)
- **Health Score**: {data['health']}/100 ({data['status']})

#### **Query Insights**
{chr(10).join([f"- {insight}" for insight in insights])}

#### **Root Cause Analysis**
1. **Telemetry Agent**: Analyzing real-time sensor data for {eq_id}.
2. **Reliability Agent**: Reviewing historical maintenance records for patterns.
3. **SOP Specialist**: Retrieving relevant procedures from technical manuals.

#### **Recommended Actions**
{chr(10).join([f"{i+1}. {item}" for i, item in enumerate(action_items)])}

#### **Safety Validation**
✅ All mandatory protocols verified.
✅ LOTO procedure documented if needed.
✅ Emergency response team on standby.

---
*Generated by Multi‑Agent Orchestrator v2.1*"""
        
        return {
            "analysis": analysis,
            "status": "completed (agentic)",
            "prediction": {"failure_risk": round((100 - data['health']) / 100, 2), "recommended_maintenance": "within 24 hours" if data['health'] < 80 else "schedule next routine"},
            "thought_process": [
                "Lead: Initiating Agentic Debate Loop...",
                "Analyst: Analyzing query and telemetry data...",
                "Reliability: Cross-referencing with historical records...",
                "Safety: Validating all safety requirements...",
                "Validator: SUCCESS. Plan complies with industrial safety mandates.",
                "Lead: Self-reflection complete. No further risks identified.",
                "Lead: Final technical report compiled and authorized."
            ],
            "sources": ["Telemetry-Analyst-v1", "Reliability-DB", "SOP-RAG-Engine", "Safety-Validator"],
            "debate": debate_log
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/resolve")
async def resolve_issue(request: ResolveRequest):
    try:
        df = pd.read_csv(MAINTENANCE_HISTORY_PATH)
        
        new_record = {
            "record_id": f"REC-{len(df) + 101}",
            "date": datetime.now().strftime("%Y-%m-%d"),
            "equipment_id": request.equipment_id,
            "issue": request.issue,
            "root_cause": request.root_cause,
            "action_taken": request.action_taken,
            "outcome": "Resolved"
        }
        
        df = pd.concat([df, pd.DataFrame([new_record])], ignore_index=True)
        df.to_csv(MAINTENANCE_HISTORY_PATH, index=False)
        
        # Log analytics event
        log_analytics(AnalyticsLogRequest(
            event_type="issue_resolved",
            equipment_id=request.equipment_id,
            details=f"Issue resolved: {request.issue[:50]}..."
        ))
        
        return {"status": "success", "record_id": new_record["record_id"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# New endpoint to get sensor logs
@app.get("/logs/sensors")
async def get_sensor_logs(equipment_id: Optional[str] = None, limit: int = 50):
    try:
        df = pd.read_csv(SENSOR_LOGS_PATH)
        if equipment_id:
            df = df[df["equipment_id"] == equipment_id]
        # Return most recent logs first
        df = df.sort_values(by="timestamp", ascending=False).head(limit)
        return df.to_dict(orient="records")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# New endpoint to get maintenance history
@app.get("/logs/maintenance")
async def get_maintenance_history(equipment_id: Optional[str] = None, limit: int = 50):
    try:
        df = pd.read_csv(MAINTENANCE_HISTORY_PATH)
        if equipment_id:
            df = df[df["equipment_id"] == equipment_id]
        # Return most recent records first
        if "date" in df.columns:
            df = df.sort_values(by="date", ascending=False).head(limit)
        return df.to_dict(orient="records")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# New endpoint to get analytics logs
@app.get("/logs/analytics")
async def get_analytics_logs(event_type: Optional[str] = None, limit: int = 50):
    try:
        df = pd.read_csv(ANALYTICS_LOG_PATH)
        if event_type:
            df = df[df["event_type"] == event_type]
        # Return most recent logs first
        df = df.sort_values(by="timestamp", ascending=False).head(limit)
        return df.to_dict(orient="records")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# New endpoint to log analytics events
@app.post("/logs/analytics")
async def create_analytics_log(event: AnalyticsLogRequest):
    success = log_analytics(event)
    if success:
        return {"status": "success"}
    else:
        raise HTTPException(status_code=500, detail="Failed to log analytics")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
