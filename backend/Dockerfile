# Use an official Python runtime as a parent image
FROM python:3

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container to /app
WORKDIR /app


# Install dependencies first (will be cached if requirements.txt doesn't change)
COPY requirements.txt requirements.txt
# update pip
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose the port server is running on
EXPOSE 8000





# Start the application from run_app.sh
CMD ["sh", "run_app.sh"]