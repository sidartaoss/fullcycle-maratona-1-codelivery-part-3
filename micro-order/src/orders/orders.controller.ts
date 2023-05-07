import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Redirect,
  Render,
  Req,
  Request,
} from "@nestjs/common";
import { lastValueFrom } from "rxjs";
import { DriverHttpService } from "./driver-http/driver-http.service";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { OrdersService } from "./orders.service";

@Controller("orders")
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly driverHttp: DriverHttpService,
  ) {}

  @Get()
  @Render("order/index")
  async index() {
    return await this.ordersService.index();
  }

  @Get("/create")
  @Render("order/create")
  async create() {
    const drivers = await lastValueFrom(this.driverHttp.list());
    return {
      drivers,
    };
  }

  @Post()
  @Redirect("orders")
  async store(@Req() request: Request) {
    const [location_id, location_geo] = request.body["location"].split("/");
    const [driver_id, driver_name] = request.body["driver"].split(",");
    const order = {
      driver_id,
      driver_name,
      location_id,
      location_geo: location_geo.split(","),
    };
    await this.ordersService.create(order);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.ordersService.remove(+id);
  }
}
