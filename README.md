# 🎙️ Speaker Recognition System

## 📌 Overview

The Speaker Recognition System uses advanced machine learning techniques for speaker identification and verification. The project leverages the Web Audio API, Firebase, and machine learning models to accurately identify users based on their voice patterns. The system ensures high accuracy and real-time recognition, making it suitable for various applications.

---

## 🚀 Features

- **Voice Registration**: Users can register their voice for identification.
- **Real-Time Recognition**: Identifies users based on their voice input without storing raw audio files.

---

## 🛠️ Technologies Used

- **Frontend**: React, Web Audio API
- **Backend**: Flask
- **Database**: Firebase Firestore
- **Machine Learning**: Scikit-learn for SVM, Random Forest, and KNN models

---

## 📋 How It Works

1. **Voice Registration**: Users record their voice samples.
2. **Feature Extraction**:
   - MFCCs and spectral features are extracted from the audio.
   - Extracted features are stored in Firebase Firestore.
3. **Model Training**:
   - The system trains three models: SVM, Random Forest, and KNN using extracted features.
   - Uses k-fold cross-validation and grid search to optimize hyperparameters.
4. **Real-Time Prediction**:
   - During recognition, features are extracted from the input audio and passed to all three models.
   - Final prediction is based on majority voting (Ensemble Learning).

---

## 🌟 Use Cases of Speaker Recognition System

### 🔐 Security & Authentication

- **Secure Voice Login**: Replace passwords with voice authentication.
- **Banking & Financial Security**: Authenticate users during transactions.
- **Smart Homes & IoT**: Control smart devices using voice-based authentication.

### 🎤 Smart Assistants & Customer Service

- **Personalized AI Assistants**: AI assistants (e.g., Alexa, Siri) can distinguish between users.
- **Call Center Optimization**: Identify callers and retrieve details instantly.

### 🏥 Healthcare & Accessibility

- **Voice Authentication for Patients**: Secure access to sensitive medical data.
- **Assistive Tech for Disabled Users**: Enable hands-free authentication for differently-abled individuals.

### 🎮 Gaming & Entertainment

- **Voice-Based Player Profiles**: Recognize players by voice in multiplayer games.
- **Personalized Streaming Recommendations**: Suggest content tailored to recognized users.

---

## 🚧 Challenges Faced

- Handling variations in audio quality and background noise.
- Ensuring scalability and real-time performance.

---

## 🔮 Future Work

- **Deep Learning Integration**: Implement CNNs or RNNs for improved accuracy.
- **Multi-Language Support**: Expand support to recognize speakers in different languages.
- **Speaker Emotion Detection**: Enhance the system to detect user emotions.
- **Mobile Application**: Develop a mobile app for voice authentication.
- **Continuous Learning**: Incorporate real-time learning to adapt to new users.

---

## 🖥️ Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/PrajwalChander/Speaker-Recognition
   ```
2. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set up Firebase credentials by replacing `firebase_credentials.json` with your file.
4. Run the Flask server:
   ```bash
   python app.py
   ```
5. Install frontend dependencies:
   ```bash
   npm install
   ```
6. Run the React frontend:
   ```bash
   npm run dev
   ```
7. Access the system at `http://localhost:`\*\*\*\*.

---

## 🤝 Contributions

Contributions are welcome! Feel free to submit issues or pull requests to enhance the project.

---

## 📨 Contact

For questions or collaboration, reach out to [prajwalchander2003@gmail.com](mailto\:prajwalchander2003@gmail.com).

