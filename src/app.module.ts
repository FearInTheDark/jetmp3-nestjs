import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from './auth/auth.module';
import { TrackModule } from './track/track.module';
import { ArtistModule } from './artist/artist.module';
import { ConfigModule } from '@nestjs/config';
import { SharedJwtModule } from 'src/common/modules/shared-jwt.module';
import { DatabaseModule } from 'src/database/database.module';
import { TodoModule } from './todo/todo.module';
import { MailModule } from 'src/mail/mail.module';
import { FavoriteModule } from 'src/favorite/favorite.module';
import { SearchModule } from './search/search.module';
import { PlaylistModule } from './playlist/playlist.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SharedJwtModule, DatabaseModule, MailModule, FavoriteModule,
    UserModule, AuthModule, TrackModule, ArtistModule, TodoModule, SearchModule, PlaylistModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
