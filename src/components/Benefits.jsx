import { useState } from 'react';
import Header from "./Header";
import Section from "./Section";

const YouTubeTrimmer = () => {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [isLongWait, setIsLongWait] = useState(false);

   const BACKEND_URL = "https://ripedly-backend.onrender.com";
  const FRONTEND_URL = "https://ripedly-frontend-qvah.vercel.app";

  const validateYouTubeUrl = (url) => {
    if (!url) return "Please enter a URL";
    
    const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    
    if (!match || match[1].length !== 11) {
      return "Please enter a valid YouTube URL";
    }

    return true;
  };

  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    const validation = validateYouTubeUrl(url);
    if (validation !== true) {
      setError(validation);
      return;
    }

    setIsLoading(true);

    try {
      const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const match = url.match(regExp);
      const id = match[1];
      
      setVideoId(id);
      setShowVideo(true);
      // setSuccess("Video loaded successfully!");

    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Failed to load video. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrim = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    setIsLongWait(false);
    setProgress(0);
    setStatusMessage("Initializing trim process...");

    try {
      // Stage 1: Backend health check (0-5%)
      setStatusMessage("Checking backend service...");
      setProgress(5);
      const healthCheck = await fetch(`${BACKEND_URL}/api/health`);
      if (!healthCheck.ok) {
        throw new Error('Backend service is unavailable');
      }

      // Stage 2: Time validation (5-10%)
      setStatusMessage("Validating timestamps...");
      setProgress(10);
      if (!startTime || !endTime) {
        throw new Error('Start and end times are required');
      }

      // Stage 3: Preparing request (10-15%)
      setStatusMessage("Preparing trim request...");
      setProgress(15);

      // Stage 4: Sending request with wait indicators (15-30%)
      setStatusMessage("Processing your video...");
      setProgress(20);
      
      // Set up wait time indicators
      const waitTimer = setTimeout(() => {
        setIsLongWait(true);
        setStatusMessage(" This may take a moment");
      }, 10000); // Show after 10 seconds

      const veryLongWaitTimer = setTimeout(() => {
        setStatusMessage("Doing magic... Please wait");
      }, 20000); // Show after 20 seconds

      const response = await fetch(
        `${BACKEND_URL}/api/trim`,
        {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            url,
            startTime,
            endTime 
          })
        }
      );

      // Clear timers
      clearTimeout(waitTimer);
      clearTimeout(veryLongWaitTimer);
      setIsLongWait(false);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Trimming failed');
      }

      // Stage 5: Processing response (30-50%)
      setStatusMessage("Processing video data...");
      setProgress(50);

      // Stage 6: FFmpeg processing (50-90%)
      setStatusMessage("Trimming video content...");
      // Simulate progress during processing
      for (let i = 60; i <= 90; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setProgress(i);
      }

      // Stage 7: Finalizing (90-100%)
      setStatusMessage("Preparing your download...");
      setProgress(95);
      const blob = await response.blob();
      
      setStatusMessage("Finalizing...");
      setProgress(100);
      
      const contentDisposition = response.headers.get('content-disposition');
  let filename = `Ripedly_${startTime.replace(/:/g, '_')}_to_${endTime.replace(/:/g, '_')}.mp4`;
  
  // If server provides a filename, use that instead
  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename="(.+?)"/);
    if (filenameMatch && filenameMatch[1]) {
      filename = filenameMatch[1];
    }
  }

      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
      
      setStatusMessage("Download complete!");
      setSuccess(`Smooth cut! Like butter 🧈🍿`);

    } catch (err) {
      console.error('Trim error:', err);
      setError(err.message || 'Failed to trim video. Please try again.');
      setProgress(0);
    } finally {
      setIsLoading(false);
      setIsLongWait(false);
    }
  };

  return (
    <div className="bg-n-8 text-n-1 min-h-screen">
      <Header />
      
      <div className="pt-4 pb-8 px-4">
        <Section id="youtube-trimmer">
          <div className="container relative z-2">
          <h1 className="h2 text-center mb-8 font-sora text-white">
  {/* Line 1: "Rip what hits!" (full width) */}
  <div className="md:inline">
    <span
      style={{
        color: '#00ffff',
        fontFamily: 'Comfortaa, cursive',
        fontWeight: 'bold',
      }}
    >
      Rip
    </span>{' '}
    what hits!
  </div>

  {/* Line 2: "Drop what fits!" (indented on mobile) */}
  <div className="md:inline md:ml-2">
    <span
      style={{
        color: '#00ffff',
        fontFamily: 'Comfortaa, cursive',
        fontWeight: 'bold',
      }}
    >
      Drop
    </span>{' '}
    what fits!
  </div>
</h1>



  
            {/* URL Input Form */}
            <div className="max-w-[40rem] mx-auto bg-n-7 rounded-3xl overflow-hidden shadow-lg mb-8">
              <div className="p-1 bg-gradient-to-r from-n-5 to-n-6">
              <h3 className="h4 text-center p-4 font-sora text-white">
  Gimme that URL,{" "}
  <span style={{ color: "#00ffff" }}>let’s cook</span>
</h3>
              </div>
              
              <form onSubmit={handleUrlSubmit} className="p-6 md:p-8">
                <div className="mb-4">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste YouTube video URL here"
                    className="w-full p-4 bg-n-8 border border-n-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-n-4 font-sora placeholder:text-n-4"
                    required
                    disabled={isLoading}
                  />
                  <p className="text-n-4 text-xs mt-2">
                  Link Please, We’re Hungry for Edits 🍿✂️

                  </p>
                </div>
                
                {error && !showVideo && (
                  <div className="mt-4 p-3 bg-red-900/20 rounded-lg">
                    <p className="text-red-400 text-center">
                      <strong>Error:</strong> {error}
                    </p>
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isLoading || !url}
                  className={`mt-6 w-full bg-n-6 text-n-1 font-sora font-semibold p-4 rounded-xl hover:bg-n-5 transition-colors ${
                    isLoading || !url ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⏳</span>
                      Loading...
                    </span>
                  ) : 'Load Video'}
                </button>
              </form>
            </div>

            {/* Video Preview */}
            {showVideo && (
              <div className="max-w-[40rem] mx-auto bg-n-7 rounded-3xl overflow-hidden shadow-lg mb-8">
                <div className="p-1 bg-gradient-to-r from-n-5 to-n-6">
                  <h2 className="h4 text-center p-4 font-sora">
                    Video Preview
                  </h2>
                </div>
                <div className="p-4 sm:p-6 aspect-video">
                  <div className="relative h-0 pb-[56.25%] sm:pb-0 sm:h-full">
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
            )}

            {/* Timestamp Controls */}
            {showVideo && (
              <div className="max-w-[40rem] mx-auto bg-n-7 rounded-3xl overflow-hidden shadow-lg">
                <div className="p-1 bg-gradient-to-r from-n-5 to-n-6">
                  <h2 className="h4 text-center p-4 font-sora">
                    Select Trim Points
                  </h2>
                </div>
                
                <form onSubmit={handleTrim} className="p-6 md:p-8">
                  <div className="mb-4">
                    <div className="bg-yellow-100/20 border border-yellow-300 rounded-lg p-3 mb-4">
                      <p className="font-medium text-sm flex items-start">
                        <svg className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Enter time as seen on YouTube</span>
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-n-3 text-sm mb-1">Start Time</label>
                        <input
                          type="text"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          placeholder="0:00"
                          className="w-full p-3 bg-n-8 border border-n-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-n-4 font-sora"
                          required
                          disabled={isLoading}
                        />
                      </div>
                      <div>
                        <label className="block text-n-3 text-sm mb-1">End Time</label>
                        <input
                          type="text"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          placeholder="0:00"
                          className="w-full p-3 bg-n-8 border border-n-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-n-4 font-sora"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    {isLoading && (
                      <div className="mt-4">
                        <div className="text-n-3 text-sm mb-1 flex items-center">
                          <span> {statusMessage}</span>
                          {isLongWait && (
                            <span >
                            
                            
                            </span>
                          )}
                        </div>
                        <div className="w-full bg-n-6 rounded-full h-2.5">
                          <div 
                            className="bg-n-1 h-2.5 rounded-full transition-all duration-300" 
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-n-3 mt-1">
                          <span>0%</span>
                          <span>{progress}%</span>
                          <span>100%</span>
                        </div>
                        {progress >= 20 && progress < 40 && (
                          <div className="mt-2 text-xs text-n-4 flex items-center">
                            <svg className="w-3 h-3 mr-1 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            Time depends on video size and quality
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {error && (
                    <div className="mt-4 p-3 bg-red-900/20 rounded-lg">
                      <p className="text-red-400 text-center">
                        <strong>Error:</strong> {error}
                      </p>
                    </div>
                  )}
                  
                  {success && (
                    <div className="mt-4 p-3  rounded-lg">
                      <p className=" text-center">
                        {success}
                      </p>
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`mt-6 w-full bg-n-6 text-n-1 font-sora font-semibold p-4 rounded-xl hover:bg-n-5 transition-colors ${
                      isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin">⏳</span>
                        {progress < 100 ? `Processing (${progress}%)` : 'Finalizing...'}
                      </span>
                    ) : `Trim Video (${startTime} - ${endTime})`}
                  </button>
                </form>
              </div>
            )}
          </div>
        </Section>
      </div>
    </div>
  );
};

export default YouTubeTrimmer;
