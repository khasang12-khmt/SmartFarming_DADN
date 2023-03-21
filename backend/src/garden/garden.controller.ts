/* eslint-disable prefer-const */
import { GardenService } from './garden.service';
import {
  Controller,
  Body,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { CreateGardenDTO } from './dto/create-garden.dto';
import { UpdateGarden } from './dto/update-garden.dto';

import { User } from 'src/user/models/user.model';
import { ConcreteGarden } from './gardenHelper';
import { GardenBuilder } from './gardenbuilder';
import { GardenManagerService } from './gardenManager';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger/dist';

import { controlDTO } from './dto/control.dto';
import { UserService } from 'src/user/user.service';
import { SensorService } from 'src/sensor/sensor.service';
import { MqttService } from 'src/mqtt/mqtt.service';


@Controller('garden')
export class GardenController {
  @Inject(SensorService)
  private sensorService: SensorService;
  constructor(
    private readonly gardenService: GardenService,
    private readonly userService: UserService,
    private readonly mqttService: MqttService,
  ) {}

  @Get()
  @ApiOkResponse({ description: 'Get all gardens successfully' })
  @ApiBadRequestResponse({ description: 'Get all gardens failed' })
  async index() {
    return await this.gardenService.findAll();
  }

  @ApiOkResponse({ description: 'Get garden successfully' })
  @ApiBadRequestResponse({ description: 'Get garden failed' })
  @Get(':id')
  async show(@Param('id') id: string) {
    return await this.gardenService.findOne(id);
  }


  @ApiOkResponse({ description: 'Update garden successfully' })
  @ApiBadRequestResponse({ description: 'Update garden failed' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateGarden: UpdateGarden) {
    return await this.gardenService.update(id, updateGarden);
  }

  @ApiOkResponse({ description: 'Delete garden successfully' })
  @ApiBadRequestResponse({ description: 'Delete garden failed' })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.gardenService.delete(id);
  }
  
  @ApiCreatedResponse({ description: 'Create Garden Successfully' })
  @ApiBadRequestResponse({ description: 'Create Garden Failed' })
  @Post('create')
  async create(@Body() payload: CreateGardenDTO) {
    // call DB to get user info
    const gardenName = payload.name;
    const desc = payload.desc;
    let owner:User = await this.userService.findOne(payload.userId);
    const gkey = payload.group_key;
    const owner_x_aio_key = owner.x_aio_key;
    if(!owner_x_aio_key) {
      return {
        code: 403,
        message: "Missing x_aio_key"
      }
    }  
    const topic_list = payload.topic_list;
    const userList = [];
    const username = payload.adaUserName;
    this.gardenService.create({
      adaUserName:payload.adaUserName,
      boundary: [{lng:0,lat:0}],
      desc: payload.desc,
      group_key: payload.group_key,
      name: payload.name,
      sensors: [],
      topic_list: [],
      userId: owner["_id"],
      x_aio_key:payload.group_key
    })
    const mqttManager = this.mqttService.getManager(username, owner_x_aio_key);
    for (let k in topic_list) {
      mqttManager.addSubcriber(k, topic_list[k]);
    }
    // Build Garden
    const garden: ConcreteGarden = new GardenBuilder()
      .setGroupKey(gkey)
      .setGardenName(gardenName)
      .setId(GardenManagerService.getCurrentNumber())
      .setOwner(owner)
      .setMQTTDevices(mqttManager)
      .setObserverList(userList)
      .build();
    garden.launch();
    GardenManagerService.addGarden(garden);
    return {
      status: 'Create Garden Successfully',
      gardenId: 0,
    };
  }

  @Get('get/:id')
  getGarden(@Param('id') id: number) {
    const garden: ConcreteGarden = GardenManagerService.getGarden(id);
    if (garden === undefined)
      return {
        error: 'Garden Not Exist',
      };
    return {
      name: garden.gardenName,
      id: garden.gardenId,
    };
  }

  @Post('/find')
  findGarden(@Body() payload : any) {
      if(payload.gardenName){
        return GardenManagerService.findGarden(payload.gardenName)
      }
      return {
        error: "Missing gardenName"
      }
  }

  @Post('/publish')
  control(@Body() payload: controlDTO) {
    let garden: ConcreteGarden = GardenManagerService.getGarden(
      payload.gardenID,
    );
    return garden
      .getMqttManager()
      .publish(payload.type, payload.feeds_key, payload.value);
  }
}
