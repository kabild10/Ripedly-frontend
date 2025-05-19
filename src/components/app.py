import os
import yt_dlp
from flask import Flask, request, send_file
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

DOWNLOAD_FOLDER = "downloads"
if not os.path.exists(DOWNLOAD_FOLDER):
    os.makedirs(DOWNLOAD_FOLDER)

@app.route("/api/health")
def health_check():
    return {"status": "healthy", "message": "Server is running"}, 200

@app.route("/api/download/<content_type>", methods=["POST"])
def download_content(content_type):
    url = request.form.get("url")
    if not url:
        return {"error": "No URL provided"}, 400
    
    try:
        # Validate Instagram URL
        if "instagram.com" not in url:
            return {"error": "Invalid Instagram URL"}, 400
            
        # Content type specific validation
        if content_type == "reels" and "/reel/" not in url and "/reels/" not in url:
            return {"error": "Invalid Reel URL"}, 400
            
        file_path = download_media(url, content_type)
        return send_file(file_path, as_attachment=True)
        
    except Exception as e:
        return {"error": str(e)}, 500

def download_media(url, content_type):
    """Downloads Instagram media using yt-dlp and returns the file path."""
    ext = "mp4"  # default extension
    if content_type == "dp":
        ext = "jpg"
    elif content_type == "audio":
        ext = "mp3"
        
    output_template = os.path.join(DOWNLOAD_FOLDER, f"{content_type}_%(title)s.%(ext)s")
    
    ydl_opts = {
        "outtmpl": output_template,
        "format": "bestvideo+bestaudio/best" if content_type != "audio" else "bestaudio",
        "merge_output_format": "mp4",
        "quiet": True,
        "no_warnings": True,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info_dict = ydl.extract_info(url, download=True)
        file_path = ydl.prepare_filename(info_dict)
        return file_path

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)