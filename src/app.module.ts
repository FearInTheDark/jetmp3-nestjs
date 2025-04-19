import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongModule } from './song/song.module';
import { UserModule } from "src/user/user.module";

@Module({
  imports: [SongModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
