FROM quay.io/saheb/Kazi-md-bot-4X:latest

WORKDIR /root/Kazi-md-bot-4X

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "start:optimized"]
