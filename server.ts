import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Could not initialize GoogleGenAI with provided key:', err);
  }
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!ai,
    timestamp: new Date().toISOString(),
  });
});

// Download endpoints for dist.zip (Netlify) and full project source
app.get('/api/download/dist', (_req, res) => {
  const filePath = path.join(__dirname, 'dist.zip');
  res.download(filePath, 'dist.zip', (err) => {
    if (err && !res.headersSent) {
      res.status(500).json({ error: 'Failed to download dist.zip' });
    }
  });
});

app.get('/api/download/source', (_req, res) => {
  const filePath = path.join(__dirname, 'cartwala-source-code.zip');
  res.download(filePath, 'cartwala-source-code.zip', (err) => {
    if (err && !res.headersSent) {
      res.status(500).json({ error: 'Failed to download source code zip' });
    }
  });
});

// Lyria Music Generation endpoint
// Feature requirement: Use lyria-3-clip-preview for short clips (up to 30s) or lyria-3-pro-preview for full-length tracks
app.post('/api/generate-music', async (req, res) => {
  const { prompt, modelType = 'clip', duration = 30, tradeType = 'juice_chai' } = req.body;
  const targetModel = modelType === 'pro' ? 'lyria-3-pro-preview' : 'lyria-3-clip-preview';

  if (ai) {
    try {
      const response = await ai.models.generateContentStream({
        model: targetModel,
        contents: prompt || `Upbeat Indian street market jingle for a Cartwala selling ${tradeType}. Catchy rhythm, festive percussion, inviting melody.`,
      });

      let audioBase64 = '';
      let lyrics = '';
      let mimeType = 'audio/wav';

      for await (const chunk of response) {
        const parts = chunk.candidates?.[0]?.content?.parts;
        if (!parts) continue;
        for (const part of parts) {
          if (part.inlineData?.data) {
            if (!audioBase64 && part.inlineData.mimeType) {
              mimeType = part.inlineData.mimeType;
            }
            audioBase64 += part.inlineData.data;
          }
          if (part.text && !lyrics) {
            lyrics = part.text;
          }
        }
      }

      if (audioBase64) {
        return res.json({
          success: true,
          model: targetModel,
          audioBase64,
          mimeType,
          lyrics: lyrics || 'Cartwala! Fresh, cold and healthy - straight from the solar thela!',
        });
      }
    } catch (err: any) {
      console.warn('Lyria API call failed, generating simulated acoustic soundbox track:', err?.message);
    }
  }

  // Graceful fallback when API key is not active or user chose "add without api"
  return res.json({
    success: true,
    isSimulated: true,
    model: targetModel,
    prompt: prompt || `Upbeat market audio for ${tradeType}`,
    duration: duration,
    title: `Cartwala ${tradeType.replace('_', ' ').toUpperCase()} Solar Anthem`,
    lyrics: `ताज़ा माल, शुद्ध स्वाद! सोलर कार्टवाला पर आपका स्वागत है। (Fresh goods, pure taste! Welcome to Solar Cartwala)`,
    synthParams: {
      tempo: 124,
      scale: 'bilawal',
      instruments: ['sitar_lead', 'tabla_pulse', 'brass_bell', 'chime_sweep'],
      frequencyChords: [523.25, 659.25, 783.99, 1046.50],
    },
  });
});

// Veo Video Generation endpoint
// Feature requirement: veo-3.1-fast-generate-preview with aspect ratio 16:9 or 9:16
app.post('/api/generate-video', async (req, res) => {
  const { prompt, aspectRatio = '16:9', imageBase64 } = req.body;
  const targetRatio = aspectRatio === '9:16' ? '9:16' : '16:9';

  if (ai) {
    try {
      const config: any = {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: targetRatio,
      };

      const payload: any = {
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt || 'A modern Cartwala solar street thela cart in a bustling festive Indian bazaar with twinkling 3000K warm lights and people smiling.',
        config,
      };

      if (imageBase64) {
        payload.image = {
          imageBytes: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
          mimeType: 'image/png',
        };
      }

      const operation = await (ai.models as any).generateVideos(payload);
      return res.json({
        success: true,
        operationName: operation.name,
        model: 'veo-3.1-fast-generate-preview',
        aspectRatio: targetRatio,
      });
    } catch (err: any) {
      console.warn('Veo video call fallback:', err?.message);
    }
  }

  return res.json({
    success: true,
    isSimulated: true,
    model: 'veo-3.1-fast-generate-preview',
    aspectRatio: targetRatio,
    operationName: `simulated-veo-op-${Date.now()}`,
    videoPreviewUrl: 'https://assets.mixkit.co/videos/preview/mixkit-curry-being-stirred-in-a-large-pan-43224-large.mp4',
    prompt: prompt || 'Solar Cartwala smoothly moving through bustling morning Mandi marketplace',
  });
});

