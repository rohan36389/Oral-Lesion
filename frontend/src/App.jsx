import { useState, useRef } from 'react'
import './App.css'

function App() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    processFile(file)
  }

  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
      setPreview(URL.createObjectURL(file))
      setPrediction(null)
      setError(null)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const response = await fetch('http://localhost:8001/predict', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Prediction failed')
      }

      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }
      setPrediction(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const resetAll = () => {
    setSelectedFile(null)
    setPreview(null)
    setPrediction(null)
    setError(null)
  }

  return (
    <div className="app-wrapper">
      {/* Animated Background */}
      <div className="bg-animation">
        <div className="bg-circle circle-1"></div>
        <div className="bg-circle circle-2"></div>
        <div className="bg-circle circle-3"></div>
      </div>

      <div className="container">
        {/* Header */}
        <header className="header">
          <div className="logo">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <span>OralScan AI</span>
          </div>
          <h1 className="title">Oral Cancer Detection</h1>
          <p className="subtitle">Advanced AI-powered analysis for early detection</p>
        </header>

        {/* Main Content */}
        <main className="main-content">
          <div className="card glass-card">
            {!preview ? (
              /* Upload Section */
              <div
                className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="file-input"
                />
                <div className="upload-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17,8 12,3 7,8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <h3>Drop your image here</h3>
                <p>or click to browse</p>
                <span className="file-types">Supports: JPG, PNG, WEBP</span>
              </div>
            ) : (
              /* Preview & Results Section */
              <div className="analysis-section">
                <div className="image-container">
                  <img src={preview} alt="Preview" className="preview-image" />
                  <button className="change-image-btn" onClick={() => fileInputRef.current?.click()}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                    Change
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="file-input"
                  />
                </div>

                {/* Action Buttons */}
                {!prediction && !loading && (
                  <div className="action-buttons">
                    <button onClick={handleUpload} className="btn btn-primary">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                      </svg>
                      Analyze Image
                    </button>
                    <button onClick={resetAll} className="btn btn-secondary">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="1,4 1,10 7,10" />
                        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                      </svg>
                      Reset
                    </button>
                  </div>
                )}

                {/* Loading State */}
                {loading && (
                  <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Analyzing image...</p>
                    <span>This may take a few seconds</span>
                  </div>
                )}

                {/* Error State */}
                {error && (
                  <div className="error-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                    <p>{error}</p>
                    <button onClick={handleUpload} className="btn btn-small">Try Again</button>
                  </div>
                )}

                {/* Results */}
                {prediction && (
                  <div className={`results-panel ${prediction.prediction}`}>
                    <div className="result-header">
                      <div className={`result-badge ${prediction.prediction}`}>
                        {prediction.prediction === 'cancer' ? (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22,4 12,14.01 9,11.01" />
                          </svg>
                        )}
                      </div>
                      <div className="result-text">
                        <span className="result-label">Diagnosis Result</span>
                        <h2 className={`result-value ${prediction.prediction}`}>
                          {prediction.prediction === 'cancer' ? 'Potential Cancer Detected' : 'No Cancer Detected'}
                        </h2>
                      </div>
                    </div>

                    <div className="confidence-section">
                      <div className="confidence-header">
                        <span>Confidence Level</span>
                        <span className="confidence-value">{(prediction.confidence * 100).toFixed(1)}%</span>
                      </div>
                      <div className="confidence-bar">
                        <div
                          className={`confidence-fill ${prediction.prediction}`}
                          style={{ width: `${prediction.confidence * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="probability-grid">
                      <div className="prob-card cancer-prob">
                        <span className="prob-label">Cancer</span>
                        <span className="prob-value">{(prediction.probabilities.cancer * 100).toFixed(1)}%</span>
                        <div className="prob-bar">
                          <div style={{ width: `${prediction.probabilities.cancer * 100}%` }}></div>
                        </div>
                      </div>
                      <div className="prob-card healthy-prob">
                        <span className="prob-label">Healthy</span>
                        <span className="prob-value">{(prediction.probabilities['non-cancer'] * 100).toFixed(1)}%</span>
                        <div className="prob-bar">
                          <div style={{ width: `${prediction.probabilities['non-cancer'] * 100}%` }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="disclaimer">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                      </svg>
                      <p>This is an AI-assisted screening tool. Please consult a medical professional for accurate diagnosis.</p>
                    </div>

                    <button onClick={resetAll} className="btn btn-outline">
                      Analyze Another Image
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="footer">
          <p>Powered by Deep Learning • ResNet18 Architecture</p>
        </footer>
      </div>
    </div>
  )
}

export default App
