FROM gcc:latest

WORKDIR /app

RUN mkdir -p /app/temp

CMD ["sh", "-c", "g++ /app/temp/code.cpp -o /app/temp/code && /app/temp/code < /app/temp/input.txt"]
