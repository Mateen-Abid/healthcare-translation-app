import React, { useState, useEffect, useRef } from 'react';

const SpeechToText = ({ onTranscription }) => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognition = useRef(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Your browser does not support Speech Recognition API');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition.current = new SpeechRecognition();
    recognition.current.continuous = true;
    recognition.current.interimResults = true;
    recognition.current.lang = 'en-US';

    recognition.current.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          setTranscript(prev => prev + event.results[i][0].transcript + ' ');
          onTranscription(prev => (prev + event.results[i][0].transcript + ' '));
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      // Optionally, you can show interim results if you want.
    };

    recognition.current.onerror = (event) => {
      console.error('Speech recognition error', event.error);
    };
  }, [onTranscription]);

  const toggleListening = () => {
    if (listening) {
      recognition.current.stop();
      setListening(false);
    } else {
      setTranscript('');
      onTranscription(''); // clear parent's transcription too
      recognition.current.start();
      setListening(true);
    }
  };

  return (
    <div>
      <button onClick={toggleListening}>
        {listening ? 'Stop Listening' : 'Start Listening'}
      </button>
      <p><strong>Transcript:</strong> {transcript}</p>
    </div>
  );
};

export default SpeechToText;
