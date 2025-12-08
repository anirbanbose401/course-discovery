# CourseHub

**A modern, responsive course discovery and enrollment platform built with Next.js 16.**

CourseHub is a feature-rich web application designed to facilitate online learning. It allows users to browse a comprehensive catalog, filter courses dynamically, manage a wishlist, and enroll in programs through a secure, multi-step process.

---

## Links

- **Repository:** [https://github.com/anirbanbose401/course-discovery.git](https://github.com/anirbanbose401/course-discovery.git)
- **Live Demo:** [CourseHub](https://course-discovery.vercel.app/)

---

## Features Implemented

### 1. Course Discovery (Listing Page)
- **Advanced Search:** Real-time text search by course name or instructor.
- **Dynamic Filtering:** Filter by **Department**, **Level** (Beginner, Intermediate, Advanced), and **Price Range**.
- **URL Synchronization:** Filters and search queries update the URL query params (e.g., `?search=react&level=beginner`), making results shareable.
- **Sorting:** Sort options for Price (Low-High), Rating, and A-Z.
- **Responsive Grid:** Card-based layout that adapts perfectly from mobile to desktop.

### 2. Course Details
- **Dynamic Routing:** Individual pages for each course (`/courses/[id]`).
- **Rich Content:** Displays curriculum, instructor bio, prerequisites, and learning outcomes.
- **Contextual Navigation:** "Enroll Now" redirects users to the form with course data pre-filled.

### 3. Two-Step Enrollment Form
Built with **React Final Form** and **Yup**, featuring strict validation logic:
- **Step 1: Personal Info**
  - **Age Validation:** Custom logic ensures the user is strictly **18+ years old**.
  - **Phone Validation:** Enforces Indian mobile number format (`+91-XXXXXXXXXX`).
- **Step 2: Academic Details**
  - Education level selection and terms agreement.
- **UX Enhancements:** Progress indicator, error handling on "Touch", and auto-redirect upon success.

### 4. My Enrollments & Wishlist
- **Persistence:** Enrolled courses are saved to LocalStorage.
- **Dashboard:** View enrolled courses with course ID.
- **Wishlist:** Heart icon functionality to save courses for later viewing.

### 5. Bonus Features
- **Course Comparison:** Compare selected courses side-by-side.
- **Enrollment Cancellation:** Option to cancel an active enrollment.
- **Newsletter Subscription:** API route implementation for footer signup.
- **Filter count badges:** Show count of active filters
- **Course favoriting:** Heart icon to save favorite courses
- **Search history:** Show last 3 searches with quick access
- **Form auto-save:** Save form draft every 30 seconds


---

## Tech Stack Used

-   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Forms & Validation**: [React Final Form](https://final-form.org/react) & [Yup](https://github.com/jquense/yup)
-   **UI Components**: [Radix UI](https://www.radix-ui.com/)
-   **Animations**: [Lottie React](https://github.com/Gamote/lottie-react)
-   **Date Handling**: [date-fns](https://date-fns.org/)

## Setup Instructions (How to run locally)

Follow these steps to get the project up and running on your local machine:

1.  **Clone the repository:**
    ```bash
    git clone "https://github.com/anirbanbose401/course-discovery.git"
    cd coursehub
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Open your browser:**
    Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

## Challenges Faced

-   **Complex Form Validation**: Implementing multi-step validation for the enrollment process required careful state management and synchronization between specific form fields and the backend API schema.
-   **State Management**: Ensuring the `Wishlist` state persisted correctly across page navigations and synced with user interactions without hydration errors in Next.js.
-   **Responsive Layouts**: Designing a card-based grid system for courses that adapts gracefully to extremely small mobile devices while maintaining visual appeal on large screens.
-   **Next.js 16 Integration**: Adapting to the latest Server Components patterns and ensuring client-side libraries (like `lottie-react` and `react-final-form`) worked seamlessly within the App Router architecture.