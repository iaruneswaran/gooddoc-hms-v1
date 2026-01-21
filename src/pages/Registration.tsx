import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, parse, isValid } from "date-fns";
import { CalendarIcon, ChevronLeft } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { PageContent } from "@/components/PageContent";
import { BookingSteps } from "@/components/BookingSteps";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const registrationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  firstName: z.string().min(2, "First name is required").max(100),
  surname: z.string().min(2, "Surname is required").max(100),
  gender: z.string().min(1, "Gender is required"),
  dateOfBirth: z.date({ required_error: "Date of birth is required" }),
  mobileNumber: z.string().regex(/^\d{10}$/, "Mobile number must be 10 digits"),
  email: z.string().email("Invalid email address").max(255),
  bloodGroup: z.string().min(1, "Blood group is required"),
  // Medical Info
  allergic: z.enum(["yes", "no"]).optional(),
  highBloodPressure: z.enum(["yes", "no"]).optional(),
  diabetes: z.enum(["yes", "no"]).optional(),
  kidneyDisease: z.enum(["yes", "no"]).optional(),
  asthma: z.enum(["yes", "no"]).optional(),
  pregnant: z.enum(["yes", "no"]).optional(),
  breastFeeding: z.enum(["yes", "no"]).optional(),
  otherConditions: z.string().optional(),
  // Insurance
  insuranceFunder: z.string().optional(),
  policyNumber: z.string().optional(),
  relationshipToPolicyHolder: z.string().optional(),
  effectiveDate: z.date().optional(),
  coverageStartDate: z.date().optional(),
  schemeName: z.string().optional(),
  policyHolderName: z.string().optional(),
  memberId: z.string().optional(),
  expiryDate: z.date().optional(),
  coverageEndDate: z.date().optional(),
  // Address
  pinCode: z.string().regex(/^\d{6}$/, "Pin code must be 6 digits"),
  city: z.string().min(2, "City is required").max(100),
  state: z.string().min(2, "State is required").max(100),
  country: z.string().min(2, "Country is required").max(100),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

