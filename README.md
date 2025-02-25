# UTE Social Network

**UTE Social Network** là một mạng xã hội dành cho sinh viên Đại học Sư phạm Kỹ thuật (UTE), được xây dựng bằng Vue.js. Dự án này nhằm mục đích tạo ra một nền tảng kết nối, chia sẻ thông tin và tương tác giữa các sinh viên trong trường.

## Tính năng chính

- **Đăng ký/Đăng nhập**: Người dùng có thể tạo tài khoản và đăng nhập vào hệ thống.
- **Trang cá nhân**: Người dùng có thể chỉnh sửa thông tin cá nhân, avatar, và cover photo.
- **Đăng bài**: Người dùng có thể đăng bài viết, chia sẻ hình ảnh, và tương tác với bài viết của người khác.
- **Kết bạn**: Người dùng có thể kết bạn, theo dõi, và nhắn tin với nhau.
- **Thông báo**: Hệ thống thông báo khi có người like, comment, hoặc gửi lời mời kết bạn.
- **Tìm kiếm**: Người dùng có thể tìm kiếm bạn bè, bài viết, và các nhóm.

## Công nghệ sử dụng

- **Frontend**: Vue.js, Vuex, Vue Router, Axios
- **Backend**: (Nếu có) Node.js, Express.js, MongoDB (hoặc bất kỳ công nghệ nào bạn sử dụng)
- **Styling**: CSS, SCSS, hoặc một framework CSS như Bootstrap/Tailwind CSS
- **Authentication**: JWT (JSON Web Token) hoặc OAuth
- **API**: RESTful API hoặc GraphQL

## Cài đặt và chạy dự án

### Yêu cầu hệ thống

- Node.js (phiên bản 14.x trở lên)
- npm hoặc yarn

### Các bước cài đặt

1. **Clone dự án**:
   ```bash
   git clone https://github.com/tranlequocthong313/ute_social_network.git
   cd ute_social_network
   ```

2. **Cài đặt các dependencies**:
   ```bash
   npm install
   # hoặc
   yarn install
   ```

3. **Chạy dự án**:
   ```bash
   npm run serve
   # hoặc
   yarn serve
   ```

4. **Truy cập ứng dụng**:
   Mở trình duyệt và truy cập vào địa chỉ: `http://localhost:8080`

### Cấu hình môi trường

Tạo file `.env` trong thư mục gốc của dự án và thêm các biến môi trường cần thiết (nếu có):

```env
VUE_APP_API_URL=http://your-api-url.com
VUE_APP_GOOGLE_CLIENT_ID=your-google-client-id
```

## Cấu trúc thư mục

```
ute_social_network/
├── public/                  # Thư mục chứa các file tĩnh
├── src/                     # Source code chính
│   ├── assets/              # Hình ảnh, font, và các file tĩnh khác
│   ├── components/          # Các component Vue.js
│   ├── views/               # Các trang chính của ứng dụng
│   ├── router/              # Cấu hình Vue Router
│   ├── store/               # Vuex store (quản lý state)
│   ├── services/            # Các service để gọi API
│   ├── styles/              # File CSS/SCSS
│   ├── App.vue              # Component chính
│   └── main.js              # File khởi tạo Vue.js
├── .env                     # File cấu hình môi trường
├── package.json             # Danh sách dependencies và scripts
└── README.md                # Tài liệu hướng dẫn
```

## Đóng góp

Nếu bạn muốn đóng góp vào dự án, vui lòng làm theo các bước sau:

1. Fork dự án
2. Tạo branch mới (`git checkout -b feature/YourFeatureName`)
3. Commit các thay đổi (`git commit -m 'Add some feature'`)
4. Push lên branch (`git push origin feature/YourFeatureName`)
5. Mở một Pull Request

## Liên hệ

Nếu bạn có bất kỳ câu hỏi hoặc góp ý nào, vui lòng liên hệ:

- **Tên**: Trần Lê Quốc Thông
- **Email**: tranlequocthong313@gmail.com
- **GitHub**: [tranlequocthong313](https://github.com/tranlequocthong313)
