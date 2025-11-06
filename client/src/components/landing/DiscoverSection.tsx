"use client";
import { motion } from "framer-motion";
import DiscoverCard from "./DiscoverCard";
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
const DiscoverSection = () => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.8 }}
      variants={containerVariants}
      className="py-12 bg-white mb-16"
    >
      <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        <motion.div variants={itemVariants} className="my-12 text-center">
          <h2 className="text-3xl font-semibold leading-tight text-gray-800 ">
            Discover
          </h2>
          <p className="mt-4 text-lg text-gray-600 ">
            Find Your Dream Rental Property Today!
          </p>
          <p className="mt-2 text-gray-500 max-w-3xl mx-auto">
            Explore our extensive listings of rental properties tailored to your
            needs. Whether you are looking for a cozy apartment or a spacious
            house, we have the perfect home waiting for you.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 xl:gap-16 text-center">
          {[
            {
              imageSrc: "/landing-icon-wand.png",
              title: "Search For Properties",
              description:
                "Easily search and filter rental listings to find your perfect home in just a few clicks.",
            },
            {
              imageSrc: "/landing-icon-calendar.png",
              title: "Book Your Rental",
              description:
                "once you've found your ideal property, easily schedule viewings and book your rental online with our seamless process.",
            },
            {
              imageSrc: "/landing-icon-heart.png",
              title: "Enjoy Your New Home",
              description:
                "Move into your new rental property and enjoy a comfortable living experience with our dedicated support and resources.",
            },
          ].map((card, index) => (
            <motion.div key={index} variants={itemVariants}>
              <DiscoverCard {...card} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default DiscoverSection;
