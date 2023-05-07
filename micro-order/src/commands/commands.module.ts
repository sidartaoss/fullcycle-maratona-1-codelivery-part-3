import { Module } from "@nestjs/common";
import { FixturesService } from "./fixtures/fixtures.service";
import { ConsoleModule } from "nestjs-console";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "../orders/entities/order.entity";
import { HttpModule } from "@nestjs/axios";
import { DriverHttpService } from "../orders/driver-http/driver-http.service";

@Module({
  imports: [ConsoleModule, TypeOrmModule.forFeature([Order]), HttpModule],
  providers: [FixturesService, DriverHttpService],
})
export class CommandsModule {}
