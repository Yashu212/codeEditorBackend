FROM gcc:latest

WORKDIR /app

COPY temp /app

CMD ["sh", "-c", "g++ code.cpp -o code && ./code < input.txt"]
