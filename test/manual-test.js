import { Zalo } from '../dist/index.js';

async function testZaloQR() {
  try {
    console.log('Starting QR code login test...');
    
    const zalo = new Zalo();
    
    // Đăng nhập bằng QR Code
    const api = await zalo.loginQR({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      language: 'vi'
    }, (event) => {
      switch (event.type) {
        case 0: // QRCodeGenerated
          console.log('\nQR Code URL:', event.data.image);
          console.log('\nVui lòng scan QR code bằng app Zalo trên điện thoại');
          break;

        case 2: // QRCodeScanned
          console.log('\nQR Code đã được scan!');
          console.log('Thông tin người dùng:', event.data);
          break;

        case 3: // QRCodeDeclined
          console.error('\nQR Code bị từ chối:', event.data);
          break;

        case 1: // QRCodeExpired
          console.error('\nQR Code đã hết hạn');
          break;

        case 4: // GotLoginInfo
          console.log('\nThông tin đăng nhập:', event.data);
          break;
      }
    });

    console.log('Login successful!');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Chạy test
testZaloQR(); 