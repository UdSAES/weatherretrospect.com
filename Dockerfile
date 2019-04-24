FROM nginx:alpine

# Provide metadata according to namespace suggested by http://label-schema.org/
LABEL org.label-schema.schema-version="1.0.0-rc.1"
LABEL org.label-schema.name="weatherretrospect.com"
LABEL org.label-schema.description="Website demonstrating exemplary uses of publicly available weather data provided by Germany's Meteorological Service (DWD)"
LABEL org.label-schema.vendor="UdS AES"
LABEL org.label-schema.vcs-url="https://github.com/UdSAES/weatherretrospect.com"

COPY dist /usr/share/nginx/html
