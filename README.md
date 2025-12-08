# CourseHub

CourseHub is a modern, responsive web application designed to facilitate course discovery and enrollment. Built with the latest web technologies, it offers a seamless user experience for browsing courses, managing wishlists, and enrolling in educational programs.

## Features Completed

-   **Course Discovery**: Browse a comprehensive catalog of courses with advanced filtering and search capabilities.
-   **Detailed Course Info**: View detailed information about each course, including curriculum, instructor details, and schedules.
-   **Enrollment System**: A robust enrollment flow powered by **React Final Form** and **Yup validation** to ensure accurate data capture.
-   **Wishlist Management**: Users can save courses to their wishlist for future reference, managed via React Context.
-   **Newsletter Subscription**: Integrated newsletter signup functionality to keep users updated (API route implementation).
-   **Responsive Design**: precise layout adjustments for mobile, tablet, and desktop views using **Tailwind CSS**.
-   **Interactive UI**: Enhanced user engagement with animations (**Lottie React**) and modern UI components (**Radix UI**).
-   **Mock Backend**: Uses local JSON data for courses and departments, allowing for a strictly frontend-focused setup without complex database prerequisites.

## 🛠 Tech Stack Used

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