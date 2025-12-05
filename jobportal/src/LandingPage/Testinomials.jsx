import React from "react";
import { Avatar, Rating } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { testimonials } from "../Data/Data";
import avtimg from "../assets/avatar-3.png";
import "@mantine/carousel/styles.css";

function Testimonials() {
  return (
    <section className="mt-20 px-4 sm:px-8 md:px-16 lg:px-20 pb-10">

      <h2 className="text-3xl sm:text-4xl font-semibold text-center text-mine-shaft-100 mb-10">
        What <span className="text-bright-sun-400">users say</span> about us
      </h2>

      {/* MOBILE SLIDER */}
      <div className="block md:hidden">
        <Carousel
          slideSize="85%"
          slideGap="lg"
          align="center"
          loop
          dragFree
          withIndicators
          styles={{
            indicator: {
              width: 8,
              height: 8,
              backgroundColor: "#ffcc00",
            },
          }}
        >
          {testimonials.map((item, index) => (
            <Carousel.Slide key={index}>
              <div className="bg-mine-shaft-900 border border-mine-shaft-700 rounded-xl p-5 hover:border-bright-sun-300/60 transition">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar src={item.avatar || avtimg} size="lg" />
                  <div>
                    <h3 className="text-lg font-semibold text-mine-shaft-200">
                      {item.name}
                    </h3>
                    <Rating value={item.rating} fractions={2} readOnly />
                  </div>
                </div>
                <p className="text-sm text-mine-shaft-300 leading-relaxed">
                  {item.testimonial}
                </p>
              </div>
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>

      {/* DESKTOP GRID */}
      <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((item, index) => (
          <div
            key={index}
            className="bg-mine-shaft-900 border border-mine-shaft-700 rounded-xl p-6 hover:border-bright-sun-300/60 transition"
          >
            <div className="flex items-center gap-4 mb-4">
              <Avatar src={item.avatar || avtimg} size="lg" />
              <div>
                <h3 className="text-lg font-semibold text-mine-shaft-200">
                  {item.name}
                </h3>
                <Rating value={item.rating} fractions={2} readOnly />
              </div>
            </div>
            <p className="text-sm text-mine-shaft-300 leading-relaxed">
              {item.testimonial}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;
