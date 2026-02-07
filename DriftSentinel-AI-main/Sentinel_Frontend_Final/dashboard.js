const API = "http://127.0.0.1:8000";

// --- 1. SAFE ELEMENT SELECTOR ---
function get(id) {
    const el = document.getElementById(id);
    if (!el) console.warn(`Element ${id} missing`);
    return el;
}

// Elements
const video = get("main-video");
const yoloFeed = get("yolo-feed");
const sourceToggle = get("source-toggle");
const uploadBtn = get("upload-btn-container");
const fileInput = get("video-upload");
const qualitySlider = get("quality-slider");
const qualityVal = get("quality-val");
const recalibrateBtn = get("recalibrate-btn");
const lockdownOverlay = get("lockdown-overlay");

// Metrics
const riskEl = get("riskLevel");
const scoreEl = get("driftScore");
const fuelFill = get("fuelFill");
const fuelText = get("fuelText");

let currentQuality = 1.0;
let trendChart = null;

// --- 2. INITIALIZE CHART ---
try {
    const ctxEl = document.getElementById("trendChart");
    if (ctxEl) {
        const ctx = ctxEl.getContext("2d");
        trendChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array(20).fill(''),
                datasets: [{
                    data: Array(20).fill(0),
                    borderColor: '#58a6ff',
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.4,
                    fill: true,
                    backgroundColor: 'rgba(88, 166, 255, 0.1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
                plugins: { legend: { display: false } },
                scales: { x: { display: false }, y: { display: false, min: 0, max: 100 } }
            }
        });
    }
} catch (e) { console.error("Chart Init Failed", e); }

// --- 3. INPUT CONTROLS ---

// Webcam Start
function startWebcam() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => { if(video) video.srcObject = stream; })
            .catch(e => console.error("Webcam Error", e));
    }
}

// Initial Start
if (sourceToggle && !sourceToggle.checked) startWebcam();

// Toggle Logic
if (sourceToggle) {
    sourceToggle.addEventListener("change", (e) => {
        if (e.target.checked) {
            // Switch to File
            if(video) video.srcObject = null;
            if(uploadBtn) uploadBtn.classList.remove("hidden");
        } else {
            // Switch to Webcam
            if(uploadBtn) uploadBtn.classList.add("hidden");
            startWebcam();
        }
    });
}

// File Upload Logic
if (fileInput) {
    fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file && video) {
            video.src = URL.createObjectURL(file);
            video.loop = true;
            video.play();
        }
    });
}

// Slider Logic
if (qualitySlider) {
    qualitySlider.addEventListener("input", (e) => {
        currentQuality = e.target.value / 100;
        if(qualityVal) qualityVal.innerText = Math.round(currentQuality * 100) + "%";
        
        // Visual Blur
        const blur = (1 - currentQuality) * 15;
        if(video) video.style.filter = `blur(${blur}px) grayscale(${(1-currentQuality)*100}%)`;
    });
}

// Recalibrate Button
if (recalibrateBtn) {
    recalibrateBtn.addEventListener("click", async () => {
        try {
            await fetch(`${API}/calibrate`, { method: "POST" });
            alert("✅ System Re-Baselined to Current Environment");
        } catch (e) { alert("Backend Offline"); }
    });
}

// --- 4. MAIN LOOP ---
setInterval(async () => {
    if (!video || video.readyState !== 4) return;

    // A. Capture & Send
    const canvas = document.createElement("canvas");
    canvas.width = 320; canvas.height = 240;
    canvas.getContext("2d").drawImage(video, 0, 0, 320, 240);
    
    canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append("file", blob, "frame.jpg");

        try {
            const res = await fetch(`${API}/process-frame?quality_flag=${currentQuality}`, { 
                method: "POST", body: formData 
            });
            const data = await res.json();

            // B. Update YOLO (Left Screen)
            if (data.yolo_image && yoloFeed) {
                yoloFeed.src = data.yolo_image;
                // Match Blur visual
                const blur = (1 - currentQuality) * 5; 
                yoloFeed.style.filter = `blur(${blur}px) grayscale(${(1-currentQuality)*80}%)`;
            }

            // C. Update Metrics (Right Screen)
            if(scoreEl) scoreEl.innerText = data.current_drift.toFixed(1);
            if(riskEl) {
                riskEl.innerText = data.risk;
                riskEl.style.color = data.risk === "CRITICAL" ? "#cf222e" : "#2da44e";
            }
            
            // D. Update Fuel Bar
            if(fuelFill) {
                fuelFill.style.width = data.risk_budget + "%";
                fuelFill.style.background = data.risk_budget < 30 ? "#cf222e" : "#2da44e";
                if(fuelText) fuelText.innerText = Math.round(data.risk_budget) + "% Fuel";
            }

            // E. Update Chart
            if (trendChart) {
                const chartData = trendChart.data.datasets[0].data;
                chartData.shift();
                chartData.push(data.current_drift);
                
                // Color change based on risk
                if(data.current_drift > 60) {
                    trendChart.data.datasets[0].borderColor = "#cf222e";
                    trendChart.data.datasets[0].backgroundColor = "rgba(207, 34, 46, 0.2)";
                } else {
                    trendChart.data.datasets[0].borderColor = "#58a6ff";
                    trendChart.data.datasets[0].backgroundColor = "rgba(88, 166, 255, 0.1)";
                }
                trendChart.update();
            }

            // F. Lockdown Overlay
            if(lockdownOverlay) {
                if (data.risk === "CRITICAL") lockdownOverlay.classList.remove("hidden");
                else lockdownOverlay.classList.add("hidden");
            }

        } catch(e) { console.error(e); }
    }, "image/jpeg", 0.7);

}, 500);
