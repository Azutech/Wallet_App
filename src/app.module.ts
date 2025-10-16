import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WalletsModule } from './apis/wallets/wallets.module';
import { NotificationModule } from './apis/notification/notification.module';
import { User } from './apis/users/entity/user.entity';
import { UsersModule } from './apis/users/users.module';
import { PaymentsModule } from './apis/payments/payments.module';
import { TransactionModule } from './apis/transactions/transaction.module';
import { FlutterwaveModule } from './flutterwave/flutterwave.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      expandVariables: true,
    }),

    // ✅ Use ConfigService for dynamic configuration
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') !== 'production',

        // SSL Configuration
        ssl:
          configService.get('DB_SSL') === 'true'
            ? {
                rejectUnauthorized: false,
              }
            : false,

        // Connection pool settings (optional but recommended)
        extra: {
          max: 10, // Maximum connections
          min: 2, // Minimum connections
          idleTimeoutMillis: 30000,
        },
      }),
    }),
    UsersModule,
    WalletsModule,
    NotificationModule,
    PaymentsModule,
    TransactionModule,
    FlutterwaveModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
