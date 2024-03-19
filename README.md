> **⚠️ DISCLAIMER**: bru is an open source proof of concept and in active
> development. It is **not** intended for production use and comes with no
> guarantees. I haven't benchmarked anything and realistically we're running
> javascript here. Which is to say that for a lot of scenarios this could be a
> fine option and you could potentially even just uses Deno's FFI to offload
> lower level tasks that require more performant means of execution but if
> performance is your highest priority then I would start elsewhere

![Deno](https://img.shields.io/badge/-Deno-black?style=flat-square&logo=deno)
![Deno Version](https://img.shields.io/badge/v1.41.0-black)

**bru** is a template for developing and managing cross-platform (MacOs, Linux
and Windows) [Deno](https://deno.com/) commands and modules, name inspired by
[homebrew](https://brew.sh/)

This repo includes
[examples](https://github.com/jamesdbruner/bru_test/tree/main/modules) (built
using [dax](https://github.com/dsherret/dax) and [openai](https://openai.com/))
showcasing how it could potentially be used, the example modules aren't meant to
be used for anything serious

## Features

**Automated Workflows:** Preconfigured github actions and git hooks for
automatic versioning, tagging, and releases based on conventional commit
standards

**Module Management:** Scaffold, install, and globally execute Deno modules
using simple project tasks

**Permission Management:** Define module permissions upfront in a `perm.ts`
file, streamlining installation and execution without runtime prompts

## Install

If you haven't already,
[install deno](https://docs.deno.com/runtime/manual/getting_started/installation)

Then clone this repository and run the installation task to set up all modules
with necessary permissions:

```bash
git clone https://github.com/jamesdbruner/bru bru
cd bru
deno task install
```

The `deno task install` command installs each module from the modules/
directory, applying permissions defined in each `modules/<module_name>/perm.ts`
files which makes it so that you don't have to ask for permissions directly each
time you run the command

## Modules

Running `deno task new` will prompt you for the name of your new module and
create the mod.ts and perm.ts files for you. You'll need to make sure that your
perm.ts has the correct permissions so that when you go to run
`deno task install` that it installs your new command with the correct
permissions which makes it so you don't have to prompt for the permissions each
time you run the module

<!-- deno-fmt-ignore-start -->
```
bru/
├── modules/
│ ├── file_chat/
│ │ └── mod.ts
│ │ └── perm.ts
│ ├── your_module/
│ │ └── mod.ts
│ │ └── perm.ts
```
<!-- deno-fmt-ignore-end -->

Running `deno task install` displays all of the installed deno commands

## Binaries

Your `.bin/` directory should be empty (or not exist) until you run the
`compile_mods.ts` script. Here's a visual representation of what the folder
structure looks like. You write your code and manage your modules in the
`modules/` directory and when you run `deno task compile_mods` it will generate
binaries into the .bin folder and compiles binaries for all 3 targets

<!-- deno-fmt-ignore-start -->
```
bru/
├── .bin/
│ ├── linux/
│ │ └── file_chat
│ │ └── code_summary
│ ├── macos/
│ │ └── file_chat
│ │ └── code_summary
│ ├── windows/
│ │ └── file_chat
│ │ └── code_summary
│
├── modules/
│ ├── file_chat/
│ │ └── mod.ts
│ │ └── perm.ts
│ ├── code_summary/
│ │ └── mod.ts
│ │ └── perm.ts
│
├── helpers/install_tools/
│ └── compile.ts
```
<!-- deno-fmt-ignore-end -->

From what I've seen the binaries tend to be large and I prefer using the
`deno task install` approach which installs each module locally to .deno/bin
with the correct permissions from your perm.ts file

## Usage

Follow these steps to create, install, and run your own Deno modules

### Creating a New Module

Use the deno task new command to start the creation of a new module. You will be
prompted to enter a name for your module

```bash
deno task new
```

This will create a new directory under modules/ with your module name, and
inside it, you will find mod.ts and perm.ts files

Edit the perm.ts file in your module directory to specify the permissions your
module requires. This step is crucial for ensuring your module has the necessary
permissions when installed and run

```typescript
// modules/your_module/perm.ts
export default {
  read: true,
  write: true,
  // Add other permissions as needed
}
```

Write your module's logic in the mod.ts file

```typescript
// modules/your_module/mod.ts
console.log('Hello from your new module!')
```

### Installing Modules

After creating your module, you can install it globally on your machine

```bash
deno task install
```

This command reads the permissions from `your_module/perm.ts` and installs the
module globally, making it available as a command in your terminal

### Running Installed Modules

Once installed, you can run your module directly from the command line using the
name you provided during the creation

```bash
your_module
```

Listing Installed Modules To see a list of all Deno modules installed by bru,
including those from this project, you can use:

```bash
deno task list
```

### Compiling Modules

If you prefer to compile your modules into standalone executables you can run
the following command to compile all modules into binaries for macOS, Linux, and
Windows

```bash
deno task compile_mods
```

Check the .bin/ directory in your project root for the compiled binaries.

```plaintext
bru/.bin/macos/your_module
```

### Uninstalling Modules

To remove modules that you've installed:

```bash
deno task uninstall
```

This command uninstalls the modules from ~/.deno/bin, cleaning up the installed
commands

### Tasks

First cd into this repository locally, assuming you've gone through the
installation instructions and cloned this repo down already

| Task                     | Description                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------------- |
| `deno task run`          | Runs `main.ts` which lists all modules in `<root>/modules/` that can be selected and run    |
| `deno task list`         | Displays a list of globally installed Deno modules                                          |
| `deno task install`      | Installs modules, applying permissions from respective `perm.ts` files in `<root>/modules/` |
| `deno task uninstall`    | Removes installed modules from `~/.deno/` that exist in `<root>/modules/`                   |
| `deno task compile_mods` | Compiles all modules into executables for [macOS, Linux, Windows] in `bru/.bin`             |

## Contributions

If you're looking to contribute, please follow these steps

**Fork the Repo:** Start by forking this repo

**Create a Branch:** For each contribution, create a new branch in your forked
repo

**Make Changes:** Implement your changes, fix a bug, or add a new feature in
your branch

**Test Changes:** Ensure your changes don't break existing functionality and
that they follow the project's coding standards

**Submit Pull Request:** Once you're satisfied with your changes, submit a pull
request to the main bru repo

## License

`bru` is open-sourced software licensed under the
[MIT License](https://www.mit.edu/~amini/LICENSE.md). This permissive license
allows for reuse, modification, and distribution of the software, provided that
the original license and copyright notice are included in all copies or
substantial portions of the software.

For more details, see the full
[MIT License](https://www.mit.edu/~amini/LICENSE.md).
