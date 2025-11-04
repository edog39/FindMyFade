import OpenAI from 'openai'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { image } = await req.json()
    
    // Check if OpenAI API key exists
    if (!process.env.OPENAI_API_KEY) {
      console.warn('⚠️ OPENAI_API_KEY not found - using mock AI')
      
      // Fallback to mock analysis if no API key
      const shapes = ['Oval', 'Square', 'Round', 'Heart', 'Diamond', 'Oblong']
      const mockAnalysis = {
        faceShape: shapes[Math.floor(Math.random() * shapes.length)],
        jawlineDefinition: Math.floor(Math.random() * 30) + 70,
        foreheadSize: ['Small', 'Medium', 'Large'][Math.floor(Math.random() * 3)],
        hairline: ['Straight', 'Rounded', 'Widow\'s Peak', 'Receding'][Math.floor(Math.random() * 4)],
        symmetry: Math.floor(Math.random() * 15) + 85,
        facialProportions: {
          foreheadToNose: Math.floor(Math.random() * 10) + 30,
          noseToLip: Math.floor(Math.random() * 10) + 25,
          lipToChin: Math.floor(Math.random() * 10) + 30,
        },
        cheekbones: ['Prominent', 'Moderate', 'Subtle'][Math.floor(Math.random() * 3)],
        confidence: Math.floor(Math.random() * 10) + 90,
        usingMockAI: true
      }
      
      return Response.json({ analysis: mockAnalysis })
    }

    console.log('🤖 Starting real AI face analysis with OpenAI Vision...')
    
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{
        role: "user",
        content: [
          {
            type: "text",
            text: `You are a professional barber and facial analysis expert. Analyze this person's face in detail.

Return ONLY a valid JSON object (no markdown, no code blocks) with this EXACT structure:
{
  "faceShape": "Oval",
  "jawlineDefinition": 85,
  "foreheadSize": "Medium",
  "hairline": "Straight",
  "symmetry": 92,
  "cheekbones": "Prominent",
  "facialProportions": {
    "foreheadToNose": 35,
    "noseToLip": 28,
    "lipToChin": 32
  },
  "confidence": 94
}

Rules:
- faceShape: Choose ONE from: Oval, Square, Round, Heart, Diamond, Oblong
- jawlineDefinition: Number 0-100 (how defined/sharp the jawline is)
- foreheadSize: Choose ONE from: Small, Medium, Large
- hairline: Choose ONE from: Straight, Rounded, Widow's Peak, Receding
- symmetry: Number 0-100 (facial symmetry score)
- cheekbones: Choose ONE from: Prominent, Moderate, Subtle
- facialProportions: All numbers should add up to approximately 95-100
- confidence: Number 0-100 (your confidence in this analysis)

Be professional and accurate. This will be used to recommend hairstyles.`
          },
          {
            type: "image_url",
            image_url: { url: image }
          }
        ]
      }],
      max_tokens: 500,
      temperature: 0.3 // Lower temperature for more consistent results
    })
    
    const content = response.choices[0].message.content
    console.log('🤖 Raw AI response:', content)
    
    // Parse the JSON response
    let analysis
    try {
      // Remove any markdown code blocks if present
      const cleanedContent = content?.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      analysis = JSON.parse(cleanedContent || '{}')
      analysis.usingMockAI = false
      console.log('✅ Successfully parsed AI analysis:', analysis)
    } catch (parseError) {
      console.error('❌ Failed to parse AI response:', parseError)
      console.error('Content was:', content)
      
      // Fallback to mock if parsing fails
      const shapes = ['Oval', 'Square', 'Round', 'Heart', 'Diamond', 'Oblong']
      analysis = {
        faceShape: shapes[Math.floor(Math.random() * shapes.length)],
        jawlineDefinition: Math.floor(Math.random() * 30) + 70,
        foreheadSize: 'Medium',
        hairline: 'Straight',
        symmetry: Math.floor(Math.random() * 15) + 85,
        facialProportions: {
          foreheadToNose: 35,
          noseToLip: 28,
          lipToChin: 32,
        },
        cheekbones: 'Moderate',
        confidence: 75,
        usingMockAI: true,
        parseError: true
      }
    }
    
    return Response.json({ analysis })
    
  } catch (error: any) {
    console.error('❌ Error in face analysis API:', error)
    
    // Return mock analysis on error
    const shapes = ['Oval', 'Square', 'Round', 'Heart', 'Diamond', 'Oblong']
    const mockAnalysis = {
      faceShape: shapes[Math.floor(Math.random() * shapes.length)],
      jawlineDefinition: Math.floor(Math.random() * 30) + 70,
      foreheadSize: 'Medium',
      hairline: 'Straight',
      symmetry: Math.floor(Math.random() * 15) + 85,
      facialProportions: {
        foreheadToNose: 35,
        noseToLip: 28,
        lipToChin: 32,
      },
      cheekbones: 'Moderate',
      confidence: 70,
      usingMockAI: true,
      error: error.message
    }
    
    return Response.json({ analysis: mockAnalysis }, { status: 200 })
  }
}

