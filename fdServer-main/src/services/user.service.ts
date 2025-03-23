import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema'; // Assuming you have a User schema
import { log } from 'console';

@Injectable()
export class UserService {
  async getUserById(userId: string) {
    return this.userModel.findById(userId); // You can also customize it with specific fields or filters
  }
  jwtService: any;
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  

  // Method to find a user by their ID
  async findById(userId: string): Promise<User | null> {
    return this.userModel.findById(userId).exec();
  }

  async getAllUsersExcept(userId: string) {
    return this.userModel.find({ _id: { $ne: userId } });
  } 

  

  async calculateCreditUtilization(data1: any[]) {
    const summaryRow1 = data1[data1.length - 1];
    console.log(summaryRow1);

    // Extract credits
    const IGSTCredit = Math.max(
      summaryRow1?.['Availed ITC Integrated Tax'] || 0,
    );
    const CGSTCredit = Math.max(summaryRow1?.['Availed ITC Central Tax'] || 0);
    const SGSTCredit = Math.max(summaryRow1?.['Availed ITC State/UT Tax'] || 0);

    // Extract liabilities
    const IGSTLiability = Math.max(
      summaryRow1?.['Integrated ITC Liability'] || 0,
    );
    const CGSTLiability = Math.max(summaryRow1?.['Central ITC Liability'] || 0);
    const SGSTLiability = Math.max(summaryRow1?.['State ITC Liability'] || 0);

    // Initialize remaining credits
    let remainingIGST = IGSTCredit;
    let remainingCGST = CGSTCredit;
    let remainingSGST = SGSTCredit;

    // Apply IGST Credit
    const IGSTPaidFromIGST = Math.min(remainingIGST, IGSTLiability);
    remainingIGST -= IGSTPaidFromIGST;

    // Apply remaining IGST Credit to CGST Liability
    const CGSTPaidFromIGST = Math.min(remainingIGST, CGSTLiability);
    remainingIGST -= CGSTPaidFromIGST;

    // Apply remaining IGST Credit to SGST Liability
    const SGSTPaidFromIGST = Math.min(remainingIGST, SGSTLiability);
    remainingIGST -= SGSTPaidFromIGST;

    // Apply CGST Credit
    const CGSTPaidFromCGST = Math.min(
      remainingCGST,
      CGSTLiability - CGSTPaidFromIGST,
    );
    remainingCGST -= CGSTPaidFromCGST;

    // Apply SGST Credit
    const SGSTPaidFromSGST = Math.min(
      remainingSGST,
      SGSTLiability - SGSTPaidFromIGST,
    );
    remainingSGST -= SGSTPaidFromSGST;

    return {
      IGST: {
        Paid: IGSTPaidFromIGST,
        Remaining: remainingIGST,
      },
      CGST: {
        Paid: CGSTPaidFromIGST + CGSTPaidFromCGST,
        Remaining: remainingCGST,
      },
      SGST: {
        Paid: SGSTPaidFromIGST + SGSTPaidFromSGST,
        Remaining: remainingSGST,
      },
    };
  }

  async saveExcelData(userId: string, data: any) {
    // Find the user and update data
    await this.userModel.updateOne(
      { _id: userId },
      {
        $set: {
          discrepancies: data.discrepancies,
          itcCredibleTransactions: data.itcCredibleTransactions,
          nonItcCredibleTransactions: data.nonItcCredibleTransactions,
          file1Data: data.file1Data,
          creditUtilization: data.creditUtilization, // Save credit utilization
        },
      },
      { upsert: true },
    );
  }

  async getExcelData(userId: string) {
    // Retrieve data for the given user ID
    const user = await this.userModel.findById(userId).lean();
    if (!user) return null;
  
    return {
      discrepancies: [],
      itcCredibleTransactions: [],
      nonItcCredibleTransactions: [],
      creditUtilization: []
    };
  }

