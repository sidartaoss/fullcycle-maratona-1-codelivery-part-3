import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order } from "../entities/order.entity";

@Injectable()
export class ChangeStatusOrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  @RabbitSubscribe({
    exchange: "amq.direct",
    routingKey: "orders.change-status",
    queue: "micro-orders/change-status",
  })
  public async rpcHandler(message) {
    const order = await this.orderRepo.findOne({
      where: { id: message.id },
    });
    order.status = message.status;
    await this.orderRepo.save(order);
    return 1;
  }
}
