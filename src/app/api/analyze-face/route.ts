import OpenAI from 'openai'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { image } = await req.json()
    
    console.log('📸 Image data received, length:', image?.length || 0)
    console.log('📸 Image format:', image?.substring(0, 50) + '...')
    
    // Check if OpenAI API key exists
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY not found')
      return Response.json(
        { 
          error: 'OpenAI API key not configured',
          message: 'Please add your OPENAI_API_KEY to the environment variables to use AI face analysis.'
        },
        { status: 503 } // Service Unavailable
      )
    }

    console.log('🤖 Starting AI face analysis with OpenAI Vision...')
    
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [{
        role: "user",
        content: [
          {
            type: "text",
            text: `CRITICAL: You MUST respond with ONLY valid JSON. No explanations, no apologies, no text. ONLY JSON.

Analyze the face in this image and return this EXACT JSON structure (fill in the values):

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

RULES:
- faceShape: MUST be ONE of: Oval, Square, Round, Heart, Diamond, Oblong
- jawlineDefinition: Number 0-100
- foreheadSize: MUST be ONE of: Small, Medium, Large  
- hairline: MUST be ONE of: Straight, Rounded, Widow's Peak, Receding
- symmetry: Number 0-100
- cheekbones: MUST be ONE of: Prominent, Moderate, Subtle
- facialProportions: Numbers should sum to ~95-100
- confidence: Number 0-100

IMPORTANT: 
- If you cannot clearly see a face, set confidence to 50 and make best estimates
- NEVER respond with text explanations
- NEVER start with "I'm sorry" or any apology
- Your response must START with { and END with }
- Do NOT wrap in markdown code blocks`
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
    try {
      if (!content) {
        throw new Error('OpenAI returned empty response')
      }
      
      // Check if OpenAI returned text instead of JSON
      if (content.toLowerCase().includes("i'm sorry") || 
          content.toLowerCase().includes("i cannot") ||
          content.toLowerCase().includes("i can't") ||
          !content.trim().startsWith('{')) {
        console.error('❌ OpenAI returned text instead of JSON:', content)
        throw new Error('OpenAI could not analyze the image. Please ensure the image shows a clear face and try again.')
      }
      
      // Try multiple parsing strategies
      let cleanedContent = content.trim()
      
      // Remove markdown code blocks (all variations)
      cleanedContent = cleanedContent.replace(/```json\s*/g, '').replace(/```\s*/g, '')
      
      // Try to extract JSON if it's embedded in text
      const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        cleanedContent = jsonMatch[0]
      }
      
      console.log('🔍 Cleaned content for parsing:', cleanedContent.substring(0, 200))
      
      const analysis = JSON.parse(cleanedContent)
      
      // Validate that we have the required fields
      if (!analysis.faceShape || !analysis.confidence) {
        throw new Error(`Missing required fields. Got: ${Object.keys(analysis).join(', ')}`)
      }
      
      console.log('✅ Successfully parsed AI analysis:', analysis)
      return Response.json({ analysis })
      
    } catch (parseError) {
      console.error('❌ Failed to parse AI response:', parseError)
      console.error('❌ Raw content was:', content)
      console.error('❌ Content length:', content?.length || 0)
      
      return Response.json(
        { 
          error: 'Failed to parse AI response',
          message: 'OpenAI returned an invalid response. Please try again.',
          details: parseError instanceof Error ? parseError.message : 'Unknown error'
        },
        { status: 500 }
      )
    }
    
  } catch (error: any) {
    console.error('❌ Error in face analysis API:', error)
    console.error('❌ Error type:', error.constructor.name)
    console.error('❌ Error status:', error.status)
    console.error('❌ Error code:', error.code)
    console.error('❌ Error message:', error.message)
    console.error('❌ Full error object:', JSON.stringify(error, null, 2))
    
    // Check if it's an OpenAI API error
    if (error.status === 401) {
      return Response.json(
        { 
          error: 'Invalid OpenAI API key',
          message: 'The OpenAI API key is invalid or expired. Please check your configuration.'
        },
        { status: 401 }
      )
    }
    
    if (error.status === 429) {
      return Response.json(
        { 
          error: 'Rate limit exceeded',
          message: 'OpenAI rate limit exceeded. Please try again in a few minutes.'
        },
        { status: 429 }
      )
    }
    
    if (error.status === 400) {
      return Response.json(
        { 
          error: 'Bad request',
          message: 'Invalid image format or size. Please try a different image.',
          details: error.message || 'Image may be too large or in an unsupported format'
        },
        { status: 400 }
      )
    }
    
    if (error.status === 403 || error.code === 'content_policy_violation') {
      return Response.json(
        { 
          error: 'Content policy violation',
          message: 'Image violates OpenAI content policy. Please try a different image.',
          details: error.message
        },
        { status: 403 }
      )
    }
    
    if (error.status === 402 || error.code === 'insufficient_quota') {
      return Response.json(
        { 
          error: 'Insufficient quota',
          message: 'OpenAI account has insufficient credits. Please add billing information.',
          details: error.message
        },
        { status: 402 }
      )
    }
    
    return Response.json(
      { 
        error: 'Face analysis failed',
        message: 'An error occurred during face analysis. Please try again.',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    )
  }
}

