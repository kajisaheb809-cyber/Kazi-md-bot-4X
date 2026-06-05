FROM quay.io/kazi-md-bot-azi-md-bot-4X:latest

WORKDIR /root/kazi-md-bot-4X

RUN git clone https://github.com/kajisaheb809-cyber . && \
    npm install

EXPOSE 5000

CMD ["npm", "start"]
