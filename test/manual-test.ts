import { Zalo, LoginQRCallbackEventType } from '../src';

describe('Zalo API Manual Test', () => {
  let zalo: Zalo;

  beforeAll(() => {
    zalo = new Zalo();
  });

  it('should login with QR code', async () => {
    try {
      console.log('Starting QR code login test...');

      // Đăng nhập bằng QR Code
      const api = await zalo.loginQR({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        language: 'vi'
      }, (event) => {
        switch (event.type) {
          case LoginQRCallbackEventType.QRCodeGenerated:
            console.log('\nQR Code URL:', event.data.image);
            console.log('\nVui lòng scan QR code bằng app Zalo trên điện thoại');
            break;

          case LoginQRCallbackEventType.QRCodeScanned:
            console.log('\nQR Code đã được scan!');
            console.log('Thông tin người dùng:', event.data);
            break;

          case LoginQRCallbackEventType.QRCodeDeclined:
            console.error('\nQR Code bị từ chối:', event.data);
            break;

          case LoginQRCallbackEventType.QRCodeExpired:
            console.error('\nQR Code đã hết hạn');
            break;

          case LoginQRCallbackEventType.GotLoginInfo:
            console.log('\nThông tin đăng nhập:', event.data);
            break;
        }
      });

      expect(api).toBeDefined();
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  }, 30000); // Tăng timeout lên 30s vì cần thời gian scan QR
}); 