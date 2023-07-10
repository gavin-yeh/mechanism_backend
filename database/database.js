const mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

connection.connect((error) => {
    if (error) {
      console.error('Error connecting to MySQL database: ' + error.stack)
      return;
    }
  
    console.log('Connected to MySQL database as id ' + connection.threadId)

    // 创建定时器，每隔一段时间执行一次 MySQL ping
    const timer = setInterval(() => {
        connection.ping((err) => {
        if (err) {
            console.error('Error pinging MySQL:', err)
            return
        }
        // console.log('MySQL pinged');
        })
    }, 5000)

    // 在程序退出前关闭 MySQL 连接和定时器
    process.on('beforeExit', () => {
        clearInterval(timer)
        connection.end()
    });
});


module.exports = {
    connection,
};