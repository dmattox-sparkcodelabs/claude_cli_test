/**
 * Claude CLI Context Retention Test
 * 
 * This application demonstrates how to programmatically call the Claude CLI from Node.js
 * and tests whether context is retained between multiple calls. It compares two scenarios:
 * 1. Default behavior (no context retention)
 * 2. Using the --continue flag (context retention enabled)
 */

const { spawn } = require('child_process');

/**
 * Spawns a Claude CLI process and sends a prompt via stdin
 * @param {string} prompt - The text prompt to send to Claude
 * @param {boolean} useContinue - Whether to use the --continue flag for context retention
 * @returns {Promise<string>} - Claude's response as a string
 */
function callClaude(prompt, useContinue = false) {
  return new Promise((resolve, reject) => {
    // Set up arguments: use -c flag if context continuation is requested
    const args = useContinue ? ['-c'] : [];
    
    // Spawn the claude CLI process
    const claude = spawn('claude', args, {
      stdio: ['pipe', 'pipe', 'pipe'] // Enable stdin/stdout/stderr piping
    });

    let output = '';
    let error = '';

    // Collect data from Claude's stdout (the response)
    claude.stdout.on('data', (data) => {
      output += data.toString();
    });

    // Collect any error messages from stderr
    claude.stderr.on('data', (data) => {
      error += data.toString();
    });

    // Handle process completion
    claude.on('close', (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(`Claude CLI exited with code ${code}: ${error}`));
      }
    });

    // Send the prompt to Claude via stdin and close the input stream
    claude.stdin.write(prompt);
    claude.stdin.end();
  });
}

/**
 * Test function that demonstrates default Claude CLI behavior (no context retention)
 * Each call spawns a fresh Claude instance with no memory of previous interactions
 */
async function testWithoutContinue() {
  console.log('=== Testing WITHOUT --continue flag ===\n');
  
  // First call - ask about cats
  const prompt1 = "Tell me one interesting fact about cats.";
  console.log('Call 1:');
  console.log('Prompt:', prompt1);
  const response1 = await callClaude(prompt1, false);
  console.log('Response:', response1);
  console.log('---\n');
  
  // Second call - ask what animal was discussed (should fail without context)
  const prompt2 = "What was the animal I just asked about?";
  console.log('Call 2:');
  console.log('Prompt:', prompt2);
  const response2 = await callClaude(prompt2, false);
  console.log('Response:', response2);
  console.log('---\n');
}

/**
 * Test function that demonstrates Claude CLI with context retention enabled
 * The --continue flag allows subsequent calls to remember previous interactions
 */
async function testWithContinue() {
  console.log('=== Testing WITH --continue flag ===\n');
  
  // First call - ask about dogs (using continue flag)
  const prompt1 = "Tell me one interesting fact about dogs.";
  console.log('Call 1:');
  console.log('Prompt:', prompt1);
  const response1 = await callClaude(prompt1, true);
  console.log('Response:', response1);
  console.log('---\n');
  
  // Second call - ask what animal was discussed (should succeed with context)
  const prompt2 = "What was the animal I just asked about?";
  console.log('Call 2:');
  console.log('Prompt:', prompt2);
  const response2 = await callClaude(prompt2, true);
  console.log('Response:', response2);
  console.log('---\n');
}

/**
 * Main function that runs both test scenarios to compare behavior
 * Demonstrates the difference between isolated calls vs. contextual conversations
 */
async function main() {
  try {
    // Run test without context retention
    await testWithoutContinue();
    console.log('\n');
    
    // Run test with context retention
    await testWithContinue();
  } catch (error) {
    console.error('Error calling Claude:', error.message);
  }
}

main();