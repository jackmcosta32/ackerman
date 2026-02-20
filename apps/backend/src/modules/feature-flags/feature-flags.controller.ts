import {
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  HttpCode,
  UseGuards,
  Controller,
  HttpStatus,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import {
  FeatureFlagNotFoundError,
  FeatureFlagAlreadyExistsError,
} from './feature-flags.errors';

import { AuthGuard } from '@/modules/auth/auth.guard';
import { Roles } from '@/modules/auth/roles.decorator';
import { RolesGuard } from '@/modules/auth/roles.guard';
import { FeatureFlagsService } from './feature-flags.service';
import { UserRole } from '@workspace/shared/constants/user.constant';
import { CreateFeatureFlagDto } from './dto/create-feature-flag.dto';
import { UpdateFeatureFlagDto } from './dto/update-feature-flag.dto';
import { EvaluateFeatureFlagDto } from './dto/evaluate-feature-flag.dto';

@UseGuards(AuthGuard, RolesGuard)
@Controller('feature-flags')
export class FeatureFlagsController {
  constructor(private readonly featureFlagsService: FeatureFlagsService) {}

  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body() createFeatureFlagDto: CreateFeatureFlagDto) {
    try {
      return await this.featureFlagsService.create(createFeatureFlagDto);
    } catch (error) {
      if (error instanceof FeatureFlagAlreadyExistsError) {
        throw new ConflictException(error.message);
      }

      throw error;
    }
  }

  @Get()
  findAll() {
    return this.featureFlagsService.findAll();
  }

  @Get(':key')
  async findOne(@Param('key') key: string) {
    try {
      return await this.featureFlagsService.findOneByKey(key);
    } catch (error) {
      if (error instanceof FeatureFlagNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Roles(UserRole.ADMIN)
  @Patch(':key')
  async update(
    @Param('key') key: string,
    @Body() updateFeatureFlagDto: UpdateFeatureFlagDto,
  ) {
    try {
      return await this.featureFlagsService.update(key, updateFeatureFlagDto);
    } catch (error) {
      if (error instanceof FeatureFlagNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Roles(UserRole.ADMIN)
  @Post(':key/toggle')
  async toggle(@Param('key') key: string) {
    try {
      return await this.featureFlagsService.toggle(key);
    } catch (error) {
      if (error instanceof FeatureFlagNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Roles(UserRole.ADMIN)
  @Delete(':key')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('key') key: string) {
    try {
      await this.featureFlagsService.remove(key);
      return;
    } catch (error) {
      if (error instanceof FeatureFlagNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Roles(UserRole.ADMIN)
  @Post(':key/evaluate')
  async evaluate(
    @Param('key') key: string,
    @Body() evaluateFeatureFlagDto: EvaluateFeatureFlagDto,
  ) {
    const enabled = await this.featureFlagsService.evaluate(key, {
      userId: evaluateFeatureFlagDto.userId,
    });

    return {
      key,
      enabled,
    };
  }
}
