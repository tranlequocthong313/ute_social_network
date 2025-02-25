# UTE Social Network

**UTE Social Network** là một mạng xã hội dành riêng cho sinh viên Đại học Sư phạm Kỹ thuật (UTE). Dự án này được phát triển với mục đích tạo ra một nền tảng kết nối, chia sẻ thông tin và tương tác giữa các sinh viên trong trường.

## Tính năng chính

- **Đăng ký/Đăng nhập**: Người dùng có thể tạo tài khoản và đăng nhập vào hệ thống.
- **Tạo bài viết**: Người dùng có thể đăng bài viết, chia sẻ hình ảnh, video và cảm xúc.
- **Kết bạn**: Người dùng có thể kết bạn, theo dõi và nhắn tin với nhau.
- **Bình luận và thích bài viết**: Người dùng có thể tương tác với bài viết của người khác bằng cách bình luận hoặc thích.
- **Tìm kiếm**: Tìm kiếm bạn bè, bài viết và các nhóm trong cộng đồng.
- **Thông báo**: Nhận thông báo về các hoạt động liên quan đến tài khoản của bạn.

## Công nghệ sử dụng

- **Frontend**: HTML, CSS, JavaScript, React.js
- **Backend**: Node.js, Express.js
- **Cơ sở dữ liệu**: MongoDB
- **Xác thực**: JWT (JSON Web Token)
- **Khác**: Socket.io (cho tính năng chat real-time), Cloudinary (lưu trữ hình ảnh)

## Cài đặt và chạy dự án

### Yêu cầu hệ thống

- Node.js (phiên bản 14.x trở lên)
- MongoDB
- Git

### Các bước cài đặt

1. **Clone repo**:
   ```bash
   git clone https://github.com/tranlequocthong313/ute_social_network.git
   cd ute_social_network
   ```

2. **Cài đặt dependencies**:
   ```bash
   npm install
   ```

3. **Cấu hình biến môi trường**:
   Tạo file `.env` trong thư mục gốc và thêm các biến môi trường cần thiết:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/ute_social
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Chạy server**:
   ```bash
   npm start
   ```

5. **Chạy frontend**:
   Mở một terminal khác và chạy:
   ```bash
   cd client
   npm install
   npm start
   ```

6. **Truy cập ứng dụng**:
   Mở trình duyệt và truy cập `http://localhost:3000`.

## Đóng góp

Nếu bạn muốn đóng góp vào dự án, vui lòng làm theo các bước sau:

1. Fork repo này.
2. Tạo một branch mới (`git checkout -b feature/YourFeatureName`).
3. Commit các thay đổi của bạn (`git commit -m 'Add some feature'`).
4. Push lên branch (`git push origin feature/YourFeatureName`).
5. Tạo một Pull Request.

## Giấy phép

Dự án này được phân phối dưới giấy phép MIT. Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## Liên hệ

Nếu bạn có bất kỳ câu hỏi hoặc góp ý nào, vui lòng liên hệ:

- **Tác giả**: Trần Lê Quốc Thông
- **Email**: tranlequocthong313@gmail.com
- **GitHub**: [tranlequocthong313](https://github.com/tranlequocthong313)

---

Chúc bạn thành công với dự án của mình! Nếu cần thêm thông tin hoặc hỗ trợ, đừng ngần ngại liên hệ. 😊
