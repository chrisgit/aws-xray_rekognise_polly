FROM node:12
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied where available (npm@5+)
# http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/
COPY package*.json ./

# If you are building your code for production RUN npm ci --only=production
RUN npm install

# Bundle app source
COPY . .

EXPOSE 4000

CMD [ "node", "server.js" ]
