import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Application } from 'src/schemas/application.schema';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectModel(Application.name)
    private readonly applicationModel: Model<Application>,
  ) {}

  async createApplication(data: Partial<Application>): Promise<Application> {
    const application = new this.applicationModel(data);
    return application.save();
  }

  async fetchApplicationsByBountyId(bountyId: string): Promise<Application[]> {
    console.log('hit service',await this.applicationModel.find({ bountyId }).exec());

    return await this.applicationModel.find({ bountyId }).exec();
  }
}
