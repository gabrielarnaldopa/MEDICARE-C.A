FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY index.html ./index.html
EXPOSE 8080
CMD ["sh", "-c", "serve -s . -l tcp://0.0.0.0:${PORT:-8080}"]
