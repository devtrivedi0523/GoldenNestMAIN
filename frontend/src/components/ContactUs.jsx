import React from 'react'

const ContactUs = () => {
    return (
        <div>
            <section className="bg-white mt-16 px-6 md:px-20 py-12">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 text-sm text-gray-700">

                    {/* Logo Placeholder */}
                    <div className="md:col-span-1">
                        <img src="/1-2 1 (1).png" alt="" className='' />
                        {/* You can replace this with <img src="/logo.png" alt="Golden Nest" className="h-10" /> */}
                    </div>

                    {/* Column 1 */}
                    <div className='justify-center'>
                        <h4 className="font-semibold text-black mb-3">SELL A HOME</h4>
                        <ul className="space-y-2">
                            <li><a href="/sell" className="hover:underline">Request an offer</a></li>

                            <li><a href="/sell" className="hover:underline">Reviews</a></li>

                        </ul>

                        <h4 className="font-semibold text-black mt-5 mb-3">BUY A HOME</h4>
                        <ul className="space-y-2">
                            <li><a href="/buy" className="hover:underline">Buy</a></li>

                        </ul>
                    </div>


                    {/* Column 2 */}


                    {/* Column 3 */}
                    <div>
                        <h4 className="font-semibold text-black mb-3">RENT A HOME</h4>
                        <ul className="space-y-2">
                            <li><a href="/rent" className="hover:underline">Rent home</a></li>
                        </ul>

                        <h4 className="font-semibold text-black mt-5 mb-3">TERMS & PRIVACY</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:underline">Trust & Safety</a></li>
                            <li><a
                                href="/Website legal pages.docx"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                            >Terms & Services</a></li>
                            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
                        </ul>
                    </div>

                    {/* Column 4 */}
                    <div>
                        <h4 className="font-semibold text-black mb-3">ABOUT</h4>
                        <ul className="space-y-2">
                            <li><a href="/aboutus" className="hover:underline">About Us</a></li>
                            <li><a href="/contact" className="hover:underline">Contact</a></li>
                        </ul>
                    </div>
                </div>
            </section>

        </div>
    )
}

export default ContactUs