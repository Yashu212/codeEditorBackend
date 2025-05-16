FROM python:3.10-slim

WORKDIR /app

COPY code.py .

CMD ["sh", "-c", "echo \"$INPUT\" | python3 code.py"]
