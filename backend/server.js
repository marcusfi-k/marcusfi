require('dotenv').config(); // Load các biến môi trường từ file .env vào process.env
const express = require('express'); // Import thư viện Express
const http = require('http'); // Import module HTTP của Node.js
const bodyParser = require('body-parser'); // Import middleware để parse body của request
const cors = require('cors'); // Import middleware để cho phép CORS
const cookieParser = require('cookie-parser'); // Import middleware để parse cookie
const helmet = require('helmet'); // Import middleware để bảo vệ ứng dụng bằng các header HTTP
const rateLimit = require('express-rate-limit'); // Import middleware để giới hạn tốc độ request
const morgan = require('morgan'); // Import middleware để ghi log request HTTP
const authRoutes = require('./routes/authRoutes'); // Import các route liên quan đến xác thực
const userRoutes = require('./routes/userRoutes'); // Import các route liên quan đến người dùng
const contentRoutes = require('./routes/contentRoutes'); // Import các route liên quan đến nội dung
const mediaFileRoutes = require('./routes/mediaFileRoutes'); // Import các route liên quan đến file media
const likeRoutes = require('./routes/likeRoutes'); // Import các route liên quan đến like
const commentRoutes = require('./routes/commentRoutes'); // Import các route liên quan đến comment
const bookmarkRoutes = require('./routes/bookmarkRoutes'); // Import các route liên quan đến bookmark
const { protect, checkAndRefreshTokens } = require('./middleware/authMiddleware'); // Import các middleware bảo vệ và làm mới token
const sequelize = require('./config/db'); // Import instance Sequelize để kết nối cơ sở dữ liệu
const Content = require('./models/Content'); // Import model Content
const MediaFile = require('./models/MediaFile'); // Import model MediaFile
const User = require('./models/User'); // Import model User

const app = express(); // Tạo instance của Express
const PORT = process.env.PORT || 3001; // Lấy port từ biến môi trường

const corsOptions = {
  origin: 'http://localhost:3002', // Cho phép CORS từ địa chỉ này
  credentials: true, // Cho phép gửi cookie cùng với request
};

app.use(cors(corsOptions)); // Sử dụng middleware CORS với cấu hình trên
app.use(bodyParser.json()); // Sử dụng middleware để parse body của request dưới dạng JSON
app.use(cookieParser()); // Sử dụng middleware để parse cookie
app.use(helmet()); // Sử dụng middleware để bảo vệ ứng dụng bằng các header HTTP
app.use(morgan('combined')); // Sử dụng middleware để ghi log request HTTP ở định dạng 'combined'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Khoảng thời gian là 15 phút
  max: 10000, // Giới hạn tối đa 100 request mỗi 15 phút
});
app.use(limiter); // Sử dụng middleware giới hạn tốc độ request

app.use('/request/auth', authRoutes); // Sử dụng các route xác thực
app.use('/request/contents', contentRoutes); // Sử dụng các route nội dung
app.use(checkAndRefreshTokens); // Sử dụng middleware làm mới token
app.use('/request/users', protect, userRoutes); // Sử dụng các route người dùng với middleware bảo vệ
app.use('/request/media', protect, mediaFileRoutes); // Sử dụng các route media với middleware bảo vệ
app.use('/request/likes', protect, likeRoutes); // Sử dụng các route like với middleware bảo vệ
app.use('/request/comments', protect, commentRoutes); // Sử dụng các route comment với middleware bảo vệ
app.use('/request/bookmarks', protect, bookmarkRoutes); // Sử dụng các route bookmark với middleware bảo vệ

// Thiết lập liên kết giữa các model
Content.hasMany(MediaFile, { // Một nội dung có nhiều file media
  foreignKey: 'contentId',
  as: 'mediaFiles'
});
MediaFile.belongsTo(Content, { // Một file media thuộc về một nội dung
  foreignKey: 'contentId',
  as: 'content'
});

// Thiết lập liên kết giữa User và Content
User.hasMany(Content, { foreignKey: 'authorId', onDelete: 'CASCADE' }); // Một người dùng có nhiều nội dung, xóa người dùng sẽ xóa luôn nội dung của họ
Content.belongsTo(User, { foreignKey: 'authorId', onDelete: 'CASCADE' }); // Một nội dung thuộc về một người dùng

// Đồng bộ các model với cơ sở dữ liệu
sequelize.sync({ force: false }) // Đồng bộ model với cơ sở dữ liệu mà không xóa dữ liệu hiện có
  .then(() => {
    console.log('Database & tables created!'); // Thông báo thành công
  })
  .catch(error => {
    console.error('Error creating database & tables:', error); // Thông báo lỗi
  });

app.use((err, req, res, next) => { // Middleware xử lý lỗi
  console.error('Internal Server Error:', err); // Ghi log chi tiết lỗi
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error' // Trả về thông báo lỗi
    }
  });
});

const server = http.createServer(app); // Tạo server HTTP
server.listen(PORT, () => { // Lắng nghe các request trên port đã chỉ định
  console.log(`Server running on port ${PORT}`); // Thông báo thành công
});
