# Mic Preamp Gain Simulator

A lightweight web app to estimate microphone output levels and preamp headroom against ADC full-scale. It helps visualize how different mic sensitivities, vocal SPL, distance, and gain land on a dBFS meter.

## Features
- Sensitivity unit switching (dBu / dBV / mV)
- Per-mic dBFS table and vertical meter view
- SPL presets and distance-to-capsule modeling
- Customizable mic database with add/remove
- Gooseneck filter for paging/installation mics

## Local use
Open `index.html` in your browser.

## Math notes
- Sensitivities are RMS at 1 Pa (94 dB SPL, 1 kHz).
- The app computes RMS dBFS referenced to ADC full-scale in dBu.
- Distance uses a simple free-field inverse distance model.

## License
MIT (add your preferred license if different).
