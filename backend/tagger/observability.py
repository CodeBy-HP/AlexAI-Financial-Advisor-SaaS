"""
Observability module for LangFuse integration.
Provides a simple context manager for flushing traces.

Note: Tracing is handled automatically by langfuse.openai wrapper in agent.py.
This module just ensures traces are properly flushed at the end.
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
    Context manager for LangFuse observability.
    
    Tracing happens automatically via langfuse.openai wrapper.
    This just ensures traces are flushed on exit.

    Usage:
        from observability import observe

        with observe():
            # Your code with LangFuse-wrapped Azure OpenAI
            result = await agent.run(...)
    """
    logger.info("🔍 Observability: LangFuse wrapper active (tracing automatic)")

    # Check if LangFuse is configured
    has_langfuse = bool(os.getenv("LANGFUSE_SECRET_KEY"))
    
    if not has_langfuse:
        logger.info("🔍 Observability: LangFuse not configured, skipping")
        yield
        return

    langfuse_client = None

    try:
        from langfuse import Langfuse
        
        # Initialize client for flushing
        langfuse_client = Langfuse()
        logger.info("✅ Observability: LangFuse client ready")

    except ImportError as e:
        logger.error(f"❌ Observability: Missing langfuse package: {e}")
    except Exception as e:
        logger.error(f"❌ Observability: Setup failed: {e}")

    try:
        # Yield control back to the calling code
        yield
    finally:
        # Flush traces on exit
        if langfuse_client:
            try:
                logger.info("🔍 Observability: Flushing traces to LangFuse...")
                langfuse_client.flush()
                
                # Small delay for network requests to complete (Lambda workaround)
                import time
                time.sleep(2)
                
                logger.info("✅ Observability: Traces flushed successfully")
            except Exception as e:
                logger.error(f"❌ Observability: Failed to flush traces: {e}")
        else:
            logger.debug("🔍 Observability: No client to flush")
