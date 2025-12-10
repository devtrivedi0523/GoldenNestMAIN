import React from 'react';
import ContactUs from './components/ContactUs';
import Footer from './components/Footer';

const AboutUs = () => {
    return (
        <>
        <div className="bg-white text-gray-800 px-6 md:px-16 py-5 space-y-16">
            {/* Top Image + Heading */}
            <div className="relative rounded-xl overflow-hidden shadow-lg">
                <img
                    src="/photo-1717167398817-121e3c283dbb.jpeg"
                    alt="About Us"
                    className="w-full h-auto object-cover"
                />
                <h1 className="absolute bottom-6 left-6 text-white text-4xl md:text-5xl font-semibold drop-shadow-lg">
                    About Us
                </h1>
            </div>

            {/* Description */}
            <div className=" mx-auto text-justify space-y-6 text-[17px] leading-relaxed">
                <p>
                    I was raised in a family of entrepreneurs. From wine shops and laundrettes to local supermarkets and property rentals, business was a part of daily life. It taught me the value of community, hard work and independence from an early age.
                    After graduating with a degree in psychology, I found myself drawn to more than just the academic side of understanding people. I became intrigued by the environments we live in, and how we make our home and our life including identity and identity.
                    While my passion lies in property design, I realized that real estate is not just about buildings or investments. It is about people, transitions, and meaningful life moments.
                </p>
                <p>
                    I started this agency to bring something different to the market. By combining clear insight & guided process psychology with the practical knowledge of the business world, my goal is to help buyers, sellers and people-centered approach to property.


                    Whether you are looking for your first home, exploring investment opportunities, or trying to find the right tenants for your property, I want to make the process clear, human and genuinely helpful.
                </p>
                <p>
                    To me, this is not just about property. It is about people. And every home should tell a story.
                </p>
            </div>

            {/* Why Choose Us */}
            <div className="px-6 md:px-16 py-16">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-start">
                    {/* Left: Title and paragraph */}
                    <div>
                        <h2 className="text-3xl md:text-4xl font-semibold mb-4">Why Choose Us</h2>
                        <p className="text-gray-600 text-base leading-relaxed">
                            Our story is one of continuous growth and evolution. We started as a small team with big dreams. Determined to create a modern real estate platform that transcended the ordinary.
                        </p>
                    </div>

                    {/* Right: Feature cards in 2x2 grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                        {/* Card 1 */}
                        <div className="flex items-start space-x-4 border-r border-gray-300 pr-6">
                            <div className="w-5 h-5 bg-orange-500 rounded-full mt-1" />
                            <div>
                                <h3 className="font-semibold text-lg">Trust</h3>
                                <p className="text-sm text-gray-600">
                                    Trust is the cornerstone of every successful real estate transaction.
                                </p>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="flex items-start space-x-4">
                            <div className="w-5 h-5 bg-orange-500 rounded-full mt-1" />
                            <div>
                                <h3 className="font-semibold text-lg">Excellence</h3>
                                <p className="text-sm text-gray-600">
                                    We set the bar high for ourselves, from the properties we curate to the services we provide.
                                </p>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="flex items-start space-x-4 border-r border-gray-300 pr-6">
                            <div className="w-5 h-5 bg-orange-500 rounded-full mt-1" />
                            <div>
                                <h3 className="font-semibold text-lg">Client-Centric</h3>
                                <p className="text-sm text-gray-600">
                                    Your dreams deserve a voice — and we listen. We understand.
                                </p>
                            </div>
                        </div>

                        {/* Card 4 */}
                        <div className="flex items-start space-x-4">
                            <div className="w-5 h-5 bg-orange-500 rounded-full mt-1" />
                            <div>
                                <h3 className="font-semibold text-lg">Our Commitment</h3>
                                <p className="text-sm text-gray-600">
                                    We are dedicated to providing you with the highest level of service and professionalism.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <ContactUs />
            <Footer />
            </>
    );
};

export default AboutUs;
