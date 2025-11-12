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
    try {
      // Remove any markdown code blocks if present
      const cleanedContent = content?.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      const analysis = JSON.parse(cleanedContent || '{}')
      
      // Validate that we have the required fields
      if (!analysis.faceShape || !analysis.confidence) {
        throw new Error('Invalid analysis structure received from OpenAI')
      }
      
      console.log('✅ Successfully parsed AI analysis:', analysis)
      return Response.json({ analysis })
      
    } catch (parseError) {
      console.error('❌ Failed to parse AI response:', parseError)
      console.error('Content was:', content)
      
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

