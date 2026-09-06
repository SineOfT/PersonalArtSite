import initShikaStateMachine from "/scripts/shika.js";
import initStateMachineManager from "/scripts/state-machine-manager.js";

const MIN_SECTION_OFFSET = 0.1;

export default function initScrollFunctions(scrollData) {
    const isMinimalAnimations = document.documentElement.classList.contains("minimal-animations");
    const isReducedAnimations = document.documentElement.classList.contains("reduced-animations");

    function initScroll() {    
        const scrollbarSpritesFrontContainer = document.querySelector(".scrollbar-sprites-front-container");
        const scrollbarSpritesBackContainer = document.querySelector(".scrollbar-sprites-back-container");
        const scrollbarSprites = [...document.querySelectorAll(".scrollbar-sprite")];

        const scrollY = window.scrollY;
        const scrollHeight = document.body.offsetHeight - window.innerHeight;

        const sectionOffsets = scrollData.map(({ sectionId: id, transition, instant }) => {
            const element = document.getElementById(id);
            const container = document.getElementById(`${id}-anchor`);
            const anchor = container.querySelector(".scroll-anchor-marker");
            if (!element) { return { id, transitionElement: false, offset: scrollHeight }; }
            const viewportOffset = element.getBoundingClientRect();
            const offset = scrollY + viewportOffset.top;
            return { id, transitionElement: transition ? element : false, container, anchor, offset, isInstant: instant };
        });
        sectionOffsets.sort((a, b) => { a.offset - b.offset });
        if (sectionOffsets[1].offset - sectionOffsets[0].offset < MIN_SECTION_OFFSET * scrollHeight) {
            sectionOffsets[0].container.classList.add("d-none");
        }
        if (sectionOffsets[sectionOffsets.length-1].offset - sectionOffsets[sectionOffsets.length-2].offset < MIN_SECTION_OFFSET * scrollHeight) {
            sectionOffsets[sectionOffsets.length-1].container.classList.add("d-none");
        }

        const scrollbarSpriteOffsets = isReducedAnimations
            ? null
            : scrollbarSprites.map((element) => {
                const viewportOffset = element.getBoundingClientRect();
                const offset = viewportOffset.left + viewportOffset.width/2;
                return { element, offset };
            });

        const scrollbarElement = document.getElementById("home-scrollbar");

        let prevScroll = -1;

        function initScrollAnchors() {
            sectionOffsets.forEach(({ id, offset, isInstant }) => {
                const sectionScrollFr = offset / scrollHeight;
                const sectionAnchor = document.getElementById(`${id}-anchor`);
                sectionAnchor.style.setProperty("--fr", sectionScrollFr);
                sectionAnchor.classList.add("scroll-anchor-position");
                if (isInstant) {
                    sectionAnchor.querySelector(".scroll-anchor").addEventListener("click", () => {
                        document.documentElement.style.scrollBehavior = "auto";
                        window.scrollTo(0, offset, { behavior: "instant" });
                        document.documentElement.style.scrollBehavior = "smooth";
                    });
                }
            });
        }

        function updateScroll(prevScrollHeight, shouldTransition = true) {
            return () => {
                const currScrollHeight = document.body.offsetHeight - window.innerHeight;
                if (currScrollHeight !== prevScrollHeight) {
                    initScroll();
                    return;
                }

                const currScroll = window.scrollY;
                const currScrollFr = currScroll / scrollHeight;
                const { currSection, isNew } = getCurrSection(currScroll);

                if (isNew) {
                    sectionOffsets.forEach(({ id, transitionElement }) => {
                        if (!transitionElement) { return; }
                        if (id === currSection) {
                            showSection(transitionElement);
                        } else {
                            hideSection(transitionElement);
                        }
                    });
                }

                if (isNew && !isReducedAnimations) {
                    let isSectionExceeded = !currSection;
                    sectionOffsets.forEach(({ id, anchor }) => {
                        if (isSectionExceeded) {
                            hideElement(anchor, shouldTransition);
                        } else {
                            showElement(anchor, shouldTransition);
                        }
                        if (id === currSection) {
                            isSectionExceeded = true;
                        }
                    });
                }

                if (!isReducedAnimations) {
                    scrollbarSpriteOffsets.forEach(({ element, offset }) => {
                        if (offset/window.innerWidth < currScrollFr) {
                            showElement(element, shouldTransition);
                        } else {
                            hideElement(element, shouldTransition);
                        }
                    });
                }

                if (!isMinimalAnimations) {
                    scrollbarElement.style.setProperty("--width-fr", currScrollFr);
                }

                prevScroll = currScroll;

                window.requestAnimationFrame(updateScroll(currScrollHeight));
            }
        }

        function getCurrSection(currScroll) {
            let { currSection, isNew } = sectionOffsets.reduce(
                (acc, section) => {
                    if (acc.isFound) { return acc; }
                    const isCurrSectionPassed = section.offset > currScroll;
                    const isPrevSectionPassed = section.offset > prevScroll;

                    if (!isCurrSectionPassed && !isPrevSectionPassed) {
                        return {
                            prevSectionFound: false,
                            currSectionFound: false,
                            isFound: false,
                            currSection: section.id,
                            isNew: false
                        };
                    }
                    
                    if (!isCurrSectionPassed && isPrevSectionPassed) {
                        return {
                            prevSectionFound: true,
                            currSectionFound: false,
                            isFound: false,
                            currSection: section.id,
                            isNew: true
                        };
                    }
                    
                    if (isCurrSectionPassed && !isPrevSectionPassed) {
                        return {
                            prevSectionFound: false,
                            currSectionFound: true,
                            isFound: false,
                            currSection: acc.currSection,
                            isNew: true
                        };
                    }
                    
                    if (acc.prevSectionFound === acc.currSectionFound) {
                        return {
                            isFound: true,
                            currSection: acc.currSection,
                            isNew: false
                        };
                    }

                    return {
                        isFound: true,
                        currSection: acc.currSection,
                        isNew: true
                    };
                },
                {
                    prevSectionFound: false,
                    currSectionFound: false,
                    isFound: false,
                    currSection: null,
                    isNew: false
                }
            );

            if (prevScroll < 0) {
                isNew = true;
            }

            return { currSection, isNew };
        }

        function showSection(element) {
            if (element.classList.contains("show")) { return; }

            element.classList.add("show");
            element.addEventListener("transitionend", removeShowOnEnd, { once: true });
            element.classList.remove("hide");
        }

        function hideSection(element) {
            if (element.classList.contains("hide")) { return; }

            element.classList.remove("show");
            element.removeEventListener("transitionend", removeShowOnEnd);
            element.classList.add("hide");
        }

        function removeShowOnEnd(event) {
            event.target.classList.remove("show");
        }

        function showElement(element, shouldTransition) {
            element.classList.remove("hide");
            element.classList.remove("v-none");
        }

        function hideElement(element, shouldTransition) {
            element.classList.add("hide");
            if (!shouldTransition) {
                element.classList.add("v-none");
            }
        }

        initScrollAnchors();
        updateScroll(scrollHeight, false)();
    }
    
    initScroll();

    if (!isMinimalAnimations) {
        const shikaStateMachine = initShikaStateMachine();
        initStateMachineManager([shikaStateMachine]);
    }
}