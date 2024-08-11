import { handleRequest } from './routes.ts'

const port = 8000

Deno.serve({ port }, handleRequest)
