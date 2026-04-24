const { spawn } = require('child_process');
const path = require('path');

// Helper function to run python scripts for AI functionalities
const runPythonScript = (scriptName, args) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '..', 'ai', scriptName);
    const pythonProcess = spawn('python', [scriptPath, ...args]);

    let dataString = '';
    let errorString = '';

    pythonProcess.stdout.on('data', (data) => {
      dataString += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorString += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python script exited with code ${code}: ${errorString}`);
        return reject(new Error('AI script failed execution.'));
      }
      try {
        const result = JSON.parse(dataString);
        resolve(result);
      } catch (err) {
        reject(new Error('Failed to parse AI response.'));
      }
    });
  });
};
// Controller for AI functionalities
exports.qualityCheck = async (req, res) => {
  try {
    const { image_path } = req.body;
    
    if (!image_path) {
      return res.status(400).json({ message: 'Please provide an image_path' });
    }

    const result = await runPythonScript('quality_checker.py', [image_path]);
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'AI Quality Check Failed' });
  }
};
// Controller for price prediction functionality
exports.predictPrice = async (req, res) => {
  try {
    const { crop_type, quantity } = req.body;
    
    if (!crop_type || !quantity) {
      return res.status(400).json({ message: 'Please provide crop_type and quantity' });
    }

    const result = await runPythonScript('price_predictor.py', [crop_type, quantity.toString()]);
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'AI Price Prediction Failed' });
  }
};
