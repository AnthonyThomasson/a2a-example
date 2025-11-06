# A2A Communication Example with LangGraph

This repository demonstrates **Agent-to-Agent (A2A) communication** using the [LangGraph JavaScript library](https://github.com/langchain-ai/langgraphjs). The example showcases how multiple AI agents can collaborate and communicate to accomplish a task.

## Overview

The example implements a simple two-agent workflow:

1. **Researcher Agent** 🔬 - Gathers information on a given topic
2. **Writer Agent** ✍️ - Takes the research and formats it into a well-written summary

The agents communicate through a shared state managed by LangGraph, demonstrating the core concepts of A2A communication.

## Features

- ✅ Two collaborative AI agents with distinct roles
- ✅ State management using LangGraph
- ✅ Conditional routing between agents
- ✅ Clean, well-documented code
- ✅ Error handling and user-friendly messages

## Prerequisites

- Node.js (v18 or higher recommended)
- An OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## Installation

1. Clone this repository:
```bash
git clone https://github.com/AnthonyThomasson/a2a-example.git
cd a2a-example
```

2. Install dependencies:
```bash
npm install
```

3. Set up your OpenAI API key:
```bash
export OPENAI_API_KEY='your-api-key-here'
```

Or create a `.env` file:
```bash
echo "OPENAI_API_KEY=your-api-key-here" > .env
```

## Usage

Run the example:
```bash
npm start
```

The application will:
1. Start the Researcher Agent to gather information about LangGraph
2. Pass the research to the Writer Agent
3. Display the final formatted summary

### Expected Output

```
🚀 Starting A2A Communication Example with LangGraph
============================================================

📝 Topic: Tell me about LangGraph and its uses
============================================================

🔬 Researcher Agent is working...
Researcher findings: [Research data about LangGraph]

✍️  Writer Agent is working...
Writer output: [Formatted summary]

============================================================

✅ A2A Communication Complete!

📊 Final Summary:
------------------------------------------------------------
[Well-formatted summary about LangGraph]
------------------------------------------------------------
```

## How It Works

### State Management

The application uses LangGraph's `StateGraph` to manage the shared state between agents:

```javascript
{
  messages: [],        // Conversation history
  currentAgent: "",    // Which agent should act next
  researchData: "",    // Data from the researcher
  finalOutput: ""      // Final output from the writer
}
```

### Agent Communication Flow

```
START → Researcher Agent → Writer Agent → END
```

1. **Researcher Agent**: Receives the initial topic and gathers key information
2. **State Update**: Research data is added to the shared state
3. **Writer Agent**: Reads the research data and creates a formatted summary
4. **State Update**: Final output is stored in the state
5. **End**: The workflow completes

### Conditional Routing

The `routeAgent` function determines which agent should execute next based on the current state:

```javascript
function routeAgent(state) {
  if (state.currentAgent === "researcher") return "researcher";
  if (state.currentAgent === "writer") return "writer";
  return "end";
}
```

## Customization

### Modify the Topic

Edit the initial message in `index.js`:

```javascript
const initialState = {
  messages: [new HumanMessage("Your custom topic here")],
  // ...
};
```

### Add More Agents

You can extend the example by adding additional agents:

```javascript
// Add a new agent function
async function editorAgent(state) {
  // Implementation
}

// Add to the workflow
workflow.addNode("editor", editorAgent);

// Update routing logic
workflow.addConditionalEdges("writer", routeAgent, {
  editor: "editor",
  end: END,
});
```

### Change the LLM Model

Modify the model configuration:

```javascript
const llm = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",  // or "gpt-4-turbo", etc.
  temperature: 0.7,
});
```

## Dependencies

- `@langchain/langgraph` - Graph-based agent orchestration
- `@langchain/core` - Core LangChain functionality
- `@langchain/openai` - OpenAI integration

## Learn More

- [LangGraph Documentation](https://langchain-ai.github.io/langgraphjs/)
- [LangChain JavaScript Docs](https://js.langchain.com/)
- [Agent-to-Agent Communication Concepts](https://langchain-ai.github.io/langgraphjs/concepts/)

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
