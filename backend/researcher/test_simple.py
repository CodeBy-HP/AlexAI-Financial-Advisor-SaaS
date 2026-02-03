#!/usr/bin/env python3
"""
Test Azure OpenAI with OpenAI Agents framework (without MCP server)
"""

import asyncio
import os
from openai import AsyncAzureOpenAI
from agents import Agent, Runner, function_tool, set_default_openai_client, set_default_openai_api, set_tracing_disabled
from dotenv import load_dotenv

# Load from root .env file
load_dotenv(dotenv_path="../../.env", override=True)

# Disable tracing (Azure key won't work for OpenAI tracing)
set_tracing_disabled(True)

# Switch to Chat Completions API (Azure doesn't support Responses API)
set_default_openai_api("chat_completions")

# Configure Azure OpenAI client
azure_client = AsyncAzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_version="2024-08-01-preview"
)
set_default_openai_client(azure_client)


@function_tool
def analyze_stock(symbol: str) -> str:
    """
    Analyze a stock symbol and provide mock analysis.
    
    Args:
        symbol: Stock ticker symbol (e.g., AAPL, TSLA)
    
    Returns:
        Mock stock analysis
    """
    return f"""Mock analysis for {symbol}:
    - Current Price: $150.00
    - 52-Week Range: $100 - $180
    - Market Cap: $500B
    - P/E Ratio: 25.5
    - Recommendation: Hold
    - Analyst Rating: 4/5 stars
    
    Note: This is mock data for testing purposes only."""


async def test_azure_agent():
    """Test Azure OpenAI with OpenAI Agents framework."""
    print("Testing Azure OpenAI with Agents Framework...")
    print("=" * 60)
    
    # Debug: Check environment variables
    print(f"AZURE_OPENAI_DEPLOYMENT: {os.getenv('AZURE_OPENAI_DEPLOYMENT')}")
    print(f"AZURE_OPENAI_ENDPOINT: {os.getenv('AZURE_OPENAI_ENDPOINT')}")
    print(f"AZURE_OPENAI_API_KEY: {'***' + (os.getenv('AZURE_OPENAI_API_KEY', '')[-10:] if os.getenv('AZURE_OPENAI_API_KEY') else 'NOT SET')}")
    print("=" * 60)
    
    try:
        # Create an agent with Azure OpenAI - specify model as deployment name
        agent = Agent(
            name="Investment Analyst",
            instructions="""You are a helpful investment analyst. 
            When asked about stocks, use the analyze_stock tool to get information.
            Provide a brief summary based on the analysis.""",
            model=os.getenv("AZURE_OPENAI_DEPLOYMENT"),  # Deployment name for Azure
            tools=[analyze_stock],
        )
        
        # Test query
        query = "What's your analysis on AAPL stock?"
        print(f"\nQuery: {query}")
        print("=" * 60)
        
        # Run the agent
        result = await Runner.run(agent, input=query, max_turns=5)
        
        print("\n✅ SUCCESS! Agent Response:")
        print("-" * 60)
        print(result.final_output)
        print("-" * 60)
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(test_azure_agent())
