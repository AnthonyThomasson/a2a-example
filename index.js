import { StateGraph, END, START } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

/**
 * Basic A2A (Agent-to-Agent) Communication Example using LangGraph
 * 
 * This example demonstrates two agents communicating with each other:
 * - Agent 1: Researcher - Gathers information
 * - Agent 2: Writer - Processes and formats the information
 */

// Initialize the LLM (using OpenAI GPT-4)
// Note: You need to set OPENAI_API_KEY environment variable
const llm = new ChatOpenAI({
  modelName: "gpt-4",
  temperature: 0.7,
});

/**
 * Researcher Agent - Simulates gathering information on a topic
 */
async function researcherAgent(state) {
  console.log("\n🔬 Researcher Agent is working...");
  
  const topic = state.messages[state.messages.length - 1]?.content || "AI and Machine Learning";
  
  const researchPrompt = `You are a research agent. Gather key facts about: ${topic}. 
  Provide 3-4 important points in a concise manner.`;
  
  const response = await llm.invoke([new HumanMessage(researchPrompt)]);
  
  console.log("Researcher findings:", response.content);
  
  return {
    ...state,
    researchData: response.content,
    currentAgent: "writer",
    messages: [...state.messages, response],
  };
}

/**
 * Writer Agent - Takes research and formats it into a well-written output
 */
async function writerAgent(state) {
  console.log("\n✍️  Writer Agent is working...");
  
  const writerPrompt = `You are a writer agent. Take the following research data and 
  create a well-formatted, engaging summary:
  
  Research Data: ${state.researchData}
  
  Create a concise, professional summary with proper formatting.`;
  
  const response = await llm.invoke([new HumanMessage(writerPrompt)]);
  
  console.log("Writer output:", response.content);
  
  return {
    ...state,
    finalOutput: response.content,
    currentAgent: "complete",
    messages: [...state.messages, response],
  };
}

/**
 * Router function - Determines which agent should act next
 */
function routeAgent(state) {
  if (state.currentAgent === "researcher") {
    return "researcher";
  } else if (state.currentAgent === "writer") {
    return "writer";
  } else {
    return "end";
  }
}

/**
 * Build the A2A communication graph
 */
function buildGraph() {
  const workflow = new StateGraph({
    channels: {
      messages: {
        value: (left, right) => (left || []).concat(right || []),
        default: () => [],
      },
      currentAgent: {
        value: (left, right) => right || left,
        default: () => "researcher",
      },
      researchData: {
        value: (left, right) => right || left,
        default: () => "",
      },
      finalOutput: {
        value: (left, right) => right || left,
        default: () => "",
      },
    },
  });

  // Add nodes for each agent
  workflow.addNode("researcher", researcherAgent);
  workflow.addNode("writer", writerAgent);

  // Set entry point
  workflow.addEdge(START, "researcher");

  // Add conditional routing from researcher
  workflow.addConditionalEdges("researcher", routeAgent, {
    writer: "writer",
    end: END,
  });

  // Add edge from writer to end
  workflow.addEdge("writer", END);

  return workflow.compile();
}

/**
 * Main execution function
 */
async function main() {
  console.log("🚀 Starting A2A Communication Example with LangGraph\n");
  console.log("=".repeat(60));
  
  // Check for API key
  if (!process.env.OPENAI_API_KEY) {
    console.error("\n❌ Error: OPENAI_API_KEY environment variable not set!");
    console.log("\nTo run this example:");
    console.log("1. Get an API key from https://platform.openai.com/api-keys");
    console.log("2. Set it as an environment variable:");
    console.log("   export OPENAI_API_KEY='your-api-key-here'");
    console.log("3. Run the example again: npm start\n");
    process.exit(1);
  }

  try {
    // Build the graph
    const app = buildGraph();
    
    // Initial state with a topic to research
    const initialState = {
      messages: [new HumanMessage("Tell me about LangGraph and its uses")],
      currentAgent: "researcher",
      researchData: "",
      finalOutput: "",
    };
    
    console.log("\n📝 Topic: Tell me about LangGraph and its uses");
    console.log("=".repeat(60));
    
    // Run the graph
    const result = await app.invoke(initialState);
    
    console.log("\n" + "=".repeat(60));
    console.log("\n✅ A2A Communication Complete!\n");
    console.log("📊 Final Summary:");
    console.log("-".repeat(60));
    console.log(result.finalOutput);
    console.log("-".repeat(60));
    
  } catch (error) {
    console.error("\n❌ Error occurred:", error.message);
    if (error.message.includes("API key")) {
      console.log("\nPlease ensure your OPENAI_API_KEY is valid.");
    }
    process.exit(1);
  }
}

// Run the example
main().catch(console.error);
