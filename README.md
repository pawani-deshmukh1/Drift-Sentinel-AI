# Drift-Sentinel-AI
Real-time AI reliability and PPE drift monitoring system with explainability and risk-aware controls.

🛡️ Drift Sentinel

Unsupervised Reliability Monitoring for Vision-Based AI Systems
Drift Sentinel is a real-time monitoring framework that operates alongside an existing computer vision model to continuously assess its reliability.
Instead of waiting for ground-truth labels or accuracy reports, the system tracks shifts in input data, prediction confidence, and entropy to detect silent model failures early.

🚀 Key Features

1.Unsupervised drift detection (no ground-truth labels required)

2.Real-time confidence & entropy monitoring

3.Operational Risk Budget with safe-degradation logic

4.Feature-level drift explainability

5.Black Box audit logging for post-incident analysis

6.Supervisor-controlled re-calibration

7.Works with live webcam or pre-recorded video feeds

## 🎬 Demo Flow 

1. Upload a clean industrial video → system remains stable  
2. Degrade video quality (fog / blur) → confidence drops  
3. Risk budget depletes → warnings appear  
4. Sustained drift → system lockdown  
5. Explainability panel shows root cause  
6. Supervisor recalibrates system safely


## 📄 Additional Resources

All supporting materials are available in the `docs/` folder:

- 📘 **Model Report (PDF)**  
  [`docs/Model Report.pdf`](Docs/ModelReport.pdf)

- 🧩 **System Architecture Diagram**  
  [`docs/System_Architecture.png`](Docs/System_Architecture.png)

- 🎥 **Demo Video Walkthrough**  
  [`docs/Demo-model.mp4`](Docs/Demo-model.mp4)



