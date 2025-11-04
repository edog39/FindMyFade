# Environment Variables Template

Copy this to your `.env.local` file in the project root.

```bash
# Database URL (PostgreSQL - Neon)
DATABASE_URL="postgresql://neondb_owner:your_password@your-host.neon.tech/neondb?sslmode=require"

# OpenAI API Key (for AI face analysis)
# Get your key at: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-proj-your-openai-api-key-here

# Optional: Other API keys (not yet implemented)
# STRIPE_SECRET_KEY=sk_test_your_stripe_key_here
# TWILIO_AUTH_TOKEN=your_twilio_token_here
```

## How to Use:

1. Create `.env.local` in your project root
2. Copy the above variables
3. Replace `your-openai-api-key-here` with your actual API key
4. Restart your dev server: `npm run dev`

