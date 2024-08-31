const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/db');
const Content = require('./models/Content');

const app = express();

app.use(bodyParser.json());

app.post('/api/contents/check-slug', async (req, res) => {
  const { slug } = req.body;
  try {
    const existingContent = await Content.findOne({ where: { slug } });
    res.json(existingContent ? false : true);
  } catch (error) {
    console.error('Error checking slug:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/contents', async (req, res) => {
  const { title, description, type, url, categories, slug } = req.body;

  try {
    const newContent = await Content.create({
      title,
      description,
      type,
      url,
      categories,
      slug
    });
    res.json(newContent);
  } catch (error) {
    console.error('Error saving content:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log('Server is running on port 3001');
  });
});
