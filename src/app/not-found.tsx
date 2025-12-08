import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white rounded-lg shadow-md p-12">
          <Image
            src="/error.svg"
            alt="Error Illustration"
            width={200}
            height={200}
            className="mb-6 mx-auto"
          />

          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            Page Not Found
          </h2>

          <p className="text-lg text-gray-600 mb-8">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
            It might have been moved or doesn&apos;t exist.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg">Go to Homepage</Button>
            </Link>
            <Link href="/courses">
              <Button variant="outline" size="lg">
                Browse Courses
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
