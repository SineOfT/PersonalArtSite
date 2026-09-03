export default function initScrollFunctions(scrollData) {
    function initScroll() {
        const screenHeight = window.innerHeight;
        const scrollY = window.scrollY;
        const scrollHeight = document.body.offsetHeight - screenHeight;

        const sectionOffsets = scrollData.map(({ sectionId: id, transition }) => {
            const element = document.getElementById(id);
            const anchor = document.querySelector(`#${id}-anchor > .scroll-anchor`);
            if (!element) { return { id, transitionElement: false, offset: scrollHeight }; }
            const viewportOffset = element.getBoundingClientRect();
            const offset = scrollY + viewportOffset.top;
            return { id, transitionElement: transition ? element : false, anchor, offset };
        });
        sectionOffsets.sort((a, b) => { a.offset - b.offset });

        const scrollbarElement = document.getElementById("home-scrollbar");

        const scrollbarSpriteOffsets = [...scrollbarElement.querySelectorAll(".scrollbar-sprite")]
            .map((element) => {
                const viewportOffset = element.getBoundingClientRect();
                const offset = viewportOffset.left + viewportOffset.width/2;
                return { element, offset };
            });

        let prevScroll = -1;

        function initScrollAnchors() {
            sectionOffsets.forEach(({ id, offset }) => {
                const sectionScrollFr = offset / scrollHeight;
                const sectionAnchor = document.getElementById(`${id}-anchor`);
                sectionAnchor.style.setProperty("--fr", sectionScrollFr);
                sectionAnchor.classList.add("scroll-anchor-position");
            });
        }

        function updateScroll(prevScrollHeight) {
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
                    let isSectionExceeded = !currSection;
                    sectionOffsets.forEach(({ id, anchor }) => {
                        if (isSectionExceeded) {
                            hideElement(anchor);
                        } else {
                            showElement(anchor);
                        }
                        if (id === currSection) {
                            isSectionExceeded = true;
                        }
                    });
                }

                scrollbarSpriteOffsets.forEach(({ element, offset }) => {
                    if (offset/window.innerWidth < currScrollFr) {
                        showElement(element);
                    } else {
                        hideElement(element);
                    }
                })

                scrollbarElement.style.width = currScrollFr * 100 + "%";

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

        function showElement(element) {
            element.classList.add("show");
            element.classList.remove("hide");
        }

        function hideElement(element) {
            element.classList.remove("show");
            element.classList.add("hide");
        }

        initScrollAnchors();
        window.requestAnimationFrame(updateScroll(scrollHeight));
    }
    
    initScroll();
}