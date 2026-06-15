from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from .diagnostic_agent import MaintenanceWizardAgent
from .predictive_engine import PredictiveEngine
from .agents import MaintenanceOrchestrator
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

agent = MaintenanceWizardAgent()
orchestrator = MaintenanceOrchestrator()
predictive_engine = PredictiveEngine()

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
    thought_process: Optional[List[str]] = None
    sources: Optional[List[str]] = None
    debate: Optional[List[dict]] = None

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
        
        # Use the new Multi-Agent Orchestrator
        result = orchestrator.run_workflow(request.query)
        prediction = predictive_engine.predict_failures(eq_id)
        
        return {
            "analysis": result["analysis"],
            "status": "completed (agentic)",
            "prediction": prediction,
            "thought_process": result["thought_process"],
            "sources": result["sources"],
            "debate": result.get("debate")
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
    uvicorn.run(app, host="0.0.0.0", port=8000)
