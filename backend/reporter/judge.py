from agents import Agent, Runner, set_default_openai_client, set_default_openai_api, set_tracing_disabled
from pydantic import BaseModel, Field
import os
import logging
from langfuse.openai import AsyncAzureOpenAI
from dotenv import load_dotenv

load_dotenv(override=True)

logger = logging.getLogger()

# Disable OpenAI's built-in tracing (we use LangFuse instead)
set_tracing_disabled(True)

# Switch to Chat Completions API (Azure doesn't support Responses API)
set_default_openai_api("chat_completions")

# Configure Azure OpenAI client with LangFuse wrapper for automatic tracing
azure_client = AsyncAzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_version="2024-08-01-preview"
)
set_default_openai_client(azure_client)


class Evaluation(BaseModel):
    feedback: str = Field(
        description="Your feedback on the financial report and rationale for your score"
    )
    score: float = Field(
        description="Score from 0 to 100 where 0 represents a terrible quality financial report and 100 represents an outstanding financial report"
    )


async def evaluate(original_instructions, original_task, original_output) -> Evaluation:
    logger.info(f"Using Azure OpenAI deployment: {os.getenv('AZURE_OPENAI_DEPLOYMENT')}")

    instructions = """
You are an Evaluation Agent that evaluates the quality of a financial report from a financial planning agent.
You will be provided with the instructions that were sent to the analyst, and its output, and you must evaluate the quality of the output.
"""

    # Create task
    task = f"""
The financial planning agent was given the following instructions:

{original_instructions}

And it was assigned this task:

{original_task}

The financial planning agent's output was:

{original_output}

Evaluate this output and respond with your comments and score.
"""

    try:
        logger.info("Judging financial report")
        agent = Agent(
            name="Judge Agent", 
            instructions=instructions, 
            model=os.getenv("AZURE_OPENAI_DEPLOYMENT"), 
            output_type=Evaluation
        )
        result = await Runner.run(agent, input=task, max_turns=5)
        return result.final_output_as(Evaluation)
    except Exception as e:
        logger.error(f"Error evaluating financial report: {e}")
        return Evaluation(feedback=f"Error evaluating financial report: {e}", score=80)
