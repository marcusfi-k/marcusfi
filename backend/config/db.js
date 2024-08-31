const { Sequelize } = require('sequelize'); // Import Sequelize từ thư viện sequelize

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST, // Địa chỉ máy chủ của cơ sở dữ liệu lấy từ biến môi trường env. và tên là DB_HOST
  dialect: 'mysql', // Loại cơ sở dữ liệu (ở đây là MySQL)
  port: process.env.DB_PORT, // Cổng mà cơ sở dữ liệu đang lắng nghe lấy từ biến môi trường env. và tên là DB_PORT
  logging: console.log, // Hàm để ghi log, ở đây là console.log để ghi log ra console
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.'); // Nếu kết nối thành công, log ra console thông báo thành công
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err); // Nếu có lỗi xảy ra, log ra console thông báo lỗi và chi tiết lỗi
  });

module.exports = sequelize; // Xuất instance sequelize để có thể được sử dụng ở các file khác trong dự án
