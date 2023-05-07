import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChangeStatusOrderService } from "./change-status-order/change-status-order.service";
import { DriverHttpService } from "./driver-http/driver-http.service";
import { Order } from "./entities/order.entity";
import { OrderSubscriberService } from "./order-subscriber/order-subscriber.service";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";

@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      useFactory: () => {
        return {
          uri: `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:5672`,
        };
      },
    }),
    TypeOrmModule.forFeature([Order]),
    HttpModule,
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    ChangeStatusOrderService,
    DriverHttpService,
    OrderSubscriberService,
  ],
})
export class OrdersModule {}
