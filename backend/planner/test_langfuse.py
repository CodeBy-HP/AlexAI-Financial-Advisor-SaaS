"""Simple test to verify Azure OpenAI connection with LangFuse tracing."""

import os
import asyncio
from dotenv import load_dotenv
from langfuse.openai import AsyncAzureOpenAI

load_dotenv(override=True)

async def test_azure_connection():
    """Test basic Azure OpenAI connection with LangFuse wrapper."""
    
    print(f"✓ AZURE_OPENAI_ENDPOINT: {os.getenv('AZURE_OPENAI_ENDPOINT')}")
    print(f"✓ AZURE_OPENAI_DEPLOYMENT: {os.getenv('AZURE_OPENAI_DEPLOYMENT')}")
    print(f"✓ LANGFUSE_SECRET_KEY: {'configured' if os.getenv('LANGFUSE_SECRET_KEY') else 'missing'}")
    
    # Create client with LangFuse wrapper
    client = AsyncAzureOpenAI(
        api_key=os.getenv("AZURE_OPENAI_API_KEY"),
        azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
        api_version="2024-08-01-preview"
    )
    
    # Simple test call
    response = await client.chat.completions.create(
        model=os.getenv("AZURE_OPENAI_DEPLOYMENT"),
        messages=[
            {"role": "user", "content": "Say 'Planner Agent Ready'"}
        ],
        max_tokens=50
    )
    
    print(f"\n✓ Response: {response.choices[0].message.content}")
    print(f"✓ Tokens used: {response.usage.total_tokens}")
    print("\n✅ Azure OpenAI connection successful with LangFuse tracing!")

if __name__ == "__main__":
    asyncio.run(test_azure_connection())
