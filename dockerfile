# 使用 Node.js 作為基礎映像檔
FROM node:14

# 設定工作目錄
WORKDIR /app

# 複製 package.json 與 package-lock.json 到容器中
COPY package*.json ./

# 安裝相依套件
RUN npm install

# 複製專案檔案到容器中
COPY . .

# 開放對外的埠口
EXPOSE 9526

# 定義啟動指令
CMD [ "node", "app.js" ]
