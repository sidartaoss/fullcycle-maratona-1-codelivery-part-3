import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConsoleService } from "nestjs-console";
import { DriverHttpService } from "../../orders/driver-http/driver-http.service";
import { Repository } from "typeorm";
import { Order } from "../../orders/entities/order.entity";
import { lastValueFrom } from "rxjs";

@Injectable()
export class FixturesService {
  constructor(
    private readonly consoleService: ConsoleService,
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    private readonly driverHttp: DriverHttpService,
  ) {
    const cli = this.consoleService.getCli();

    this.consoleService.createCommand(
      {
        command: "db:seed",
        description: "Seed data in database",
      },
      this.seed,
      cli,
    );
  }

  seed = async (): Promise<any> => {
    const drivers = await lastValueFrom(this.driverHttp.list());
    for (const driver of drivers) {
      const order = this.orderRepo.create({
        driver_id: driver.uuid,
        driver_name: driver.name,
        location_id: 1,
        location_geo: [-81.24653, 28.3645],
      });
      await this.orderRepo.save(order);
    }
  };
}
