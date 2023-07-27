require('dotenv').config(); // 加载.env文件中的配置
const express = require('express');

const app = express();



const middleware = require('./api/generic/middleware.js')

app.use(middleware.errorHandler)
app.use(middleware.corsHandler)
app.use(middleware.parseJSONHandler)
app.use(middleware.genericHandler)



const user = require('./api/staff.js')

app.post('/api/user/login', user.loginHandler)
app.get('/api/user/info', middleware.afterLoginHandler, user.infoHandler)
app.post('/api/user/logout', middleware.afterLoginHandler, user.logoutHandler)



const public = require('./api/public.js')

app.get('/api/public/search', public.searchHandler)
app.post('/api/public', public.addHandler)



const weeklyProductReport = require('./api/weekly_product_report.js')

app.get('/api/user/weeklyProductReport', middleware.afterLoginHandler, weeklyProductReport.userInfoHandler)
app.post('/api/user/weeklyProductReport', middleware.afterLoginHandler, weeklyProductReport.userSubmitHandler)

app.get('/api/weeklyProductReport', middleware.afterLoginHandler, weeklyProductReport.infoHandler)
app.post('/api/weeklyProductReport', middleware.afterLoginHandler, weeklyProductReport.submitHandler)



const weeklyProductList = require('./api/weekly_product_list.js')

app.get('/api/weeklyProductList', middleware.afterLoginHandler, weeklyProductList.infoHandler)
app.post('/api/weeklyProductList', middleware.afterLoginHandler, weeklyProductList.submitHandler)



const staffCurve = require('./api/staff_curve.js')

app.get('/api/staff-curve', middleware.afterLoginHandler, staffCurve.settingHandler)
app.get('/api/staff-curve/item', middleware.afterLoginHandler, staffCurve.curveItemHandler)



app.listen(process.env.PORT, () => {
  console.log(`Server listening at http://localhost:${process.env.PORT}`);
});
