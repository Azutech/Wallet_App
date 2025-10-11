import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
     ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      expandVariables: true,
    }),

    //    TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',       // your postgres host
    //   port: 5432,              // default postgres port
    //   username: 'youruser',    // your postgres username
    //   password: 'yourpassword',// your postgres password
    //   database: 'yourdbname',  // your postgres database name
    //   entities: [__dirname + '/**/*.entity{.ts,.js}'],
    //   synchronize: true,       // use only in dev; auto create tables
    // }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
