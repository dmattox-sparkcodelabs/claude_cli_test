# Claude CLI Context Retention Test

A Node.js application that demonstrates how to programmatically call the Claude CLI and test context retention between multiple calls.

## Overview

This project explores how the Claude CLI handles conversation context when called from external programs. It compares two scenarios:

1. **Default behavior**: Each CLI call starts a fresh conversation with no memory of previous interactions
2. **Context retention**: Using the `--continue` flag to maintain conversation history across multiple calls

## Prerequisites

- Node.js installed on your system
- Claude CLI installed and configured
- Access to the `claude` command in your PATH

## Installation

1. Clone or download this project
2. Initialize Claude CLI in the project directory:
   ```bash
   claude --init
   ```
   This creates the necessary configuration for Claude to work in this directory and enables conversation history storage.
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

Run the test application:

```bash
npm start
```

Or run directly with Node:

```bash
node index.js
```

## What It Does

The application runs two test scenarios:

### Test 1: Without Context Retention
- Makes two separate calls to Claude CLI without any flags
- First call asks for a fact about cats
- Second call asks "What was the animal I just asked about?"
- **Expected result**: The second call won't remember the first call

### Test 2: With Context Retention
- Makes two calls to Claude CLI using the `--continue` flag
- First call asks for a fact about dogs
- Second call asks "What was the animal I just asked about?"
- **Expected result**: The second call remembers the first call and responds "Dogs"

## Code Structure

- `callClaude(prompt, useContinue)`: Core function that spawns Claude CLI process
  - `prompt`: The text to send to Claude
  - `useContinue`: Boolean flag to enable `--continue` option
- `testWithoutContinue()`: Demonstrates isolated CLI calls
- `testWithContinue()`: Demonstrates contextual CLI calls
- `main()`: Orchestrates both test scenarios

## Key Learnings

- Each `claude` CLI invocation is isolated by default
- The `--continue` flag enables conversation persistence across calls
- Context retention only applies to the spawned processes, not the parent Node.js application
- This approach allows building chatbot-like applications that maintain conversation state

## Technical Details

The application uses Node.js `child_process.spawn()` to:
- Launch Claude CLI as a subprocess
- Send prompts via stdin
- Capture responses from stdout
- Handle errors from stderr

## Example Output

```
=== Testing WITHOUT --continue flag ===

Call 1:
Prompt: Tell me one interesting fact about cats.
Response: Cats have a special scent organ called the Jacobson's organ...

Call 2:
Prompt: What was the animal I just asked about?
Response: I don't see any previous messages in our conversation...

=== Testing WITH --continue flag ===

Call 1:
Prompt: Tell me one interesting fact about dogs.
Response: Dogs can be left or right-pawed, just like humans...

Call 2:
Prompt: What was the animal I just asked about?
Response: Dogs.
```