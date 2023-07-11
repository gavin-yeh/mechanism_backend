
class Response {
  constructor(code, data, message) {
    this.code = code
    this.data = data
    if (message != null) {
      this.message = message
    }
  }
}

function sendSuccess(req, res, data) {
  var resp = new Response(20000, data, null)
  res.send(resp)
}

function sendFail(req, res, message, debugMessage) {
  var resp = new Response(5000, null, message)
  res.send(resp)
}

function sendReLogin(req, res, message) {
  const debugMessage = 'Invalid token'
  var resp = new Response(5001, null, '無效的憑證，請重新登入')
  res.send(resp)
}

function handleError(req, res) {
  return function(err) {
    console.log('資料庫發生錯誤：' + err);
  }
}


module.exports = {
  sendSuccess,
  sendFail,
  sendReLogin,
  handleError,
};
