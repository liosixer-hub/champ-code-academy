import { useEffect, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const carouselItems = [
  {
    image: "https://images.unsplash.com/photo-1742440710136-1976b1cad864?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b3Jrc3BhY2UlMjBjb2xsYWJvcmF0aW9ufGVufDF8fHx8MTc2NzIyOTgxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tagline: "Empower the next generation",
    subtitle: "Join our community of passionate coding tutors"
  },
  {
    image: "https://images.unsplash.com/photo-1765046894839-29753508f446?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwc3VjY2VzcyUyMGNlbGVicmF0aW9ufGVufDF8fHx8MTc2NzMyMTE1M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tagline: "Shape young minds",
    subtitle: "Inspire students to reach their full potential"
  },
  {
    image: "https://images.unsplash.com/photo-1742440710136-1976b1cad864?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGRlc2lnbiUyMHN0dWRpb3xlbnwxfHx8fDE3NjcyMTM5MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tagline: "Flexible teaching opportunities",
    subtitle: "Work on your own schedule, make a difference"
  }
];

export function ImageCarousel() {
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
}