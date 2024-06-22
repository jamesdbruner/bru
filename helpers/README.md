
  # Install Tools, Prompts, Caching, Openai Documentation

  ## Install Tools

### Install Cli

**Purpose**: The file `install_cli.ts` is designed to automate the installation of a specific Deno module using the `deno install` command.

**Functionality**: This file provides a script to install a Deno module with full permissions, specifying the module name, entry point, and import map.

**Key Functions**:
- `installMod`: An asynchronous function that executes the `deno install` command to install the module. It uses the module name from an environment configuration (`NAME`), sets the entry point to `main.ts`, and specifies an import map (`import_map.json`).

### Install

**Purpose**: The file `install.ts` is designed to automate the installation of Deno modules with specified permissions.

**Functionality**: This script reads permission requirements from separate permission files and installs each module using Deno's install command with the necessary permission flags. It checks for existing installations and can force reinstallation if needed. The script processes all modules in a specified directory, handling errors and logging the installation status.

**Key Functions**:
1. **install(name: string, force = false): Promise<string | null>**: Installs a single Deno module with the specified permissions. It reads the module's permission file, constructs the appropriate permission flags, and executes the Deno install command. If the installation fails, it can retry with the force option.
2. **installMods(): Promise<void>**: Installs all Deno modules found in the source directory. It iterates over each module directory, invoking the `install` function, and logs the results, including any errors or skipped modules.

### Uninstall

**Purpose**: The file `uninstall.ts` is designed to automate the uninstallation of Deno modules.

**Functionality**: The script identifies installed Deno modules and uninstalls them. It supports an optional timeout for the uninstallation process and logs any errors encountered during the operation.

**Key Functions**:
- **listInstalledModules()**: Identifies and returns a set of currently installed Deno modules.
- **uninstall(name: string)**: Uninstalls the specified Deno module, with an optional delay, and returns an error message if the uninstallation fails.
- **uninstallAll()**: Coordinates the uninstallation of all identified modules, logs progress, and reports any errors that occur.

### Compile

**Purpose**: The file `compile.ts` is designed to compile Deno modules for different target platforms by walking through a directory of modules, checking their permissions, and using Deno's compile command.

**Functionality**: 
- The script identifies target platforms via command-line arguments.
- It ensures the output directory exists.
- It walks through the source directory to find modules.
- It retrieves and applies the necessary permissions for each module.
- It compiles each module for the specified target platform.

**Key Functions**:
- `getFriendlyTargetName(target: string): string`: Maps a target string to a friendly name (e.g., 'x86_64-apple-darwin' to 'macos').
- `compileModule(filePath: string, moduleName: string, target: string, permissions: DenoPermissions): Promise<void>`: Compiles a specific Deno module for a given target platform using specified permissions.
- `constructDenoCompileCommandArgs(filePath: string, moduleName: string, target: string, permissions: DenoPermissions): string[]`: Constructs the command-line arguments needed for the Deno compile command.
- `compileModules(target: string): Promise<void>`: Main function that compiles all modules found in the source directory for the specified target platform.

### Uninstall Cli

**File Name**: uninstall_cli.ts

**Purpose**: The file is designed to automate the uninstallation of a CLI tool.

**Functionality**: It provides a script to uninstall a CLI tool using Deno's uninstall command.

**Key Functions**:
- `uninstallMod()`: An asynchronous function that executes the Deno uninstall command for the CLI tool identified by the `NAME` constant.
- Direct invocation of `uninstallMod()`: Ensures the function runs immediately when the script is executed.

### List

**Purpose**: The file `list.ts` is designed to list all installed Deno modules by iterating over the directory entries in the Deno binary directory.

**Functionality**: The main functionality provided by this file is to asynchronously collect the names of all entries (presumably Deno-installed modules) in the specified directory and log them in a comma-separated list along with the directory path.

**Key Functions**:
- `listInstalledModules()`: Asynchronously iterates over the directory entries in the Deno binary directory, collects their names, and logs the directory path along with a comma-separated list of the module names.

## Prompts

### Select Folders

**Purpose**: The file `select_folders.ts` is designed to present a multi-select prompt to users for selecting directories within a specified path, excluding hidden directories.

**Functionality**: The main functionality of this file is to read the contents of a specified directory, filter out hidden directories, and display a prompt to the user for selecting one or more visible directories. The selected directories' full paths are then returned.

**Key Functions**:
- `selectFolders(currentPath: string = Deno.cwd()): Promise<string[]>`: This asynchronous function reads the specified directory, filters for visible directories, presents a multi-select prompt to the user, and returns an array of full paths of the selected directories.

### Save Copy Exit

**Purpose**: The file `save_copy_exit.ts` is designed to handle a message, providing the user with options to save the message content to a file, copy it to the clipboard, or exit the program.

