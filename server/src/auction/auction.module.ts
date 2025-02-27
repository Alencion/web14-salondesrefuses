import { Module } from '@nestjs/common';
import { AuctionGateway } from './gateway/auction.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionRepository } from './auction.repository';
import { AuctionHistoryModule } from '../auctionHistory/auctionHistory.module';
import AuctionController from './auction.controller';
import AuctionService from './auction.service';

@Module({
    imports: [AuctionHistoryModule, TypeOrmModule.forFeature([AuctionRepository])],
    controllers: [AuctionController],
    providers: [AuctionService, AuctionGateway],
    exports: [AuctionService],
})
export class AuctionModule {}
