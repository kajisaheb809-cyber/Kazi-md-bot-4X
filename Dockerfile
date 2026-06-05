FROM quay.io/kajisaheb809-cyber/kazi-md-bot-4x:latest

WORKDIR /root/kazi-md-bot-4x

RUN git clone https://github.com/kajisaheb809-cyber . && \
    npm install

EXPOSE 5000

CMD ["npm", "start"]
