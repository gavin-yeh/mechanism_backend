require('dotenv').config(); // 加载.env文件中的配置
const express = require('express');

const app = express();



const middleware = require('./api/generic/middleware.js')

app.use(middleware.errorHandler)
app.use(middleware.corsHandler)
app.use(middleware.parseJSONHandler)
app.use(middleware.genericHandler)



const user = require('./api/user.js')

app.post('/api/user/login', user.loginHandler)
app.get('/api/user/info', middleware.loginHandler, user.infoHandler)
app.post('/api/user/logout', middleware.loginHandler, user.logoutHandler)



const weeklyProductReport = require('./api/weekly_product_report.js')

app.get('/api/user/weeklyProductReport', middleware.loginHandler, weeklyProductReport.userInfoHandler)
app.post('/api/user/weeklyProductReport', middleware.loginHandler, weeklyProductReport.userSubmitHandler)

app.get('/api/weeklyProductReport', middleware.loginHandler, weeklyProductReport.infoHandler)
app.post('/api/weeklyProductReport', middleware.loginHandler, weeklyProductReport.submitHandler)



const weeklyProductList = require('./api/weekly_product_list.js')

app.get('/api/weeklyProductList', middleware.loginHandler, weeklyProductList.infoHandler)
app.post('/api/weeklyProductList', middleware.loginHandler, weeklyProductList.submitHandler)



app.listen(process.env.PORT, () => {
  console.log(`Server listening at http://localhost:${process.env.PORT}`);
});
