import sys
import json
import os
import urllib.request
import urllib.error

def predict_price(crop_type, quantity):
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return predict_price_simulated(crop_type, quantity)
        
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    
    prompt = f"As an agricultural pricing expert in India, predict the expected price per quintal in INR for {quantity} quintals of '{crop_type}'. Return ONLY a valid JSON object with these exact keys: 'status' (string 'success'), 'suggested_price_per_unit' (number, the price per quintal), 'currency' (string 'INR'), and 'message' (string, explanation). No markdown formatting."
    
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
        return predict_price_simulated(crop_type, quantity)

def predict_price_simulated(crop_type, quantity):
    historical_data = {
        'wheat': {'base': 2200, 'volatility': 200},
        'rice': {'base': 3000, 'volatility': 300},
        'corn': {'base': 1800, 'volatility': 150},
        'sugarcane': {'base': 350, 'volatility': 50},
        'cotton': {'base': 6000, 'volatility': 500}
    }
    
    c_type = crop_type.lower()
    
    # Simple fallback check
    base_price = 2000.0
    for key, data in historical_data.items():
        if key in c_type:
            base_price = data['base']
            break
            
    if 'bad' in c_type or 'poor' in c_type or 'low' in c_type:
        base_price = base_price * 0.5
    elif 'good' in c_type or 'premium' in c_type or 'high' in c_type:
        base_price = base_price * 1.5

    bulk_discount = 0.98 if quantity > 50 else 1.0
    suggested_price = base_price * bulk_discount
    
    return {
        "status": "success",
        "suggested_price_per_unit": round(suggested_price, 2),
        "currency": "INR",
        "message": "Fallback AI simulation used."
    }

if __name__ == "__main__":
    if len(sys.argv) > 2:
        crop_type = sys.argv[1]
        try:
            quantity = float(sys.argv[2])
            result = predict_price(crop_type, quantity)
            print(json.dumps(result))
        except ValueError:
            print(json.dumps({"status": "error", "message": "Invalid quantity provided."}))
    else:
        print(json.dumps({"status": "error", "message": "Missing arguments. Required: crop_type, quantity"}))
