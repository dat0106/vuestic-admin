# Sử dụng hình ảnh Node.js 22 làm base image
FROM node:22-alpine

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json và package-lock.json (hoặc yarn.lock)
COPY package*.json ./

# Cài đặt các phụ thuộc
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Build ứng dụng Vue 3 với Vite
RUN npm run build

# Cài đặt một máy chủ web đơn giản để phục vụ các tệp tĩnh
RUN npm install -g serve

# Expose cổng mà ứng dụng sẽ chạy
EXPOSE 3000

# Chạy ứng dụng
CMD ["serve", "-s", "dist", "-l", "3000"]