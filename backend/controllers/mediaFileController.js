const multer = require('multer');
const sharp = require('sharp');
const admin = require('../config/firebaseAdminConfig');
const MediaFile = require('../models/MediaFile');

// Cấu hình multer để lưu trữ file trong bộ nhớ tạm thời
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Sử dụng Firebase Admin SDK để lấy URL công khai
const getDownloadURL = async (fileUpload) => {
  const [url] = await fileUpload.getSignedUrl({
    action: 'read',
    expires: '03-01-2500' // Bạn có thể thay đổi thời gian hết hạn
  });
  return url;
};

// Xử lý upload file ảnh
exports.uploadMediaFile = (req, res, next) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return next(err);
    }
    const { file } = req;
    const bucket = admin.storage().bucket();

    try {
      // Sử dụng sharp để resize ảnh từ buffer
      const buffer = await sharp(file.buffer)
        .resize(800) // Resize ảnh về chiều rộng 800px
        .toBuffer();

      // Tạo đường dẫn file trên Firebase
      const fileUpload = bucket.file(`uploads/resized_${file.originalname}`);

      // Tải lên Firebase
      await fileUpload.save(buffer, {
        metadata: {
          contentType: file.mimetype,
          cacheControl: 'public, max-age=31536000', // Cài đặt cache cho file
        },
      });

      // Lấy URL công khai
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileUpload.name)}?alt=media`;

      // Lưu thông tin file vào cơ sở dữ liệu
      const mediaFile = await MediaFile.create({
        filename: fileUpload.name,
        filepath: `uploads/resized_${file.originalname}`,
        mimetype: file.mimetype,
        size: buffer.length,
        url: publicUrl,
        contentId: req.body.contentId || null
      });

      res.status(200).json({ message: 'Tải ảnh lên thành công', url: publicUrl });
    } catch (error) {
      console.error('Lỗi khi tải ảnh lên Firebase:', error);
      res.status(500).json({ error: error.message });
    }
  });
};

// Xóa file ảnh
exports.deleteMediaFile = async (req, res, next) => {
  const { id } = req.params;

  try {
    const mediaFile = await MediaFile.findByPk(id);
    if (!mediaFile) {
      return res.status(404).json({ message: 'Không tìm thấy file ảnh' });
    }

    // Xóa file từ Firebase Storage
    const bucket = admin.storage().bucket();
    await bucket.file(`uploads/${mediaFile.filename}`).delete();

    // Xóa bản ghi từ cơ sở dữ liệu
    await mediaFile.destroy();
    res.status(200).json({ message: 'Xóa file ảnh thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa file ảnh:', error);
    res.status(500).json({ error: error.message });
  }
};
