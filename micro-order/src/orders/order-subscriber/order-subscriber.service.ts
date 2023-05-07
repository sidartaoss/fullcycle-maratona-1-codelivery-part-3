import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  EntitySubscriberInterface,
  EventSubscriber,
  Connection,
  Repository,
  InsertEvent,
} from "typeorm";
import { Order } from "../entities/order.entity";

@EventSubscriber()
export class OrderSubscriberService
  implements EntitySubscriberInterface<Order>
{
  constructor(
    connection: Connection,
    private amqpConnection: AmqpConnection,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return Order;
  }

  async afterInsert(event: InsertEvent<Order>) {
    const order = event.entity;
    await this.amqpConnection.publish("amq.direct", "orders.new", {
      id: order.id,
      driver_name: order.driver_name,
      location_id: order.location_id,
      location_geo: order.location_geo,
      order: order.id,
      destination: order.location_id,
    });
  }
}
