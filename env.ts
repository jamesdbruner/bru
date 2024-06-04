import { config } from 'dotenv'

// Load environment variables from .env file
config({
  path: './.env',
  export: true,
  safe: true,
  allowEmptyValues: true,
})

export const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') || ''
export const NAME = Deno.env.get('NAME') || 'bru'