const Registration = () => {
  const navigate = useNavigate();
  const [gdid] = useState("GDID - 009");
  const [age, setAge] = useState<number | null>(null);
  const [dateInput, setDateInput] = useState<string>("");
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      country: "India",
    },
  });

  const dateOfBirth = watch("dateOfBirth");
  const gender = watch("gender");
  const title = watch("title");

  // Calculate age when date of birth changes
  useEffect(() => {
    if (dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      
      setAge(calculatedAge);
    } else {
      setAge(null);
    }
  }, [dateOfBirth]);

  const onSubmit = (data: RegistrationFormData) => {
    console.log("Registration data:", data);
    toast({
      title: "Registration Successful",
      description: `Patient registered with ${gdid}`,
    });
    // Navigate to appointment booking step
    navigate("/book-appointment");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      <PageContent>
        <AppHeader breadcrumbs={["Appointments", "Registration"]} />
        
        <main className="p-6">
          <div className="flex items-center justify-between h-10 mb-12">
            <button
              onClick={() => navigate("/new-appointment")}
              className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors w-[120px]"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="font-semibold">Search</span>
            </button>

            <BookingSteps currentStep="registration" />
            
            <div className="w-[120px]" />
          </div>

          <div className="max-w-5xl mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Patient Information */}
              <div className="bg-card rounded-lg border border-border p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-foreground">Patient Information</h3>
                  <span className="text-sm font-medium text-primary">#{gdid}</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Select value={title} onValueChange={(value) => setValue("title", value)}>
                      <SelectTrigger className={errors.title ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mr">Mr</SelectItem>
                        <SelectItem value="Mrs">Mrs</SelectItem>
                        <SelectItem value="Ms">Ms</SelectItem>
                        <SelectItem value="Dr">Dr</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.title && (
                      <p className="text-xs text-destructive">{errors.title.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="First name"
                      {...register("firstName")}
                      className={errors.firstName ? "border-destructive" : ""}
                    />
                    {errors.firstName && (
                      <p className="text-xs text-destructive">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="surname">Surname</Label>
                    <Input
                      id="surname"
                      placeholder="Surname"
                      {...register("surname")}
                      className={errors.surname ? "border-destructive" : ""}
                    />
                    {errors.surname && (
                      <p className="text-xs text-destructive">{errors.surname.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={gender} onValueChange={(value) => setValue("gender", value)}>
                      <SelectTrigger className={errors.gender ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Male</SelectItem>
                        <SelectItem value="F">Female</SelectItem>
                        <SelectItem value="O">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.gender && (
                      <p className="text-xs text-destructive">{errors.gender.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Input
                      placeholder="dd/mm/yyyy"
                      value={dateInput || (dateOfBirth ? format(dateOfBirth, "dd/MM/yyyy") : "")}
                      maxLength={10}
                      onChange={(e) => {
                        let value = e.target.value.replace(/[^\d]/g, ''); // Remove non-digits
                        
                        // Auto-format with slashes
                        if (value.length >= 2) {
                          value = value.slice(0, 2) + '/' + value.slice(2);
                        }
                        if (value.length >= 5) {
                          value = value.slice(0, 5) + '/' + value.slice(5, 9);
                        }
                        
                        setDateInput(value);
                        
                        // Try to parse the date in dd/MM/yyyy format
                        const parsedDate = parse(value, "dd/MM/yyyy", new Date());
                        if (isValid(parsedDate) && parsedDate <= new Date() && parsedDate >= new Date("1900-01-01")) {
                          setValue("dateOfBirth", parsedDate);
                        }
                      }}
                      className={cn(
                        errors.dateOfBirth && "border-destructive"
                      )}
                    />
                    {errors.dateOfBirth && (
                      <p className="text-xs text-destructive">{errors.dateOfBirth.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      placeholder="Calculated from DOB"
                      value={age !== null ? age : ""}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mobileNumber">Mobile Number</Label>
                    <div className="flex gap-2">
                      <Input
                        value="+91"
                        readOnly
                        className="w-16 bg-muted text-center"
                      />
                      <Input
                        id="mobileNumber"
                        placeholder="98765 43210"
                        maxLength={10}
                        {...register("mobileNumber")}
                        className={errors.mobileNumber ? "border-destructive flex-1" : "flex-1"}
                      />
                    </div>
                    {errors.mobileNumber && (
                      <p className="text-xs text-destructive">{errors.mobileNumber.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      {...register("email")}
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Controller
                      control={control}
                      name="bloodGroup"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className={errors.bloodGroup ? "border-destructive" : ""}>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A+">A+</SelectItem>
                            <SelectItem value="A−">A−</SelectItem>
                            <SelectItem value="B+">B+</SelectItem>
                            <SelectItem value="B−">B−</SelectItem>
                            <SelectItem value="AB+">AB+</SelectItem>
                            <SelectItem value="AB−">AB−</SelectItem>
                            <SelectItem value="O+">O+</SelectItem>
                            <SelectItem value="O−">O−</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.bloodGroup && (
                      <p className="text-xs text-destructive">{errors.bloodGroup.message}</p>
                    )}
                  </div>
                </div>

              </div>

              {/* Medical Info */}
              <div className="bg-card rounded-lg border border-border p-6 space-y-6">
                <h3 className="text-base font-semibold text-foreground">Medical Info</h3>
                
                <div className="grid grid-cols-4 gap-x-6 gap-y-4">
                  {[
                    { name: "allergic" as const, label: "Allergic" },
                    { name: "highBloodPressure" as const, label: "High Blood Pressure" },
                    { name: "diabetes" as const, label: "Diabetes" },
                    { name: "kidneyDisease" as const, label: "Kidney Disease" },
                    { name: "asthma" as const, label: "Asthma" },
                    { name: "pregnant" as const, label: "Pregnant" },
                    { name: "breastFeeding" as const, label: "Breast feeding" },
                  ].map((condition) => (
                    <div key={condition.name} className="space-y-2">
                      <Label className="text-sm">{condition.label}</Label>
                      <Controller
                        control={control}
                        name={condition.name}
                        render={({ field }) => (
                          <RadioGroup
                            value={field.value}
                            onValueChange={field.onChange}
                            className="flex gap-4"
                          >
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="yes" id={`${condition.name}-yes`} />
                              <Label htmlFor={`${condition.name}-yes`} className="font-normal cursor-pointer">Yes</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="no" id={`${condition.name}-no`} />
                              <Label htmlFor={`${condition.name}-no`} className="font-normal cursor-pointer">No</Label>
                            </div>
                          </RadioGroup>
                        )}
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="otherConditions">Other</Label>
                  <Input
                    id="otherConditions"
                    placeholder="Please specify any other medical conditions, allergies, or relevant health information..."
                    {...register("otherConditions")}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Insurance */}
              <div className="bg-card rounded-lg border border-border p-6 space-y-6">
                <h3 className="text-base font-semibold text-foreground">Insurance</h3>
                
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="insuranceFunder">Insurance Funder</Label>
                    <Input
                      id="insuranceFunder"
                      placeholder="Funder name"
                      {...register("insuranceFunder")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="policyNumber">Policy Number</Label>
                    <Input
                      id="policyNumber"
                      placeholder="Policy number"
                      {...register("policyNumber")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="relationshipToPolicyHolder">Relationship To Policy Holder</Label>
                    <Controller
                      control={control}
                      name="relationshipToPolicyHolder"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="self">Self</SelectItem>
                            <SelectItem value="spouse">Spouse</SelectItem>
                            <SelectItem value="child">Child</SelectItem>
                            <SelectItem value="parent">Parent</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Effective Date</Label>
                    <Controller
                      control={control}
                      name="effectiveDate"
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, "dd/MM/yyyy") : "DD/MM/YYYY"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Coverage Start Date</Label>
                    <Controller
                      control={control}
                      name="coverageStartDate"
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, "dd/MM/yyyy") : "DD/MM/YYYY"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="schemeName">Scheme Name</Label>
                    <Input
                      id="schemeName"
                      placeholder="Scheme name"
                      {...register("schemeName")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="policyHolderName">Policy Holder Name</Label>
                    <Input
                      id="policyHolderName"
                      placeholder="Policy holder name"
                      {...register("policyHolderName")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="memberId">Member ID</Label>
                    <Input
                      id="memberId"
                      placeholder="Member ID"
                      {...register("memberId")}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Expiry Date</Label>
                    <Controller
                      control={control}
                      name="expiryDate"
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, "dd/MM/yyyy") : "DD/MM/YYYY"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Coverage End Date</Label>
                    <Controller
                      control={control}
                      name="coverageEndDate"
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, "dd/MM/yyyy") : "DD/MM/YYYY"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Address Details */}
              <div className="bg-card rounded-lg border border-border p-6 space-y-6">
                <h3 className="text-base font-semibold text-foreground">Address Details</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="Chennai"
                      {...register("city")}
                      className={errors.city ? "border-destructive" : ""}
                    />
                    {errors.city && (
                      <p className="text-xs text-destructive">{errors.city.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pinCode">Pin code</Label>
                    <Input
                      id="pinCode"
                      placeholder="012 345"
                      maxLength={6}
                      {...register("pinCode")}
                      className={errors.pinCode ? "border-destructive" : ""}
                    />
                    {errors.pinCode && (
                      <p className="text-xs text-destructive">{errors.pinCode.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      placeholder="Tamil Nadu"
                      {...register("state")}
                      className={errors.state ? "border-destructive" : ""}
                    />
                    {errors.state && (
                      <p className="text-xs text-destructive">{errors.state.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      placeholder="India"
                      {...register("country")}
                      className={errors.country ? "border-destructive" : ""}
                    />
                    {errors.country && (
                      <p className="text-xs text-destructive">{errors.country.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/new-appointment")}
                >
                  Back
                </Button>
                <Button type="submit">
                  Save & Continue
                </Button>
              </div>
            </form>
          </div>
        </main>
      </PageContent>
    </div>
  );
};

export default Registration;
