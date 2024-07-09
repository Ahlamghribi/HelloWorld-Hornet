const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const multer = require('multer');
const AWS = require('aws-sdk');
const fs = require('fs');

dotenv.config();

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const fileSchema = new mongoose.Schema({
  name: String,
  size: Number,
  description: String,
  mime_type: String,
  s3_key: String,
});

const File = mongoose.model('File', fileSchema);

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const uploadToS3 = (file) => {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Body: fileStream,
    Key: file.filename,
  };

  return s3.upload(uploadParams).promise();
};

app.post('/upload', upload.single('file'), async (req, res) => {
  const { description } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const s3Response = await uploadToS3(file);

    const newFile = new File({
      name: file.filename,
      size: file.size,
      description,
      mime_type: file.mimetype,
      s3_key: s3Response.Key,
    });

    await newFile.save();

    res.status(201).send(newFile);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get file information by ID
app.get('/file/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).send('File not found');
    }

    res.send(file);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update file information
app.put('/file/:id', async (req, res) => {
  try {
    const file = await File.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!file) {
      return res.status(404).send('File not found');
    }

    res.send(file);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Retrieve file by ID
app.get('/file/download/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).send('File not found');
    }

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: file.s3_key,
    };

    s3.getObject(params, (err, data) => {
      if (err) {
        return res.status(500).send(err.message);
      }

      res.attachment(file.name);
      res.send(data.Body);
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete file by ID
app.delete('/file/:id', async (req, res) => {
  try {
    const file = await File.findByIdAndDelete(req.params.id);

    if (!file) {
      return res.status(404).send('File not found');
    }

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: file.s3_key,
    };

    s3.deleteObject(params, (err, data) => {
      if (err) {
        return res.status(500).send(err.message);
      }

      res.send('File deleted');
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
