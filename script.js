// Play birthday tune on page load
const audio = new Audio('./birthday-tune.mp3');
audio.play();

// Microphone blowing detection
navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    const audioContext = new AudioContext();
    const microphone = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    microphone.connect(analyser);
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    function detectBlow() {
        analyser.getByteFrequencyData(dataArray);
        const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        if (volume > 50) {
            console.log('Blow detected!');
            // Extinguish the candle by hiding the flame
            document.querySelectorAll('.flame').forEach(flame => flame.style.display = 'none');
        }
        requestAnimationFrame(detectBlow);
    }
    detectBlow();
}).catch((err) => console.error('Microphone access denied:', err));