// High-Quality Image Generation endpoint
// Feature requirement: gemini-3-pro-image-preview with image size (1K, 2K, 4K)
app.post('/api/generate-image', async (req, res) => {
  const { prompt, imageSize = '1K', aspectRatio = '1:1' } = req.body;
  const validSize = ['1K', '2K', '4K'].includes(imageSize) ? imageSize : '1K';

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [
            {
              text: prompt || 'A pristine Cartwala solar-powered Indian street vendor cart with high-efficiency 400W solar roof, modular stainless steel trays, warm LED bulbs, and vibrant yellow and red livery.',
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any,
            imageSize: validSize as any,
          },
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData?.data) {
          return res.json({
            success: true,
            model: 'gemini-3-pro-image-preview',
            imageSize: validSize,
            imageUrl: `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`,
          });
        }
      }
    } catch (err: any) {
      console.warn('Gemini 3 Pro Image generation fallback:', err?.message);
    }
  }

  return res.json({
    success: true,
    isSimulated: true,
    model: 'gemini-3-pro-image-preview',
    imageSize: validSize,
    prompt,
    aspectRatio,
  });
});

// High-Thinking Advisor endpoint
// Feature requirement: gemini-3.1-pro-preview with thinkingLevel: ThinkingLevel.HIGH (do not set maxOutputTokens)
app.post('/api/high-thinking-consult', async (req, res) => {
  const { vendorDetails } = req.body;
  const { tradeType, city, currentMonthlyFuel, dailyRevenue, selectedSolarCapacity } = vendorDetails || {};

  const queryPrompt = `You are the Lead Financial & Solar Engineering Advisor for Cartwala, evaluating an Indian street vendor's business upgrade under PM SVANidhi scheme.
Analyze in detail:
Trade Type: ${tradeType || 'Juice and Chai'}
City: ${city || 'Lucknow / Delhi'}
Current monthly illegal grid/generator diesel spend: ₹${currentMonthlyFuel || 3000}
Average daily sales: ₹${dailyRevenue || 4500}
Proposed solar capacity: ${selectedSolarCapacity || '400W + 1.2kWh LiFePO4'}

Provide:
1. Mathematical solar yield vs daily load calculation (Wh generated vs blender/chiller/lights consumption).
2. Direct PM SVANidhi 7% interest subsidy & Mudra scheme qualification breakdown.
3. Monthly net savings and exact payback period in months.
4. Strategic street placement and customer trust impact.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: queryPrompt,
        config: {
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.HIGH,
          },
        },
      });

      return res.json({
        success: true,
        model: 'gemini-3.1-pro-preview',
        thinkingLevel: 'HIGH',
        analysis: response.text,
      });
    } catch (err: any) {
      console.warn('High-thinking Gemini 3.1 Pro call fallback:', err?.message);
    }
  }

  // High-Thinking reasoning model breakdown fallback
  return res.json({
    success: true,
    isSimulated: true,
    model: 'gemini-3.1-pro-preview',
    thinkingLevel: 'HIGH',
    analysis: `### 🧠 High-Thinking Financial & Solar Audit (Cartwala Engineering Advisory)

#### 1. Energy Autonomy & Electrical Yield Matrix
- **Solar Insolation Coefficient**: Based on standard 5.2 peak sun hours in ${city || 'North/Central India'}, the 400W mono-crystalline PERC array generates **~2,080 Wh (2.08 kWh)** daily.
- **Vendor Daily Load Demand**:
  - 40L Active Cold Bay Chiller (35W avg intermittent): ~385 Wh (11 hrs operational)
  - 4x 3000K High-CRI LED task spotlights (24W total): ~144 Wh (6 hrs evening)
  - High-Torque 600W Commercial Blender (burst mode 40 runs x 30 sec): ~200 Wh
  - Soundbox PA Announcer & Phone Charger: ~50 Wh
  - **Total Consumption**: ~779 Wh / day.
- **Safety Margin**: **267% Energy Surplus**. Even under heavy monsoon overcast (0.8 kWh generation), the 1.2 kWh LiFePO4 battery pack operates with a **40-hour autonomy buffer** without grid reliance.

#### 2. PM SVANidhi & Central Subsidy Eligibility
- Under **PM SVANidhi Tranche-2 & Tranche-3** (₹20,000 to ₹50,000 collateral-free digital micro-credit), street entrepreneurs transitioning to clean energy qualify for:
  - **7% Interest Subsidy** credited directly to the vendor's Jan Dhan bank account.
  - Cash-back incentive up to ₹1,200/year for accepting UPI digital transactions via Cartwala's illuminated QR stand.
  - Capital Subsidy / Clean Tech State Grant (₹10,000 upfront factory reduction applied directly).

#### 3. Bottom-Line ROI & Debt Payback Formula
- **Current Unproductive Leakage**: ₹${currentMonthlyFuel || 3000}/mo diesel generator + ₹150/day unhygienic melting ice blocks (₹4,500/mo) = **₹7,500/month**.
- **Cartwala Out-of-Pocket EMI**: **₹1,290/month** (36 months tenure at 7% subsidized rate).
- **Net Immediate Free Cashflow Gain**: +₹6,210/month extra take-home profit from Day 1.
- **Capital Payback Period**: **5.8 Months**. After Month 6, all electrical energy and refrigeration are 100% free for the remaining 8-year LiFePO4 lifespan (>3,000 cycles).`,
  });
});

// Mount Vite middleware in development
async function startServer() {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Cartwala Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
