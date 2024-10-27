import shutil
from http.client import HTTPResponse
from pathlib import Path

import cv2
import matplotlib.pyplot as plt
import numpy as np
from PIL import Image
from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
import io
from starlette.responses import RedirectResponse, FileResponse
import lane_detection as ld

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
async def index():
    return RedirectResponse(url="/static/index.html")


@app.post("/detection")
async def detect_image(image: UploadFile = None):
    if image.content_type not in ["image/jpeg", "image/png", "image/gif"]:
        raise HTTPException(status_code=400, detail="Invalid image type. Please upload a JPEG, PNG, or GIF.")

    try:
        image_data = await image.read()
        np_image = np.array(Image.open(io.BytesIO(image_data)))
        result = ld.process_frame(np_image)
        res, result_jpg = cv2.imencode(".png", cv2.cvtColor(result, cv2.COLOR_RGB2BGR))

        return StreamingResponse(io.BytesIO(result_jpg.tobytes()), media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to process image")


@app.post("/detection-video")
async def detect_video(video: UploadFile = None):
    if video.content_type != "video/mp4":
        raise HTTPException(status_code=400, detail="Invalid video type. Please upload a MP4.")

    try:
        file_path = Path("input.mp4")
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(video.file, buffer)
        ld.process_video("input.mp4", "output.mp4")
        return FileResponse("output.mp4")

    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to process video")
