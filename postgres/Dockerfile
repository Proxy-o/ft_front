#syntax=docker/dockerfile:1
FROM postgres:14-alpine3.20

# Switch to root to install necessary packages and add files
USER root

# Install dependencies
RUN apk update && apk add --no-cache jq

# Add the script to the image
COPY tools/entrypoint.sh /usr/local/bin/entrypoint.sh

# Grant permissions to the script
RUN chmod +x /usr/local/bin/entrypoint.sh

# Switch back to the postgres user
USER postgres

# Set the entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# set the command to run the container
CMD ["postgres"]