**Functionality**: The main functionality provided by this file is to present a set of options to the user for handling a message's content. It allows the user to choose between saving the content to a file, copying it to the clipboard, or exiting the application without performing any action on the content.

**Key Functions**:
- **SaveCopyExit**: An asynchronous function that accepts a message (either as a string or an `OpenAI.ChatCompletionMessageParam` object). It converts the message content to a string if necessary, presents the user with options to save the content to a file, copy it to the clipboard, or exit, and then executes the selected action.

### Clipboard

**Purpose**: The file `clipboard.ts` is designed to prompt users for confirmation before copying text to their clipboard.

**Functionality**: The main functionality of the file is to provide an asynchronous prompt to the user, asking for confirmation to copy a given text to the clipboard. If the user confirms, the text is copied, and a log message is displayed.

**Key Functions**:
- `clipboardPrompt(text: string): Promise<void>`: Asynchronously prompts the user with a confirmation dialog to copy the provided text to the clipboard. If confirmed, it copies the text and logs a success message.

### Overwrite

**Purpose**: The file `overwrite.ts` is designed to check if a file already exists and confirm with the user whether they want to overwrite it.

**Functionality**: The main functionality provided by this file is to prompt the user for confirmation when a file with the specified name already exists, and to return a boolean indicating whether the file should be overwritten or not.

**Key Functions**:
- **promptOverwrite**: This asynchronous function takes a file name and an optional message as parameters. It checks if the file exists using `existsSync`. If the file exists, it prompts the user with a confirmation message using `$.confirm`. The function returns `true` if the file should be overwritten, and `false` if the operation should be aborted. If the file does not exist, it returns `true` to proceed with the operation.

### Get Args

**Purpose**: The file `get_args.ts` is designed to retrieve command-line arguments based on a predefined configuration, prompting the user for input if arguments are not provided or left empty.

**Functionality**: The main functionality of this file is to support flexible argument definitions, allowing for direct values, arrays of values, or interactive user prompts. It processes these configurations and returns a record with each argument name and an array of resolved values.

**Key Functions**:
- **`getArgs`**: An asynchronous function that accepts a record of argument configurations (`args`). It processes each configuration, either using provided values or prompting the user for input if necessary. It returns a promise that resolves to a record of argument names and their corresponding values as arrays of strings.

## Openai

### Init

**Purpose**: The file `init.ts` is designed to initialize the OpenAI API using a provided API key.

**Functionality**: This file checks for an existing OpenAI API key in the environment variables. If the key is not found, it prompts the user to input their API key, sets it for the current session, and provides instructions to save it for future use. Finally, it creates and exports an instance of the OpenAI API with the API key.

**Key Functions/Classes**:
- **OpenAI**: Class instantiated with the provided API key to interact with the OpenAI API.
- **$.prompt**: Function used to prompt the user for their OpenAI API key if it is not found in the environment variables.
- **Deno.env.set**: Function to set the API key in the environment variables for the current session.
- **log**: Function to display instructions for saving the API key for future sessions.

### Summarize File

**Purpose**: The file `summarize_file.ts` is designed to generate concise summaries of other files using the OpenAI API.

**Functionality**: The main functionality provided by this file includes reading the content of a specified file, generating a summary using OpenAI's language model, and appending this summary to a JSON file (`summary.json`).

**Key Functions**:
- `summarizeFile(file: string)`: An asynchronous function that reads the content of the specified file, generates a summary using the OpenAI API, processes the response to extract the summary text, and appends the summary to `summary.json`.

### Create Completion

**Purpose**: The file `create_completion.ts` is designed to interact with the OpenAI API to generate content based on specific parameters.

**Functionality**: This file defines a function that sends a request to the OpenAI API using provided parameters for chat completion and returns the complete response.

**Key Functions**:
- **generate**: This asynchronous function takes an `OpenAI` instance and `chatCompletionParams` as arguments, sends a request to OpenAI's chat completions endpoint, and returns the generated content.

### Chat

**Purpose**: The file `chat.ts` is designed to manage a conversation with OpenAI's language model.

**Functionality**: This script facilitates an ongoing chat between a user and the OpenAI model, capturing user inputs, processing them through the OpenAI API, and handling the conversation flow until the user decides to end it.

**Key Functions**:
- `chat`: An asynchronous function that:
  - Initializes the conversation with given initial messages.
  - Continuously prompts the user for input, logs the input, and appends it to the conversation.
  - Sends the conversation messages to the OpenAI API for a response.
  - Logs and appends the OpenAI response to the conversation.
  - Checks if the user wants to continue the conversation and calls a callback function when the conversation ends.
  - Returns the last message from the conversation.

### Model

