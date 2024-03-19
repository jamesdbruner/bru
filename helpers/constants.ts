export const homeDir = Deno.env.get('HOME') || Deno.env.get('USERPROFILE')
export const denoDir = Deno.env.get('DENO_DIR') || `${homeDir}/.deno`
export const denoBin = `${denoDir}/bin`

export const binDir = './.bin'
export const srcDir = './modules'
