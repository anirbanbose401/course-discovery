export interface Enrollment {
    id: string;
    courseId: string;
    courseName: string;
    courseCode: string;
    studentName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    qualification: string;
    joinReason: string;
    source: string[];
    agreedToTerms: boolean;
    enrolledDate: string;
}

export interface EnrollmentFormData {
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    qualification: string;
    joinReason: string;
    source: string[];
    agreedToTerms: boolean;
}
