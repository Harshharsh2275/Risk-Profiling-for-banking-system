
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, UserIcon, ClipboardCheck, FileText, AlertTriangle } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { PersonalInfo, RegistrationData } from '@/types';

interface PersonalInfoFormProps {
  onSubmit: (data: Partial<RegistrationData>) => void;
  initialData?: PersonalInfo;
}

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  dateOfBirth: z.date({ required_error: 'Date of birth is required' }),
  identityProofType: z.enum([
    'Aadhaar Card', 'Passport', 'Voter ID Card', 
    'Driving License', 'NREGA Job Card', 'PAN Card'
  ], { required_error: 'Please select an identity proof type' }),
  identityProofNumber: z.string().min(4, { message: 'Valid document number is required' }),
  identityProofIssueDate: z.date().optional().nullable(),
  identityProofExpiryDate: z.date().optional().nullable(),
  addressProofType: z.enum([
    'Aadhaar Card', 'Passport', 'Voter ID Card', 'Driving License', 
    'Utility Bill', 'Bank Statement', 'Employer Letter'
  ], { required_error: 'Please select an address proof type' }),
  addressProofNumber: z.string().min(4, { message: 'Valid document number is required' }),
  addressProofValidTill: z.date().optional().nullable(),
  // panCard: z.string().regex([A-Z]{5}[0-9]{4}[A-Z]{1}, { message: 'Invalid PAN card format' }),
  riskCategory: z.enum(['High', 'Medium', 'Low'], { required_error: 'Please select a risk category' }),
});

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ onSubmit, initialData }) => {
  const form = useForm<PersonalInfo>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      dateOfBirth: null,
      identityProofType: 'Aadhaar Card',
      identityProofNumber: '',
      identityProofIssueDate: null,
      identityProofExpiryDate: null,
      addressProofType: 'Aadhaar Card',
      addressProofNumber: '',
      addressProofValidTill: null,
      panCard: '',
      riskCategory: 'Low',
    },
  });

  const handleSubmit = (data: PersonalInfo) => {
    onSubmit({ personalInfo: data });
  };

  return (
    <div className="form-container">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="form-section">
          <div className="space-y-6">
            {/* Personal Information Section */}
            <div className="flex items-center space-x-2 pb-2 mb-4 border-b">
              <UserIcon className="h-5 w-5 text-brand-primary" />
              <h3 className="font-medium text-lg">Personal Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your full name as per documents" 
                        {...field} 
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date of Birth */}
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-11 pl-3 text-left font-normal flex justify-between items-center",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Select date of birth</span>
                            )}
                            <CalendarIcon className="h-4 w-4 opacity-70" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PAN Card */}
              <FormField
                control={form.control}
                name="panCard"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PAN Card Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. ABCDE1234F" 
                        {...field} 
                        className="h-11 uppercase"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Identity Proof Section */}
            <div className="flex items-center space-x-2 pt-4 pb-2 mb-4 border-b">
              <ClipboardCheck className="h-5 w-5 text-brand-primary" />
              <h3 className="font-medium text-lg">Identity Proof</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Identity Proof Type */}
              <FormField
                control={form.control}
                name="identityProofType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Identity Proof Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Aadhaar Card">Aadhaar Card</SelectItem>
                        <SelectItem value="Passport">Passport</SelectItem>
                        <SelectItem value="Voter ID Card">Voter ID Card</SelectItem>
                        <SelectItem value="Driving License">Driving License</SelectItem>
                        <SelectItem value="NREGA Job Card">NREGA Job Card</SelectItem>
                        <SelectItem value="PAN Card">PAN Card</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Identity Proof Number */}
              <FormField
                control={form.control}
                name="identityProofNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Identity Proof Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter document number" 
                        {...field}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Identity Proof Issue Date */}
              <FormField
                control={form.control}
                name="identityProofIssueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Date (optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-11 pl-3 text-left font-normal flex justify-between items-center",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Select issue date</span>
                            )}
                            <CalendarIcon className="h-4 w-4 opacity-70" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Identity Proof Expiry Date */}
              <FormField
                control={form.control}
                name="identityProofExpiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Date (optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-11 pl-3 text-left font-normal flex justify-between items-center",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Select expiry date</span>
                            )}
                            <CalendarIcon className="h-4 w-4 opacity-70" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address Proof Section */}
            <div className="flex items-center space-x-2 pt-4 pb-2 mb-4 border-b">
              <FileText className="h-5 w-5 text-brand-primary" />
              <h3 className="font-medium text-lg">Address Proof</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Address Proof Type */}
              <FormField
                control={form.control}
                name="addressProofType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Proof Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Aadhaar Card">Aadhaar Card</SelectItem>
                        <SelectItem value="Passport">Passport</SelectItem>
                        <SelectItem value="Voter ID Card">Voter ID Card</SelectItem>
                        <SelectItem value="Driving License">Driving License</SelectItem>
                        <SelectItem value="Utility Bill">Utility Bill</SelectItem>
                        <SelectItem value="Bank Statement">Bank Statement</SelectItem>
                        <SelectItem value="Employer Letter">Employer Letter</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address Proof Number */}
              <FormField
                control={form.control}
                name="addressProofNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Proof Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter document number" 
                        {...field}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address Proof Valid Till */}
              <FormField
                control={form.control}
                name="addressProofValidTill"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valid Till (optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-11 pl-3 text-left font-normal flex justify-between items-center",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Select validity date</span>
                            )}
                            <CalendarIcon className="h-4 w-4 opacity-70" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <Button 
              type="submit" 
              className="px-8 h-11 bg-black hover:bg-slate-500 text-white transition-colors"
            >
              Next: Document Upload
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
