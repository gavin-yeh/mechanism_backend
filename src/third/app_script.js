const axios = require('axios');

async function call(action, input) {
  try {
    const jsonData = JSON.stringify({ action, input });

    const response = await axios.post(process.env.APP_SCRIPT_URL, jsonData);

    if (response.data.status !== 1) {
      throw new Error("錯誤: " + response.data.msg);
    }

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = {
  call,
};