**Purpose**: The file defines a default export.

**Functionality**: This file sets a default export value for use in other parts of the application.

**Key Functions**:
- Default Export: The string 'gpt-4o' is exported as the default value.

### Code Fence

**File Name**: code_fence.ts

**Purpose**: The purpose of this file is to provide a utility function that formats a given string as a code block.

**Functionality**: The main functionality of this file is to wrap a given string in Markdown code fence syntax.

**Key Functions**:
- `codeFence(contents: string)`: Takes a string `contents` and returns it wrapped in Markdown code fence syntax, facilitating the inclusion of code blocks in Markdown documents.

### Chat Loop

**Purpose**: The file `chat_loop.ts` is designed to manage a conversational loop with the user, allowing them to refine the output or save the response and exit.

**Functionality**: The main functionality of this file is to prompt the user to decide whether to continue refining a chat response or to save the current response and exit. It integrates with the OpenAI API for generating chat completions and handles user interactions through confirmation prompts.

**Key Functions**:
- **chatLoop**: This asynchronous function takes an array of chat completion message parameters and a response string. It appends the response to the message array, prompts the user to decide whether to refine the output, and either continues the conversation or saves the response and exits based on the user's input.

### Stream Response

**Purpose**: The file `stream_response.ts` is designed to initiate a streaming session with OpenAI, accumulate the generated content, and write it directly to the standard output.

**Functionality**: The main functionality provided by this file is to stream responses from OpenAI's chat completion API, accumulate the content generated during the session, and output it in real-time to the standard output.

**Key Functions**:
- **stream**: This asynchronous function initiates a stream with OpenAI using the provided chat completion parameters, accumulates the generated content, writes it to the standard output, and returns the accumulated content as a string.

## Caching

### Copy Cached

**Purpose**: The file `copy_cached.ts` is designed to copy cached files from specified directories to a given output directory.

**Functionality**: The main functionality provided by this file is to ensure the specified output directory exists, read a hash table to determine which files need to be copied, and then copy these files from the cache to the output directory while filtering by file extension. It also handles errors and logs the progress of the copying process.

**Key Functions**:
- `copyCachedFiles(path: string, selectedDirs: string[], ext: string): Promise<void>`: This is the primary function that performs the following tasks:
  - Ensures the output directory exists.
  - Reads and parses the hash table from a predefined path.
  - Filters the selected directories.
  - Uses a progress bar to track and log the copying process.
  - Copies files from the cache to the output directory, handling errors appropriately.

### Hashtable

**Purpose**: The file `hashtable.ts` is designed to manage a hash table for caching purposes, maintaining a nested directory structure in a YAML file.

**Functionality**: 
- The file provides functions to update, check, and remove entries in the hash table.
- It ensures the hash table file exists and reads or initializes its content as needed.

**Key Functions**:
1. **updateHashTable(entry: string)**: Adds a new entry to the hash table and updates the YAML file.
2. **checkHashTable(key: string)**: Checks if a given key exists in the hash table and returns the file path if found.
3. **removeFromHashTable(filePath: string)**: Removes an entry from the hash table and updates the YAML file accordingly.
4. **ensureHashTable()**: Ensures the hash table file exists and parses its content into a `HashTable` object.

### Cache

**Purpose**: The file `cache.ts` is designed to provide caching functionality within the application.

**Functionality**: The file offers functions to write data to a cache, read data from the cache, and remove data from the cache, ensuring efficient data retrieval and storage.

**Key Functions**:
- `writeToCache(filePath: string, content: string, ext: string = '.txt'): Promise<void>`: Writes the specified content to a cache file at the given file path, creating necessary directories if they do not exist.
- `readFromCache(filePath: string, ext: string = '.txt'): Promise<string>`: Reads and returns the content from a cache file at the given file path. Throws an error if the file does not exist.
- `removeFromCache(filePath: string, ext: string = '.txt'): Promise<void>`: Removes the specified cache file and logs the removal. Also updates the hash table to reflect the removal.

### Config

**Purpose**: The file `config.ts` is designed to handle reading and writing configuration settings to and from a YAML file within a caching directory.

**Functionality**: The main functionality provided by this file includes reading configuration data from a YAML file and writing configuration data back to a YAML file. It ensures that the cache directory exists and manages the configuration using a specified namespace.

**Key Functions**:
- **readFromConfig(name: string = NAME): Promise<Config>**: Reads the configuration from a `<namespace>_config.yml` file located in the cache directory. It returns a promise that resolves to a configuration object.
- **writeToConfig(config: Config, name: string = NAME): Promise<void>**: Writes the given configuration object to a `<namespace>_config.yml` file in the cache directory. It ensures the cache directory exists before writing the file.

generated by **bru** using openai **gpt-4o**