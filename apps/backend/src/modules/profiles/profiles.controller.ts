import { AuthGuard } from '@/modules/auth/auth.guard';
import { UsersService } from '@/modules/users/users.service';
import { UpdateUserDto } from '@/modules/users/dto/update-user.dto';
import type { AuthenticatedRequest } from '@/interfaces/auth.interface';
import { Controller, Get, Req, Body, Patch, UseGuards } from '@nestjs/common';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('profile')
  async profile(@Req() req: AuthenticatedRequest) {
    const id = req.user.id;
    const user = await this.usersService.findOneById(id);

    return user?.toDto();
  }

  @UseGuards(AuthGuard)
  @Patch('profile')
  async updateProfile(
    @Req() req: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const id = req.user.id;
    const user = await this.usersService.update(id, updateUserDto);

    return user?.toDto();
  }
}
