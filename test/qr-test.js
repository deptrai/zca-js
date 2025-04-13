import { Zalo } from '../dist/index.js';
import fs from 'fs';

async function testZaloQR() {
  try {
    console.log('Starting QR code login test...');
    
    const zalo = new Zalo();
    
    // Đăng nhập bằng QR Code
    const api = await zalo.loginQR({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      language: 'vi',
      qrPath: './qr-code.png' // Lưu QR code vào file này
    }, (event) => {
      console.log('\nEvent received:', event);
      
      switch (event.type) {
        case 0: // QRCodeGenerated
          console.log('\nQR Code đã được lưu vào file: qr-code.png');
          console.log('Vui lòng mở file và scan QR code bằng app Zalo trên điện thoại');
          
          // Lưu QR code thành file
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

        case 3: // QRCodeDeclined
          console.error('\nQR Code bị từ chối:', event.data);
          break;

        case 1: // QRCodeExpired
          console.error('\nQR Code đã hết hạn');
          break;

        case 4: // GotLoginInfo
          console.log('\nThông tin đăng nhập:', JSON.stringify(event.data, null, 2));
          break;

        default:
          console.log('Unknown event type:', event.type);
      }
    });

    console.log('Login successful!');
    console.log('API instance:', api);
    
  } catch (error) {
    console.error('Test failed:', error);
    console.error('Error details:', error.stack);
  }
}

// Chạy test
testZaloQR(); 