/* eslint-disable prettier/prettier */
import { MailerModule } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Global()
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        ignoreTLS: true,
        secure: true,
        auth: {
          user: "bolu.bluesprint@gmail.com",
          pass: "18/52hA017",
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@gbese>',
      }}),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
