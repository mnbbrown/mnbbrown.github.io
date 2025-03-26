---
title: Defining AI tools in python
category: notes
publishedDate: 2025-03-26
---


With the explosion of agent frameworks we’re seeing different approaches to defining agent “tools” in python. The two immediately obvious approaches are using the `docstring` or using a `pydantic model` to define the tool arguments. 

> **Opinions wanted**: I don’t have an agent framework to shill, nor do I really have a strong opinion about either… What do you think? Comment on Hacker News.

### Option 1: docstring

A simple python function with an optional docstring to define additional context (like field descriptions)

```python
def search_customer(postcode: str | None = None):
	"""Search for customers.

    Args:
        postcode: The customer's postcode
  """
```

Pros:

*This style is used by lots of agent frameworks*

- PydanticAI ([see docs](https://ai.pydantic.dev/tools/#function-tools-and-schema))
- OpenAI Agents Framework ([see docs](https://openai.github.io/openai-agents-python/tools/))
- MCP Python SDK ([see docs](https://github.com/modelcontextprotocol/python-sdk?tab=readme-ov-file#quickstart))

Internally all of these tools convert the signature + docstring into a pydantic model…

*Can’t do funny things with models like union types:* For example `SearchCustomerParamsV1 | SearchCustomerParamsV2` which produces `anyOf` schemas which aren’t supported by the models.

*You’re just writing normal python functions. T*ype hints in function signatures are more visible in IDEs without having to look at model definitions. Better integration with existing tooling (mypy, pylint, etc.)

Cons:

*Action arguments interleaved with magic/injected variables.* For example in the below example it may not be super clear which arguments are model provided vs dependency injected.

```python
@tool()
def search_customer(
	postcode: str | None = None, # tool argument
	ctx: Context,  # special variable name/type which is injected by us
	# dependency injected arguments (FastAPI style)
	crm_client: Client = Depends(get_crm_client),
  crm_customer: Customer | None = Depends(get_crm_customer),
  session: Session = Depends(get_db_session),
):
	"""Search for customers.

    Args:
        postcode: The customer's postcode
  """
```

*Documentation and constraints are separated from the type definitions* (i.e. no pydantic validation). Also `docstrings` can be unwieldy and long winded. 

### Option 2: pydantic model

In this case the function has one special argument called “arguments” or “params” which is a pydantic model that represents the function arguments. 

```python
class SearchCustomerArguments(BaseModel):
    postcode: str | None = Field(description="The customer's postcode")

@tool()
def search_customer(arguments: SearchCustomerArguments):
	...
```

Pros:

*Very similar to FastAPI style*

```python
@tool()
async def create_diary_event(
    arguments: CreateDiaryEventV1Args,
    crm_client: Client = Depends(get_crm_client),
	  crm_customer: Customer | None = Depends(get_crm_customer),
	  session: Session = Depends(get_db_session),
):
    ...
```

*Access to some useful pydantic features*

1. Validation (field_validator, model_validator,  Field(gt=0), etc)
2. Field descriptions

Cons:

*No precendence:* Not used by other frameworks so if we wanted to create an MCP server with our functions we’d have to explode the pydantic model into a function.

*Unsupported pydantic features:* Can use pydantic features that are not supported by models (union → anyOf, nested models, etc) 

### Option 3: hybrid/support both

In this scenario the `@tool()` magic would inspect the function signature:

- If it finds an argument called `arguments` assumes it’s a pydantic model uses “Option 2”, or
- It uses Option 1

In this case we could use the docstring approach for simple functions with few parameters/limited validation, and pydantic models where we want validation.

What are your thoughts?
