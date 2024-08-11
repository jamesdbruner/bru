import { getModulePermissions, getModules, runModStream } from './fetchMods.ts'
import { corsHeaders, handleCors } from './utils.ts'

export const handleRequest = async (request: Request): Promise<Response> => {
  if (request.method === 'OPTIONS') {
    return handleCors()
  }

  if (request.method === 'POST') {
    const { moduleName, input } = await request.json()
    return handlePostRequest(moduleName, input)
  } else if (request.method === 'GET') {
    return handleGetRequest()
  } else {
    return new Response('Method not allowed', {
      status: 405,
      headers: corsHeaders,
    })
  }
}

const handlePostRequest = async (
  moduleName: string,
  input: Record<string, string | number | boolean>,
): Promise<Response> => {
  try {
    const permissions = await getModulePermissions(moduleName)

    if (!permissions.default.read) {
      return new Response('Forbidden', {
        status: 403,
        headers: corsHeaders,
      })
    }

    const cmd = permissions.options.name || moduleName
    const args = input ? Object.values(input).map(String) : []
    const stream = await runModStream(cmd, args)

    return new Response(stream, {
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
    })
  } catch (error) {
    console.error('Error running module:', error)
    return new Response('Internal Server Error', {
      status: 500,
      headers: corsHeaders,
    })
  }
}

const handleGetRequest = async (): Promise<Response> => {
  try {
    const modules = await getModules()
    const modulesWithPermissions = await Promise.all(
      modules.map(async (name) => {
        const permissions = await getModulePermissions(name)
        const { default: perms, options } = permissions
        return { name, perms, options }
      }),
    )

    return new Response(JSON.stringify(modulesWithPermissions), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error getting modules:', error)
    return new Response('Internal Server Error', {
      status: 500,
      headers: corsHeaders,
    })
  }
}
