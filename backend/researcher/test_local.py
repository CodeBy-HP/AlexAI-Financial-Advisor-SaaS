# \!/usr/bin/env python3
"""
Test the researcher locally before deployment
"""

import asyncio
import os
from openai import AsyncAzureOpenAI
from agents import Agent, Runner, set_default_openai_client, set_default_openai_api, set_tracing_disabled
from context import get_agent_instructions, DEFAULT_RESEARCH_PROMPT
from tools import ingest_financial_document, tavily_search
from dotenv import load_dotenv

load_dotenv(override=True)

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


async def test_local():
    """Test the researcher agent locally."""
    print("Testing researcher agent locally...")
    print("=" * 60)

    # Test with no topic (agent picks)
    query = "reserach topic:Microsoft cloud revenue growth also tell me did you saved the analysis to database"

    try:
        agent = Agent(
            name="Alex Investment Researcher",
            instructions=get_agent_instructions(),
            model=os.getenv("AZURE_OPENAI_DEPLOYMENT"),  # Azure deployment name
            tools=[tavily_search, ingest_financial_document],
        )

        result = await Runner.run(agent, input=query)

        print("\nRESULT:")
        print("=" * 60)
        print(result.final_output)
        print("=" * 60)
        print("\n✅ Test completed successfully!")

    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback

        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(test_local())
