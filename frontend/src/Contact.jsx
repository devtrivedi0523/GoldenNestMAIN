import React from 'react';
import Footer from './components/Footer';
import ContactUs from './components/ContactUs';

const Contact = () => {
    return (
        <>
            <div className="px-6 py-12">
                {/* Header */}
                <div className="text-center mb-12 ">
                    <h2 className="text-3xl font-bold mb-4 ">Get in Touch with Golden Nest</h2>
                    <p className="text-gray-700 max-w-2xl mx-auto">
                        We’re here to assist you with any inquiries, requests, or feedback you may have. Whether you're looking to buy or sell a property, explore investment opportunities, or simply want to connect, we’re just a message away.
                    </p>
                </div>

                {/* Contact Methods */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {/* Email */}
                    <div className="border rounded-lg p-6 text-center shadow hover:shadow-lg transition">
                        <div className="text-orange-500 text-3xl mb-2">📧</div>
                        <p className="text-lg font-semibold">info@thegoldennest.com</p>
                    </div>
                    {/* Phone */}
                    <div className="border rounded-lg p-6 text-center shadow hover:shadow-lg transition">
                        <div className="text-orange-500 text-3xl mb-2">📞</div>
                        <p className="text-lg font-semibold">+1 (023) 456-7890</p>
                    </div>
                    {/* Social */}
                    <div className="border rounded-lg p-6 text-center shadow hover:shadow-lg transition">
                        <div className="text-orange-500 text-3xl mb-2">🌐</div>
                        <p className="text-lg font-semibold">Instagram • LinkedIn • Facebook</p>
                    </div>
                </div>

                {/* Let's Connect */}
                <div className="bg-white border p-8 rounded-lg shadow">
                    <h3 className="text-2xl font-bold mb-6">Let's Connect</h3>
                    <p className="text-gray-600 mb-6 max-w-3xl">
                        Use the form below to get in touch with Golden Nest. Whether you're a prospective client, partner, or simply curious about our services, we're here to answer your questions and provide the assistance you need.
                    </p>

                    <form className="space-y-6">
                        {/* Row 1: First Name, Last Name, Email */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                                <input id="firstName" type="text" placeholder="Enter First Name" className="rounded px-4 py-2 w-full bg-gray-300" />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                                <input id="lastName" type="text" placeholder="Enter Last Name" className="rounded px-4 py-2 w-full bg-gray-300" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input id="email" type="email" placeholder="Enter your Email" className="rounded px-4 py-2 w-full bg-gray-300" />
                            </div>
                        </div>

                        {/* Row 2: Phone, Inquiry Type, How Did You Hear */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <input id="phone" type="tel" placeholder="Enter Phone Number" className="rounded px-4 py-2 w-full bg-gray-300" />
                            </div>
                            <div>
                                <label htmlFor="inquiryType" className="block text-sm font-medium text-gray-700">Inquiry Type</label>
                                <select id="inquiryType" className="bg-gray-300 rounded px-4 py-2 w-full text-gray-700">
                                    <option>Select Inquiry Type</option>
                                    <option>Buying</option>
                                    <option>Selling</option>
                                    <option>Renting</option>
                                    <option>Partnership</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="hearAbout" className="block text-sm font-medium text-gray-700">How Did You Hear About Us?</label>
                                <select id="hearAbout" className="bg-gray-300 rounded px-4 py-2 w-full text-gray-700">
                                    <option>How Did You Hear About Us?</option>
                                    <option>Social Media</option>
                                    <option>Referral</option>
                                    <option>Online Search</option>
                                    <option>Other</option>
                                </select>
                            </div>
                        </div>

                        {/* Message */}
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                            <textarea id="message" placeholder="Enter your Message here..." rows="5" className="bg-gray-300 rounded px-4 py-2 w-full"></textarea>
                        </div>

                        {/* Terms and Button */}
                        <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-4">
                            <label className="text-sm text-gray-600 flex items-start">
                                <input type="checkbox" className="mr-2 mt-1" />
                                I agree with <a href="#" className="text-orange-500 underline ml-1">Terms of Use</a> and <a href="#" className="text-orange-500 underline ml-1">Privacy Policy</a>
                            </label>
                            <button type="submit" className="bg-[#F3B03E] text-white px-6 py-2 rounded hover:bg-[#e69b1a] transition">
                                Send Your Message
                            </button>
                        </div>
                    </form>

                </div>

            </div>
            <ContactUs />
            <Footer />
        </>
    );
};


export default Contact;
