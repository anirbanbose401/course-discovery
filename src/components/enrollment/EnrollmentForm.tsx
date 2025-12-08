'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Field } from 'react-final-form';
import * as Yup from 'yup';
import { Button } from '@/components/ui/Button';
import { EnrollmentFormData, Course } from '@/types';
import { useToast } from '@/hooks/useToast';
import { format, isValid, parse } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useEnrollments } from '@/hooks/useEnrollments';

interface EnrollmentFormProps {
  course: Course;
}


const step1Schema = Yup.object().shape({
  fullName: Yup.string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: Yup.string()
    .required('Email is required')
    // Standard email regex. Not perfect, but good enough for client-side check.
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email address'),
  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^\+91-\d{10}$/, 'Phone must be in format +91-XXXXXXXXXX'),
  dateOfBirth: Yup.date()
    .transform((value, originalValue) => {
      if (originalValue && typeof originalValue === 'string') {
        // Parse DD-MM-YYYY to Date
        const parsed = parse(originalValue, 'dd-MM-yyyy', new Date());
        return isValid(parsed) ? parsed : new Date(''); // Return invalid date if parsing fails
      }
      return value;
    })
    .required('Date of birth is required')
    .test('age', 'You must be at least 18 years old', function (value) {
      if (!value || !isValid(value)) return false;
      // Simple age check - just looking at year/month/day to be precise
      const today = new Date();
      const birthDate = value;
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 18;
      }
      return age >= 18;
    }),
});

const step2Schema = Yup.object().shape({
  qualification: Yup.string().required('Qualification is required'),
  joinReason: Yup.string()
    .required('Reason for joining is required')
    .min(50, 'Reason must be at least 50 characters')
    .max(300, 'Reason must be at most 300 characters'),
  source: Yup.array()
    .of(Yup.string())
    .min(1, 'Please select at least one source'),
  agreedToTerms: Yup.boolean()
    .oneOf([true], 'You must agree to the terms and conditions')
    .required('You must agree to the terms and conditions'),
});

