import { useState, useRef, useEffect } from "react";
import Meyda from "meyda";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import "./styles.css";



export default function VoiceRecorder() {
    const [recording, setRecording] = useState(false);
    const [mode, setMode] = useState("train"); // "train" or "recognize"
    const [username, setUsername] = useState("");
    const [prediction, setPrediction] = useState(null);
    const audioContextRef = useRef(null);
    const sourceNodeRef = useRef(null);
    const analyzerRef = useRef(null);
    const extractedFeatures = useRef([]);
    const requiredFrames = 50;

    useEffect(() => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert("getUserMedia is not supported in this browser.");
        }
    }, []);

    const initializeAudio = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        sourceNodeRef.current = audioContextRef.current.createMediaStreamSource(stream);
        return stream;
    };

    const startRecording = async () => {
        if (mode === "train" && !username) {
            alert("Please enter your username before recording.");
            return;
        }

        try {
            await initializeAudio();
            extractedFeatures.current = [];

            analyzerRef.current = Meyda.createMeydaAnalyzer({
                audioContext: audioContextRef.current,
                source: sourceNodeRef.current,
                bufferSize: 512,
                featureExtractors: [
                    "mfcc",
                    "rms",
                    "zcr",
                    "spectralCentroid",
                    "spectralFlatness",
                    "spectralSkewness",
                    "spectralKurtosis",
                    "spectralSlope",
                    "spectralSpread",
                    "spectralRolloff",
                    "chroma"
                ],
                callback: (features) => {
                    if (features) {
                        extractedFeatures.current.push({
                            mfcc: features.mfcc ? features.mfcc.slice(0, 13) : Array(13).fill(0),
                            energy: features.rms || 0,
                            zeroCrossingRate: features.zcr || 0,
                            spectralCentroid: features.spectralCentroid || 0,
                            spectralFlatness: features.spectralFlatness || 0,
                            spectralSkewness: features.spectralSkewness || 0,
                            spectralKurtosis: features.spectralKurtosis || 0,
                            spectralSlope: features.spectralSlope || 0,
                            spectralSpread: features.spectralSpread || 0,
                            spectralRolloff: features.spectralRolloff || 0,
                            chroma: features.chroma || Array(12).fill(0)
                        });
                    }
                },
            });

            analyzerRef.current.start();
            setRecording(true);
        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    };

    const stopRecording = async () => {
        if (recording) {
            analyzerRef.current?.stop();
            setRecording(false);

            if (extractedFeatures.current.length >= requiredFrames) {
                const processedFeatures = processAudioFeatures(extractedFeatures.current);

                if (mode === "train") {
                    await saveFeaturesToFirestore(username, processedFeatures);
                } else if (mode === "recognize") {
                    sendFeaturesToBackend(processedFeatures);
                }
            } else {
                console.log("Insufficient voice data collected, please try recording again.");
            }
        }
    };

    const processAudioFeatures = (featuresArray) => {
        const averagedFeatures = {
            mfcc: Array(13).fill(0),
            energy: 0,
            zeroCrossingRate: 0,
            spectralCentroid: 0,
            spectralFlatness: 0,
            spectralSkewness: 0,
            spectralKurtosis: 0,
            spectralSlope: 0,
            spectralSpread: 0,
            spectralRolloff: 0,
            chroma: Array(12).fill(0)
        };

        featuresArray.forEach((features) => {
            averagedFeatures.mfcc = averagedFeatures.mfcc.map((val, idx) => val + features.mfcc[idx]);
            averagedFeatures.energy += features.energy;
            averagedFeatures.zeroCrossingRate += features.zeroCrossingRate;
            averagedFeatures.spectralCentroid += features.spectralCentroid;
            averagedFeatures.spectralFlatness += features.spectralFlatness;
            averagedFeatures.spectralSkewness += features.spectralSkewness;
            averagedFeatures.spectralKurtosis += features.spectralKurtosis;
            averagedFeatures.spectralSlope += features.spectralSlope;
            averagedFeatures.spectralSpread += features.spectralSpread;
            averagedFeatures.spectralRolloff += features.spectralRolloff;
            averagedFeatures.chroma = averagedFeatures.chroma.map((val, idx) => val + features.chroma[idx]);
        });

        const numFrames = featuresArray.length;
        for (let key in averagedFeatures) {
            if (Array.isArray(averagedFeatures[key])) {
                averagedFeatures[key] = averagedFeatures[key].map(val => val / numFrames);
            } else {
                averagedFeatures[key] /= numFrames;
            }
        }

        return averagedFeatures;
    };

    const saveFeaturesToFirestore = async (username, features) => {
        try {
            // Flatten the features for Firestore storage
            const formattedFeatures = {
                username: username,
                timestamp: new Date(),
                mfcc: features.mfcc.join(","),  // Convert array to a comma-separated string
                chroma: features.chroma.join(","),  // Convert chroma array as well
                energy: features.energy,
                zeroCrossingRate: features.zeroCrossingRate,
                spectralCentroid: features.spectralCentroid,
                spectralFlatness: features.spectralFlatness,
                spectralSkewness: features.spectralSkewness,
                spectralKurtosis: features.spectralKurtosis,
                spectralSlope: features.spectralSlope,
                spectralSpread: features.spectralSpread,
                spectralRolloff: features.spectralRolloff
            };
    
            await addDoc(collection(db, "audioFeatures"), formattedFeatures);
            console.log("Features stored successfully:", formattedFeatures);
        } catch (error) {
            console.error("Error saving features to Firestore:", error);
        }
    };
    const sendFeaturesToBackend = async (features) => {
        try {
            // Replace this URL with your Flask API endpoint
            const apiUrl = "http://localhost:5000/predict";
    
            // Send the processed features to the backend
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(features),
            });
    
            if (response.ok) {
                const result = await response.json();
                setPrediction(result.predictedUsername);
                console.log("Recognition result:", result);
            } else {
                console.error("Failed to get a response from the backend.");
            }
        } catch (error) {
            console.error("Error sending features to backend:", error);
        }
    };
    
    

    return (
        <div className="container">
            <div className="left-section">
                <h1>Who Am I??</h1>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    disabled={mode === "recognize"}
                />

                <div className="mode-toggle">
                    <button
                        className={mode === "train" ? "active" : ""}
                        onClick={() => setMode("train")}
                    >
                        Train
                    </button>
                    <button
                        className={mode === "recognize" ? "active" : ""}
                        onClick={() => setMode("recognize")}
                    >
                        Recognize
                    </button>
                </div>

                <button className="mic-button" onClick={recording ? stopRecording : startRecording}>
                    🎤 {recording ? "Stop" : "Start"} {mode === "train" ? "Recording" : "Recognition"}
                </button>
            </div>

            <div className="right-section">
                {prediction && <p>Predicted User: {prediction}</p>}
            </div>
        </div>
    );
}
