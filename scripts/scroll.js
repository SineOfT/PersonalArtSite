export default function initScrollFunctions(scrollData) {
    function initScroll() {
        const scrollHeight = document.body.offsetHeight - window.innerHeight;
        const sectionOffsets = scrollData.map(({ sectionId: id, fade }) => {
            const element = document.getElementById(id);
            if (!element) { return { id, fadeElement: false, offset: scrollHeight }; }
            const viewportOffset = element.getBoundingClientRect();
            const offset = viewportOffset.top + window.scrollY;
            return { id, fadeElement: fade ? element : false, offset };
        });
        sectionOffsets.sort((a, b) => { a.offset - b.offset });

        const scrollbarElement = document.getElementById("home-scrollbar");

        let prevScroll = scrollHeight;

        function initScrollAnchors() {
            const scrollAnchors = [
                { id: "scroll-anchor-start-padding", offset: 0 },
                ...sectionOffsets.map(({ id, offset}) => ({ id: `${id}-anchor`, offset })),
                {id: null, offset: scrollHeight}
            ];
            
            scrollAnchors.slice(1).reduce(
                (prev, curr, index) => {
                    const offset = Math.min(curr.offset, scrollHeight);
                    const fr = offset - prev.offset;
                    const sectionAnchor = document.getElementById(prev.id);
                    sectionAnchor.style.setProperty("--fr", fr);
                    sectionAnchor.style.setProperty("--index", index + 1);
                    return { id: curr.id, offset };
                },
                scrollAnchors[0]
            );
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
                    sectionOffsets.forEach(({ id, fadeElement }) => {
                        if (!fadeElement) { return; }
                        if (id === currSection) {
                            showSection(fadeElement);
                        } else {
                            hideSection(fadeElement);
                        }
                    });
                }

                scrollbarElement.style.width = currScrollFr * 100 + "%";

                prevScroll = currScroll;

                window.requestAnimationFrame(updateScroll(currScrollHeight));
            }
        }

        function getCurrSection(currScroll) {
            const { currSection, isNew } = sectionOffsets.reduce(
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

        initScrollAnchors();
        window.requestAnimationFrame(updateScroll(scrollHeight));
    }
    
    initScroll();
}