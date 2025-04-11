import {
  Controller,
  Post,
  UseGuards,
  Inject,
  Res,
  Get,
  Req,
  Body,
} from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { CurrentUser } from 'src/utils/decorators/current-user.decorator';
import { IAuthsService } from '../interfaces/auth.interface';
import { Response, Request } from 'express';
import { Public } from 'src/utils/decorators/public.decorator';
import { ResponseMessage } from 'src/utils/decorators/response_message.decorator';
import { ResponseMessages } from 'src/utils/user.message';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { ICurrentUser } from 'src/utils/types';
import { LocalAuthGuard } from '../utils/guards/local-auth.guard';
@Controller(Routes.AUTHS)
export class AuthsController {
  constructor(
    @Inject(Services.AUTHS) private readonly authsService: IAuthsService,
  ) {}
  @Post('login')
  @Public()
  @ResponseMessage(ResponseMessages.AuthMessages.LOGIN)
  @UseGuards(LocalAuthGuard)
  async login(@Req() req, @Res({ passthrough: true }) response: Response) {
    return this.authsService.login(req.user, response);
  }

  @ResponseMessage(ResponseMessages.AuthMessages.STATUS)
  @Get('account')
  async status(@CurrentUser() user: ICurrentUser) {
    const permissions = await this.authsService.getRolePermissions(user.role);
    user.permissions = permissions;
    return { user };
  }

  @Get('refresh')
  @Public()
  @ResponseMessage(ResponseMessages.AuthMessages.REFRESH_TOKEN)
  async resfresh(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const refresh_token = req.cookies['refresh_token'];
    return this.authsService.refreshAccessToken(refresh_token, res);
  }

  @ResponseMessage(ResponseMessages.AuthMessages.LOGOUT)
  @Post('logout')
  async logout(
    @CurrentUser() user: ICurrentUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authsService.logout(user, res);
  }

  @Public()
  @Post('register')
  @ResponseMessage(ResponseMessages.AuthMessages.REGISTER_USER)
  async registerUser(@Body() registerUserData: RegisterUserDto) {
    return await this.authsService.register(registerUserData);
  }
}
