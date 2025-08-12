import React, { useState, useEffect, useRef } from "react";
import b1 from "./assets/b1.jpg";
import b2 from "./assets/b2.jpg";
import b3 from "./assets/b3.jpg";
import "./index.css";

export default function App() {
  const [inputLang, setInputLang] = useState("en");
  const [targetLang, setTargetLang] = useState("ur");
  const [transcript, setTranscript] = useState("");
  const [translation, setTranslation] = useState("No translation yet");
  const [bannerIndex, setBannerIndex] = useState(0);
  const [transcriptKey, setTranscriptKey] = useState(0);
  const [translationKey, setTranslationKey] = useState(0);
  const recognitionRef = useRef(null);

  const banners = [
    { img: b1, text: "Breaking Language Barriers in Healthcare" },
    { img: b2, text: "Real-time Translation for Better Patient Care" },
    { img: b3, text: "Connecting Patients & Doctors Across Languages" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = inputLang;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.continuous = false;

    recognitionRef.current.onresult = async (event) => {
      const spokenText = event.results[0][0].transcript;
      setTranscript(spokenText);
      setTranscriptKey((prev) => prev + 1); // 🔥 trigger animation

      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${spokenText}&langpair=${inputLang}|${targetLang}`
      );
      const data = await res.json();
      setTranslation(data.responseData.translatedText);
      setTranslationKey((prev) => prev + 1); // 🔥 trigger animation
    };

    recognitionRef.current.start();
  };

  const speakTranslation = () => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(translation);
    utterance.lang = targetLang;
    synth.speak(utterance);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start text-white">
      {/* Overlay for gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-indigo-900/90 z-0" />

      {/* Rotating Banner */}
      <div className="relative w-full h-64 overflow-hidden z-10">
        {banners.map((banner, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
              idx === bannerIndex
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            }`}
          >
            <img
              src={banner.img}
              alt="Healthcare banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <h2 className="text-white text-3xl md:text-5xl font-extrabold drop-shadow-lg text-center px-4">
                {banner.text}
              </h2>
            </div>
          </div>
        ))}
      </div>

      {/* App Header */}
      <header className="text-center my-8 animate-fadeIn z-10">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">
          Healthcare Translation App
        </h1>
        <p className="text-white text-lg md:text-2xl mt-3">
          Real-time multilingual speech translation for better patient care.
        </p>
      </header>

      {/* Main Card */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl p-8 w-full max-w-3xl animate-slideUp z-10">
        {/* Language selectors */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <label className="block font-semibold mb-1 text-white">Select Input Language:</label>
            <select
              value={inputLang}
              onChange={(e) => setInputLang(e.target.value)}
              className="w-full p-3 border border-white/40 rounded-lg focus:ring-2 focus:ring-blue-300 bg-white/20 text-white"
            >
              <option value="en">English</option>
              <option value="ur">Urdu</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1 text-white">Select Target Language:</label>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="w-full p-3 border border-white/40 rounded-lg focus:ring-2 focus:ring-blue-300 bg-white/20 text-white"
            >
              <option value="ur">Urdu</option>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-6 mb-10">
          <button
            onClick={startListening}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-blue-500/50 hover:scale-105 transition-all"
          >
            🎤 Start Listening
          </button>
          <button
            onClick={speakTranslation}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-green-500/50 hover:scale-105 transition-all"
          >
            🔊 Speak Translation
          </button>
        </div>

        {/* Transcript & Translation with dynamic fade */}
        <div className="text-center space-y-6">
          <div key={transcriptKey} className="animate-fadeIn">
            <h2 className="text-xl font-bold">Transcript:</h2>
            <p className="italic text-2xl font-light">
              {transcript || "No speech detected yet."}
            </p>
          </div>
          <div key={translationKey} className="animate-fadeIn">
            <h2 className="text-xl font-bold">
              Translation ({targetLang}):
            </h2>
            <p className="text-2xl font-semibold">
              {translation}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-white text-sm mb-6 z-10">
        © 2025 Nao Medical | Built with Web Speech API & Tailwind CSS
      </footer>
    </div>
  );
}
