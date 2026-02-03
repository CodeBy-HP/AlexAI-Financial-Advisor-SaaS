#!/usr/bin/env python3
"""
Test to verify LangFuse integration with Azure OpenAI for Reporter agent
"""

import asyncio
import os
from dotenv import load_dotenv

load_dotenv(override=True)

# Import the LangFuse-wrapped Azure client
from langfuse.openai import AsyncAzureOpenAI

async def test_langfuse_reporter():
    """Test that LangFuse wrapper captures Azure OpenAI calls for reporter"""
    
    print("Testing Reporter Agent - LangFuse + Azure OpenAI Integration...")
    print("=" * 60)
    
    # Check configuration
    print(f"LANGFUSE_SECRET_KEY: {'✓ Set' if os.getenv('LANGFUSE_SECRET_KEY') else '✗ Missing'}")
    print(f"AZURE_OPENAI_API_KEY: {'✓ Set' if os.getenv('AZURE_OPENAI_API_KEY') else '✗ Missing'}")
    print(f"AZURE_OPENAI_ENDPOINT: {os.getenv('AZURE_OPENAI_ENDPOINT', 'Not set')}")
    print(f"AZURE_OPENAI_DEPLOYMENT: {os.getenv('AZURE_OPENAI_DEPLOYMENT', 'Not set')}")
    print()
    
    # Create LangFuse-wrapped Azure client
    print("Creating LangFuse-wrapped Azure OpenAI client...")
    client = AsyncAzureOpenAI(
        api_key=os.getenv("AZURE_OPENAI_API_KEY"),
        azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
        api_version="2024-08-01-preview"
    )
    print("✓ Client created")
    print()
    
    # Make a simple test call
    print("Making a test API call (this will be traced to LangFuse)...")
    try:
        response = await client.chat.completions.create(
            model=os.getenv("AZURE_OPENAI_DEPLOYMENT"),
            messages=[
                {"role": "system", "content": "You are a financial analyst."},
                {"role": "user", "content": "Say 'Reporter agent LangFuse integration working!' in one sentence."}
            ],
            temperature=0.7,
            max_tokens=50,
            # LangFuse-specific parameters
            name="reporter-test-trace",
            metadata={"test": "reporter_langfuse", "agent": "reporter"}
        )
        
        print("✓ API call successful!")
        print(f"Response: {response.choices[0].message.content}")
        print()
        
        # Flush traces
        print("Flushing traces to LangFuse...")
        from langfuse import Langfuse
        langfuse = Langfuse()
        langfuse.flush()
        
        print("✓ Traces flushed!")
        print()
        print("=" * 60)
        print("SUCCESS! Check your LangFuse dashboard:")
        print("https://cloud.langfuse.com")
        print("You should see a trace named 'reporter-test-trace'")
        print("=" * 60)
        
    except Exception as e:
        print(f"✗ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_langfuse_reporter())
