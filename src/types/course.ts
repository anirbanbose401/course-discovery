export interface Review {
    id: string;
    studentName: string;
    rating: number;
    comment: string;
    date: string;
}

export interface Instructor {
    id: string;
    name: string;
    title: string;
    bio: string;
    avatar: string;
    rating: number;
}

export interface Course {
    id: string;
    title: string;
    code: string;
    department: string;
    level: "Beginner" | "Intermediate" | "Advanced";
    price: number;
    duration: string;
    rating: number;
    reviewCount: number;
    instructor: Instructor;
    description: string;
    prerequisites: string[];
    learningOutcomes: string[];
    reviews: Review[];
    thumbnail: string;
    credits: number;
    studentsEnrolled: number;
    isFeatured: boolean;
}

export interface Department {
    id: string;
    name: string;
    icon: string;
    courseCount: number;
    description: string;
}
