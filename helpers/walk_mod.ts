import { $, fs, log } from 'bru'
import { ProgressBar } from 'dax'

// Function to process a single file and update the progress bar
export async function runModule(
  mod: string,
  run: (mod: string) => Promise<void>,
  pb: ProgressBar,
) {
  try {
    await run(mod) // Run the module
    pb.increment() // Increment the progress bar after processing each file
  } catch (error) {
    log.error(`Error running ${mod}: ${error}`)
  }
}

// Function to recursively process files in a directory
export async function walkMod(
  dir: string,
  run: (mod: string) => Promise<void>,
  ext = '.ts',
  skipFiles: string[] = ['perm.ts'], // Array of file paths to skip
  message = `Walking ${dir}`,
) {
  const files = await collectAllFiles(dir, ext, skipFiles) // Collect all files with the given extension
  const length = files.length - skipFiles.length
  const pb = $.progress(message, { length }) // Initialize the progress bar

  await pb.with(async () => {
    for (const file of files) {
      await runModule(file, run, pb)
    }
  })
}

export async function collectAllFiles(
  dir: string,
  ext: string,
  skipFiles: string[],
): Promise<string[]> {
  const files: string[] = []
  for await (
    const entry of fs.walk(dir, {
      match: [new RegExp(`.${ext}$`)],
    })
  ) {
    if (entry.isFile && !skipFiles.includes(entry.name)) {
      files.push(entry.path)
    }
  }
  return files
}

export default walkMod
