#!/bin/bash

# Script to run tests with Docker containers in a dedicated network

set -e

echo "🐳 Setting up Docker test environment..."

# Create the network if it doesn't exist
echo "📡 Creating Docker network..."
docker network create telerpg-test-network || echo "Network already exists"

# Start the test services
echo "🚀 Starting test containers..."
docker compose -f docker-compose.test.yml up -d postgres_test redis_test

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
docker compose -f docker-compose.test.yml up --wait postgres_test redis_test

# Run the tests
echo "🧪 Running tests..."
docker compose -f docker-compose.test.yml run --rm app_test

# Capture the exit code
TEST_EXIT_CODE=$?

# Cleanup
echo "🧹 Cleaning up..."
docker compose -f docker-compose.test.yml down

if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo "✅ All tests passed!"
else
    echo "❌ Tests failed with exit code: $TEST_EXIT_CODE"
fi

exit $TEST_EXIT_CODE