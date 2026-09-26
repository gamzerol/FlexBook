import { Injectable, Logger } from "@nestjs/common";

// Gercek bir SMS saglayicisina (Twilio, Netgsm, Iletimerkezi vb.) gecmek
// icin sadece bu dosyanin icini degistirmek yeterli - cagiran taraflar
// (NotificationsProcessor) hicbir sey bilmiyor, sadece send() cagiriyor.
@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  async send(to: string, message: string) {
    // Gercek gonderim yerine simdilik konsola yazdiriyoruz - boylece
    // is akisini (enqueue -> process -> "gonderim") gozle takip edebiliriz.
    // Twilio'ya gecince: await this.twilioClient.messages.create({ to, body: message, from: ... })
    this.logger.log(`📱 [${to}] ${message}`);
  }
}
