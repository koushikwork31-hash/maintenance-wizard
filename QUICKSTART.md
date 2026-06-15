# Maintenance Wizard Pro - Quick Start Guide

## 🚀 What's New!

### 📊 Analytics & Logs System
- **New API Endpoints**: `/logs/sensors`, `/logs/maintenance`, `/logs/analytics`
- **Analytics Tracking**: Every analysis and issue resolution is now logged
- **Logs UI**: Three dedicated tabs for maintenance, sensor, and analytics logs

### 🎯 Expanded Fleet
Now supports **5 Blast Furnaces**:
- BF-01 (Critical)
- BF-02 (Normal)
- BF-03 (Normal)
- BF-04 (Critical)
- BF-05 (Normal)

### 🎨 New Features
- **3 Main Views**: Dashboard, AI Wizard, Logs & Analytics
- **Advanced Charts**: Trend analysis, status distribution, risk matrix
- **Enhanced UI**: Modern gradient design, better navigation
- **Notifications System**: Real-time alerts for critical issues
- **Efficiency Tracking**: Per-unit efficiency metrics

### 📈 Streamlit Analytics App
Standalone Streamlit application for deep data analysis!

## 🛠️ Running the Application

### 1. Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
The backend runs at http://localhost:8000

### 2. Frontend (React)
```bash
cd frontend
npm install
npm run dev
```
The frontend runs at http://localhost:5173

### 3. Streamlit Analytics (Optional)
```bash
pip install -r requirements-streamlit.txt
streamlit run streamlit_app.py
```
Runs at http://localhost:8501

## 📁 New Files Added
- `data/logs/analytics.csv` - Analytics events log
- `streamlit_app.py` - Streamlit analytics application
- `requirements-streamlit.txt` - Streamlit dependencies

## 🔑 Key Features
1. **Real-time Analytics Dashboard**: Overview of all equipment
2. **AI Maintenance Wizard**: Multi-agent analysis with safety validation
3. **Comprehensive Logs**: Maintenance history, sensor data, analytics events
4. **Predictive Analytics**: Risk scores and failure predictions
5. **Digital Twin Visualization**: Real-time equipment state display

## 📊 Data Files
Located in `data/logs/`:
- `sensor_logs.csv` - Sensor data for all equipment
- `maintenance_history.csv` - Maintenance records
- `analytics.csv` - System analytics events

## 🎯 Future Enhancements
- [ ] Real-time MQTT sensor integration
- [ ] Predictive model retraining pipeline
- [ ] Mobile responsive UI
- [ ] Multi-language support
- [ ] Cloud deployment capabilities
