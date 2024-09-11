#!/bin/bash

# Define the NGINX container name
NGINX_CONTAINER="nginx_container"

# Define the test requests
declare -A TEST_REQUESTS
TEST_REQUESTS["SQL Injection"]="curl -k 'https://localhost/?id=1' OR '1'='1'"
TEST_REQUESTS["XSS"]="curl -k 'https://localhost/?q=<script>alert(\"XSS\")</script>'"
TEST_REQUESTS["Web Scanner"]="curl -k -H 'User-Agent: Nikto' https://localhost"

# Send test requests
for TEST in "${!TEST_REQUESTS[@]}"; do
  echo "Sending $TEST test request..."
  eval "${TEST_REQUESTS[$TEST]}"
done

# Check ModSecurity logs
echo "Checking ModSecurity logs..."

# Define the log files
AUDIT_LOG="/var/log/nginx/modsec_audit.log"
DEBUG_LOG="/var/log/nginx/modsec_debug.log"

# Function to check logs
check_logs() {
  local log_file=$1
  echo "Checking $log_file..."
  docker exec -it $NGINX_CONTAINER tail -n 20 $log_file
}

# Check audit log
check_logs $AUDIT_LOG

# Check debug log
check_logs $DEBUG_LOG

echo "Test completed."