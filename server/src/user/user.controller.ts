import { Body, Controller, Get, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Artwork } from '../artwork/artwork.entity';
import { Exhibition } from '../exhibition/exhibition.entity';
import { CustomAuthGuard } from '../auth/guard/CustomAuthGuard';
import { RequestUserDTO } from './dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateResult } from 'typeorm';
import {
    getUsersArtworksApiOperation,
    updateUserProfileApiOperation,
    getUserProfile,
    getInterestArtworksApiOperation,
    getBiddingArtworksApiOperation,
    getBiddedArtworksApiOperation,
    getUsersExhibitionsApiOperation,
    updateUserProfileApiBody,
} from './swagger';

@UseGuards(CustomAuthGuard)
@Controller('/users')
@ApiTags('유저 컨트롤러')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('/')
    @ApiOperation(getUserProfile)
    @ApiResponse({ type: User })
    getUserProfile(@Req() { user }: Express.Request & { user: User }): Promise<User> {
        return this.userService.getUserProfile(user);
    }

    @Put('/')
    @UseInterceptors(FileInterceptor('image'))
    @ApiOperation(updateUserProfileApiOperation)
    @ApiBody(updateUserProfileApiBody)
    @ApiResponse({ type: UpdateResult })
    updateUserProfile(
        @Req() { user }: Express.Request & { user: User },
        @UploadedFile() file: Express.Multer.File,
        @Body() requestUserDTO: RequestUserDTO,
    ): Promise<UpdateResult> {
        return this.userService.updateUserProfile(user, file, requestUserDTO);
    }

    @Get('/artworks')
    @ApiOperation(getUsersArtworksApiOperation)
    @ApiResponse({ type: Artwork })
    getUsersArtworks(@Req() { user }: Express.Request & { user: User }): Promise<Artwork[]> {
        return this.userService.getUsersArtworks(user);
    }

    @Get('/artworks/interest')
    @ApiOperation(getInterestArtworksApiOperation)
    @ApiResponse({ type: Artwork })
    getInterestArtworks(@Req() { user }: Express.Request & { user: User }): Promise<Artwork[]> {
        return this.userService.getInterestArtworks(user);
    }

    @Get('/artworks/transaction')
    @ApiOperation(getBiddingArtworksApiOperation)
    @ApiResponse({ type: Artwork })
    getBiddingArtworks(@Req() { user }: Express.Request & { user: User }): Promise<Artwork[]> {
        return this.userService.getBiddingArtworks(user);
    }

    @Get('/artworks/bid')
    @ApiOperation(getBiddedArtworksApiOperation)
    @ApiResponse({ type: Artwork })
    getBiddedArtworks(
        @Query('nftTokens') nftTokens: string
    ): Promise<Artwork[]> {
        return this.userService.getBiddedArtworks(nftTokens);
    }

    @Get('/exhibitions')
    @ApiOperation(getUsersExhibitionsApiOperation)
    @ApiResponse({ type: Exhibition })
    getUsersExhibitions(@Req() { user }: Express.Request & { user: User }): Promise<Exhibition[]> {
        return this.userService.getUsersExhibitions(user);
    }
}
