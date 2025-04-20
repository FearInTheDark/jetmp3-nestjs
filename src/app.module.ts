import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from "src/user/user.module";
import { AuthModule } from './auth/auth.module';
import { TrackModule } from './track/track.module';
import { ArtistModule } from './artist/artist.module';

@Module({
	imports: [UserModule, AuthModule, TrackModule, ArtistModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {
}
