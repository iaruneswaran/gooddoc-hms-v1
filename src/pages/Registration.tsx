import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, ChevronLeft } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { BookingSteps } from "@/components/BookingSteps";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
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
  nationalId: z.string().min(12, "National ID must be at least 12 characters").max(20),
  street: z.string().min(5, "Street address is required").max(200),
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
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
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
      
      <div className="flex-1 ml-[196px]">
        <AppHeader breadcrumbs={["GoodDoc", "Appointments", "Registration"]} />
        
        <main className="p-8">
          <button
            onClick={() => navigate("/new-appointment")}
            className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="font-semibold">Search</span>
          </button>

          <BookingSteps currentStep="registration" />

          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-primary">Patient Registration</h2>
              <span className="text-sm font-medium text-primary">#{gdid}</span>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Patient Information */}
              <div className="bg-card rounded-lg border border-border p-6 space-y-6">
                <h3 className="text-base font-semibold text-foreground">Patient Information</h3>
                
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
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dateOfBirth && "text-muted-foreground",
                            errors.dateOfBirth && "border-destructive"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateOfBirth ? format(dateOfBirth, "dd/MM/yyyy") : "dd/mm/yyyy"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateOfBirth}
                          onSelect={(date) => date && setValue("dateOfBirth", date)}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
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
                    <Input
                      id="mobileNumber"
                      placeholder="10 digits"
                      maxLength={10}
                      {...register("mobileNumber")}
                      className={errors.mobileNumber ? "border-destructive" : ""}
                    />
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
                    <Label htmlFor="nationalId">National ID</Label>
                    <Input
                      id="nationalId"
                      placeholder="9876 5432 1098"
                      {...register("nationalId")}
                      className={errors.nationalId ? "border-destructive" : ""}
                    />
                    {errors.nationalId && (
                      <p className="text-xs text-destructive">{errors.nationalId.message}</p>
                    )}
                  </div>
                </div>

              </div>

              {/* Address Details */}
              <div className="bg-card rounded-lg border border-border p-6 space-y-6">
                <h3 className="text-base font-semibold text-foreground">Address Details</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="street">Street, Apartment</Label>
                    <Input
                      id="street"
                      placeholder="Anna Nagar"
                      {...register("street")}
                      className={errors.street ? "border-destructive" : ""}
                    />
                    {errors.street && (
                      <p className="text-xs text-destructive">{errors.street.message}</p>
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
      </div>
    </div>
  );
};

export default Registration;
