FROM node AS builder

# Using a base container to build assets, produces a lightweight
# NGINX instance whose sole purpose is to serve static files

COPY *.js *.json /build/
COPY src /build/src

WORKDIR /build

RUN npm install
RUN npm run build

FROM nginx:alpine AS final

COPY --from=builder /build/public /usr/share/nginx/html/
COPY static/*.txt /usr/share/nginx/html
