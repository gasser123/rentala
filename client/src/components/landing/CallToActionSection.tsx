"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
const CallToActionSection = () => {
  return (
    <div className="relative py-24">
      <Image
        src="/landing-call-to-action.jpg"
        alt="call to action"
        fill
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/60 "></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative max-w-4xl xl:max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 py-12"
      >
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 md:mr-10">
            <h2 className="text-2xl font-bold text-white text-center">
              Find your next adventure today!
            </h2>
          </div>
          <div>
            <p className="text-white mb-3 ">
              Discover a wide range of rental properties in your desired
              location.
            </p>
            <div className="flex justify-center md:justify-start gap-4">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="inline-block text-gray-900 bg-white rounded-lg px-6 py-3 font-semibold hover:bg-gray-900 hover:text-gray-100 cursor-pointer"
              >
                Search
              </button>
              <Link
                href="/signup"
                className="inline-block text-white font-semibold px-6 py-3 bg-red-800 hover:bg-red-400 hover:text-gray-900 rounded-lg cursor-pointer"
                scroll={false}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CallToActionSection;
