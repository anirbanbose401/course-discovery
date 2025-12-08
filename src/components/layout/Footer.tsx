import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">About CourseHub</h3>
            <p className="text-sm">
              Discover and enroll in high-quality courses across multiple disciplines.
              Build your skills with expert instructors.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-white transition-colors">
                  All Courses
                </Link>
              </li>
              <li>
                <Link href="/enrollments" className="hover:text-white transition-colors">
                  My Enrollments
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Popular Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/courses?department=Web Development" className="hover:text-white transition-colors">
                  Web Development
                </Link>
              </li>
              <li>
                <Link href="/courses?department=Data Science" className="hover:text-white transition-colors">
                  Data Science
                </Link>
              </li>
              <li>
                <Link href="/courses?department=UI/UX Design" className="hover:text-white transition-colors">
                  UI/UX Design
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>Email: info@coursehub.com</li>
              <li>Phone: +91-1234567890</li>
              <li>Address: Mumbai, India</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} CourseHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
