const uuidv1 = require('uuid/v1')

const moderationStatus = {
    TRIGGERED_AUTOMATED_FILTER: 0,
    APPROVED_BY_MODERATOR: 1
}

const filterText = async function(cleanspeakConfig, text) {
  const data = {
    "content": {
      "applicationId": `${cleanspeakConfig.applicationId}`,
  		"createInstant": Date.now(),
      "parts": [
        {
          "content": `${text}`,
          "type": "text"
        }
      ],
      "senderId": "f6d3df91-ed4b-48ad-810f-05a367d328c2"
    }
  }

  try {
    const url = `${cleanspeakConfig.baseUrl}/content/item/moderate/${uuidv1()}`
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': cleanspeakConfig.apiKey
      }
    });
    const responseBody = await response.json();
    if (response.status === 200 && responseBody.contentAction !== 'allow') {
      return true
    }
  } catch (error) {
    console.error('Cleanspeak moderate error:', error);
  }
  return false
}

module.exports = {
  filterText,
  moderationStatus,
};