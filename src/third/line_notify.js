const https = require('https');

function send(message) {
  const url = `https://notify-api.line.me/api/notify?message=${encodeURIComponent(message)}`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + process.env.LINE_NOTIFY_TOKEN,
    },
  };

  const req = https.request(url, options, (res) => {
    res.on('data', (data) => {
      // 在此處理回應資料
    //   console.log(data.toString());
    });
  });

  req.on('error', (error) => {
    // 在此處理錯誤
    console.error(error);
  });

  req.end();
}


module.exports = {
    send,
};
