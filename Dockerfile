FROM node
WORKDIR /cookies-ds
COPY package.json .
COPY npm-shrinkwrap.json .
RUN npm install
RUN npm audit --level=low
COPY . .
RUN npm run build