  // Method to find a user by their email
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  // Method to update the user's access token
  async updateAccessToken(userId: string, accessToken: string): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(
        userId,
        { accessToken }, // Update the accessToken field with the new token
        { new: true }, // Return the updated user
      )
      .exec();
  }

  // Method to create a new user
  async create(userData: Partial<User>): Promise<User> {
    const user = new this.userModel(userData);
    return user.save();
  }

  // Method to delete a user by ID
  async deleteUser(userId: string): Promise<any> {
    return this.userModel.findByIdAndDelete(userId).exec();
  }

  // Method to verify the token and return the user if valid
  async verifyAndGetUser(token: string): Promise<User | null> {
    // If you need to verify the token or perform custom validation logic
    // You can implement it here, like decoding the token or using a JWT service
    // If the token is valid, you can return the user
    // Assuming token contains the user ID in the 'sub' field

    const decoded = this.decodeJwt(token);
    if (!decoded?.sub) {
      return null;
    }

    return this.findById(decoded.sub);
  }
  async compareExcelData(
    data1: any[],
    data2: any[],
  ): Promise<{
    discrepancies: any[];
    itcCredibleTransactions: any[];
    nonItcCredibleTransactions: any[];
  }> {
    const discrepancies: any[] = [];
    const itcCredibleTransactions: any[] = [];
    const nonItcCredibleTransactions: any[] = [];

    const comparisonFields = [
      'Invoice Value',
      'Taxable Value',
      'Integrated Tax Paid',
      'Central Tax Paid',
      'State/UT Tax Paid',
    ];

    // Create maps for efficient lookup
    const data1Map = new Map(
      data1
        .filter((entry) => entry['Invoice Number'])
        .map((entry) => [
          `${entry['GSTIN of Supplier']}-${entry['Invoice Number']}`,
          entry,
        ]),
    );
    const data2Map = new Map(
      data2
        .filter((entry) => entry['Invoice Number'])
        .map((entry) => [
          `${entry['GSTIN of Supplier']}-${entry['Invoice Number']}`,
          entry,
        ]),
    );

    // Check entries in data1
    for (const entry1 of data1) {
      if (!entry1['Invoice Number']) continue; // Skip summary row

      // Check ITC Credibility based on Invoice and Payment Dates
      const invoiceDate = new Date(entry1['Invoice date']);
      const paymentDate = new Date(entry1['Payment Date']);

      console.log(invoiceDate.getTime(), paymentDate.getTime());

      const daysDifference = Math.abs(
        (paymentDate.getTime() - invoiceDate.getTime()) / (1000 * 3600 * 24),
      );

      // Round to the nearest integer
      const roundedDaysDifference = Math.round(daysDifference);
      console.log(roundedDaysDifference);

      // ITC is credible if payment is made within 180 days of invoice
      console.log(daysDifference);
      const isItcCredible = !(daysDifference > 0);

      // Categorize Transactions
      if (isItcCredible) {
        itcCredibleTransactions.push(entry1);
      } else {
        nonItcCredibleTransactions.push(entry1);
      }

      const key = `${entry1['GSTIN of Supplier']}-${entry1['Invoice Number']}`;
      const entry2 = data2Map.get(key);

      if (entry2) {
        // Compare specific fields for discrepancies
        for (const field of comparisonFields) {
          if (entry1[field] !== entry2[field]) {
            discrepancies.push({
              'GSTIN of Supplier': entry1['GSTIN of Supplier'],
              'Invoice Number': entry1['Invoice Number'],
              field,
              file1Value: entry1[field],
              file2Value: entry2[field],
              discrepancy: `${field} mismatch`,
              itcCredible: isItcCredible,
            });
          }
        }
        // Remove processed entries from maps
        data2Map.delete(key);
      } else {
        // Entry missing in file2
        discrepancies.push({
          'GSTIN of Supplier': entry1['GSTIN of Supplier'],
          'Invoice Number': entry1['Invoice Number'],
          discrepancy: 'Missing in File 2',
          itcCredible: isItcCredible,
        });
      }
    }

    // Check remaining entries in data2 (missing from data1)
    for (const [, entry2] of data2Map) {
      if (!entry2['Invoice Number']) continue; // Skip summary row

      discrepancies.push({
        'GSTIN of Supplier': entry2['GSTIN of Supplier'],
        'Invoice Number': entry2['Invoice Number'],
        discrepancy: 'Missing in File 1',
        itcCredible: false,
      });
    }

    return {
      discrepancies,
      itcCredibleTransactions,
      nonItcCredibleTransactions,
    };
  }

  // Helper method to decode the JWT token
  private decodeJwt(token: string): any {
    try {
      return this.jwtService.decode(token); // Decode the JWT token (Ensure JwtService is injected)
    } catch (error) {
      return null;
    }
  }
}
