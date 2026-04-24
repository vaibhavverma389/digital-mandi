import sys
import json
import random
import time
import os
import urllib.request
import urllib.error

def analyze_quality(image_path_or_crop_type):
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return analyze_quality_simulated(image_path_or_crop_type)
        
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    
    prompt = f"Analyze the likely quality of an Indian crop described as '{image_path_or_crop_type}'. Return ONLY a valid JSON object with the keys: 'status' (string 'success'), 'quality_score' (string, exactly one of 'Grade A (Premium)', 'Grade B (Standard)', or 'Grade C (Low Quality)'), 'confidence' (string like '95.5%'), and 'message' (string, short reasoning). No markdown formatting."
    
    data = {
        "contents": [{"parts": [{"text": prompt}]}]
    }
    
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'})
    
    try:
        response = urllib.request.urlopen(req)
        result = json.loads(response.read())
        text = result['candidates'][0]['content']['parts'][0]['text'].strip()
        if text.startswith("```json"): text = text[7:]
        if text.startswith("```"): text = text[3:]
        if text.endswith("```"): text = text[:-3]
        return json.loads(text.strip())
    except Exception as e:
        return analyze_quality_simulated(image_path_or_crop_type)

def analyze_quality_simulated(image_path):
    time.sleep(1.0)
    
    c_type = image_path.lower()
    if 'bad' in c_type or 'poor' in c_type or 'low' in c_type:
        predicted_quality = 'Grade C (Low Quality)'
    elif 'good' in c_type or 'premium' in c_type or 'high' in c_type:
        predicted_quality = 'Grade A (Premium)'
    else:
        predicted_quality = 'Grade B (Standard)'
        
    confidence = round(random.uniform(85.0, 99.9), 2)
    
    return {
        "status": "success",
        "quality_score": predicted_quality,
        "confidence": f"{confidence}%",
        "message": "Fallback AI simulation used."
    }

if __name__ == "__main__":
    if len(sys.argv) > 1:
        image_path = sys.argv[1]
        result = analyze_quality(image_path)
        print(json.dumps(result))
    else:
        print(json.dumps({"status": "error", "message": "No image path provided."}))
