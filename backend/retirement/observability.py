"""
Observability module for LangFuse integration.
Provides a simple context manager for flushing traces.
"""

import os
import logging
from contextlib import contextmanager

# Use root logger for Lambda compatibility
logger = logging.getLogger()
logger.setLevel(logging.INFO)


@contextmanager
def observe():
    """
    Context manager for observability with LangFuse.

    The langfuse.openai.AsyncAzureOpenAI wrapper handles automatic tracing.
    This context manager just ensures traces are flushed on exit.

    Usage:
        from observability import observe

        with observe():
            # Your code that uses OpenAI Agents SDK
            result = await agent.run(...)
    """
    logger.info("🔍 Observability: LangFuse tracing active via wrapper")
    
    # Local variable for the client (no global needed)
    langfuse_client = None

    # Try to set up LangFuse for flushing
    try:
        from langfuse import get_client
        
        # Initialize LangFuse client for flushing
        langfuse_client = get_client()
        logger.info("✅ Observability: LangFuse client ready")

    except ImportError as e:
        logger.warning(f"⚠️  Observability: LangFuse not available: {e}")
        langfuse_client = None
    except Exception as e:
        logger.warning(f"⚠️  Observability: Setup warning: {e}")
        langfuse_client = None

    try:
        # Yield control back to the calling code
        yield
    finally:
        # Flush traces on exit
        if langfuse_client:
            try:
                logger.info("🔍 Observability: Flushing traces...")
                langfuse_client.flush()
                logger.info("✅ Observability: Traces flushed")
            except Exception as e:
                logger.warning(f"⚠️  Observability: Flush warning: {e}")
        else:
            logger.debug("🔍 Observability: No client to flush")

