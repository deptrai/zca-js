import { Zalo } from '../dist/index.js';
import fs from 'fs';

async function testSendMessage() {
  try {
    console.log('Starting send message test...');
    
    const zalo = new Zalo();
    let isLoggedIn = false;
    let retryCount = 0;
    const maxRetries = 3;
    
    while (!isLoggedIn && retryCount < maxRetries) {
      try {
        // Đăng nhập bằng QR Code
        const api = await zalo.loginQR({
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          language: 'vi',
          qrPath: './qr-code.png'
        }, (event) => {
          console.log('\nEvent received:', event);
          
          switch (event.type) {
            case 0: // QRCodeGenerated
              console.log('\nQR Code đã được lưu vào file: qr-code.png');
              console.log('Vui lòng mở file và scan QR code bằng app Zalo trên điện thoại');
              
              if (event.data.image) {
                fs.writeFileSync('./qr-code.png', event.data.image, 'base64');
                console.log('QR code image saved successfully');
              } else {
                console.error('No QR code image data received');
              }
              break;

            case 2: // QRCodeScanned
              console.log('\nQR Code đã được scan!');
              console.log('Thông tin người dùng:', JSON.stringify(event.data, null, 2));
              break;

            case 4: // GotLoginInfo
              console.log('\nThông tin đăng nhập:', JSON.stringify(event.data, null, 2));
              isLoggedIn = true;
              break;

            case 1: // QRCodeExpired
              console.log('\nQR Code đã hết hạn, đang thử lại...');
              if (event.actions && event.actions.retry) {
                event.actions.retry();
              }
              break;
          }
        });

        if (isLoggedIn) {
          console.log('Login successful!');
          
          try {
            // Lấy danh sách bạn bè
            const friends = await api.getAllFriends();
            console.log('\nTổng số bạn bè:', friends.length);
            
            if (friends.length > 0) {
              // Lấy người bạn đầu tiên
              const firstFriend = friends[0];
              console.log('\nChọn người bạn đầu tiên:', {
                displayName: firstFriend.displayName,
                userId: firstFriend.userId,
                username: firstFriend.username
              });
              
              console.log('Gửi tin nhắn cho:', firstFriend.displayName);
              
              try {
                // Lấy thông tin người dùng trước
                const userInfo = await api.getUserInfo(firstFriend.userId);
                console.log('Thông tin người dùng:', userInfo);
                
                // Gửi tin nhắn
                const result = await api.sendMessage({
                  message: 'Xin chào! Đây là tin nhắn test từ zca-js',
                  threadId: firstFriend.userId,
                  type: 'user'
                });
                
                console.log('\nKết quả gửi tin nhắn:', result);
              } catch (error) {
                console.error('Lỗi khi gửi tin nhắn:', error);
                console.error('Chi tiết lỗi:', error.stack);
                console.error('Thông tin người nhận:', {
                  displayName: firstFriend.displayName,
                  userId: firstFriend.userId,
                  username: firstFriend.username
                });
              }
            } else {
              console.log('Không có bạn bè nào trong danh sách');
            }
          } catch (error) {
            console.error('Lỗi khi sử dụng API:', error);
            console.error('Chi tiết lỗi:', error.stack);
          }
          break;
        }
      } catch (error) {
        console.error('Login attempt failed:', error);
        retryCount++;
        if (retryCount < maxRetries) {
          console.log(`Retrying... (Attempt ${retryCount + 1}/${maxRetries})`);
        }
      }
    }

    if (!isLoggedIn) {
      throw new Error(`Failed to login after ${maxRetries} attempts`);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
    console.error('Error details:', error.stack);
  }
}

// Chạy test
testSendMessage(); 