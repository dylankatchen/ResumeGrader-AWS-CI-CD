const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Trust ALB proxy
app.set("trust proxy", 1);

// Health check for ALB
app.get('/health', (req, res) => {
    res.status(200).send('ok');
});

const path = require('path');

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../public')));

// Example API route
app.get('/api/hello', (req, res) => {
    res.send('Hello from the API!');
});


const multer = require('multer');
const pdf = require('pdf-parse');
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');

// Configure Multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Initialize Bedrock Client
const bedrock = new BedrockRuntimeClient({ region: 'us-east-1' });

app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Resume Grading Endpoint
app.post('/api/grade', upload.single('resume'), async (req, res) => {
    try {
        const jobDescription = req.body.jobDescription;
        let resumeText = req.body.resumeText || '';

        // If a file was uploaded, parse it
        if (req.file) {
            if (req.file.mimetype === 'application/pdf') {
                const data = await pdf(req.file.buffer);
                resumeText = data.text;
            } else {
                // Assume text file
                resumeText = req.file.buffer.toString('utf-8');
            }
        }

        if (!resumeText || !jobDescription) {
            return res.status(400).json({ error: 'Resume and Job Description are required' });
        }

        // Construct Prompt for Nova (Messages API)
        const userMessage = `You are an expert technical recruiter and hiring manager. 
        Please grade the following resume against the job description provided.
        
        Job Description:
        ${jobDescription}

        Resume:
        ${resumeText}

        Provide a structured response in JSON format with the following keys:
        - score: A number between 0 and 100.
        - pointers: A list of specific, actionable improvements or feedback.
        - reasoning: A brief explanation of the score.

        Do not include any preamble or postscript, just the JSON.`;

        const input = {
            modelId: "us.amazon.nova-2-lite-v1:0",
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify({
                inferenceConfig: {
                    max_new_tokens: 1000,
                    temperature: 0.5,
                    top_p: 0.9
                },
                messages: [
                    {
                        role: "user",
                        content: [
                            { text: userMessage }
                        ]
                    }
                ]
            })
        };

        const command = new InvokeModelCommand(input);
        const response = await bedrock.send(command);

        const responseBody = JSON.parse(new TextDecoder().decode(response.body));

        // Nova response structure
        let completion;
        if (responseBody.output && responseBody.output.message) {
            completion = responseBody.output.message.content[0].text;
        } else {
            // Fallback or error logging
            console.error('Unexpected model response structure:', responseBody);
            completion = JSON.stringify(responseBody);
        }

        // Attempt to parse JSON from the completion
        try {
            // Find JSON start and end just in case
            const jsonStart = completion.indexOf('{');
            const jsonEnd = completion.lastIndexOf('}') + 1;
            const jsonString = completion.substring(jsonStart, jsonEnd);
            const result = JSON.parse(jsonString);
            res.json(result);
        } catch (e) {
            console.error('Failed to parse model response:', completion);
            res.json({ score: 0, pointers: ['Error parsing AI response'], reasoning: completion });
        }

    } catch (error) {
        console.error('Error grading resume:', error);
        res.status(500).json({ error: 'Failed to grade resume', details: error.message });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`API running on port ${PORT}`);
});
