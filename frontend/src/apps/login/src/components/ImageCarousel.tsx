import React, { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const carouselItems = [
  {
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop",
    tagline: "Empower Your Learning Journey",
    subtitle:
      "Access world-class education from anywhere, at any time. Join a community of lifelong learners.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop",
    tagline: "Collaborate and Grow Together",
    subtitle:
      "Connect with peers and mentors. Share knowledge, solve problems, and achieve your goals faster.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop",
    tagline: "Master New Skills Daily",
    subtitle:
      "Stay ahead in your career with our constantly updated courses. Learn the latest technologies and trends.",
  },
];

export const ImageCarousel = () => {
  const sliderRef = useRef<Slider>(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    fade: true,
    cssEase: "cubic-bezier(0.4, 0, 0.2, 1)",
    arrows: false,
    pauseOnHover: false,
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      <Slider ref={sliderRef} {...settings} className="h-screen">
        {carouselItems.map((item, index) => (
          <div key={index} className="relative h-screen">
            <div className="absolute inset-0">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${item.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
            </div>
            <div className="relative h-full flex flex-col justify-end p-12 pb-24">
              <p className="text-white text-4xl mb-4 max-w-md">
                {item.tagline}
              </p>
              <p className="text-white/90 text-l max-w-md">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};