export default function EnrollmentForm({ course }: EnrollmentFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<EnrollmentFormData>>({});
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
  const router = useRouter();
  const toast = useToast();
  const { addEnrollment } = useEnrollments();

  const validate = (values: Partial<EnrollmentFormData>) => {
    const schema = step === 1 ? step1Schema : step2Schema;
    try {
      schema.validateSync(values, { abortEarly: false });
      return {};
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        return err.inner.reduce((errors: any, error) => {
          if (error.path) {
            errors[error.path] = error.message;
          }
          return errors;
        }, {});
      }
      return {};
    }
  };


  useEffect(() => {
    const draftKey = `enrollment_draft_${course.id}`;


    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setFormData(parsed);
        // Note: We are not auto-advancing steps, just restoring data.
        toast.success('Restored your previous draft');
      } catch (e) {
        // Silent fail if local storage is corrupt or disabled
        console.error('Failed to restore draft');
      }
    }
  }, [course.id]); // Only run on mount (and if course changes, though unlikely in this view)


  const AutoSave = ({ values }: { values: Partial<EnrollmentFormData> }) => {
    useEffect(() => {
      const draftKey = `enrollment_draft_${course.id}`;
      // Debounce save (or just save every few seconds if prefer interval)
      const saveToStorage = () => {
        // Merge formData (Step 1 or previous data) with current form values
        const currentData = { ...formData, ...values };
        if (Object.keys(currentData).length > 0) {
          localStorage.setItem(draftKey, JSON.stringify(currentData));
        }
      };

      // Debounce the save to avoid hammering localStorage on every keystroke
      const timer = setTimeout(saveToStorage, 1000);
      return () => clearTimeout(timer);
    }, [values]);

    return null;
  };

  const clearDraft = () => {
    localStorage.removeItem(`enrollment_draft_${course.id}`);
  };

  const handleStep1Submit = (values: Partial<EnrollmentFormData>) => {
    setFormData({ ...formData, ...values });
    setStep(2);
  };

  const handleStep2Submit = async (values: Partial<EnrollmentFormData>) => {
    const finalData: EnrollmentFormData = {
      ...formData,
      ...values,
    } as EnrollmentFormData;

    try {
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: course.id,
          courseName: course.title,
          courseCode: course.code,
          ...finalData,
        }),
      });

      if (!response.ok) {
        throw new Error('Enrollment failed');
      }

      const data = await response.json();
      if (data.enrollment) {
        addEnrollment(data.enrollment);
      }

      toast.success('Successfully enrolled in course!');
      clearDraft();
      router.push('/success');
    } catch (error) {
      toast.error('Failed to enroll. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">

      <div className="mb-10">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start relative z-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
              1
            </div>
            <span className="mt-2 text-sm font-medium absolute top-10 left-0 whitespace-nowrap">Personal Info</span>
          </div>
          <div className="flex-1 h-1 mx-4 bg-gray-300">
            <div className={`h-full transition-all duration-300 ${step >= 2 ? 'bg-primary-600 w-full' : 'bg-gray-300 w-0'
              }`} />
          </div>
          <div className="flex flex-col items-end relative z-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
              2
            </div>
            <span className="mt-2 text-sm font-medium absolute top-10 right-0 whitespace-nowrap">Education</span>
          </div>
        </div>
      </div>


      {step === 1 && (
        <Form
          onSubmit={handleStep1Submit}
          validate={validate}
          initialValues={formData}
          render={({ handleSubmit, submitting, hasValidationErrors, values }) => (
            <form onSubmit={handleSubmit} className="space-y-6">
              <AutoSave values={values} />
              <Field name="fullName">
                {({ input, meta }) => (
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      {...input}
                      type="text"
                      id="fullName"
                      className="w-full h-11 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your full name"
                      onKeyDown={(e) => {

                        // We restrict special chars here to keep the name clean
                        if (
                          !/^[a-zA-Z\s]*$/.test(e.key) &&
                          !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)
                        ) {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {

                        const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                        input.onChange(value);
                      }}
                    />
                    {meta.touched && meta.error && (
                      <p className="mt-1 text-sm text-red-600">{meta.error}</p>
                    )}
                  </div>
                )}
              </Field>

              <Field name="email">
                {({ input, meta }) => (
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      {...input}
                      type="email"
                      id="email"
                      className="w-full h-11 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="your.email@example.com"
                    />
                    {meta.touched && meta.error && (
                      <p className="mt-1 text-sm text-red-600">{meta.error}</p>
                    )}
                  </div>
                )}
              </Field>

              <Field name="phone">
                {({ input, meta }) => (
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      {...input}
                      type="tel"
                      id="phone"
                      className="w-full h-11 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="+91-XXXXXXXXXX"
                      onFocus={(e) => {
                        if (!e.target.value) {
                          input.onChange('+91-');
                        }
                      }}
                      onKeyDown={(e) => {
                        // Prevent backspace if cursor is at or before the prefix
                        if (e.key === 'Backspace' && e.currentTarget.selectionStart !== null && e.currentTarget.selectionStart <= 4) {
                          e.preventDefault();
                        }
                        // Allow numbers and standard control keys
                        if (
                          !/\d/.test(e.key) &&
                          !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)
                        ) {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        let value = e.target.value;


                        // Force the +91 prefix for Indian numbers
                        if (!value.startsWith('+91-')) {
                          value = '+91-' + value.replace(/^\+91-?/, '');
                        }


                        const prefix = '+91-';
                        const suffix = value.substring(4).replace(/\D/g, '');


                        const truncatedSuffix = suffix.slice(0, 10);

                        input.onChange(prefix + truncatedSuffix);
                      }}
                    />
                    {meta.touched && meta.error && (
                      <p className="mt-1 text-sm text-red-600">{meta.error}</p>
                    )}
                  </div>
                )}
              </Field>

              <Field name="dateOfBirth">
                {({ input, meta }) => (
                  <div className="flex flex-col">
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth <span className="text-red-500 ml-1">*</span> (You must be 18+)
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="relative">
                          <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
                          <input
                            {...input}
                            type="text"
                            className={cn(
                              "w-full h-11 pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500",
                              !input.value && "text-muted-foreground"
                            )}
                            placeholder="DD-MM-YYYY"
                            onChange={(e) => {
                              let value = e.target.value.replace(/\D/g, '');
                              if (value.length > 8) value = value.slice(0, 8);


                              if (value.length > 4) {
                                value = `${value.slice(0, 2)}-${value.slice(2, 4)}-${value.slice(4)}`;
                              } else if (value.length > 2) {
                                value = `${value.slice(0, 2)}-${value.slice(2)}`;
                              }

                              input.onChange(value);


                              if (value.length === 10) {
                                const parsed = parse(value, 'dd-MM-yyyy', new Date());
                                if (isValid(parsed)) {
                                  setCalendarMonth(parsed);
                                }
                              }
                            }}
                            maxLength={10}
                          />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          month={calendarMonth}
                          onMonthChange={setCalendarMonth}
                          selected={(() => {
                            if (!input.value || input.value.length < 10) return undefined;
                            const date = parse(input.value, 'dd-MM-yyyy', new Date());
                            return isValid(date) ? date : undefined;
                          })()}
                          onSelect={(date) => {
                            if (date) {
                              input.onChange(format(date, 'dd-MM-yyyy'));
                              setCalendarMonth(date);
                            }
                          }}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {meta.touched && meta.error && (
                      <p className="mt-1 text-sm text-red-600">{meta.error}</p>
                    )}
                  </div>
                )}
              </Field>

              <div className="flex justify-end">
                <Button type="submit" disabled={submitting || hasValidationErrors}>
                  Next Step
                </Button>
              </div>
            </form>
          )}
        />
      )}


      {step === 2 && (
        <Form
          onSubmit={handleStep2Submit}
          validate={validate}
          initialValues={formData}
          render={({ handleSubmit, submitting, hasValidationErrors, values }) => (
            <form onSubmit={handleSubmit} className="space-y-6">
              <AutoSave values={values} />
              <Field name="qualification">
                {({ input, meta }) => (
                  <div>
                    <label htmlFor="qualification" className="block text-sm font-medium text-gray-700 mb-1">
                      Current education level <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                      {...input}
                      id="qualification"
                      className="w-full h-11 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select Education Level</option>
                      <option value="High School">High School</option>
                      <option value="Undergraduate">Undergraduate</option>
                      <option value="Graduate">Graduate</option>
                    </select>
                    {meta.touched && meta.error && (
                      <p className="mt-1 text-sm text-red-600">{meta.error}</p>
                    )}
                  </div>
                )}
              </Field>

              <Field name="joinReason">
                {({ input, meta }) => (
                  <div>
                    <label htmlFor="joinReason" className="block text-sm font-medium text-gray-700 mb-1">
                      Why do you want to join this course? <span className="text-red-500 ml-1">*</span>
                      <span className="text-xs text-gray-500 ml-2">(Min 50, Max 300 chars)</span>
                    </label>
                    <textarea
                      {...input}
                      id="joinReason"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Tell us your motivation..."
                      maxLength={300}
                    />
                    <div className="flex justify-between mt-1">
                      {meta.touched && meta.error ? (
                        <p className="text-sm text-red-600">{meta.error}</p>
                      ) : (
                        <span></span>
                      )}
                      <p className="text-xs text-gray-500">
                        {input.value ? input.value.length : 0}/300
                      </p>
                    </div>
                  </div>
                )}
              </Field>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How did you hear about us?
                </label>
                <div className="space-y-2">
                  {['Social Media', 'Friend', 'Advertisement', 'Other'].map((option) => (
                    <div key={option} className="flex items-center">
                      <Field
                        name="source"
                        component="input"
                        type="checkbox"
                        value={option}
                      >
                        {({ input }) => (
                          <input
                            {...input}
                            id={`source-${option}`}
                            type="checkbox"
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                        )}
                      </Field>
                      <label htmlFor={`source-${option}`} className="ml-2 block text-sm text-gray-900">
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
                <Field name="source">
                  {({ meta }) => (
                    meta.touched && meta.error && (
                      <p className="mt-1 text-sm text-red-600">{meta.error}</p>
                    )
                  )}
                </Field>
              </div>

              <Field name="agreedToTerms" type="checkbox">
                {({ input, meta }) => (
                  <div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          {...input}
                          id="agreedToTerms"
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="agreedToTerms" className="font-medium text-gray-700">
                          Agree to terms and conditions <span className="text-red-500 ml-1">*</span>
                        </label>
                        <p className="text-gray-500">By selecting this, you agree to our terms of service and privacy policy.</p>
                      </div>
                    </div>
                    {meta.touched && meta.error && (
                      <p className="mt-1 text-sm text-red-600">{meta.error}</p>
                    )}
                  </div>
                )}
              </Field>

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="border-primary-600 text-primary-600 hover:bg-primary-50"
                >
                  Previous
                </Button>
                <Button type="submit" disabled={submitting || hasValidationErrors}>
                  Complete Enrollment
                </Button>
              </div>
            </form>
          )}
        />
      )}
    </div>
  );
}
