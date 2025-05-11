import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export function setupSmoothScrollParallax() {
    ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 2,
        effects: true
    });

    gsap.utils.toArray('.scene-text').forEach((el, i) => {
        gsap.fromTo(el,
            { y: 80, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    end: "bottom 50%",
                    scrub: 1,
                }
            }
        );
    });
}
