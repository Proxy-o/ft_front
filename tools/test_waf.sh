#!/bin/bash

# set -x

# vars
IPADDR=$(grep "SERVER_HOST" .env | cut -d '=' -f 2)
NGINX_CONTAINER="nginx"
AUDIT_LOG="/var/log/nginx/modsec_audit.log"
DEBUG_LOG="/var/log/nginx/modsec_debug.log"
TEST_NAMES=("SQL Injection" "XSS" "Web Scanner")
TEST_REQUESTS=("curl -k 'https://$IPADDR/?id=1%27%20OR%20%271%27=%271'"
               "curl -k 'https://$IPADDR/?q%3D%3Cscript%3Ealert%28%5C%22XSS%5C%22%29%3C%2Fscript%3E'"
               "curl -k -H 'User-Agent: Nikto' https://$IPADDR")

# Send test requests
for i in "${!TEST_NAMES[@]}"; do
  echo "Sending ${TEST_NAMES[$i]} test request..."
  eval "${TEST_REQUESTS[$i]}"
done

# check ModSecurity logs
echo "Checking ModSecurity logs..."

# Function to check logs
check_logs() {
  local log_file=$1
  echo "-----------------------------------"
  echo "Checking $log_file..."
  docker exec -it $NGINX_CONTAINER tail -n 40 $log_file
  echo "-----------------------------------"
}

# Check audit log
check_logs $AUDIT_LOG

# Check debug log
check_logs $DEBUG_LOG

echo "Test completed."