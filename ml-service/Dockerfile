# Use the official Python 3.9 image optimized for size
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /code

# Copy the requirements file into the container
COPY ./requirements.txt /code/requirements.txt

# Install all the python packages
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Download the required SpaCy model
RUN python -m spacy download en_core_web_sm

# Copy the rest of the application files into the container
COPY ./ /code/

# Hugging Face Spaces exposes port 7860 by default!
# We tell uvicorn to run on port 7860
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
