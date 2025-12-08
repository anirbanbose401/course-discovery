import React from 'react';

const testimonials = [
    {
        id: 1,
        quote: "I was skeptical at first, but the Python bootcamp completely changed my career path. The instructor explained complex concepts so simply that I finally 'got' it.",
        author: "Sarah Jenkins",
        role: "Junior Developer @ TechFlow",
        rating: 5,
    },
    {
        id: 2,
        quote: "The UI is super clean and I love that I can download lessons for offline viewing. Perfect for my morning commute on the train.",
        author: "Rahul Mehta",
        role: "Data Analyst",
        rating: 5,
    },
    {
        id: 3,
        quote: "Honestly, better than my university lectures. The practical projects forced me to actually code instead of just watching videos.",
        author: "Priya Sharma",
        role: "UX Designer",
        rating: 5,
    },
    {
        id: 4,
        quote: "I got stuck on a React hook issue and the community helped me solve it in 20 minutes. The support system is the real value here.",
        author: "Amit Patel",
        role: "Frontend Freelancer",
        rating: 5,
    },
    {
        id: 5,
        quote: "Good content, but I wish there were more advanced modules for backend architecture. Still, great for getting the basics down solid.",
        author: "Neha Reddy",
        role: "Product Manager",
        rating: 4,
    },
];

export default function TestimonialCarousel() {
    return (
        <div className="w-full overflow-hidden bg-white py-10 relative">
            <div className="absolute top-0 left-0 h-full w-16 sm:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 right-0 h-full w-16 sm:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            <div className="relative w-full">
                <div className="flex w-max animate-scroll group hover:[animation-play-state:paused]">

                    <div className="flex gap-8 px-4">
                        {testimonials.map((testimonial) => (
                            <div
                                key={testimonial.id}
                                className="w-[300px] sm:w-[350px] bg-gray-50 p-6 rounded-lg flex-shrink-0 border border-gray-100 flex flex-col"
                            >
                                <div className="flex items-center mb-4">
                                    <div className="text-yellow-500 flex">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={i < testimonial.rating ? "text-yellow-500" : "text-gray-300"}>
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-700 mb-6 italic flex-grow">&quot;{testimonial.quote}&quot;</p>
                                <div className="mt-auto">
                                    <div className="font-semibold text-gray-900">- {testimonial.author}</div>
                                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>


                    <div className="flex gap-8 px-4">
                        {testimonials.map((testimonial) => (
                            <div
                                key={`dup-${testimonial.id}`}
                                className="w-[300px] sm:w-[350px] bg-gray-50 p-6 rounded-lg flex-shrink-0 border border-gray-100 flex flex-col"
                            >
                                <div className="flex items-center mb-4">
                                    <div className="text-yellow-500 flex">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={i < testimonial.rating ? "text-yellow-500" : "text-gray-300"}>
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-700 mb-6 italic flex-grow">&quot;{testimonial.quote}&quot;</p>
                                <div className="mt-auto">
                                    <div className="font-semibold text-gray-900">- {testimonial.author}</div>
                                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
