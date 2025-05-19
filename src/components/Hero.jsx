import { curve } from "../assets";
import Button from "./Button";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Hero = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <div className="pt-[12rem] -mt-[5.25rem]" id="hero">
      <div className="container relative">
        <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[3.875rem] md:mb-20 lg:mb-[6.25rem]">
          <h1 className="h1 mb-6">
            Unlock the Power of Instagram Downloads with{" "}
            <span className="inline-block relative">
              InstaGrabHub{" "}
              <img
                src={curve}
                className="absolute top-full left-0 w-full xl:-mt-2"
                width={624}
                height={28}
                alt="Curve"
              />
            </span>
          </h1>
          <p className="body-1 max-w-3xl mx-auto mb-6 text-n-2 lg:mb-8">
            Upgrade your Instagram experience by downloading reels, posts, stories, highlights, and audio in just a few clicks.
          </p>
          <Button onClick={() => navigate("/benefits")} white>
            Get started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
