import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime
import os

# Set page config
st.set_page_config(
    page_title="Maintenance Wizard Analytics",
    page_icon="🔧",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
    <style>
    .main {
        background-color: #0f172a;
    }
    .stPlotlyChart {
        background-color: #1e293b;
        border-radius: 10px;
        padding: 10px;
    }
    .css-1v0mbdj {
        background-color: #1e293b;
    }
    </style>
""", unsafe_allow_html=True)

# Title and header
st.title("🔧 Maintenance Wizard Analytics Dashboard")
st.markdown("### Advanced Industrial Maintenance Analytics Platform")

# Sidebar for navigation
st.sidebar.title("📊 Analytics Menu")
page = st.sidebar.radio(
    "Select Page",
    ["Dashboard Overview", "Sensor Analytics", "Maintenance History", "Predictive Analytics"]
)

# Load data
@st.cache_data
def load_data():
    data_path = "data/logs"
    
    # Load sensor logs
    if os.path.exists(f"{data_path}/sensor_logs.csv"):
        sensor_df = pd.read_csv(f"{data_path}/sensor_logs.csv")
    else:
        sensor_df = pd.DataFrame()
    
    # Load maintenance history
    if os.path.exists(f"{data_path}/maintenance_history.csv"):
        maintenance_df = pd.read_csv(f"{data_path}/maintenance_history.csv")
    else:
        maintenance_df = pd.DataFrame()
    
    # Load analytics logs
    if os.path.exists(f"{data_path}/analytics.csv"):
        analytics_df = pd.read_csv(f"{data_path}/analytics.csv")
    else:
        analytics_df = pd.DataFrame()
    
    return sensor_df, maintenance_df, analytics_df

sensor_df, maintenance_df, analytics_df = load_data()

# Dashboard Overview Page
if page == "Dashboard Overview":
    st.header("📈 Fleet Overview")
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        total_equipment = 5  # BF-01 to BF-05
        st.metric("Total Equipment", f"{total_equipment}", "✓ Normal")
    
    with col2:
        critical_count = 2  # BF-01 and BF-04
        st.metric("Critical Alerts", f"{critical_count}", "⚠ High")
    
    with col3:
        avg_efficiency = 87
        st.metric("Average Efficiency", f"{avg_efficiency}%", "↑ 2%")
    
    with col4:
        mttr = 4.2  # Mean Time To Repair (hours)
        st.metric("Avg MTTR", f"{mttr}h", "↓ 15%")
    
    # Status distribution
    st.subheader("Equipment Status Distribution")
    status_data = pd.DataFrame({
        "Status": ["Normal", "Warning", "Critical"],
        "Count": [3, 0, 2]
    })
    fig_pie = px.pie(
        status_data,
        values="Count",
        names="Status",
        color_discrete_map={
            "Normal": "#10b981",
            "Warning": "#f59e0b",
            "Critical": "#ef4444"
        },
        title="Equipment Status"
    )
    st.plotly_chart(fig_pie, use_container_width=True)
    
    # Maintenance trend
    if not maintenance_df.empty:
        st.subheader("Maintenance Trend Over Time")
        maintenance_df["date"] = pd.to_datetime(maintenance_df["date"])
        monthly_trend = maintenance_df.groupby(maintenance_df["date"].dt.to_period("M")).size().reset_index(name="count")
        monthly_trend["date"] = monthly_trend["date"].dt.strftime("%Y-%m")
        
        fig_line = px.line(
            monthly_trend,
            x="date",
            y="count",
            title="Maintenance Events by Month",
            markers=True,
            color_discrete_sequence=["#3b82f6"]
        )
        st.plotly_chart(fig_line, use_container_width=True)

# Sensor Analytics Page
elif page == "Sensor Analytics":
    st.header("🌡️ Sensor Data Analytics")
    
    # Equipment selector
    equipment_list = ["BF-01", "BF-02", "BF-03", "BF-04", "BF-05"]
    selected_equipment = st.selectbox("Select Equipment", equipment_list, index=0)
    
    if not sensor_df.empty:
        eq_sensor_data = sensor_df[sensor_df["equipment_id"] == selected_equipment]
        
        if not eq_sensor_data.empty:
            st.subheader(f"Sensor Data for {selected_equipment}")
            
            # Sensor type selector
            sensor_types = eq_sensor_data["sensor_type"].unique()
            selected_sensor = st.selectbox("Select Sensor Type", sensor_types, index=0)
            
            filtered_data = eq_sensor_data[eq_sensor_data["sensor_type"] == selected_sensor]
            
            # Line chart
            fig_sensor = go.Figure()
            fig_sensor.add_trace(
                go.Scatter(
                    x=filtered_data["timestamp"],
                    y=filtered_data["value"],
                    mode="lines+markers",
                    name=selected_sensor,
                    line=dict(color="#3b82f6", width=3),
                    marker=dict(size=8)
                )
            )
            
            fig_sensor.update_layout(
                title=f"{selected_sensor} Readings Over Time",
                xaxis_title="Timestamp",
                yaxis_title=f"Value ({filtered_data['unit'].iloc[0]})",
                height=400
            )
            
            st.plotly_chart(fig_sensor, use_container_width=True)
            
            # Statistics
            st.subheader("Sensor Statistics")
            col1, col2, col3, col4 = st.columns(4)
            with col1:
                st.metric("Current", f"{filtered_data['value'].iloc[-1]:.2f} {filtered_data['unit'].iloc[0]}")
            with col2:
                st.metric("Average", f"{filtered_data['value'].mean():.2f}")
            with col3:
                st.metric("Min", f"{filtered_data['value'].min():.2f}")
            with col4:
                st.metric("Max", f"{filtered_data['value'].max():.2f}")
        else:
            st.warning(f"No sensor data found for {selected_equipment}")
    else:
        st.info("No sensor data available")

# Maintenance History Page
elif page == "Maintenance History":
    st.header("🔧 Maintenance Records")
    
    if not maintenance_df.empty:
        # Filters
        st.subheader("Filters")
        col1, col2 = st.columns(2)
        with col1:
            equipment_filter = st.multiselect(
                "Select Equipment",
                maintenance_df["equipment_id"].unique(),
                default=maintenance_df["equipment_id"].unique()
            )
        with col2:
            outcome_filter = st.multiselect(
                "Select Outcome",
                maintenance_df["outcome"].unique(),
                default=maintenance_df["outcome"].unique()
            )
        
        # Apply filters
        filtered_maintenance = maintenance_df[
            (maintenance_df["equipment_id"].isin(equipment_filter)) &
            (maintenance_df["outcome"].isin(outcome_filter))
        ]
        
        st.subheader("Maintenance Records")
        st.dataframe(filtered_maintenance, use_container_width=True)
        
        # Action taken distribution
        st.subheader("Actions Taken Distribution")
        action_counts = filtered_maintenance["action_taken"].value_counts()
        
        fig_actions = px.bar(
            x=action_counts.index,
            y=action_counts.values,
            title="Maintenance Actions",
            color_discrete_sequence=["#8b5cf6"]
        )
        st.plotly_chart(fig_actions, use_container_width=True)
        
    else:
        st.info("No maintenance history available")

# Predictive Analytics Page
elif page == "Predictive Analytics":
    st.header("🔮 Predictive Maintenance Analytics")
    
    st.subheader("Failure Risk Assessment")
    
    # Risk matrix visualization
    st.markdown("### Risk Matrix")
    col1, col2, col3 = st.columns([1, 2, 1])
    
    with col2:
        risk_matrix = [
            ["Low", "Low", "Medium", "Medium", "High"],
            ["Low", "Medium", "Medium", "High", "High"],
            ["Medium", "Medium", "High", "High", "Critical"],
            ["Medium", "High", "High", "Critical", "Critical"],
            ["High", "High", "Critical", "Critical", "Critical"]
        ]
        
        # Display risk matrix as a heatmap
        fig_matrix = go.Figure(data=go.Heatmap(
            z=[[1, 2, 3, 4, 5], [2, 3, 4, 5, 5], [3, 4, 5, 5, 6], [4, 5, 5, 6, 6], [5, 5, 6, 6, 6]],
            x=["Low", "Med-Low", "Medium", "Med-High", "High"],
            y=["Low", "Med-Low", "Medium", "Med-High", "High"],
            colorscale="Reds",
            showscale=False
        ))
        
        fig_matrix.update_layout(
            title="Risk Matrix (Impact vs Probability)",
            xaxis_title="Impact",
            yaxis_title="Probability"
        )
        
        st.plotly_chart(fig_matrix, use_container_width=True)
    
    st.subheader("Equipment Failure Predictions")
    
    prediction_data = [
        {"Equipment": "BF-01", "Risk Score": 85, "ETA": "12h", "Status": "Critical"},
        {"Equipment": "BF-04", "Risk Score": 72, "ETA": "24h", "Status": "High"},
        {"Equipment": "BF-02", "Risk Score": 25, "ETA": ">7d", "Status": "Low"},
        {"Equipment": "BF-03", "Risk Score": 18, "ETA": ">7d", "Status": "Low"},
        {"Equipment": "BF-05", "Risk Score": 15, "ETA": ">7d", "Status": "Low"}
    ]
    
    pred_df = pd.DataFrame(prediction_data)
    
    # Risk score chart
    fig_risk = px.bar(
        pred_df,
        x="Equipment",
        y="Risk Score",
        color="Status",
        color_discrete_map={
            "Low": "#10b981",
            "Medium": "#f59e0b",
            "High": "#f97316",
            "Critical": "#ef4444"
        },
        title="Equipment Risk Scores"
    )
    st.plotly_chart(fig_risk, use_container_width=True)
    
    st.subheader("Prediction Details")
    st.dataframe(pred_df, use_container_width=True)

# Footer
st.sidebar.markdown("---")
st.sidebar.markdown("### Maintenance Wizard Pro")
st.sidebar.markdown("Advanced Industrial AI System v4.2")
st.sidebar.markdown("© 2026 Tata Steel")
