const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3007;
const jwt = require('jsonwebtoken');

const publicKey = '-----BEGIN PUBLIC KEY-----\n' +
  'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6nEQI/1ebEjmhO88sW1K\n' +
  'tooqpBCINghS2HcaXDJqWpefQ9iNibTLRktCqVD+y4UGyc8ruC9iZUt6QmoaNXir\n' +
  'OZ4agc+1gj73YIM4UkL4mDpd7ZwA5SerXbiQp8q4yndeg2XI1FXZHYlanRfSZQgq\n' +
  'W070hfZmspeBJaBq14EC8kuhnWoeGblgFaTEqDz02vKF2GwQkUZH9TDi1x0yJwhE\n' +
  'Yxta6gMYQhGhbn1om5LyvC4zrGDcTlxV0U+LztLcIcNEAxoxT6zmGifSDwhYMjWJ\n' +
  '++bGFJGXBhsFy8EGy5XXTFO1fdpZg0eiCufI7w+zPD6dn/dZDebFY4Luck5BYulN\n' +
  'VwIDAQAB\n' +
  '-----END PUBLIC KEY-----'
app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('Hello World, from express');
});
const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};
verifyAndDecode = webhook => {
  const decoded = jwt.verify(webhook, publicKey, {ignoreExpiration: true});
  const {instanceId, eventType, data} = JSON.parse(decoded.data);
  return {
    instanceId,
    eventType,
    data: JSON.parse(data)
  }
}
app.post('/webhook', (req, res) => {

  const dataWebhook = verifyAndDecode(req.body)
  console.log("data webhook: ", JSON.stringify(dataWebhook, getCircularReplacer()))
  res.send("OK");
});
app.listen(port, () => console.log(`Hello world app listening on port ${port}!`))
